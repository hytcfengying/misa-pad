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
export default class InfoFormOne extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    dicData: PropTypes.object,
    accountTmpInfo: PropTypes.array,
    empInforData: PropTypes.object,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    changeStepIndexFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    form: {},
    dicData: {},
    empInforData: {},
    accountTmpInfo: [],
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

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      stepCacheData,
      empInforData,
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
          KFYYB: empInforData.yyb,
          KHMB: values.KHMB,
          GTKHLY: values.GTKHLY,
          KHQC: values.KHQC,
          ZJLB: values.ZJLB,
          ZJBH: values.ZJBH,
          ZJFZJG: values.ZJFZJG,
          ZJQSRQ: values.ZJQSRQ.format(DATE_FORMAT),
          ZJJZRQ: values.ZJJZRQ.format(DATE_FORMAT),
          ZJDZ: values.ZJDZ,
          formStep: 0,
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
              index: 1,
            });
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          },
        });
      }
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

  // 开户模板选择项初始化
  accountTmpCreate() {
    const { accountTmpInfo } = this.props;
    const accountTmpOpt = [];
    accountTmpInfo.map(item =>
      accountTmpOpt.push(<Option key={item.id}>{item.mbmc}</Option>),
    );
    return accountTmpOpt;
  }

  // 证件地址校验
  @autobind
  idAddCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length < 16 && length !== 0) {
      callback('地址的有效长度必须大于等于8个汉字或16个英文字符');
    } else if (length > 100) {
      callback('地址的有效长度必须小于等于100(汉字长度计为2)');
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
        ZJJZRQ: value ? moment('3000-12-31') : '',
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
      startValue,
      endValue,
      longFlag,
    } = this.state;
    const {
      dicData,
      empInforData,
      stepCacheData,
      accountTmpInfo,
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
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>证件信息</span>
          </div>
          <FormItem
            {...formItemLayout}
            label="机构全称"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('KHQC', {
              rules: [
                { required: true, message: '机构全称缺失' },
              ],
              initialValue: stepSaveData.KHQC,
            })(
              <Input
                id="KHQC"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
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
                { required: true, message: '证件类别缺失' },
              ],
              initialValue: this.getIdType(stepSaveData.ZJLB),
            })(
              <Input
                id="ZJLB"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件编码"
            colon={false}
            className={FormStyle.formItem}
          >
            {getFieldDecorator('ZJBH', {
              rules: [
                { required: true, message: '证件编号缺失' },
              ],
              initialValue: stepFormData.ZJBH || stepSaveData.ZJBH || '1',
            })(
              <Input
                id="ZJBH"
                className={FormStyle.formInput}
                disabled
                autoComplete="off"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="证件地址"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('ZJDZ')}
          >
            {getFieldDecorator('ZJDZ', {
              rules: [
                { required: true, message: '请填写证件地址' },
                { validator: this.idAddCheck },
              ],
              initialValue: stepFormData.ZJDZ || '',
            })(
              <Input
                id="ZJDZ"
                className={FormStyle.formInput}
                maxLength="100"
                autoComplete="off"
                // disabled={this.returnChangeState('ZJDZ')}
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
                  {getFieldDecorator('ZJQSRQ', {
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
                  {getFieldDecorator('ZJJZRQ', {
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
            <Switch
              checkedChildren={'长期'}
              unCheckedChildren={'短期'}
              className={FormStyle.formSwitch}
              onChange={this.handleSwitchChange}
              checked={longFlag}
              // disabled={this.returnChangeState('ZJJZRQ')}
            />
          </div>
          <div className={FormStyle.formBlank} />
          <FormItem
            {...formItemLayout}
            label="发证机关"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('ZJFZJG')}
          >
            {getFieldDecorator('ZJFZJG', {
              rules: [
                { required: true, message: '请填写发证机关' },
              ],
              initialValue: stepFormData.ZJFZJG || '',
            })(
              <Input
                id="ZJFZJG"
                className={FormStyle.formInput}
                maxLength="30"
                autoComplete="off"
                // disabled={this.returnChangeState('ZJFZJG')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper} />
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
            {getFieldDecorator('KFYYB', {
              rules: [
                { required: true, message: '请选择开户营业厅' },
              ],
              initialValue: empInforData ? empInforData.yyb_note : stepFormData.YYB || '',
            })(
              <Input
                id="KFYYB"
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
            {getFieldDecorator('KHMB', {
              rules: [
                { required: true, message: '请选择开户模板' },
              ],
              initialValue: stepFormData.KHMB || (!_.isEmpty(accountTmpInfo[0]) ? accountTmpInfo[0].id.toString() : ''),
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                // disabled={this.returnChangeState()}
              >
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
            {getFieldDecorator('GTKHLY', {
              rules: [
                { required: true, message: '请选择客户来源' },
              ],
              initialValue: dicData ? stepFormData.GTKHLY || '0' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                // disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('GT_KHLY')}
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
