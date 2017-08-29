/**
 * @file organizationAccount/angetForm.js
 * @author zzc
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
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import helper from '../../utils/helper';

import { menusTwo } from '../../config';
import FormStyle from '../personAccount/infoForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const DATE_FORMAT = 'YYYYMMDD';
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
export default class InfoForm extends PureComponent {

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
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    form: {},
    countryInfo: [],
    dicData: {},
    empInforData: {},
    returnOpinion: {},
  }

  constructor(props) {
    super(props);

    const { stepCacheData } = props;
    const stepForm = _.find(stepCacheData, { key: 'KHDLR' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    this.state = {
      idType: stepFormData.JBRZJLB || '0',
      identityAnswer: stepFormData.SFYZDA || '',
      identityConfirm: stepFormData.SFYZDA || '',
      startValue: stepFormData.JBRZJQSRQ ? moment(stepFormData.JBRZJQSRQ) : null,
      endValue: stepFormData.JBRZJJZRQ ? moment(stepFormData.JBRZJJZRQ) : null,
      longFlag: stepFormData.JBRZJJZRQ === '30001231',
      countryFlag: false,
      countryInit: stepFormData.newGJ || '156',
    };
  }

  componentWillMount() {
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
        console.log('Received values of form: ', values);
        let rValue = ''; // 退回保存步骤缓存
        const returnCacheObj = _.find(stepCacheData, { key: 'THZG' });
        const menuObj = _.find(menusTwo, { cacheKey: 'KHDLR' });
        const thisIndex = _.findIndex(menusTwo, menuObj);
        if (!_.isEmpty(this.props.returnOpinion)) {
          if (returnCacheObj &&
            returnCacheObj.value) {
            rValue = '';
          } else {
            const retrunObj = {
              key: 'KHDLR',
              index: -(thisIndex + 1),
            };
            rValue = JSON.stringify(retrunObj);
          }
        }
        const stebValueObj = {
          JBRXM: values.JBRXM,
          JBRZJLB: values.JBRZJLB.key,
          JBRZJBH: values.JBRZJBH,
          JBRZJQSRQ: values.JBRZJQSRQ.format(DATE_FORMAT),
          JBRZJJZRQ: values.JBRZJJZRQ.format(DATE_FORMAT),
          JBRXB: values.JBRXB.key,
          JBRSJ: values.JBRSJ,
          SJ: values.JBRSJ,
          JBRDH: values.JBRDH,
          DZ: values.DZ,
          SFYZWT: values.identityQuestion,
          SFYZDA: this.state.identityAnswer,
          ZJYZLY: '3',
          birth: values.CSRQ.format(DATE_FORMAT),
          newYZBM: values.YZBM,
          newGJ: values.GJ.key,
          LXRXXSTR: [
            {
              LXRXM: values.JBRXM,
              DH: values.JBRDH,
              SJ: values.JBRSJ,
              ZJLB: values.JBRZJLB.key,
              ZJBH: values.JBRZJBH,
              ZJQSRQ: values.JBRZJQSRQ.format(DATE_FORMAT),
              ZJJZRQ: values.JBRZJJZRQ.format(DATE_FORMAT),
              EMAIL: '',
              GXSM: '',
              GXLX: '',
            },
          ],
          DLRSTR: [{
            DLRXM: values.JBRXM,
            XB: values.JBRXB.key,
            XBMC: values.JBRXB.label,
            GJ: values.GJ.key,
            GJMC: values.GJ.label,
            ZJLB: values.JBRZJLB.key,
            ZJLBMC: values.JBRZJLB.label,
            ZJBH: values.JBRZJBH,
            CSRQ: values.CSRQ.format(DATE_FORMAT),
            ZJQSRQ: values.JBRZJQSRQ.format(DATE_FORMAT),
            ZJYXQ: values.JBRZJJZRQ.format(DATE_FORMAT),
            DLQXFW: '53;54;56;57;58;62;64;70',
            DLQXMC: '',
            DLYXQ: '',
            DH: values.JBRDH,
            SJ: values.JBRSJ,
            EMAIL: '',
            XL: '',
            ZYDM: '',
            GZDW: '',
            DZ: values.DZ,
            YZBM: values.YZBM,
          }],
        };
        console.log(stebValueObj);
        // 保存步骤缓存
        const saveStep = (saveStepFuncParam, formValueParam) => {
          const promise = new Promise((resolve, reject) => {
            try {
              saveStepFuncParam({
                bdid,
                key: 'KHDLR',
                value: JSON.stringify(formValueParam),
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
        saveStep(saveStepFunc, stebValueObj).then(() => {
          if (!_.isEmpty(this.props.returnOpinion)) {
            push('/organizationAccount/info');
          } else {
            push('/organizationAccount/question');
          }
        });
      }
    });
  }

  // 姓名校验
  @autobind
  nameCheck(rule, value, callback) {
    if (value) {
      const length = helper.asciilen(value);
      if (length > 80) {
        callback('姓名长度必须小于80个字符');
      }
      callback();
    }
    callback();
  }

  // 证件类型改变处理
  @autobind
  handleTypeChange(value) {
    this.setState({
      idType: value.key,
    }, () => {
      this.props.form.setFieldsValue({
        JBRZJBH: '',
        JBRZJBHCheck: '',
        GJ: { key: this.countryInit() },
      });
    });
  }

  // 国籍选择项初始化
  @autobind
  countryCreate(idType) {
    const { countryInfo } = this.props;
    if (_.isEmpty(countryInfo)) {
      return <Option key="noData" />;
    }
    const country = [];
    if (idType === '18' ||
      idType === '6' ||
      idType === '59' ||
      idType === '60') {
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
    } else if (idType === '4') {
      countryInfo.map((item) => {
        if (
          item.ibm === 344 ||
          item.ibm === 446
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    } else if (idType === '15') {
      countryInfo.map((item) => {
        if (
          item.ibm === 158
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    } else if (idType === '16') {
      countryInfo.map((item) => {
        if (
          item.ibm === 344 ||
          item.ibm === 446 ||
          item.ibm === 158
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    } else if (idType === '19') {
      countryInfo.map((item) => {
        if (
          item.ibm === 344
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    } else if (idType === '20') {
      countryInfo.map((item) => {
        if (
          item.ibm === 446
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    } else {
      countryInfo.map((item) => {
        if (
          item.ibm === 156
        ) {
          return country.push(<Option key={item.ibm}>{item.gjmc}</Option>);
        }
        return '';
      });
    }
    return country;
  }

  // 国籍初始化
  @autobind
  countryInit() {
    const { countryInfo } = this.props;
    const { idType } = this.state;
    const conuntryInit = countryInfo[0] ? countryInfo[0].ibm.toString() : '';
    if (idType === '18' ||
      idType === '6' ||
      idType === '59' ||
      idType === '60') {
      return conuntryInit;
    } else if (idType === '4') {
      return '446';
    } else if (idType === '15') {
      return '158';
    } else if (idType === '16') {
      return '446';
    } else if (idType === '19') {
      return '344';
    } else if (idType === '20') {
      return '446';
    }
    return '156';
  }

  @autobind
  checkBenefiterId(rule, value, callback) {
    const { idType } = this.state;
    if (idType && value !== '') {
      if (helper.checkIdentity(value, idType)) {
        callback();
        return;
      }
      callback('请输入正确的格式');
      return;
    }
    callback();
  }

  @autobind
  checkIdNew(rule, value, callback) {
    if (value && this.props.form.getFieldValue('JBRZJBHCheck')) {
      this.props.form.validateFields(['JBRZJBHCheck'], { force: true });
    }
    callback();
  }

  // 确认校验
  @autobind
  checkId(rule, value, callback) {
    if (!value ||
        !this.props.form.getFieldValue('JBRZJBH') ||
        value === this.props.form.getFieldValue('JBRZJBH')) {
      callback();
      return;
    }
    callback('请保持证件号一致！');
  }

  // 长期选择处理
  @autobind
  handleSwitchChange(value) {
    this.setState({
      longFlag: value,
    }, () => {
      this.props.form.setFieldsValue({
        JBRZJJZRQ: value ? moment('30001231') : null,
      });
    });
  }

  // 限制日期选择范围
  @autobind
  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return startValue && startValue.valueOf() > Date.now();
    }
    return startValue.valueOf() > endValue.valueOf() ||
      startValue.valueOf() > Date.now();
  }

  // 限制日期选择范围
  @autobind
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return endValue && endValue.valueOf() < Date.now();
    }
    return endValue.valueOf() <= startValue.valueOf() ||
      endValue.valueOf() < Date.now();
  }

  // 出生日期限制日期选择范围
  @autobind
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  // 联系地址校验
  @autobind
  dzCheck(rule, value, callback) {
    if (value) {
      const length = helper.asciilen(value);
      if (length > 100) {
        callback('地址的有效长度必须小于100个字符');
      } else if (length < 16) {
        callback('地址的有效长度必须大于等于8个汉字或16个英文字符');
      }
      callback();
    }
    callback();
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

  // 身份验证问题退回整改意见
  @autobind
  identityReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'SFYZWT' || item.zd === 'SFYZDA') {
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

  // 代理人信息退回
  @autobind
  dlrInfoReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'KHDLR') {
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

  // 数据字典选择项初始化
  dicOptsCreate(key) {
    const { dicData = {} } = this.props;
    if (_.isEmpty(dicData)) {
      return <Option key="noData" />;
    }
    const disOpts = [];
    if (key === 'GT_ZJLB') {
      dicData[key].map((item) => {
        if (
          item.flag === 1 ||
          item.flag === 3
        ) {
          return disOpts.push(<Option key={item.ibm}>{item.note}</Option>);
        }
        return '';
      });
    } else {
      dicData[key].map(item =>
        disOpts.push(<Option key={item.ibm}>{item.note}</Option>),
      );
    }
    return disOpts;
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
      startValue,
      endValue,
      longFlag,
      idType,
      countryInit,
    } = this.state;
    const {
      dicData,
      stepCacheData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'KHDLR' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    // 国籍生成
    const countryList = this.countryCreate(idType);
    // 代理人退回整改意见
    const dlrInfoReturn = this.dlrInfoReturnCreate();
    // 身份验证问题退回整改
    const identityReturn = this.identityReturnCreate();
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>开户代理人信息</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="姓名"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRXM', {
              rules: [
                { required: true, message: '姓名不能为空', whitespace: true },
                { validator: this.nameCheck },
              ],
              initialValue: stepFormData.JBRXM || '',
            })(
              <Input
                id="JBRXM"
                placeholder="请输入姓名"
                className={FormStyle.formInput}
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件类型"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRZJLB', {
              rules: [
                { required: true, message: '请选择证件类型！' },
              ],
              initialValue: { key: dicData ? stepFormData.JBRZJLB || '0' : '' },
            })(
              <Select
                id="JBRZJLB"
                labelInValue
                className={FormStyle.formSelect}
                disabled={this.returnChangeState('KHDLR')}
                dropdownClassName="formOption angle"
                onChange={this.handleTypeChange}
              >
                {this.dicOptsCreate('GT_ZJLB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件编号"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRZJBH', {
              rules: [
                { required: true, message: '证件编号不能为空', whitespace: true },
                { validator: this.checkBenefiterId },
                { validator: this.checkIdNew },
              ],
              initialValue: stepFormData.JBRZJBH || '',
            })(
              <Input
                id="JBRZJBH"
                placeholder="请输入证件编号"
                className={FormStyle.formInput}
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件校验"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRZJBHCheck', {
              rules: [
                { required: true, message: '证件校验不能为空', whitespace: true },
                { validator: this.checkId },
              ],
              initialValue: stepFormData.JBRZJBH || '',
            })(
              <Input
                id="JBRZJBHCheck"
                placeholder="请输入证件校验"
                className={FormStyle.formInput}
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <div>
            <div className={FormStyle.dateItem}>
              <div className={FormStyle.dateWrapper}>
                <div className={FormStyle.label}>
                  证件有效期
                </div>
                <div className={FormStyle.dateContent}>
                  <FormItem
                    className={FormStyle.dateSub}
                    validateStatus={this.returnChangeWarning('ZJQSRQ')}
                  >
                    {getFieldDecorator('JBRZJQSRQ', {
                      initialValue: startValue,
                      rules: [
                        { type: 'object', required: true, message: '请选择开始时间' },
                      ],
                    })(
                      <DatePicker
                        disabledDate={this.disabledStartDate}
                        format="YYYYMMDD"
                        placeholder="开始时间"
                        onChange={this.onStartChange}
                        showTime={false}
                        showToday={false}
                        disabled={this.returnChangeState('KHDLR')}
                      />,
                    )}
                  </FormItem>
                  <div className={FormStyle.dateLink}>
                    至
                  </div>
                  <FormItem
                    className={FormStyle.dateSub}
                    validateStatus={this.returnChangeWarning('ZJJZRQ')}
                  >
                    {getFieldDecorator('JBRZJJZRQ', {
                      initialValue: endValue,
                      rules: [
                        { type: 'object', required: true, message: '请选择结束时间' },
                      ],
                    })(
                      <DatePicker
                        disabledDate={this.disabledEndDate}
                        format="YYYYMMDD"
                        placeholder="结束时间"
                        onChange={this.onEndChange}
                        showTime={false}
                        showToday={false}
                        disabled={this.returnChangeState('KHDLR')}
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
                checked={longFlag}
                disabled={this.returnChangeState('KHDLR')}
              />
            </div>
          </div>
          <FormItem
            {...formItemLayout}
            label="出生日期"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('CSRQ', {
              rules: [],
              initialValue: stepFormData.birth ? moment(stepFormData.birth) : null,
            })(
              <DatePicker
                disabledDate={this.disabledDate}
                format="YYYYMMDD"
                placeholder="出生日期"
                showTime={false}
                showToday={false}
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRXB', {
              rules: [],
              initialValue: { key: dicData ? stepFormData.JBRXB || '1' : '' },
            })(
              <Select
                labelInValue
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                disabled={this.returnChangeState('KHDLR')}
              >
                {this.dicOptsCreate('GT_XB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="国籍"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('GJ', {
              rules: [
                { required: true, message: '请选择国籍' },
              ],
              initialValue: { key: countryInit },
            })(
              <Select
                labelInValue
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                showSearch
                optionFilterProp="children"
                disabled={this.returnChangeState('KHDLR')}
              >
                {countryList}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRSJ', {
              rules: [
                { pattern: new RegExp('^1[3|4|5|7|8][0-9]{9}$'), message: '手机号码格式错误' },
                { required: true, message: '请填写手机号码' },
              ],
              initialValue: stepFormData.JBRSJ || '',
            })(
              <Input
                id="JBRSJ"
                placeholder="请输入手机号码"
                className={FormStyle.formInput}
                maxLength="11"
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('JBRDH', {
              rules: [
                { required: true, message: '请填写联系电话' },
                { pattern: new RegExp('^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$'), message: '联系电话格式错误' },
              ],
              initialValue: stepFormData.JBRDH || '',
            })(
              <Input
                id="JBRDH"
                className={FormStyle.formInput}
                maxLength="20"
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
                placeholder="例如025-88888888"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系地址"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('DZ', {
              rules: [
                { required: true, message: '请填写联系地址', whitespace: true },
                { validator: this.dzCheck },
              ],
              initialValue: stepFormData.DZ || '',
            })(
              <Input
                id="DZ"
                placeholder="请输入联系地址"
                className={FormStyle.formInput}
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮政编码"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('YZBM', {
              rules: [
                { pattern: new RegExp('^\\d{6}$'), message: '邮政编码格式错误' },
                { required: true, message: '请填写邮政编码' },
              ],
              initialValue: stepFormData.newYZBM || '',
            })(
              <Input
                id="YZBM"
                placeholder="请输入邮政编码"
                className={FormStyle.formInput}
                maxLength="6"
                autoComplete="off"
                disabled={this.returnChangeState('KHDLR')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>{dlrInfoReturn}</div>
        </div>
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
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                key="identityQuestion"
                disabled={this.returnChangeState('SFYZNEW')}
              >
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
                maxLength="60"
                onChange={this.handleAnswerChange}
                onBlur={this.handleAnswerBlur}
                onFocus={this.handleAnswerFocus}
                autoComplete="off"
                disabled={this.returnChangeState('SFYZNEW')}
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
                { required: true, message: '请填写验证答案校验' },
                { validator: this.checkAnswer2 },
              ],
              initialValue: '*'.repeat(this.state.identityConfirm.length),
            })(
              <Input
                id="identityAnswer2"
                className={FormStyle.formInput}
                maxLength="60"
                onBlur={this.handleConfirmBlur}
                onFocus={this.handleConfirmFocus}
                onPaste={this.handlePaste}
                autoComplete="off"
                disabled={this.returnChangeState('SFYZNEW')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>{identityReturn}</div>
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
