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
  DatePicker,
  Switch,
  Checkbox,
  Radio,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import FormStyle from './infoForm.less';
import AddressInput from '../../components/personAccount/AddressInput';
import CodeInput from '../../components/personAccount/CodeInput';
// import IdRangePicker from '../../components/personAccount/IdRangePicker';

const DATE_FORMAT = 'YYYYMMDD';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const currencyOpts = [
  { label: '人民币', value: 1, disabled: true },
];

const deputeOpts = [
  { label: '电话委托', value: 1 },
  { label: '自助委托', value: 3 },
  { label: '网上委托', value: 6 },
  { label: '页面委托', value: 56 },
  { label: 'GPRS委托', value: 74 },
];

const authorityOpts = [
  { label: '开基代销', value: 9 },
];

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
export default class InfoForm extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    countryInfo: PropTypes.array,
    provinceInfo: PropTypes.array,
    cityInfo: PropTypes.array,
    accountTmpInfo: PropTypes.array,
    bankInfo: PropTypes.array,
    fundCompanyInfo: PropTypes.array,
    mealInfo: PropTypes.array,
    accountInfo: PropTypes.array,
    getCityInfoFunc: PropTypes.func.isRequired,
    getCSDCReturnFunc: PropTypes.func.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    returnInfo: PropTypes.array,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getCerCodeFunc: PropTypes.func.isRequired,
    checkCerCodeFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    form: {},
    countryInfo: [],
    provinceInfo: [],
    cityInfo: [],
    accountTmpInfo: [],
    bankInfo: [],
    fundCompanyInfo: [],
    mealInfo: [],
    dicData: {},
    empInforData: {},
    returnInfo: [],
    accountInfo: [],
  }

  constructor(props) {
    super(props);

    // todo (data init)
    this.state = {
      identityAnswer: '',
      identityConfirm: '',
      startValue: '',
      endValue: '',
      longFlag: false,
      bankSelShow: false,
      HAStockShow: false,
      HAStockAccount: false,
      SAStockShow: false,
      SAStockAccount: false,
      codeFlag: false,
      codeErr: '请输入验证码',
    };
  }

  // 日期改变处理
  @autobind
  onChange(field, value) {
    this.setState({
      [field]: value,
    });
  }

  @autobind
  onStartChange(value) {
    this.onChange('startValue', value);
  }

  @autobind
  onEndChange(value) {
    this.onChange('endValue', value);
  }

  // 获取证件类别
  @autobind
  getIdType(code) {
    const { dicData } = this.props;
    if (code) {
      return dicData.GT_ZJLB[code].note;
    }
    return '身份证';
  }

  // 获取步骤缓存数据
  getStepIndex(stepCacheData, key) {
    const index = _.findIndex(stepCacheData, step => step.key === key);
    return index;
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      bankSelShow,
      HAStockShow,
      HAStockAccount,
      SAStockShow,
      SAStockAccount,
    } = this.state;
    const {
      stepCacheData,
      empInforData,
      saveStepFunc,
      bdid,
    } = this.props;
    this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
      let filterErr = err;
      // 错误过滤
      if (!bankSelShow) {
        filterErr = _.omit(filterErr, ['bankNo', 'bankNoConfirm']);
      }
      if (!HAStockShow) {
        filterErr = _.omit(filterErr, ['HAStockAccountSelect', 'HAStockAccountInput']);
      } else if (HAStockAccount) {
        filterErr = _.omit(filterErr, 'HAStockAccountInput');
      } else {
        filterErr = _.omit(filterErr, 'HAStockAccountSelect');
      }
      if (!SAStockShow) {
        filterErr = _.omit(filterErr, ['SAStockAccountSelect', 'SAStockAccountInput']);
      } else if (SAStockAccount) {
        filterErr = _.omit(filterErr, 'SAStockAccountInput');
      } else {
        filterErr = _.omit(filterErr, 'SAStockAccountSelect');
      }
      if (_.isEmpty(filterErr)) {
        const sfyzIndex = this.getStepIndex(stepCacheData, 'SFYZ');
        const stepData = sfyzIndex === -1 ? {} : JSON.parse(stepCacheData[sfyzIndex].value);
        // todo
        const formValue = {
          SFYZWT: values.identityQuestion,
          SFYZDA: this.state.identityAnswer,
          KFYYB: empInforData.yyb,
          KHMB: values.mould,
          GTKHLY: values.resource,
          ZJLB: stepData.ZJLB || '',
          ZJBH: stepData.ZJBH || '',
          ZJFZJG: values.agent,
          ZJQSRQ: values.startDate.format(DATE_FORMAT),
          ZJJZRQ: values.endDate.format(DATE_FORMAT),
          ZJDZ: values.identityAddress,
          PROVINCE: values.address.cities,
          CITY: values.address.secondCity,
          DZ: values.address.detail,
          YZBM: values.postalcode,
          SJ: values.cellNumber,
          DH: values.telphone || '',
          EMAIL: values.email || '',
          XB: stepData.XB || values.sex || '',
          CSRQ: stepData.CSRQ || values.birth.format(DATE_FORMAT),
          ZYDM: values.job,
          XL: values.degree,
          GJ: values.nation,
          MZDM: values.tribe,
          XQFXDJ: values.riskLevel,
          YJTC: values.meal,
          YXBZ: values.currency.join(';'),
          WTFS: values.depute.join(';'),
          KHQX: values.authority.join(';'),
          GDKH_SH: values.HAStock,
          GDDJ_SH: values.HAStock === 9 ? values.HAStockAccountInput || values.HAStockAccountSelect : '',
          GDKH_SZ: values.SAStock,
          GDDJ_SZ: values.SAStock === 9 ? values.SAStockAccountInput || values.SAStockAccountSelect : '',
          CGYH: values.saveBank,
          CGYHZH: values.bankNo || '',
          SQJJZH: values.fundCompany.join(';'),
        };
        console.log('Received values of form: ', values);
        // 保存步骤缓存
        saveStepFunc({
          bdid,
          key: 'ZLTX',
          value: JSON.stringify(formValue),
          index: 3,
        });
      }
    });
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  // 加密判断
  answerJudge(value) {
    if (!value) {
      return true;
    }
    const arr = value.split('');
    let flag = false;
    arr.map((item) => {
      if (item !== '*') {
        flag = true;
      }
      return flag;
    });
    return flag;
  }

  // 身份问题确认校验
  @autobind
  checkAnswer2(rule, value, callback) {
    const { identityAnswer, identityConfirm } = this.state;
    let confirm = '';
    if (this.answerJudge(value)) {
      confirm = value;
    } else {
      confirm = identityConfirm;
    }
    if (!confirm ||
        !identityAnswer ||
        confirm === identityAnswer) {
      callback();
      return;
    }
    callback('请保持验证答案一致');
  }

  // 手机号码校验
  @autobind
  checkCell1(rule, value, callback) {
    if (value && this.props.form.getFieldValue('cellConfirm')) {
      this.props.form.validateFields(['cellConfirm'], { force: true });
    }
    callback();
  }

  // 手机号码确认校验
  @autobind
  checkCell2(rule, value, callback) {
    if (!value ||
        !this.props.form.getFieldValue('cellNumber') ||
        value === this.props.form.getFieldValue('cellNumber')) {
      callback();
      return;
    }
    callback('请保持手机号码一致');
  }

  // 获取手机号
  @autobind
  cellGet() {
    const { empInforData } = this.props;
    return {
      cellNumber: this.props.form.getFieldValue('cellNumber'),
      numberCheck: this.props.form.getFieldError('cellNumber'),
      cellConfirm: this.props.form.getFieldValue('cellConfirm'),
      confirmCheck: this.props.form.getFieldError('cellConfirm'),
      yyb: empInforData.yyb || '',
    };
  }

  // 验证码校验
  @autobind
  checkCode(rule, value, callback) {
    const { codeFlag, codeErr } = this.state;
    if (codeFlag) {
      callback();
    } else {
      callback(codeErr);
    }
  }

  // 验证码验证
  @autobind
  verifyCode() {
    const { checkCerCodeFunc } = this.props;
    const code = this.props.form.getFieldValue('code').code;
    const cellNumber = this.props.form.getFieldValue('cellNumber');
    if (code !== '') {
      checkCerCodeFunc({
        code: code.toString(),
        mobile: cellNumber,
        failBack: this.handleCodeFail,
        sucBack: this.handleCodeSuc,
      });
    } else {
      this.props.form.setFields({
        code: {
          errors: [new Error('请填写验证码')],
        },
      });
      this.setState({
        codeFlag: false,
        codeErr: '请填写验证码',
      });
    }
  }

  // 验证码失败回调
  @autobind
  handleCodeFail() {
    this.props.form.setFields({
      code: {
        errors: [new Error('验证码错误')],
      },
    });
    this.setState({
      codeFlag: false,
      codeErr: '验证码错误',
    });
  }

  // 验证码成功回调
  @autobind
  handleCodeSuc() {
    this.setState({
      codeFlag: true,
    }, () => {
      this.props.form.validateFields(['code'], { force: true });
    });
  }

  // 地址校验
  @autobind
  addressCheck(rule, value, callback) {
    if (value.detail === '') {
      callback('请填写详细地址');
    }
    callback();
  }

  // 身份问题加密处理
  @autobind
  handleAnswerChange(e) {
    this.setState({
      identityAnswer: e.target.value || '',
    });
  }

  // 身份问题加密
  @autobind
  handleAnswerBlur(e) {
    this.props.form.setFieldsValue({
      identityAnswer1: '*'.repeat(e.target.value.length),
    });
  }

  // 身份问题加密还原
  @autobind
  handleAnswerFocus() {
    const { identityAnswer } = this.state;
    this.props.form.setFieldsValue({
      identityAnswer1: identityAnswer,
    });
  }

  // 身份问题确认加密处理
  @autobind
  handleConfirmChange(e) {
    this.setState({
      identityConfirm: e.target.value || '',
    });
  }

  // 身份问题确认加密
  @autobind
  handleConfirmBlur(e) {
    this.setState({
      identityConfirm: e.target.value || '',
    });
    this.props.form.setFieldsValue({
      identityAnswer2: '*'.repeat(e.target.value.length),
    });
  }

  // 身份问题确认加密还原
  @autobind
  handleConfirmFocus() {
    const { identityConfirm } = this.state;
    this.props.form.setFieldsValue({
      identityAnswer2: identityConfirm,
    });
  }

  // 长期选择处理
  @autobind
  handleSwitchChange(value) {
    this.setState({
      longFlag: value,
    }, () => {
      this.props.form.setFieldsValue({
        endDate: value ? moment('3000-12-31') : '',
      });
    });
  }

  @autobind
  handleCurrencyChange(checkedValues) {
    console.log('checked = ', checkedValues);
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

  // 证件有效期加密
  @autobind
  checkRangePicker(rule, value, callback) {
    if (!value.startValue || !value.endValue) {
      callback('请填写证件有效期');
    }
    callback();
  }

  // 限制日期选择范围
  @autobind
  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  // 限制日期选择范围
  @autobind
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
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
    fundCompanyInfo.map(item =>
      fundCompany.push(<Option value={item.jjgsqc} key={item.jjgsdm}>{item.jjgsqc}</Option>),
    );
    return fundCompany;
  }

  // 国籍选择项初始化
  @autobind
  countryCreate() {
    const { countryInfo } = this.props;
    const country = [];
    countryInfo.map(item =>
      country.push(<Option key={item.ibm}>{item.gjmc}</Option>),
    );
    return country;
  }

  // 开户模板选择项初始化
  accountTmpCreate() {
    const { accountTmpInfo } = this.props;
    const accountTmpOpt = [];
    accountTmpInfo.map(item =>
      accountTmpOpt.push(<Option key={item.id}>{item.mbmc}</Option>),
    );
    return accountTmpOpt;
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

  // 佣金套餐选择项初始化
  mealCreate() {
    const { mealInfo } = this.props;
    const mealOpt = [];
    mealInfo.map(item =>
      mealOpt.push(<Option key={item.cbm}>{item.note}</Option>),
    );
    return mealOpt;
  }

  // 银行账号校验
  @autobind
  checkBankNo1(rule, value, callback) {
    if (value && this.props.form.getFieldValue('bankNoConfirm')) {
      this.props.form.validateFields(['bankNoConfirm'], { force: true });
    }
    callback();
  }

  // 银行账号确认校验
  @autobind
  checkBankNo2(rule, value, callback) {
    if (!value ||
        !this.props.form.getFieldValue('bankNo') ||
        value === this.props.form.getFieldValue('bankNo')) {
      callback();
      return;
    }
    callback('请保持银行账号一致');
  }

  // 沪A股东开户改变处理
  @autobind
  handleHAStockChange(e) {
    const { returnInfo } = this.props;
    if (e.target.value === 9) {
      if (_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3) {
        this.setState({
          HAStockShow: true,
          HAStockAccount: false,
        });
      } else {
        this.setState({
          HAStockShow: true,
          HAStockAccount: true,
        });
      }
    } else {
      this.setState({
        HAStockShow: false,
        HAStockAccount: false,
      });
    }
  }

  // 深A股东开户改变处理
  @autobind
  handleSAStockChange(e) {
    const { returnInfo } = this.props;
    if (e.target.value === 9) {
      if (_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3) {
        this.setState({
          SAStockShow: true,
          SAStockAccount: false,
        });
      } else {
        this.setState({
          SAStockShow: true,
          SAStockAccount: true,
        });
      }
    } else {
      this.setState({
        SAStockShow: false,
        SAStockAccount: false,
      });
    }
  }

  // 股东账户选择项初始化
  @autobind
  HAStockAccountCreate() {
    const { accountInfo = [] } = this.props;
    const HAStockAccount = [];
    if (_.isEmpty(accountInfo)) {
      return '';
    }
    accountInfo.map(item =>
      HAStockAccount.push(<Option value={item.code}>{item.code} {item.account}</Option>),
    );
    return HAStockAccount;
  }

  stockShowFunc(showFlag, accountFlag, hasAccount, noAccount) {
    if (showFlag) {
      if (accountFlag) {
        return hasAccount;
      }
      return noAccount;
    }
    return null;
  }

  @autobind
  accountTableCreate() {
    const { returnInfo } = this.props;
    if (returnInfo[0].clbz && returnInfo[0].clbz === 3) {
      return 'Success';
    }
    return <div className={FormStyle.accountFail} onClick={this.accountRefresh}>加载失败，点击刷新！</div>;
  }

  @autobind
  accountRefresh() {
    const { location: { query } } = this.props;
    this.props.getCSDCReturnFunc({
      ...query,
    });
    console.log('account refresh!');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      startValue,
      endValue,
      longFlag,
      bankSelShow,
      HAStockShow,
      HAStockAccount,
      SAStockShow,
      SAStockAccount,
    } = this.state;
    const {
      provinceInfo,
      cityInfo,
      accountTmpInfo,
      bankInfo,
      mealInfo,
      getCityInfoFunc,
      dicData,
      empInforData,
      returnInfo,
      stepCacheData,
      getCerCodeFunc,
    } = this.props;
    // 获取步骤缓存
    const sfyzIndex = this.getStepIndex(stepCacheData, 'SFYZ');
    const zltxIndex = this.getStepIndex(stepCacheData, 'ZLTX');
    const stepSaveData = sfyzIndex === -1 ?
      {} :
      JSON.parse(stepCacheData[sfyzIndex].value || null) || {};
    const stepFormData = zltxIndex === -1 ?
      {} :
      JSON.parse(stepCacheData[zltxIndex].value || null) || {};
    // HTML
    const bankNo = (
      <FormItem
        {...formItemLayout}
        label="银行账号"
        colon={false}
        className={FormStyle.formItem}
      >
        {getFieldDecorator('bankNo', {
          rules: [
            { required: true, message: '请填写银行账号' },
            { validator: this.checkBankNo1 },
          ],
        })(
          <Input
            id="bankNo"
            className={FormStyle.formInput}
            maxLength="30"
            autoComplete="off"
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
      >
        {getFieldDecorator('bankNoConfirm', {
          rules: [
            { required: true, message: '请填写银行账号' },
            { validator: this.checkBankNo2 },
          ],
        })(
          <Input
            id="bankNoConfirm"
            className={FormStyle.formInput}
            maxLength="30"
            onPaste={this.handlePaste}
            autoComplete="off"
          />,
        )}
      </FormItem>
    );
    const accountTableTitle = _.isEmpty(returnInfo) ? null : (
      <div className={FormStyle.tableTitle}>
        股东账户开户情况（中登查询结果）
      </div>
    );
    const accountTable = _.isEmpty(returnInfo) ? null : this.accountTableCreate();
    const HAStockhasAccount = (
      <FormItem
        {...formItemLayout}
        label="沪A股东账户"
        colon={false}
        className={FormStyle.formItem}
      >
        {getFieldDecorator('HAStockAccountSelect', {
          rules: [
            { required: true, message: '请选择沪A股东账户' },
          ],
        })(
          <Select className={FormStyle.formSelect} dropdownClassName="formOption">
            {this.HAStockAccountCreate()}
          </Select>,
        )}
      </FormItem>
    );
    const HAStockNoAccount = (
      <FormItem
        {...formItemLayout}
        label="沪A股东账户"
        colon={false}
        className={FormStyle.formItem}
      >
        {getFieldDecorator('HAStockAccountInput', {
          rules: [
            { required: true, message: '请填写沪A股东账户' },
          ],
        })(
          <Input
            id="HAStockAccount"
            className={FormStyle.formInput}
            maxLength="10"
            autoComplete="off"
          />,
        )}
      </FormItem>
    );
    const SAStockhasAccount = (
      <FormItem
        {...formItemLayout}
        label="深A股东账户"
        colon={false}
        className={FormStyle.formItem}
      >
        {getFieldDecorator('SAStockAccountSelect', {
          rules: [
            { required: true, message: '请选择深A股东账户' },
          ],
        })(
          <Select className={FormStyle.formSelect} dropdownClassName="formOption">
            {this.HAStockAccountCreate()}
          </Select>,
        )}
      </FormItem>
    );
    const SAStockNoAccount = (
      <FormItem
        {...formItemLayout}
        label="深A股东账户"
        colon={false}
        className={FormStyle.formItem}
      >
        {getFieldDecorator('SAStockAccountInput', {
          rules: [
            { required: true, message: '请填写深A股东账户' },
          ],
        })(
          <Input
            id="SAStockAccount"
            className={FormStyle.formInput}
            maxLength="10"
            autoComplete="off"
          />,
        )}
      </FormItem>
    );
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>身份验证问题</span>
          </div>
          <div className={FormStyle.warn}>
            <p>
              <span className={FormStyle.warnIcon} />
              以下验证信息很重要，请客户牢记验证答案并在客服回访激活账户时正确回答进行核对。
            </p>
          </div>
          <FormItem
            {...formItemLayout}
            label="身份验证问题"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('identityQuestion', {
              rules: [
                { required: true, message: '请选择身份验证问题' },
              ],
              initialValue: dicData ? stepFormData.SFYZWT || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption" key="identityQuestion">
                {this.dicOptsCreate('KH_SFYZWT')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="身份验证答案"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('identityAnswer1', {
              rules: [
                { required: true, message: '请填写身份验证答案' },
              ],
              initialValue: '*'.repeat(this.state.identityAnswer.length),
            })(
              <Input
                id="identityAnswer1"
                className={FormStyle.formInput}
                maxLength="30"
                onChange={this.handleAnswerChange}
                onBlur={this.handleAnswerBlur}
                onFocus={this.handleAnswerFocus}
                autoComplete="off"
              />,
            )}
          </FormItem>
          <div className={FormStyle.formBlank} />
          <FormItem
            {...formItemLayout}
            label="答案校验"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('identityAnswer2', {
              rules: [
                { required: true, message: '请填写身份验证答案' },
                { validator: this.checkAnswer2 },
              ],
              initialValue: '*'.repeat(this.state.identityConfirm.length),
            })(
              <Input
                id="identityAnswer2"
                className={FormStyle.formInput}
                maxLength="30"
                onBlur={this.handleConfirmBlur}
                onFocus={this.handleConfirmFocus}
                onPaste={this.handlePaste}
                autoComplete="off"
              />,
            )}
          </FormItem>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>营业部</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="开户营业厅"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('hall', {
              rules: [
                { required: true, message: '请选择开户营业厅' },
              ],
              initialValue: empInforData ? empInforData.yyb_note : stepFormData.KFYYB || '',
            })(
              <Input
                id="hall"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="开户模板"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('mould', {
              rules: [
                { required: true, message: '请选择开户模板' },
              ],
              initialValue: stepFormData.KHMB || (!_.isEmpty(accountTmpInfo[0]) ? accountTmpInfo[0].id.toString() : ''),
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.accountTmpCreate()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="客户来源"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('resource', {
              rules: [
                { required: true, message: '请选择客户来源' },
              ],
              initialValue: dicData ? stepFormData.GTKHLY || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.dicOptsCreate('GT_KHLY')}
              </Select>,
            )}
          </FormItem>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>证件信息</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="证件类型"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('identityType', {
              rules: [
                { required: true, message: '请选择证件类型' },
              ],
              initialValue: this.getIdType(stepSaveData.ZJLB),
            })(
              <Input
                id="identityType"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件号码"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('identityNumber', {
              rules: [
                { required: true, message: '请填写证件号码' },
              ],
              initialValue: stepFormData.ZJBH || stepSaveData.ZJBH || '320107199027508040',
            })(
              <Input
                id="identityNumber"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件签发机关"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('agent', {
              rules: [
                { required: true, message: '请填写证件签发机关' },
              ],
              initialValue: stepFormData.ZJFZJG || '',
            })(
              <Input
                id="agent"
                className={FormStyle.formInput}
                maxLength="30"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件地址"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('identityAddress', {
              rules: [
                { required: true, message: '请填写证件地址' },
              ],
              initialValue: stepFormData.ZJDZ || '',
            })(
              <Input
                id="identityAddress"
                className={FormStyle.formInput}
                maxLength="50"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <div className={FormStyle.dateItem}>
            <div className={FormStyle.dateWrapper}>
              <div className={FormStyle.label}>
                证件有效期
              </div>
              <div className={FormStyle.dateContent}>
                <FormItem
                  className={FormStyle.dateSub}
                >
                  {getFieldDecorator('startDate', {
                    initialValue: startValue,
                    rules: [
                      { type: 'object', required: true, message: '请选择开始时间' },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      format="YYYY-MM-DD"
                      placeholder="开始时间"
                      onChange={this.onStartChange}
                      showTime={false}
                      showToday={false}
                    />,
                  )}
                </FormItem>
                <div className={FormStyle.dateLink}>
                  至
                </div>
                <FormItem
                  className={FormStyle.dateSub}
                >
                  {getFieldDecorator('endDate', {
                    initialValue: endValue,
                    rules: [
                      { type: 'object', required: true, message: '请选择结束时间' },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
                      placeholder="结束时间"
                      onChange={this.onEndChange}
                      showTime={false}
                      showToday={false}
                      disabled={longFlag}
                    />,
                  )}
                </FormItem>
              </div>
            </div>
            <Switch
              checkedChildren={'长期'}
              unCheckedChildren={'短期'}
              className={FormStyle.formSwitch}
              onChange={this.handleSwitchChange}
            />
          </div>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>联系方式</span>
          </div>
          <FormItem
            {...formLongItemLayout}
            label="联系方式"
            colon={false}
            className={FormStyle.formAddressItem}
          >
            {getFieldDecorator('address', {
              initialValue: { detail: '' },
              rules: [
                { validator: this.addressCheck },
                { required: true, message: '请填写联系方式' },
              ],
            })(
              <AddressInput
                provinceInfo={provinceInfo}
                cityInfo={cityInfo}
                getCityInfoFunc={getCityInfoFunc}
                stepFormData={stepFormData}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('cellNumber', {
              rules: [
                { pattern: new RegExp('^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$'), message: '手机号码格式错误' },
                { required: true, message: '请填写手机号码' },
                { validator: this.checkCell1 },
              ],
              initialValue: stepFormData.SJ || '',
            })(
              <Input
                id="cellNumber"
                className={FormStyle.formInput}
                maxLength="11"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机校验"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('cellConfirm', {
              rules: [
                { required: true, message: '请填写手机校验' },
                { validator: this.checkCell2 },
              ],
              initialValue: stepFormData.SJ || '',
            })(
              <Input
                id="cellConfirm"
                className={FormStyle.formInput}
                maxLength="11"
                onPaste={this.handlePaste}
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="验证码"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('code', {
              initialValue: { code: '' },
              rules: [
                { validator: this.checkCode },
                { required: true, message: '请填写验证码' },
              ],
            })(
              <CodeInput
                cellGet={this.cellGet}
                getCerCodeFunc={getCerCodeFunc}
                verifyCode={this.verifyCode}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮政编码"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('postalcode', {
              rules: [
                { pattern: new RegExp('^\\d{6}$'), message: '邮政编码格式错误' },
                { required: true, message: '请填写邮政编码' },
              ],
              initialValue: stepFormData.YZBM || '',
            })(
              <Input
                id="postalcode"
                className={FormStyle.formInput}
                maxLength="6"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="固定电话"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('telphone', {
              rules: [
                { pattern: new RegExp('^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$'), message: '固定电话格式错误' },
              ],
              initialValue: stepFormData.DH || '',
            })(
              <Input
                id="telphone"
                className={FormStyle.formInput}
                maxLength="20"
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="电子邮件"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: '电子邮箱格式不正确' },
              ],
              initialValue: stepFormData.EMAIL || '',
            })(
              <Input
                id="email"
                className={FormStyle.formInput}
                maxLength="50"
                autoComplete="off"
              />,
            )}
          </FormItem>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>基本信息</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="性别"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('sex', {
              rules: [
                { required: true, message: '请选择性别' },
              ],
              initialValue: dicData ? stepFormData.XB || stepSaveData.XB || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption" disabled={stepSaveData.XB}>
                {this.dicOptsCreate('GT_XB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="出生日期"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('birth', {
              rules: [
                { type: 'object', required: true, message: '请选择出生日期' },
              ],
              initialValue: moment(stepSaveData.CSRQ) || '',
            })(
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="出生日期"
                showTime={false}
                showToday={false}
                disabled={stepSaveData.CSRQ}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="职业"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('job', {
              rules: [
                { required: true, message: '请选择职业' },
              ],
              initialValue: dicData ? stepFormData.ZYDM || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.dicOptsCreate('GT_ZYDM')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="学历"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('degree', {
              rules: [
                { required: true, message: '请选择学历' },
              ],
              initialValue: dicData ? stepFormData.XL || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.dicOptsCreate('GT_XLDM')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="国籍"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('nation', {
              rules: [
                { required: true, message: '请选择国籍' },
              ],
              initialValue: stepFormData.GJ || '156',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                showSearch
                optionFilterProp="children"
              >
                {this.countryCreate()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="民族"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('tribe', {
              rules: [
                { required: true, message: '请选择民族' },
              ],
              initialValue: dicData ? stepFormData.MZDM || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.dicOptsCreate('MZDM')}
              </Select>,
            )}
          </FormItem>
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
          >
            {getFieldDecorator('riskLevel', {
              rules: [
                { required: true, message: '请选择反洗钱风险等级' },
              ],
              initialValue: dicData ? stepFormData.XQFXDJ || '1' : '',
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.dicOptsCreate('XQFXDJ')}
              </Select>,
            )}
          </FormItem>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>资金开户</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="佣金套餐"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('meal', {
              rules: [
                { required: true, message: '请选择佣金套餐' },
              ],
              initialValue: stepFormData.YJTC || (!_.isEmpty(mealInfo[0]) ? mealInfo[0].cbm : ''),
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.mealCreate()}
              </Select>,
            )}
          </FormItem>
          <div className={FormStyle.formBlank} />
          <FormItem
            {...formLongItemLayout}
            label="允许币种"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('currency', {
              rules: [
                { required: true, message: '请选择币种' },
              ],
              initialValue: [1],
            })(
              <CheckboxGroup
                options={currencyOpts}
                disabled
              />,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="委托方式"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('depute', {
              rules: [
                { required: true, message: '请选择委托方式' },
              ],
              initialValue: stepFormData.WTFS ? stepFormData.WTFS.split(';') : [],
            })(
              <CheckboxGroup options={deputeOpts} />,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="客户权限"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('authority', {
              rules: [
                { required: true, message: '请选择客户权限' },
              ],
              initialValue: stepFormData.KHQX ? stepFormData.KHQX.split(';') : [],
            })(
              <CheckboxGroup options={authorityOpts} />,
            )}
          </FormItem>
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>股东开户</span>
          </div>
          <div className={FormStyle.formTable}>
            {accountTableTitle}
            {accountTable}
          </div>
          <FormItem
            {...formLongItemLayout}
            label="沪A股东开户"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('HAStock', {
              rules: [
                { required: true, message: '请选择沪A股东开户' },
              ],
              initialValue: stepFormData.GDKH_SH || '',
            })(
              <RadioGroup onChange={this.handleHAStockChange}>
                <Radio value={1}>新开A股账户</Radio>
                <Radio value={2}>新开场内基金账户</Radio>
                <Radio value={9}>已开</Radio>
                <Radio value={0}>不开户</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {this.stockShowFunc(
            HAStockShow,
            HAStockAccount,
            HAStockhasAccount,
            HAStockNoAccount,
          )}
          <FormItem
            {...formLongItemLayout}
            label="深A股东开户"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('SAStock', {
              rules: [
                { required: true, message: '请选择深A股东开户' },
              ],
              initialValue: stepFormData.GDKH_SZ || '',
            })(
              <RadioGroup onChange={this.handleSAStockChange}>
                <Radio value={1}>新开A股账户</Radio>
                <Radio value={2}>新开场内基金账户</Radio>
                <Radio value={9}>已开</Radio>
                <Radio value={0}>不开户</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {this.stockShowFunc(
            SAStockShow,
            SAStockAccount,
            SAStockhasAccount,
            SAStockNoAccount,
          )}
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
          >
            {getFieldDecorator('saveBank', {
              rules: [
                { required: true, message: '请选择存管银行' },
                { validator: this.checkSaveBank1 },
              ],
              initialValue: stepFormData.CGYH || (!_.isEmpty(bankInfo[0]) ? bankInfo[0].yhdm : ''),
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
                {this.bankCreate()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="银行校验"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('saveBankConfirm', {
              rules: [
                { required: true, message: '请选择存管银行' },
                { validator: this.checkSaveBank2 },
              ],
              initialValue: stepFormData.CGYH || (!_.isEmpty(bankInfo[0]) ? bankInfo[0].yhdm : ''),
            })(
              <Select className={FormStyle.formSelect} dropdownClassName="formOption">
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
            })(
              <RadioGroup onChange={this.handleMethodChange}>
                <Radio value={1}>预指定</Radio>
                <Radio value={2}>直接指定</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {bankSelShow ? bankNo : null}
          {bankSelShow ? bankNoConfirm : null}
        </div>
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
          <FormItem
            {...formLongItemLayout}
            label="基金公司"
            colon={false}
            className={FormStyle.formLongInputItem}
          >
            {getFieldDecorator('fundCompany', {
              rules: [
                { required: true, message: '请选择基金公司' },
              ],
              initialValue: stepFormData.SQJJZH ? stepFormData.SQJJZH.split(';') : [],
            })(
              <Select mode="multiple" >
                {this.fundCompanyCreate()}
              </Select>,
            )}
          </FormItem>
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
