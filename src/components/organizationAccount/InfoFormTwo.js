/**
 * @file organizationAccount/InfoForm.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import helper from '../../utils/helper';
import FormStyle from './infoForm.less';
import AddressInput from '../../components/personAccount/AddressInput';

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
    changeStepIndexFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
    countryInfo: PropTypes.array,
  }

  static defaultProps = {
    form: {},
    provinceInfo: [],
    cityInfo: [],
    dicData: {},
    empInforData: {},
    countryInfo: [],
  }

  constructor(props) {
    super(props);

    const { stepCacheData } = props;
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const saveStepForm = _.find(stepCacheData, { key: 'SFYZ' });
    const saveStepFormData = saveStepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    this.state = {
      startValue: stepFormData.ZZJGDMQSRQ ? moment(stepFormData.ZZJGDMQSRQ) : '',
      endValue: stepFormData.ZZJGDMJZRQ ? moment(stepFormData.ZZJGDMJZRQ) : '',
      nationInit: this.countryInit(saveStepFormData.ZJLB),
      nationFlag: saveStepFormData.ZJLB === '8' || saveStepFormData.ZJLB === '25',
      orgTypeFlag: stepFormData.JGLBXZ || '1',
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
        let formValue = {
          KHXM: values.KHXM,
          YWMC: values.YWMC || '',
          GJ: values.GJ,
          QYXZ: values.QYXZ,
          HYDM: values.HYDM,
          JGLBXZ: values.JGLBXZ,
          JGLB: values.JGLB,
          TBSM: values.TBSM || '',
          GYSX: values.GYSX,
          SSSX: values.SSSX,
          ZBSX: values.ZBSX,
          JGZCDZ: values.JGZCDZ,
          JGZCRQ: values.JGZCRQ.format(DATE_FORMAT),
          JGJYFW: values.JGJYFW,
          JGZCBZ: values.JGZCBZ,
          JGZCZB: values.JGZCZB,
          PROVINCE: values.address.cities,
          CITY: values.address.secondCity,
          DZ: values.address.detail,
          YZBM: values.YZBM,
          DH: values.DH,
          CZ: values.CZ || '',
          EMAIL: values.EMAIL || '',
          ZZJGDM: values.ZZJGDM,
          ZZJGDMQSRQ: values.startDate.format(DATE_FORMAT),
          ZZJGDMJZRQ: values.endDate.format(DATE_FORMAT),
          GSSWDJZ: values.GSSWDJZ,
          DSSWDJZ: values.GSSWDJZ,
          formStep: 1,
        };
        formValue = _.assign(stepFormData, formValue);
        console.log('Received values of form: ', values);
        // 保存步骤缓存
        saveStepFunc({
          bdid,
          key: 'ZLTX',
          value: JSON.stringify(formValue),
          callback: () => {
            changeStepIndexFunc({
              index: 2,
            });
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          },
        });
      }
    });
  }

  // 国籍初始化
  @autobind
  countryInit(type) {
    const { countryInfo } = this.props;
    const conuntryInit = countryInfo[0] ? countryInfo[0].ibm.toString() : '';
    if (type === '8' || type === '25' || type === '61' || type === '99') {
      return '156';
    }
    return conuntryInit;
  }

  // 国籍选择项初始化
  @autobind
  countryCreate(nationFlag) {
    const { countryInfo } = this.props;
    const country = [];
    if (!nationFlag) {
      countryInfo.map(item =>
        country.push(<Option key={item.ibm}>{item.gjmc}</Option>),
      );
    } else {
      country.push(<Option key="156">中国</Option>);
    }
    return country;
  }

  // 机构类别选项初始化
  @autobind
  jglbOptsCreate(orgTypeFlag, key) {
    const { dicData = {} } = this.props;
    if (_.isEmpty(dicData)) {
      return <Option key="noData" />;
    }
    const disOpts = [];
    dicData[key].map((item) => {
      if (item.flag === parseInt(orgTypeFlag, 10)) {
        disOpts.push(<Option key={item.ibm}>{item.note}</Option>);
      }
      return disOpts;
    });
    return disOpts;
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  // 客户姓名校验
  @autobind
  khxmCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 30) {
      callback('长度必须小于等于30(汉字长度计2)');
    }
    callback();
  }

  // 英文名称校验
  @autobind
  ywmcCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 100) {
      callback('长度必须小于等于100(汉字长度计2)');
    }
    callback();
  }

  // 特别说明校验
  @autobind
  tbsmCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 255) {
      callback('长度必须小于等于255(汉字长度计2)');
    }
    callback();
  }

  // 经营范围校验
  @autobind
  jyfwCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 200) {
      callback('长度必须小于等于200(汉字长度计2)');
    }
    callback();
  }

  // 地址校验
  @autobind
  addressCheck(rule, value, callback) {
    if (value.detail === '') {
      callback('请填写详细地址');
    }
    callback();
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

  // 机构类别性质改变处理
  @autobind
  handleJglbxzChange(value) {
    this.setState({
      orgTypeFlag: value,
    }, () => {
      this.props.form.setFieldsValue({
        JGLB: '',
      });
    });
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
      nationFlag,
      nationInit,
      orgTypeFlag,
    } = this.state;
    const {
      provinceInfo,
      cityInfo,
      getCityInfoFunc,
      stepCacheData,
      returnOpinion,
      dicData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>机构信息</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="机构简称"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('KHXM', {
              rules: [
                { required: true, message: '请填写机构简称' },
                { validator: this.khxmCheck },
              ],
              initialValue: stepFormData.KHXM || '',
            })(
              <Input
                id="KHXM"
                className={FormStyle.formInput}
                maxLength="30"
                autoComplete="off"
                // disabled={this.returnChangeState('ZJDZ')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="英文名称"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('YWMC', {
              rules: [
                { validator: this.ywmcCheck },
              ],
              initialValue: stepFormData.YWMC || '',
            })(
              <Input
                id="YWMC"
                className={FormStyle.formInput}
                maxLength="100"
                autoComplete="off"
                // disabled={this.returnChangeState('ZJDZ')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="企业类型"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('QYXZ', {
              rules: [
                { required: true, message: '请选择企业类型' },
              ],
              initialValue: dicData ? stepFormData.QYXZ || '0' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('GT_QYLX')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="行业类型"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('HYDM', {
              rules: [
                { required: true, message: '请选择行业类型' },
              ],
              initialValue: dicData ? stepFormData.HYDM || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('GT_HYDM')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="机构类别性质"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('JGLBXZ', {
              rules: [
                { required: true, message: '请选择机构类别性质' },
              ],
              initialValue: stepFormData.JGLBXZ || '1',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                onChange={this.handleJglbxzChange}
                // disabled={this.returnChangeState()}
              >
                <Option key="1">一般机构</Option>
                <Option key="2">特殊机构</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="机构类别"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('JGLB', {
              rules: [
                { required: true, message: '请选择机构类别' },
              ],
              initialValue: dicData ? stepFormData.JGLB || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                // disabled={this.returnChangeState()}
              >
                {this.jglbOptsCreate(orgTypeFlag, 'ZDZH_JGLB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="特别说明"
            colon={false}
            className={FormStyle.formLongItem}
            // validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('TBSM', {
              rules: [
                { validator: this.tbsmCheck },
              ],
              initialValue: stepFormData.TBSM || '',
            })(
              <Input
                id="TBSM"
                className={FormStyle.formInput}
                maxLength="255"
                autoComplete="off"
                // disabled={this.returnChangeState('ZJDZ')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="国籍"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('GJ', {
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
                // disabled={nationFlag || this.returnChangeState('BJXX')}
              >
                {this.countryCreate(nationFlag)}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="国有属性"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('GYSX', {
              rules: [
                { required: true, message: '请选择国有属性' },
              ],
              initialValue: dicData ? stepFormData.GYSX || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('ZDZH_GYSX')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="上市属性"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('SSSX', {
              rules: [
                { required: true, message: '请选择上市属性' },
              ],
              initialValue: dicData ? stepFormData.SSSX || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('ZD_SSSX')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资本属性"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('ZBSX', {
              rules: [
                { required: true, message: '请选择资本属性' },
              ],
              initialValue: dicData ? stepFormData.ZBSX || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('ZDZH_ZBSX')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册地址"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('JGZCDZ', {
              rules: [
                { required: true, message: '请填写注册地址' },
              ],
              initialValue: stepFormData.ZJDZ,
            })(
              <Input
                id="JGZCDZ"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册日期"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={stepSaveData.CSRQ || this.returnChangeState('BJXX') ?
            //   '' :
            //   this.returnChangeWarning('BJXX')}
          >
            {getFieldDecorator('JGZCRQ', {
              rules: [
                { type: 'object', required: true, message: '请选择注册日期' },
              ],
              initialValue: moment(stepFormData.JGZCRQ) || '',
            })(
              <DatePicker
                format="YYYYMMDD"
                placeholder="注册日期"
                showTime={false}
                showToday={false}
                // disabled={stepSaveData.CSRQ || this.returnChangeState('BJXX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="经营范围"
            colon={false}
            className={FormStyle.formLongItem}
            // validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('JGJYFW', {
              rules: [
                { required: true, message: '请填写经营范围' },
                { validator: this.jyfwCheck },
              ],
              initialValue: stepFormData.JGJYFW || '',
            })(
              <Input
                id="JGJYFW"
                className={FormStyle.formInput}
                maxLength="200"
                autoComplete="off"
                // disabled={this.returnChangeState('ZJDZ')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册资本币种"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('JGZCBZ', {
              rules: [
                { required: true, message: '请选择注册资本币种' },
              ],
              initialValue: dicData ? stepFormData.JGZCBZ || '1' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('GT_BZ')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册资本"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('JGZCZB', {
              rules: [
                { required: true, message: '请填写注册资本' },
              ],
              initialValue: stepFormData.JGZCZB || '',
            })(
              <Input
                id="JGZCZB"
                className={FormStyle.formInput}
                maxLength="23"
                autoComplete="off"
                suffix="万元"
                // disabled={this.returnChangeState('ZJDZ')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="联系地址"
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
            label="邮政编码"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('YZBM', {
              rules: [
                { pattern: new RegExp('^\\d{6}$'), message: '邮政编码格式错误' },
                { required: true, message: '请填写邮政编码' },
              ],
              initialValue: stepFormData.YZBM || '',
            })(
              <Input
                id="YZBM"
                className={FormStyle.formInput}
                maxLength="6"
                autoComplete="off"
                // disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="固定电话"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('DH', {
              rules: [
                { pattern: new RegExp('^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$'), message: '固定电话格式错误' },
                { required: true, message: '请填写固定电话' },
              ],
              initialValue: stepFormData.DH || '',
            })(
              <Input
                id="DH"
                className={FormStyle.formInput}
                maxLength="20"
                autoComplete="off"
                // disabled={this.returnChangeState('LXXX')}
                placeholder="例如025-88888888"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="传真"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('CZ', {
              rules: [
                { pattern: new RegExp('^[0-9]*$'), message: '传真格式不正确' },
              ],
              initialValue: stepFormData.CZ || '',
            })(
              <Input
                id="CZ"
                className={FormStyle.formInput}
                maxLength="20"
                autoComplete="off"
                // disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="电子邮件"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('EMAIL', {
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
                // disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.warn}>
            <p>
              <span className={FormStyle.warnIcon} />
              营业执照：有效证件号为统一社会信用代码的，录入“第9位至第17位”，并在16至17位之间加“-”
            </p>
          </div>
          <FormItem
            {...formItemLayout}
            label="机构代码证编码"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('ZZJGDM', {
              rules: [
                { pattern: new RegExp('[a-zA-Z0-9]{8}-[a-zA-Z0-9]'), message: '编码格式错误' },
                { required: true, message: '请填写机构代码证编码' },
              ],
              initialValue: stepFormData.ZZJGDM || '',
            })(
              <Input
                id="ZZJGDM"
                className={FormStyle.formInput}
                maxLength="16"
                autoComplete="off"
                // disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.formBlank} />
          <div className={FormStyle.dateItem}>
            <div className={FormStyle.dateWrapper}>
              <div className={FormStyle.label}>
                机构代码证有效期
              </div>
              <div className={FormStyle.dateContent}>
                <FormItem
                  className={FormStyle.dateSub}
                  // validateStatus={this.returnChangeWarning('ZJQSRQ')}
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
                      // disabled={this.returnChangeState('ZJQSRQ')}
                    />,
                  )}
                </FormItem>
                <div className={FormStyle.dateLink}>
                  至
                </div>
                <FormItem
                  className={FormStyle.dateSub}
                  // validateStatus={this.returnChangeWarning('ZJJZRQ')}
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
                      // disabled={longFlag || this.returnChangeState('ZJJZRQ')}
                    />,
                  )}
                </FormItem>
              </div>
            </div>
          </div>
          <div className={FormStyle.warn}>
            <p>
              <span className={FormStyle.warnIcon} />
              有效证件号为统一社会信用代码的，录入18位“社会信用代码”号码
            </p>
          </div>
          <FormItem
            {...formItemLayout}
            label="税务登记证"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('GSSWDJZ', {
              rules: [
                { required: true, message: '请填写税务登记证' },
              ],
              initialValue: stepFormData.GSSWDJZ || '',
            })(
              <Input
                id="GSSWDJZ"
                className={FormStyle.formInput}
                maxLength="60"
                autoComplete="off"
                // disabled={this.returnChangeState('LXXX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper} />
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
