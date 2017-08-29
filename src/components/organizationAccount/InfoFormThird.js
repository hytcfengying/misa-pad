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
  DatePicker,
  Switch,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import helper from '../../utils/helper';
import FormStyle from './infoForm.less';

const FormItem = Form.Item;
const DATE_FORMAT = 'YYYYMMDD';
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
    const JGKGGDSTR = stepFormData.JGKGGDSTR ? stepFormData.JGKGGDSTR[0] : '';
    const ZJQSRQ = JGKGGDSTR ? JGKGGDSTR.ZJQSRQ || '' : '';
    const ZJYXQ = JGKGGDSTR ? JGKGGDSTR.ZJYXQ || '' : '';
    this.state = {
      startValue1: stepFormData.FRDBZJQSRQ ? moment(stepFormData.FRDBZJQSRQ) : '',
      endValue1: stepFormData.FRDBZJJZRQ ? moment(stepFormData.FRDBZJJZRQ) : '',
      longFlag1: stepFormData.FRDBZJJZRQ === '30001231',
      startValue2: ZJQSRQ ? moment(ZJQSRQ) : '',
      endValue2: ZJYXQ ? moment(ZJYXQ) : '',
      longFlag2: ZJYXQ === '30001231',
      frIdType: stepFormData.FRDBZJLB || '0',
      gdIdType: JGKGGDSTR ? JGKGGDSTR.ZJLB || '0' : '0',
      countryInit: JGKGGDSTR ? JGKGGDSTR.GJDM || '156' : '156',
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
  onStartChange1(value) {
    this.onChange('startValue1', value);
  }

  @autobind
  onEndChange1(value) {
    this.onChange('endValue1', value);
  }

  @autobind
  onStartChange2(value) {
    this.onChange('startValue2', value);
  }

  @autobind
  onEndChange2(value) {
    this.onChange('endValue2', value);
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

  // 限制日期选择范围
  @autobind
  disabledStartDate1(startValue) {
    const endValue = this.state.endValue1;
    if (!startValue || !endValue) {
      return startValue && startValue.valueOf() > Date.now();
    }
    return startValue.valueOf() > endValue.valueOf() ||
      startValue.valueOf() > Date.now();
  }

  // 限制日期选择范围
  @autobind
  disabledEndDate1(endValue) {
    const startValue = this.state.startValue1;
    if (!endValue || !startValue) {
      return endValue && endValue.valueOf() < Date.now();
    }
    return endValue.valueOf() <= startValue.valueOf() ||
      endValue.valueOf() < Date.now();
  }

  // 限制日期选择范围
  @autobind
  disabledStartDate2(startValue) {
    const endValue = this.state.endValue2;
    if (!startValue || !endValue) {
      return startValue && startValue.valueOf() > Date.now();
    }
    return startValue.valueOf() > endValue.valueOf() ||
      startValue.valueOf() > Date.now();
  }

  // 限制日期选择范围
  @autobind
  disabledEndDate2(endValue) {
    const startValue = this.state.startValue2;
    if (!endValue || !startValue) {
      return endValue && endValue.valueOf() < Date.now();
    }
    return endValue.valueOf() <= startValue.valueOf() ||
      endValue.valueOf() < Date.now();
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
          FRDBXM: values.FRDBXM,
          FRDBZJLB: values.FRDBZJLB,
          FRDBZJBH: values.FRDBZJBH,
          FRDBZJQSRQ: values.FRDBZJQSRQ.format(DATE_FORMAT),
          FRDBZJJZRQ: values.FRDBZJJZRQ.format(DATE_FORMAT),
          FRDBDH: values.FRDBDH,
          JGKGGDSTR: [
            {
              GDMC: values.GDMC,
              ZJLB: values.ZJLB,
              ZJBH: values.ZJBH,
              ZJQSRQ: values.ZJQSRQ.format(DATE_FORMAT),
              ZJYXQ: values.ZJYXQ.format(DATE_FORMAT),
              EMAIL: values.EMAIL,
              GJDM: '',
              KZRLX: '1',
            },
          ],
          formStep: 2,
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

  dicZjlbCreate(key) {
    const { dicData = {} } = this.props;
    if (_.isEmpty(dicData)) {
      return <Option key="noData" />;
    }
    const disOpts = [];
    dicData[key].map((item) => {
      if (item.flag === 1 || item.flag === 3) {
        disOpts.push(<Option key={item.ibm}>{item.note}</Option>);
      }
      return disOpts;
    });
    return disOpts;
  }

  // 国籍初始化
  @autobind
  countryInit() {
    const { countryInfo } = this.props;
    const { gdIdType } = this.state;
    const conuntryInit = countryInfo[0] ? countryInfo[0].ibm.toString() : '';
    if (gdIdType === '18' ||
      gdIdType === '6' ||
      gdIdType === '59' ||
      gdIdType === '60') {
      return conuntryInit;
    } else if (gdIdType === '4') {
      return '446';
    } else if (gdIdType === '15') {
      return '158';
    } else if (gdIdType === '16') {
      return '446';
    } else if (gdIdType === '19') {
      return '344';
    } else if (gdIdType === '20') {
      return '446';
    }
    return '156';
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

  // 姓名校验
  @autobind
  xmCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 60) {
      callback('长度必须小于等于60(汉字长度计2)');
    }
    callback();
  }

  // 股东姓名校验
  @autobind
  gdxmCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 40) {
      callback('长度必须小于等于40(汉字长度计2)');
    }
    callback();
  }

  // 证件类别改变处理
  @autobind
  handleFrzjlbChange(value) {
    this.props.form.setFieldsValue({
      FRDBZJBH: '',
    });
    this.setState({
      frIdType: value,
    });
  }

  // 股东证件类别改变处理
  @autobind
  handleGdzjlbChange(value) {
    this.setState({
      gdIdType: value,
    }, () => {
      this.props.form.setFieldsValue({
        ZJBH: '',
        GJDM: this.countryInit(),
      });
    });
  }

  // 法人证件编号验证
  @autobind
  checkFrId(rule, value, callback) {
    const { frIdType } = this.state;
    if (frIdType && value !== '') {
      if (helper.checkIdentity(value, frIdType)) {
        callback();
        return;
      }
      callback('请输入正确的格式');
      return;
    }
    callback();
  }

  // 身份问题确认校验
  @autobind
  checkGdId(rule, value, callback) {
    const { gdIdType } = this.state;
    if (gdIdType && value !== '') {
      if (helper.checkIdentity(value, gdIdType)) {
        callback();
        return;
      }
      callback('请输入正确的格式');
      return;
    }
    callback();
  }

  // 长期选择处理
  @autobind
  handleSwitchChange1(value) {
    this.setState({
      longFlag1: value,
    }, () => {
      this.props.form.setFieldsValue({
        FRDBZJJZRQ: value ? moment('3000-12-31') : '',
      });
    });
  }

  // 长期选择处理
  @autobind
  handleSwitchChange2(value) {
    this.setState({
      longFlag2: value,
    }, () => {
      this.props.form.setFieldsValue({
        ZJYXQ: value ? moment('3000-12-31') : '',
      });
    });
  }

  // 营业部退回整改意见
  @autobind
  yybReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'KFYYB' || item.zd === 'KHMB' || item.zd === 'GTKHLY') {
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
  returnChangeState() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return false;
    }
    return true;
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
      startValue1,
      endValue1,
      longFlag1,
      startValue2,
      endValue2,
      longFlag2,
      gdIdType,
      countryInit,
    } = this.state;
    const {
      dicData,
      stepCacheData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    const JGKGGDSTR = stepFormData.JGKGGDSTR ? stepFormData.JGKGGDSTR[0] : '';
    // 国籍生成
    const countryList = this.countryCreate(gdIdType);
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>法定代表人</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="姓名"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('FRDBXM', {
              rules: [
                { required: true, message: '请填写姓名' },
                { validator: this.xmCheck },
              ],
              initialValue: stepFormData.FRDBXM || '',
            })(
              <Input
                id="FRDBXM"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="60"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件类别"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('FRDBZJLB', {
              rules: [
                { required: true, message: '请选择证件类别' },
              ],
              initialValue: dicData ? stepFormData.FRDBZJLB || '0' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                onChange={this.handleFrzjlbChange}
                // disabled={this.returnChangeState()}
              >
                {this.dicZjlbCreate('GT_ZJLB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件号码"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('FRDBZJBH', {
              rules: [
                { required: true, message: '请填写证件号码' },
                { validator: this.checkFrId },
              ],
              initialValue: stepFormData.FRDBZJBH || '',
            })(
              <Input
                id="FRDBZJBH"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="30"
                // disabled={this.returnChangeState('JYSYRGX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('LXXX')}
          >
            {getFieldDecorator('FRDBDH', {
              rules: [
              ],
              initialValue: stepFormData.FRDBDH || '',
            })(
              <Input
                id="FRDBDH"
                className={FormStyle.formInput}
                autoComplete="off"
                // disabled={this.returnChangeState('LXXX')}
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
                  // validateStatus={this.returnChangeWarning('ZJQSRQ')}
                >
                  {getFieldDecorator('FRDBZJQSRQ', {
                    initialValue: startValue1,
                    rules: [
                      { type: 'object', required: true, message: '请选择开始时间' },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate1}
                      format="YYYYMMDD"
                      placeholder="开始时间"
                      onChange={this.onStartChange1}
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
                  {getFieldDecorator('FRDBZJJZRQ', {
                    initialValue: endValue1,
                    rules: [
                      { type: 'object', required: true, message: '请选择结束时间' },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate1}
                      format="YYYYMMDD"
                      placeholder="结束时间"
                      onChange={this.onEndChange1}
                      showTime={false}
                      showToday={false}
                      // disabled={longFlag || this.returnChangeState('ZJJZRQ')}
                    />,
                  )}
                </FormItem>
              </div>
            </div>
            <Switch
              checkedChildren={'长期'}
              unCheckedChildren={'短期'}
              className={FormStyle.formSwitch}
              onChange={this.handleSwitchChange1}
              checked={longFlag1}
              // disabled={this.returnChangeState('ZJJZRQ')}
            />
          </div>
          <div className={FormStyle.returnWrapper} />
        </div>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>控股股东</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="姓名"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('GDMC', {
              rules: [
                { required: true, message: '请填写姓名' },
                { validator: this.gdxmCheck },
              ],
              initialValue: JGKGGDSTR ? JGKGGDSTR.GDMC || '' : '',
            })(
              <Input
                id="GDMC"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="40"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件类别"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('ZJLB', {
              rules: [
                { required: true, message: '请选择证件类别' },
              ],
              initialValue: JGKGGDSTR ? JGKGGDSTR.ZJLB || '0' : '0',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                onChange={this.handleGdzjlbChange}
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('GT_ZJLB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件号码"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('ZJBH', {
              rules: [
                { required: true, message: '请填写证件号码' },
                { validator: this.checkGdId },
              ],
              initialValue: JGKGGDSTR ? JGKGGDSTR.ZJBH || '' : '',
            })(
              <Input
                id="ZJBH"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="30"
                // disabled={this.returnChangeState('JYSYRGX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.formBlank} />
          <div className={FormStyle.dateItem}>
            <div className={FormStyle.dateWrapper}>
              <div className={FormStyle.label}>
                证件有效期
              </div>
              <div className={FormStyle.dateContent}>
                <FormItem
                  className={FormStyle.dateSub}
                  // validateStatus={this.returnChangeWarning('ZJQSRQ')}
                >
                  {getFieldDecorator('ZJQSRQ', {
                    initialValue: startValue2,
                    rules: [
                      { type: 'object', required: true, message: '请选择开始时间' },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate2}
                      format="YYYYMMDD"
                      placeholder="开始时间"
                      onChange={this.onStartChange2}
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
                  {getFieldDecorator('ZJYXQ', {
                    initialValue: endValue2,
                    rules: [
                      { type: 'object', required: true, message: '请选择结束时间' },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate2}
                      format="YYYYMMDD"
                      placeholder="结束时间"
                      onChange={this.onEndChange2}
                      showTime={false}
                      showToday={false}
                      // disabled={longFlag || this.returnChangeState('ZJJZRQ')}
                    />,
                  )}
                </FormItem>
              </div>
            </div>
            <Switch
              checkedChildren={'长期'}
              unCheckedChildren={'短期'}
              className={FormStyle.formSwitch}
              onChange={this.handleSwitchChange2}
              checked={longFlag2}
              // disabled={this.returnChangeState('ZJJZRQ')}
            />
          </div>
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
              initialValue: JGKGGDSTR ? JGKGGDSTR.EMAIL || '' : '',
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
          <FormItem
            {...formItemLayout}
            label="国籍"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('KHDLR')}
          >
            {getFieldDecorator('GJDM', {
              rules: [
                { required: true, message: '请选择国籍' },
              ],
              initialValue: countryInit,
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                showSearch
                optionFilterProp="children"
              >
                {countryList}
              </Select>,
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
