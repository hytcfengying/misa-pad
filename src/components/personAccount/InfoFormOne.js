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
} from 'antd';
import _ from 'lodash';

import FormStyle from './infoForm.less';

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
      identityAnswer: stepFormData.SFYZDA || '',
      identityConfirm: stepFormData.SFYZDA || '',
    };
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
          SFYZWT: values.identityQuestion,
          SFYZDA: this.state.identityAnswer,
          KFYYB: empInforData.yyb,
          KHMB: values.mould,
          GTKHLY: values.resource,
          formStep: 0,
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
              index: 1,
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

  render() {
    const { getFieldDecorator } = this.props.form;
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
    // 身份验证问题退回整改
    const identityReturn = this.identityReturnCreate();
    // 营业部退回整改
    const yybReturn = this.yybReturnCreate();
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
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                key="identityQuestion"
                disabled={this.returnChangeState()}
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
                maxLength="30"
                onChange={this.handleAnswerChange}
                onBlur={this.handleAnswerBlur}
                onFocus={this.handleAnswerFocus}
                autoComplete="off"
                disabled={this.returnChangeState()}
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
                maxLength="30"
                onBlur={this.handleConfirmBlur}
                onFocus={this.handleConfirmFocus}
                onPaste={this.handlePaste}
                autoComplete="off"
                disabled={this.returnChangeState()}
              />,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>
            {identityReturn}
          </div>
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
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                disabled={this.returnChangeState()}
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
            {getFieldDecorator('resource', {
              rules: [
                { required: true, message: '请选择客户来源' },
              ],
              initialValue: dicData ? stepFormData.GTKHLY || '0' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                disabled={this.returnChangeState()}
              >
                {this.dicOptsCreate('GT_KHLY')}
              </Select>,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper}>
            {yybReturn}
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
