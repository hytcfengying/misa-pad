/**
 * @file personAccount/InfoForm.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Switch,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import FormStyle from './infoForm.less';
import AddressInput from '../../components/personAccount/AddressInput';
import CodeInput from '../../components/personAccount/CodeInput';

const DATE_FORMAT = 'YYYYMMDD';
const FormItem = Form.Item;

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
export default class InfoFormTwo extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    provinceInfo: PropTypes.array,
    cityInfo: PropTypes.array,
    getCityInfoFunc: PropTypes.func.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getCerCodeFunc: PropTypes.func.isRequired,
    checkCerCodeFunc: PropTypes.func.isRequired,
    changeStepIndexFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    form: {},
    provinceInfo: [],
    cityInfo: [],
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
      startValue: stepFormData.ZJQSRQ ? moment(stepFormData.ZJQSRQ) : '',
      endValue: stepFormData.ZJJZRQ ? moment(stepFormData.ZJJZRQ) : '',
      longFlag: stepFormData.ZJJZRQ === '30001231',
      codeFlag: stepFormData.SJ,
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
      return _.find(dicData.GT_ZJLB, { cbm: code }) ?
        _.find(dicData.GT_ZJLB, { cbm: code }).note :
        '身份证';
    }
    return '身份证';
  }

  // 联系方式设置
  @autobind
  setConnect(state) {
    this.props.form.setFieldsValue({
      address: state,
    });
  }

  @autobind
  getConnect() {
    return this.props.form.getFieldValue('address');
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
    this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
      const filterErr = err;
      if (_.isEmpty(filterErr)) {
        const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
        const stepFormData = stepForm ?
          JSON.parse(stepForm.value || null) || {}
          : {};
        const stepSaveForm = _.find(stepCacheData, { key: 'SFYZ' });
        const stepData = stepSaveForm ?
          JSON.parse(stepSaveForm.value || null) || {}
          : {};
        let formValue = {
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
          formStep: 2,
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
              index: 3,
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
    const codeValue = this.props.form.getFieldValue('code');
    this.props.form.setFields({
      code: {
        value: codeValue,
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

  // 证件地址校验
  @autobind
  idAddCheck(rule, value, callback) {
    const length = this.asciilen(value);
    if (length < 16 && length !== 0) {
      callback('地址的有效长度必须大于等于8个汉字或16个英文字符');
    }
    callback();
  }

  asciilen(src) {
    let byteLen = 0;
    const len = src.length;
    if (src) {
      for (let i = 0; i < len; i++) {
        if (src.charCodeAt(i) > 255) {
          byteLen += 2;
        } else {
          byteLen++;
        }
      }
      return byteLen;
    }
    return 0;
  }

  // 地址校验
  @autobind
  addressCheck(rule, value, callback) {
    if (value.detail === '') {
      callback('请填写详细地址');
    }
    callback();
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

  // 手机号码改变处理
  @autobind
  handleCellChange(e) {
    const cellConfirm = this.props.form.getFieldValue('cellConfirm');
    this.checkCellCode(e.target.value || '', cellConfirm);
  }

  // 手机号码确认改变处理
  @autobind
  handleCellConfirmChange(e) {
    const cellNumber = this.props.form.getFieldValue('cellNumber');
    this.checkCellCode(cellNumber, e.target.value || '');
  }

  // 手机号码校验码校验确认
  @autobind
  checkCellCode(cellNumber, cellConfirm) {
    const { stepCacheData } = this.props;
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    if (cellNumber === cellConfirm &&
        cellNumber === stepFormData.SJ &&
        cellNumber !== '') {
      this.setState({
        codeFlag: true,
      });
    } else {
      this.setState({
        codeFlag: false,
      });
    }
  }

  // 证件信息退回整改意见
  @autobind
  idInfoReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'ZJFZJG' ||
          item.zd === 'ZJQSRQ' ||
          item.zd === 'ZJJZRQ' ||
          item.zd === 'ZJDZ'
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

  // 联系方式退回整改意见
  @autobind
  connectReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'LXXX') {
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
      startValue,
      endValue,
      longFlag,
    } = this.state;
    const {
      provinceInfo,
      cityInfo,
      getCityInfoFunc,
      stepCacheData,
      getCerCodeFunc,
      returnOpinion,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const stepSaveForm = _.find(stepCacheData, { key: 'SFYZ' });
    const stepSaveData = stepSaveForm ?
      JSON.parse(stepSaveForm.value || null) || {}
      : {};
    // 证件信息退回整改意见
    const idInfoReturn = this.idInfoReturnCreate();
    // 联系方式退回整改意见
    const connectReturn = this.connectReturnCreate();
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
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
            validateStatus={this.returnChangeWarning('ZJFZJG')}
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
                disabled={this.returnChangeState('ZJFZJG')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件地址"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('identityAddress', {
              rules: [
                { required: true, message: '请填写证件地址' },
                { validator: this.idAddCheck },
              ],
              initialValue: stepFormData.ZJDZ || '',
            })(
              <Input
                id="identityAddress"
                className={FormStyle.formInput}
                maxLength="50"
                autoComplete="off"
                disabled={this.returnChangeState('ZJDZ')}
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
                  validateStatus={this.returnChangeWarning('ZJQSRQ')}
                >
                  {getFieldDecorator('startDate', {
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
                      disabled={this.returnChangeState('ZJQSRQ')}
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
                  {getFieldDecorator('endDate', {
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
                      disabled={longFlag || this.returnChangeState('ZJJZRQ')}
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
              disabled={this.returnChangeState('ZJJZRQ')}
            />
          </div>
          <div className={FormStyle.returnWrapper}>
            {idInfoReturn}
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
              initialValue: {
                detail: stepFormData.DZ || '',
                cities: stepFormData.PROVINCE || '110000',
                secondCity: stepFormData.CITY || '',
              },
              rules: [
                { validator: this.addressCheck },
                { required: true, message: '请填写联系方式' },
              ],
            })(
              <AddressInput
                provinceInfo={provinceInfo}
                cityInfo={cityInfo}
                getCityInfoFunc={getCityInfoFunc}
                setConnect={this.setConnect}
                getConnect={this.getConnect}
                returnOpinion={returnOpinion}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('cellNumber', {
              rules: [
                { pattern: new RegExp('^1[3|4|5|7|8][0-9]{9}$'), message: '手机号码格式错误' },
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
                onChange={this.handleCellChange}
                disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机校验"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('LXXX')}
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
                onChange={this.handleCellConfirmChange}
                disabled={this.returnChangeState('LXXX')}
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
              ],
            })(
              <CodeInput
                cellGet={this.cellGet}
                getCerCodeFunc={getCerCodeFunc}
                verifyCode={this.verifyCode}
                returnOpinion={returnOpinion}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮政编码"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('LXXX')}
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
                disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="固定电话"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('LXXX')}
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
                disabled={this.returnChangeState('LXXX')}
                placeholder="例如025-88888888"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="电子邮件"
            colon={false}
            className={FormStyle.formItem}
            validateStatus={this.returnChangeWarning('LXXX')}
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
                disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>
            {connectReturn}
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
