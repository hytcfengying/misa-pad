/**
 * @file organizationAccount/InfoForm.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  Switch,
} from 'antd';
import _ from 'lodash';

import helper from '../../utils/helper';
import { menus } from '../../config';
import FormStyle from './infoForm.less';
// import IdRangePicker from '../../components/personAccount/IdRangePicker';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

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

const formLongItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

@Form.create()
export default class InfoFormSixth extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    bankInfo: PropTypes.array,
    fundCompanyInfo: PropTypes.array,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    form: {},
    bankInfo: [],
    fundCompanyInfo: [],
    dicData: {},
    empInforData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      hasLayout: false,
    };
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      stepCacheData,
      saveStepFunc,
      bdid,
      push,
    } = this.props;
    this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
      const filterErr = err;
      if (_.isEmpty(filterErr)) {
        const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
        const stepFormData = stepForm ?
          JSON.parse(stepForm.value || null) || {}
          : {};
        const fundCode = this.handleCompanyName(values.fundCompany);
        let formValue = {
          CGYH: values.saveBank,
          SQJJZH: fundCode.join(';'),
          CGYHKHXM: values.CGYHKHXM,
          CGYHZJLB: values.CGYHZJLB,
          CGYHZJBH: values.CGYHZJBH,
          formStep: 5,
        };
        formValue = _.assign(stepFormData, formValue);
        console.log('Received values of form: ', values);
        let rValue = ''; // 退回保存步骤缓存
        const returnCacheObj = _.find(stepCacheData, { key: 'THZG' });
        const menuObj = _.find(menus, { cacheKey: 'ZLTX' });
        const thisIndex = _.findIndex(menus, menuObj);
        if (!_.isEmpty(this.props.returnOpinion)) {
          if (returnCacheObj) {
            if (returnCacheObj.value) {
              if (JSON.parse(returnCacheObj.value).key !== 'YXSM') {
                const retrunObj = {
                  key: 'ZLTX',
                  index: -(thisIndex + 1),
                };
                rValue = JSON.stringify(retrunObj);
              }
            } else {
              const retrunObj = {
                key: 'ZLTX',
                index: -(thisIndex + 1),
              };
              rValue = JSON.stringify(retrunObj);
            }
          } else {
            const retrunObj = {
              key: 'ZLTX',
              index: -(thisIndex + 1),
            };
            rValue = JSON.stringify(retrunObj);
          }
        }
        // 保存步骤缓存
        const saveStep = (saveStepFuncParam, formValueParam) => {
          const promise = new Promise((resolve, reject) => {
            try {
              saveStepFuncParam({
                bdid,
                key: 'ZLTX',
                value: JSON.stringify(formValueParam),
                index: 3,
                returnValue: rValue,
                stepCallback: () => {
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
          push('/organizationAccount/image');
        });
      }
    });
  }

  // 基金公司code
  @autobind
  handleCompanyName(company) {
    const { fundCompanyInfo } = this.props;
    const companyCode = [];
    company.map(item =>
      companyCode.push(_.find(fundCompanyInfo, { jjgsqc: item }).id),
    );
    return companyCode;
  }

  // 基金公司name
  @autobind
  handleCompanyCode(code) {
    const { fundCompanyInfo } = this.props;
    if (_.isEmpty(fundCompanyInfo)) {
      return ['深市TA', '沪市TA'];
    }
    const companyName = [];
    const codeArr = code.split(';');
    codeArr.map(item =>
      companyName.push(_.find(fundCompanyInfo, { id: parseInt(item, 10) }).jjgsqc),
    );
    return companyName;
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  // 存管银行校验
  @autobind
  checkSaveBank1(rule, value, callback) {
    if (value && this.props.form.getFieldValue('saveBankConfirm')) {
      this.props.form.validateFields(['saveBankConfirm'], { force: true });
    }
    callback();
  }

  // 存管银行确认校验
  @autobind
  checkSaveBank2(rule, value, callback) {
    if (value === this.props.form.getFieldValue('saveBank')) {
      callback();
      return;
    }
    callback('请保持存管银行一致');
  }

  // 客户姓名校验
  @autobind
  khNameCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 120) {
      callback('客户姓名长度必须小于120个字符');
    }
    callback();
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

  // 存管人证件类别变化处理
  @autobind
  handleCgzjlbChange(value) {
    const {
      stepCacheData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const stepSaveForm = _.find(stepCacheData, { key: 'SFYZ' });
    const stepData = stepSaveForm ?
      JSON.parse(stepSaveForm.value || null) || {}
      : {};
    if (value === '8' && stepData.ZJLB === value) {
      this.props.form.setFieldsValue({
        CGYHZJBH: stepData.ZJBH,
        CGYHZJBHJY: stepData.ZJBH,
      });
    } else if (value === '58') {
      this.props.form.setFieldsValue({
        CGYHZJBH: stepFormData.ZZJGDM,
        CGYHZJBHJY: stepFormData.ZZJGDM,
      });
    } else {
      this.props.form.setFieldsValue({
        CGYHZJBH: '',
        CGYHZJBHJY: '',
      });
    }
  }

  // 基金公司选择项初始化
  fundCompanyCreate() {
    const { fundCompanyInfo } = this.props;
    const fundCompany = [];
    // fundCompany.push(<Option value='all' key='all'>全选</Option>);
    // fundCompany.push(<Option value='clear' key='clear'>清空</Option>);
    fundCompanyInfo.map(item =>
      fundCompany.push(<Option value={item.jjgsqc} key={item.jjgsqc}>{item.jjgsqc}</Option>),
    );
    return fundCompany;
  }

  // 存管银行选择项初始化
  bankCreate() {
    const { bankInfo } = this.props;
    const bankOpt = [];
    bankInfo.map(item =>
      bankOpt.push(<Option key={item.yhdm}>{item.yhmc}</Option>),
    );
    return bankOpt;
  }

  // 证件号码校验
  @autobind
  checkZjbh1(rule, value, callback) {
    if (value && this.props.form.getFieldValue('CGYHZJBHJY')) {
      this.props.form.validateFields(['CGYHZJBHJY'], { force: true });
    }
    callback();
  }

  // 证件号码确认校验
  @autobind
  checkZjbh2(rule, value, callback) {
    if (!value ||
        !this.props.form.getFieldValue('CGYHZJBH') ||
        value === this.props.form.getFieldValue('CGYHZJBH')) {
      callback();
      return;
    }
    callback('请保持证件号码一致');
  }

  // 基金公司改变操作
  @autobind
  handleFundChange() {
    this.setState({
      hasLayout: false,
    });
  }

  // 基金公司全选初始化
  initFundChange(value) {
    if (value.length >= 63) {
      return true;
    }
    return false;
  }
  // 基金公司全选清空操作
  @autobind
  handleSwitchChange(value) {
    console.log(value);
    if (value) {
      const { fundCompanyInfo } = this.props;
      const fundCompany = [];
      fundCompanyInfo.map(item =>
        fundCompany.push(item.jjgsqc),
      );
      this.props.form.setFieldsValue({
        fundCompany,
      });
      this.setState({
        hasLayout: false,
      });
    } else {
      this.props.form.setFieldsValue({
        fundCompany: [],
      });
      this.setState({
        hasLayout: true,
      });
    }
  }

  // 基金公司退回整改意见
  @autobind
  companyReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'JJKH') {
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

  // 银行账户退回整改意见
  @autobind
  bankReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'YHZH') {
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
    const { hasLayout } = this.state;
    const {
      bankInfo,
      stepCacheData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const stepSaveForm = _.find(stepCacheData, { key: 'SFYZ' });
    const stepData = stepSaveForm ?
      JSON.parse(stepSaveForm.value || null) || {}
      : {};
    // 基金公司退回整改意见
    const companyReturn = this.companyReturnCreate();
    // 银行账号退回整改意见
    const bankReturn = this.bankReturnCreate();
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>基金公司</span>
          </div>
          <div className={FormStyle.warn}>
            <p>
              <span className={FormStyle.warnIcon} />
              用于购买各家基金管理公司旗下的所有开放式基金和券商集合理财产品。
            </p>
          </div>
          <div className={FormStyle.dateFundItem}>
            <div className={`${FormStyle.dateWrapper} ${hasLayout ? FormStyle.dataChangeWrapper : ''}`}>
              <div className={FormStyle.label}>
                基金公司
              </div>
              <div className={FormStyle.dateContent}>
                <FormItem
                  {...formLongItemLayout}
                  className={FormStyle.formLongInputItem}
                  validateStatus={this.returnChangeWarning('JJKH')}
                >
                  {getFieldDecorator('fundCompany', {
                    rules: [
                      { required: true, message: '请选择基金公司' },
                    ],
                    initialValue: stepFormData.SQJJZH ?
                      this.handleCompanyCode(stepFormData.SQJJZH) :
                      ['深市TA', '沪市TA'],
                  })(
                    <Select
                      mode="multiple"
                      dropdownClassName="formOption angle"
                      onChange={this.handleFundChange}
                      disabled={this.returnChangeState('JJKH')}
                    >
                      {this.fundCompanyCreate()}
                    </Select>,
                  )}
                </FormItem>
              </div>
            </div>
            <Switch
              checkedChildren={'全选'}
              unCheckedChildren={'清空'}
              className={FormStyle.formSwitch}
              onChange={this.handleSwitchChange}
              disabled={this.returnChangeState('JJKH')}
              defaultChecked={this.initFundChange(
                stepFormData.SQJJZH ?
                this.handleCompanyCode(stepFormData.SQJJZH) :
                [],
              )}
            />
          </div>
          <div className={FormStyle.returnWrapper}>
            {companyReturn}
          </div>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>银行账户</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="存管银行"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('YHZH')}
          >
            {getFieldDecorator('saveBank', {
              rules: [
                { required: true, message: '请选择存管银行' },
                { validator: this.checkSaveBank1 },
              ],
              initialValue: stepFormData.CGYH || (!_.isEmpty(bankInfo[0]) ? bankInfo[0].yhdm : ''),
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                disabled={this.returnChangeState('YHZH')}
              >
                {this.bankCreate()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="银行校验"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('YHZH')}
          >
            {getFieldDecorator('saveBankConfirm', {
              rules: [
                { required: true, message: '请选择存管银行' },
                { validator: this.checkSaveBank2 },
              ],
              initialValue: stepFormData.CGYH || (!_.isEmpty(bankInfo[0]) ? bankInfo[0].yhdm : ''),
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                disabled={this.returnChangeState('YHZH')}
              >
                {this.bankCreate()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="存管指定方式"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('saveMethod', {
              rules: [
                { required: true, message: '请选择存管指定方式' },
              ],
              initialValue: 1,
            })(
              <RadioGroup
                disabled={this.returnChangeState('YHZH')}
              >
                <Radio value={1}>预指定</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="客户姓名"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('CGYHKHXM', {
              rules: [
                { required: true, message: '请填写客户姓名' },
                { validator: this.khNameCheck },
              ],
              initialValue: stepData.KHQC || '',
            })(
              <Input
                id="CGYHKHXM"
                className={FormStyle.formInput}
                autoComplete="off"
                disabled
                maxLength="120"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件类别"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('CGYHZJLB', {
              rules: [
                { required: true, message: '请选择证件类别' },
              ],
              initialValue: stepFormData.CGYHZJLB || '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                onChange={this.handleCgzjlbChange}
                // disabled={this.returnChangeState()}
              >
                <Option key="8">营业执照</Option>
                <Option key="58">全国组织机构代码</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件编号"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('CGYHZJBH', {
              rules: [
                { required: true, message: '请填写证件编号' },
                { validator: this.checkZjbh1 },
              ],
              initialValue: stepFormData.CGYHZJBH || '',
            })(
              <Input
                id="CGYHZJBH"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="30"
                // disabled={this.returnChangeState('JYSYRGX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件编号校验"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('CGYHZJBHJY', {
              rules: [
                { required: true, message: '请填写证件编号校验' },
                { validator: this.checkZjbh2 },
              ],
              initialValue: stepFormData.CGYHZJBH || '',
            })(
              <Input
                id="CGYHZJBHJY"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="30"
                // disabled={this.returnChangeState('JYSYRGX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>
            {bankReturn}
          </div>
        </div>
        <div className={FormStyle.formBtnContent}>
          <Button type="primary" htmlType="submit" className={FormStyle.formBtn}>
            下一步
          </Button>
        </div>
      </Form>
    );
  }
}
