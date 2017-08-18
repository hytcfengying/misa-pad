/**
 * @file personAccount/InfoForm.js
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
export default class InfoFormFifth extends PureComponent {

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

    const { stepCacheData } = props;
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    this.state = {
      bankSelShow: stepFormData.CGYHZH,
      hasLayout: false,
    };
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      bankSelShow,
    } = this.state;
    const {
      stepCacheData,
      saveStepFunc,
      bdid,
      push,
    } = this.props;
    this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
      let filterErr = err;
      // 错误过滤
      if (!bankSelShow) {
        filterErr = _.omit(filterErr, ['bankNo', 'bankNoConfirm']);
      }
      if (_.isEmpty(filterErr)) {
        const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
        const stepFormData = stepForm ?
          JSON.parse(stepForm.value || null) || {}
          : {};
        const fundCode = this.handleCompanyName(values.fundCompany);
        let formValue = {
          CGYH: values.saveBank,
          CGYHZH: values.bankNo || '',
          SQJJZH: fundCode.join(';'),
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
          push('/personAccount/image');
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

  // 存管指定方式改变处理
  @autobind
  handleMethodChange(e) {
    if (e.target.value === 2) {
      this.setState({
        bankSelShow: true,
      });
    } else {
      this.setState({
        bankSelShow: false,
      });
    }
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

  // 银行账号校验
  @autobind
  checkBankNo1(rule, value, callback) {
    if (value && this.props.form.getFieldValue('bankNoConfirm')) {
      this.props.form.validateFields(['bankNoConfirm'], { force: true });
    }
    const re = /^\d+$/;
    if (!re.test(value) && value !== '') {
      callback('银行账号只能输入数字');
      return;
    }
    callback();
  }

  // 银行账号确认校验
  @autobind
  checkBankNo2(rule, value, callback) {
    const re = /^\d+$/;
    if (!re.test(value) && value !== '') {
      callback('银行账号只能输入数字');
      return;
    }
    if (!value ||
        !this.props.form.getFieldValue('bankNo') ||
        value === this.props.form.getFieldValue('bankNo')) {
      callback();
      return;
    }
    callback('请保持银行账号一致');
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
    const { bankSelShow, hasLayout } = this.state;
    const {
      bankInfo,
      stepCacheData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    // HTML
    const bankNo = (
      <FormItem
        {...formItemLayout}
        label="银行账号"
        colon={false}
        className={FormStyle.formItem}
        validateStatus={this.returnChangeWarning('YHZH')}
      >
        {getFieldDecorator('bankNo', {
          rules: [
            { required: true, message: '请填写银行账号' },
            { validator: this.checkBankNo1 },
          ],
          initialValue: stepFormData.CGYHZH,
        })(
          <Input
            id="bankNo"
            className={FormStyle.formInput}
            maxLength="30"
            autoComplete="off"
            disabled={this.returnChangeState('YHZH')}
          />,
        )}
      </FormItem>
    );
    const bankNoConfirm = (
      <FormItem
        {...formItemLayout}
        label="银行账号校验"
        colon={false}
        className={FormStyle.formItem}
        validateStatus={this.returnChangeWarning('YHZH')}
      >
        {getFieldDecorator('bankNoConfirm', {
          rules: [
            { required: true, message: '请填写银行账号' },
            { validator: this.checkBankNo2 },
          ],
          initialValue: stepFormData.CGYHZH,
        })(
          <Input
            id="bankNoConfirm"
            className={FormStyle.formInput}
            maxLength="30"
            onPaste={this.handlePaste}
            autoComplete="off"
            disabled={this.returnChangeState('YHZH')}
          />,
        )}
      </FormItem>
    );
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
              initialValue: stepFormData.CGYHZH ? 2 : 1,
            })(
              <RadioGroup
                onChange={this.handleMethodChange}
                disabled={this.returnChangeState('YHZH')}
              >
                <Radio value={1}>预指定</Radio>
                <Radio value={2}>直接指定</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {bankSelShow ? bankNo : null}
          {bankSelShow ? bankNoConfirm : null}
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
