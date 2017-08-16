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
  Checkbox,
  Radio,
} from 'antd';
import _ from 'lodash';

import FormStyle from './infoForm.less';
// import IdRangePicker from '../../components/personAccount/IdRangePicker';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const currencyOpts = [
  { label: '人民币', value: '1', disabled: true },
];

const deputeOpts = [
  { label: '电话委托', value: '1' },
  { label: '自助委托', value: '3' },
  { label: '网上委托', value: '6' },
  { label: '页面委托', value: '56' },
  { label: 'GPRS委托', value: '74' },
];

const authorityOpts = [
  { label: '开基代销', value: '9', disabled: true },
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
export default class InfoFormForth extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    mealInfo: PropTypes.array,
    getCSDCReturnFunc: PropTypes.func.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    returnInfo: PropTypes.array,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    changeStepIndexFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
    checkMealFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    form: {},
    mealInfo: [],
    dicData: {},
    empInforData: {},
    returnInfo: [],
  }

  constructor(props) {
    super(props);

    const { stepCacheData, returnInfo } = props;
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const accountFlag = !(_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3);
    this.state = {
      HAStockShow: stepFormData.GDKH_SH === '9',
      HAStockAccount: accountFlag && this.HASAccountCheck(returnInfo),
      SAStockShow: stepFormData.GDKH_SZ === '9',
      SAStockAccount: accountFlag && this.SASAccountCheck(returnInfo),
      mealFlag: stepFormData.YJTC,
      mealMsg: '',
    };
  }

  componentWillMount() {
    const { location: { query }, empInforData, stepCacheData, returnInfo } = this.props;
    const stepObj = _.find(stepCacheData, { key: 'SFYZ' });
    if (_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3) {
      this.props.getCSDCReturnFunc({
        ...query,
        empInforData,
        stepObj,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { returnInfo } = nextProps;
    const { returnInfo: preReturnInfo } = this.props;
    // 条件变化
    if (!_.isEqual(preReturnInfo, returnInfo)) {
      const accountFlag = !(_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3);
      this.setState({
        HAStockAccount: accountFlag && this.HASAccountCheck(returnInfo),
        SAStockAccount: accountFlag && this.SASAccountCheck(returnInfo),
      });
    }
  }

  @autobind
  HASAccountCheck(returnInfo) {
    let HASAccountFlag = false;
    if (_.isEmpty(returnInfo)) {
      return false;
    }
    returnInfo.map((item) => {
      if (item.zhlb === 11) {
        HASAccountFlag = true;
      }
      return HASAccountFlag;
    });
    return HASAccountFlag;
  }

  @autobind
  SASAccountCheck(returnInfo) {
    let SASAccountFlag = false;
    if (_.isEmpty(returnInfo)) {
      return false;
    }
    returnInfo.map((item) => {
      if (item.zhlb === 21) {
        SASAccountFlag = true;
      }
      return SASAccountFlag;
    });
    return SASAccountFlag;
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      HAStockShow,
      HAStockAccount,
      SAStockShow,
      SAStockAccount,
    } = this.state;
    const {
      stepCacheData,
      saveStepFunc,
      bdid,
      changeStepIndexFunc,
    } = this.props;
    this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
      let filterErr = err;
      // 错误过滤
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
        const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
        const stepFormData = stepForm ?
          JSON.parse(stepForm.value || null) || {}
          : {};
        const HASAccount = HAStockAccount ?
          values.HAStockAccountSelect :
          values.HAStockAccountInput;
        const SASAccount = SAStockAccount ?
          values.SAStockAccountSelect :
          values.SAStockAccountInput;
        let formValue = {
          YJTC: values.meal,
          YXBZ: values.currency.join(';'),
          WTFS: values.depute.join(';'),
          KHQX: values.authority.join(';'),
          GDKH_SH: values.HAStock,
          GDDJ_SH: values.HAStock === '9' ? HASAccount : '',
          GDKH_SZ: values.SAStock,
          GDDJ_SZ: values.SAStock === '9' ? SASAccount : '',
          formStep: 4,
        };
        formValue = _.assign(stepFormData, formValue);
        console.log('Received values of form: ', values);
        // 保存步骤缓存
        saveStepFunc({
          bdid,
          key: 'ZLTX',
          value: JSON.stringify(formValue),
          index: 3,
          callback: () => {
            changeStepIndexFunc({
              index: 5,
            });
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          },
        });
      }
    });
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  @autobind
  handleCurrencyChange(checkedValues) {
    console.log('checked = ', checkedValues);
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

  // 佣金套餐选择处理
  @autobind
  handleMealChange(value) {
    const { empInforData, checkMealFunc } = this.props;
    checkMealFunc({
      yyb: empInforData.yyb,
      productCode: value,
      failBack: this.handleMealFail,
      sucBack: this.handleMealSuc,
    });
  }

  // 佣金套餐失败回调
  @autobind
  handleMealFail(msg) {
    const mealValue = this.props.form.getFieldValue('meal');
    this.props.form.setFields({
      meal: {
        value: mealValue,
        errors: [new Error(msg)],
      },
    });
    this.setState({
      mealFlag: false,
      mealMsg: msg,
    });
  }

  // 佣金套餐成功回调
  @autobind
  handleMealSuc() {
    this.setState({
      mealFlag: true,
    }, () => {
      this.props.form.validateFields(['meal'], { force: true });
    });
  }

  // 佣金套餐验证
  @autobind
  verifyMeal(rule, value, callback) {
    const { mealFlag, mealMsg } = this.state;
    if (mealFlag) {
      callback();
    } else if (value === '') {
      callback();
    } else {
      callback(mealMsg || '验证中...');
    }
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
    if (e.target.value === '9') {
      if (_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3) {
        this.setState({
          HAStockShow: true,
          HAStockAccount: false,
        });
      } else if (this.HASAccountCheck(returnInfo)) {
        this.setState({
          HAStockShow: true,
          HAStockAccount: true,
        });
      } else {
        this.setState({
          HAStockShow: true,
          HAStockAccount: false,
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
    if (e.target.value === '9') {
      if (_.isEmpty(returnInfo) || returnInfo[0].clbz !== 3) {
        this.setState({
          SAStockShow: true,
          SAStockAccount: false,
        });
      } else if (this.SASAccountCheck(returnInfo)) {
        this.setState({
          SAStockShow: true,
          SAStockAccount: true,
        });
      } else {
        this.setState({
          SAStockShow: true,
          SAStockAccount: false,
        });
      }
    } else {
      this.setState({
        SAStockShow: false,
        SAStockAccount: false,
      });
    }
  }

  // 沪A股东账户选择项初始化
  @autobind
  HAStockAccountCreate() {
    const { returnInfo = [] } = this.props;
    const HAStockAccount = [];
    if (_.isEmpty(returnInfo)) {
      return '';
    }
    returnInfo.map((item) => {
      if (item.zhlb === 11) {
        HAStockAccount.push(<Option value={item.zqzh} key={item.zqzh}>{item.zqzh}</Option>);
      }
      return HAStockAccount;
    });
    return HAStockAccount;
  }

  // 深A股东账户选择项初始化
  @autobind
  SAStockAccountCreate() {
    const { returnInfo = [] } = this.props;
    const SAStockAccount = [];
    if (_.isEmpty(returnInfo)) {
      return '';
    }
    returnInfo.map((item) => {
      if (item.zhlb === 21) {
        SAStockAccount.push(<Option value={item.zqzh} key={item.zqzh}>{item.zqzh}</Option>);
      }
      return SAStockAccount;
    });
    return SAStockAccount;
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
      const returnHtml = returnInfo.map((item, index) =>
        <div key={`returnInfo-${index + 1}`} className={FormStyle.tableLine}>
          <div className={FormStyle.tableName}>
            {item.khmc}
          </div>
          <div className={FormStyle.tableIdentity}>
            {item.zjlb_note}
          </div>
          <div className={FormStyle.tableIdentityNo}>
            {item.zjbh}
          </div>
          <div className={FormStyle.tableCode}>
            {item.zqzh}
          </div>
          <div className={FormStyle.tableAccount}>
            {item.zhlb_note}
          </div>
          <div className={FormStyle.tableStatus}>
            {item.zqzhzt_note}
          </div>
        </div>,
      );
      return (<div>
        <div className={FormStyle.tableThLine}>
          <div className={FormStyle.tableName}>
            客户名称
          </div>
          <div className={FormStyle.tableIdentity}>
            证件类别
          </div>
          <div className={FormStyle.tableIdentityNo}>
            证件编号
          </div>
          <div className={FormStyle.tableCode}>
            证券账号
          </div>
          <div className={FormStyle.tableAccount}>
            账户类别
          </div>
          <div className={FormStyle.tableStatus}>
            证券账号状态
          </div>
        </div>
        {returnHtml}
      </div>);
    }
    return <div className={FormStyle.accountFail} onClick={this.accountRefresh}>加载失败，点击刷新！</div>;
  }

  @autobind
  accountRefresh() {
    const { location: { query }, empInforData, stepCacheData } = this.props;
    const stepObj = _.find(stepCacheData, { key: 'SFYZ' });
    this.props.getCSDCReturnFunc({
      ...query,
      empInforData,
      stepObj,
    });
    console.log('account refresh!');
  }

  // 资金开户退回整改意见
  @autobind
  fundReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'ZJZH') {
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

  // 股东开户退回整改意见
  @autobind
  stockReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'GDKH_SH' ||
          item.zd === 'GDKH_SZ'
      ) {
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
      HAStockShow,
      HAStockAccount,
      SAStockShow,
      SAStockAccount,
    } = this.state;
    const {
      returnInfo,
      stepCacheData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    // HTML
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
        validateStatus={this.returnChangeWarning('GDKH_SH')}
      >
        {getFieldDecorator('HAStockAccountSelect', {
          rules: [
            { required: true, message: '请选择沪A股东账户' },
          ],
          initialValue: stepFormData.GDDJ_SH || '',
        })(
          <Select
            className={FormStyle.formSelect}
            dropdownClassName="formOption"
            disabled={this.returnChangeState('GDKH_SH')}
          >
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
        validateStatus={this.returnChangeWarning('GDKH_SH')}
      >
        {getFieldDecorator('HAStockAccountInput', {
          rules: [
            { required: true, message: '请填写沪A股东账户' },
          ],
          initialValue: stepFormData.GDDJ_SH || '',
        })(
          <Input
            id="HAStockAccount"
            className={FormStyle.formInput}
            maxLength="10"
            autoComplete="off"
            disabled={this.returnChangeState('GDKH_SH')}
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
        validateStatus={this.returnChangeWarning('GDKH_SZ')}
      >
        {getFieldDecorator('SAStockAccountSelect', {
          rules: [
            { required: true, message: '请选择深A股东账户' },
          ],
          initialValue: stepFormData.GDDJ_SZ || '',
        })(
          <Select
            className={FormStyle.formSelect}
            dropdownClassName="formOption"
            disabled={this.returnChangeState('GDKH_SZ')}
          >
            {this.SAStockAccountCreate()}
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
        validateStatus={this.returnChangeWarning('GDKH_SZ')}
      >
        {getFieldDecorator('SAStockAccountInput', {
          rules: [
            { required: true, message: '请填写深A股东账户' },
          ],
          initialValue: stepFormData.GDDJ_SZ || '',
        })(
          <Input
            id="SAStockAccount"
            className={FormStyle.formInput}
            maxLength="10"
            autoComplete="off"
            disabled={this.returnChangeState('GDKH_SZ')}
          />,
        )}
      </FormItem>
    );
    // 资金开户退回整改意见
    const fundReturn = this.fundReturnCreate();
    // 股东开户退回整改意见
    const stockReturn = this.stockReturnCreate();
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>资金开户</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="佣金套餐"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('ZJZH')}
          >
            {getFieldDecorator('meal', {
              rules: [
                { required: true, message: '请选择佣金套餐' },
                { validator: this.verifyMeal },
              ],
              initialValue: stepFormData.YJTC || '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                onChange={this.handleMealChange}
                disabled={this.returnChangeState('ZJZH')}
              >
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
              initialValue: ['1'],
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
              <CheckboxGroup
                options={deputeOpts}
                disabled={this.returnChangeState('ZJZH')}
              />,
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
              initialValue: ['9'],
            })(
              <CheckboxGroup
                options={authorityOpts}
                disabled
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>
            {fundReturn}
          </div>
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
              <RadioGroup
                onChange={this.handleHAStockChange}
                disabled={this.returnChangeState('GDKH_SH')}
              >
                <Radio value={'1'}>新开A股账户</Radio>
                <Radio value={'2'}>新开场内基金账户</Radio>
                <Radio value={'9'}>已开</Radio>
                <Radio value={'0'}>不开户</Radio>
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
              <RadioGroup
                onChange={this.handleSAStockChange}
                disabled={this.returnChangeState('GDKH_SZ')}
              >
                <Radio value={'1'}>新开A股账户</Radio>
                <Radio value={'2'}>新开场内基金账户</Radio>
                <Radio value={'9'}>已开</Radio>
                <Radio value={'0'}>不开户</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {this.stockShowFunc(
            SAStockShow,
            SAStockAccount,
            SAStockhasAccount,
            SAStockNoAccount,
          )}
          <div className={FormStyle.returnWrapper}>
            {stockReturn}
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
