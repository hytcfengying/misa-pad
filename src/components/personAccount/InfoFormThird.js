/**
 * @file personAccount/InfoForm.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import {
  Form,
  Select,
  Button,
  DatePicker,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import FormStyle from './infoForm.less';
// import IdRangePicker from '../../components/personAccount/IdRangePicker';

const DATE_FORMAT = 'YYYYMMDD';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

@Form.create()
export default class InfoFormThird extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    countryInfo: PropTypes.array,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    changeStepIndexFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    form: {},
    countryInfo: [],
    dicData: {},
    empInforData: {},
  }

  constructor(props) {
    super(props);

    const { stepCacheData } = props;
    const stepForm = _.find(stepCacheData, { key: 'SFYZ' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    this.state = {
      nationFlag: stepFormData.ZJLB !== '18',
      nationInit: this.countryInit(stepFormData.ZJBH, stepFormData.ZJLB),
      tribeFlag: stepFormData.ZJLB !== '18',
      chinaFlag: stepFormData.ZJLB === '0',
    };
  }

  // 国籍初始化
  @autobind
  countryInit(number, type) {
    const { countryInfo } = this.props;
    const conuntryInit = countryInfo[0] ? countryInfo[0].ibm.toString() : '';
    if (type === '18') {
      return conuntryInit;
    } else if (type === '0') {
      return '156';
    } else if (type === '4') {
      if (_.startsWith(number, 'H')) {
        return '344';
      }
      return '446';
    } else if (type === '15') {
      return '158';
    }
    return '156';
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      stepCacheData,
      saveStepFunc,
      bdid,
      changeStepIndexFunc,
    } = this.props;
    const { tribeFlag } = this.state;
    this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
      let filterErr = err;
      // 错误过滤
      if (!tribeFlag) {
        filterErr = _.omit(filterErr, ['tribe']);
      }
      if (_.isEmpty(filterErr)) {
        const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
        const stepFormData = stepForm ?
          JSON.parse(stepForm.value || null) || {}
          : {};
        const stepSaveForm = _.find(stepCacheData, { key: 'SFYZ' });
        const stepData = stepSaveForm ?
          JSON.parse(stepSaveForm.value || null) || {}
          : {};
        // todo
        let formValue = {
          XB: stepData.XB || values.sex || '',
          CSRQ: stepData.CSRQ || values.birth.format(DATE_FORMAT),
          ZYDM: values.job,
          XL: values.degree,
          GJ: values.nation,
          MZDM: values.tribe || '',
          XQFXDJ: values.riskLevel,
          formStep: 3,
        };
        formValue = _.assign(stepFormData, formValue);
        console.log('Received values of form: ', values);
        // 保存步骤缓存
        const saveStep = (saveStepFuncParam, formValueParam) => {
          const promise = new Promise((resolve, reject) => {
            try {
              saveStepFuncParam({
                bdid,
                key: 'ZLTX',
                value: JSON.stringify(formValueParam),
                index: 3,
                callback: () => {
                  resolve(true);
                },
              });
            } catch (ex) {
              reject(ex);
            }
          });
          return promise;
        };
        saveStep(saveStepFunc, formValue).then(() => {
          changeStepIndexFunc({
            index: 4,
          });
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        });
      }
    });
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  // 数据字典选择项初始化
  dicOptsCreate(key) {
    const { dicData = {} } = this.props;
    if (_.isEmpty(dicData)) {
      return <Option key="noData" />;
    }
    const disOpts = [];
    dicData[key].map(item =>
      disOpts.push(<Option key={item.ibm}>{item.note}</Option>),
    );
    return disOpts;
  }

  // 国籍选择项初始化
  @autobind
  countryCreate(nationFlag) {
    const { countryInfo } = this.props;
    const country = [];
    if (nationFlag) {
      countryInfo.map(item =>
        country.push(<Option key={item.ibm}>{item.gjmc}</Option>),
      );
    } else {
      countryInfo.map((item) => {
        if (
          item.ibm !== 156 &&
          item.ibm !== 344 &&
          item.ibm !== 446 &&
          item.ibm !== 158
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    }
    return country;
  }

  // 基本信息退回整改意见
  @autobind
  baseInfoReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'BJXX') {
        returnHtml.push(<span key={sort}><em>{sort}、{item.zdmc}：</em>{item.shyj}</span>);
        sort += 1;
      }
      return returnHtml;
    });
    if (_.isEmpty(returnHtml)) {
      return '';
    }
    return (<div className={FormStyle.returnBlank}>
      <div className={FormStyle.returnIcon} />
      <p>{returnHtml}</p>
    </div>);
  }

  // 反洗钱退回整改意见
  @autobind
  legalReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'FXQXX') {
        returnHtml.push(<span key={sort}><em>{sort}、{item.zdmc}：</em>{item.shyj}</span>);
        sort += 1;
      }
      return returnHtml;
    });
    if (_.isEmpty(returnHtml)) {
      return '';
    }
    return (<div className={FormStyle.returnBlank}>
      <div className={FormStyle.returnIcon} />
      <p>{returnHtml}</p>
    </div>);
  }

  @autobind
  returnChangeState(key) {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return false;
    }
    let state = true;
    returnOpinion.map((item) => {
      if (item.zd === key) {
        state = false;
      }
      return state;
    });
    return state;
  }

  @autobind
  returnChangeWarning(key) {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    let state = '';
    returnOpinion.map((item) => {
      if (item.zd === key) {
        state = 'warning';
      }
      return state;
    });
    return state;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      dicData,
      stepCacheData,
    } = this.props;
    const { nationFlag, nationInit, tribeFlag, chinaFlag } = this.state;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const stepSaveForm = _.find(stepCacheData, { key: 'SFYZ' });
    const stepSaveData = stepSaveForm ?
      JSON.parse(stepSaveForm.value || null) || {}
      : {};
    // HTML
    const tribeItem = (
      <FormItem
        {...formItemLayout}
        label="民族"
        colon={false}
        className={FormStyle.formItem}
        validateStatus={chinaFlag || this.returnChangeState('BJXX') ?
          '' :
          this.returnChangeWarning('BJXX')}
      >
        {getFieldDecorator('tribe', {
          rules: [
            { required: true, message: '请选择民族' },
          ],
          initialValue: dicData ? stepSaveData.MZDM || stepFormData.MZDM || '1' : '',
        })(
          <Select
            className={FormStyle.formSelect}
            dropdownClassName="formOption"
            disabled={chinaFlag || this.returnChangeState('BJXX')}
          >
            {this.dicOptsCreate('MZDM')}
          </Select>,
        )}
      </FormItem>
    );
    // 基本信息退回整改意见
    const baseInfoReturn = this.baseInfoReturnCreate();
    // 反洗钱退回整改意见
    const legalReturn = this.legalReturnCreate();
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>基本信息</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="性别"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={stepSaveData.XB || this.returnChangeState('BJXX') ?
              '' :
              this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('sex', {
              rules: [
                { required: true, message: '请选择性别' },
              ],
              initialValue: dicData ? stepFormData.XB || stepSaveData.XB || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                disabled={stepSaveData.XB || this.returnChangeState('BJXX')}
              >
                {this.dicOptsCreate('GT_XB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="出生日期"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={stepSaveData.CSRQ || this.returnChangeState('BJXX') ?
              '' :
              this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('birth', {
              rules: [
                { type: 'object', required: true, message: '请选择出生日期' },
              ],
              initialValue: moment(stepSaveData.CSRQ) || '',
            })(
              <DatePicker
                format="YYYYMMDD"
                placeholder="出生日期"
                showTime={false}
                showToday={false}
                disabled={stepSaveData.CSRQ || this.returnChangeState('BJXX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="职业"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('job', {
              rules: [
                { required: true, message: '请选择职业' },
              ],
              initialValue: dicData ? stepFormData.ZYDM || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                disabled={this.returnChangeState('BJXX')}
              >
                {this.dicOptsCreate('GT_ZYDM')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="学历"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('degree', {
              rules: [
                { required: true, message: '请选择学历' },
              ],
              initialValue: dicData ? stepFormData.XL || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                disabled={this.returnChangeState('BJXX')}
              >
                {this.dicOptsCreate('GT_XLDM')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="国籍"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('nation', {
              rules: [
                { required: true, message: '请选择国籍' },
              ],
              initialValue: stepFormData.GJ || nationInit,
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                showSearch
                optionFilterProp="children"
                disabled={nationFlag || this.returnChangeState('BJXX')}
              >
                {this.countryCreate(nationFlag)}
              </Select>,
            )}
          </FormItem>
          {tribeFlag ? tribeItem : null}
          <div className={FormStyle.returnWrapper}>
            {baseInfoReturn}
          </div>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>反洗钱</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="反洗钱风险等级"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('FXQXX')}
          >
            {getFieldDecorator('riskLevel', {
              rules: [
                { required: true, message: '请选择反洗钱风险等级' },
              ],
              initialValue: dicData ? stepFormData.XQFXDJ || '0' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                disabled={this.returnChangeState('FXQXX')}
              >
                {this.dicOptsCreate('XQFXDJ')}
              </Select>,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>
            {legalReturn}
          </div>
        </div>
        <div className={FormStyle.formBtnContent}>
          <Button type="primary" htmlType="submit" className={FormStyle.formBtn}>
            继续
          </Button>
        </div>
      </Form>
    );
  }
}
