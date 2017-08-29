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
  Checkbox,
} from 'antd';
import _ from 'lodash';

import helper from '../../utils/helper';
import FormStyle from './infoForm.less';
// import IdRangePicker from '../../components/personAccount/IdRangePicker';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const recordOpts = [
  { label: '中国人民银行征信中心', value: '1' },
  { label: '最高人民法院失信被执行人名单', value: '2' },
  { label: '工商行政管理机构', value: '3' },
  { label: '税务管理机构', value: '4' },
  { label: '监管机构、自律组织', value: '5' },
  { label: '投资者在证券经营机构从事投资活动时产生的违约等失信行为记录', value: '6' },
  { label: '过度维权等不当行为信息', value: '7' },
  { label: '其他', value: '8' },
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
    dicData: PropTypes.object,
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
  }

  constructor(props) {
    super(props);

    const { stepCacheData } = props;
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    this.state = {
      cheatFlag: stepFormData.CXJL,
      setFlag: stepFormData.ZYTZZLX,
      idType: '',
    };
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      cheatFlag,
      setFlag,
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
      if (!cheatFlag) {
        filterErr = _.omit(filterErr, 'cheatRecord');
      }
      if (!setFlag) {
        filterErr = _.omit(filterErr, 'ZYTZZLB');
      }
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
          ZYTZZLX: values.ZYTZZLX,
          ZYTZZLB: values.ZYTZZLB || '',
          ZYTZZDQR: '30001231',
          CXJL: cheatFlag ? values.cheatRecord.join(';') : '',
          SJKZRXM: values.SJKZRXM,
          SJKZRZJLB: values.SJKZRZJLB,
          SJKZRZJBH: values.SJKZRZJBH,
          JYSYRGX: values.JYSYRGX,
          JYSYRXM: stepData.KHQC,
          JYSYRZJLB: stepData.ZJLB,
          JYSYRZJBH: stepData.ZJBH,
          formStep: 3,
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
              index: 4,
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

  @autobind
  cheatSelInit(data) {
    if (data) {
      return '1';
    } else if (data === '') {
      return '2';
    }
    return '';
  }

  @autobind
  handleCheatSelChange(value) {
    if (value.target.value === '1') {
      this.setState({
        cheatFlag: true,
      });
    } else {
      this.setState({
        cheatFlag: false,
      });
    }
  }

  @autobind
  handleProSetChange(value) {
    if (value.target.value === '125001') {
      this.setState({
        setFlag: true,
      });
    } else {
      this.setState({
        setFlag: false,
      });
    }
  }

  // 适当性退回整改意见
  @autobind
  properReturnReturnCreate() {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    const returnHtml = [];
    let sort = 1;
    returnOpinion.map((item) => {
      if (item.zd === 'CXJL' ||
          item.zd === 'JYSYRGX'
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

  // 身份问题确认校验
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

  // 证件类型改变处理
  @autobind
  handleTypeChange(value) {
    this.setState({
      idType: value,
    }, () => {
      this.props.form.setFieldsValue({
        SJKZRZJBH: '',
      });
    });
  }

  // 控制人姓名校验
  @autobind
  benefiterNameCheck(rule, value, callback) {
    const length = helper.asciilen(value);
    if (length > 120) {
      callback('实际控制人姓名长度必须小于120个字符');
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      cheatFlag,
      setFlag,
    } = this.state;
    const {
      stepCacheData,
      dicData,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    // HTML
    const cheatRecord = (
      <FormItem
        {...formLongItemLayout}
        label="不良记录"
        colon={false}
        className={`${FormStyle.formLongItem} ${FormStyle.recordItem}`}
      >
        {getFieldDecorator('cheatRecord', {
          rules: [
            { required: true, message: '请选择不良记录' },
          ],
          initialValue: stepFormData.CXJL ? stepFormData.CXJL.split(';') : [],
        })(
          <CheckboxGroup
            options={recordOpts}
            // disabled={this.returnChangeState('CXJL')}
          />,
        )}
      </FormItem>
    );
    const proSetHTML = (
      <FormItem
        {...formItemLayout}
        label="专业投资者类型"
        colon={false}
        className={FormStyle.formItem}
        // validateStatus={this.returnChangeWarning('FXQXX')}
      >
        {getFieldDecorator('ZYTZZLB', {
          rules: [
            { required: true, message: '请选择专业投资者类型' },
          ],
          initialValue: dicData ? stepFormData.ZYTZZLB || '10' : '',
        })(
          <Select
            className={FormStyle.formSelect}
            dropdownClassName="formOption"
            // disabled={this.returnChangeState('FXQXX')}
          >
            {this.dicOptsCreate('GT_ZYTZZLB')}
          </Select>,
        )}
      </FormItem>
    );
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>适当性</span>
          </div>
          <FormItem
            {...formLongItemLayout}
            label="专业投资者认定"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('ZYTZZLX', {
              rules: [
                { required: true, message: '请选择专业投资者认定' },
              ],
              initialValue: stepFormData.ZYTZZLX || '',
            })(
              <RadioGroup
                onChange={this.handleProSetChange}
                // disabled={this.returnChangeState('CXJL')}
              >
                <Radio value={'125001'}>是(同意划分为专业投资者A)</Radio>
                <Radio value={'0'}>否</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {setFlag ? proSetHTML : ''}
          <FormItem
            {...formLongItemLayout}
            label="不良诚信记录"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('cheatSel', {
              rules: [
                { required: true, message: '请选择不良诚信记录' },
              ],
              initialValue: this.cheatSelInit(stepFormData.CXJL),
            })(
              <RadioGroup
                onChange={this.handleCheatSelChange}
                // disabled={this.returnChangeState('CXJL')}
              >
                <Radio value={'1'}>有</Radio>
                <Radio value={'2'}>无</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {cheatFlag ? cheatRecord : ''}
          <FormItem
            {...formItemLayout}
            label="实际控制人姓名"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('SJKZRXM', {
              rules: [
                { required: true, message: '请填写实际控制人姓名' },
                { validator: this.benefiterNameCheck },
              ],
              initialValue: stepFormData.SJKZRXM || '',
            })(
              <Input
                id="SJKZRXM"
                className={FormStyle.formInput}
                autoComplete="off"
                // disabled={this.returnChangeState('JYSYRGX')}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="控制人证件类别"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('SJKZRZJLB', {
              rules: [
                { required: true, message: '请选择控制人证件类别' },
              ],
              initialValue: stepFormData.SJKZRZJLB || '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption angle"
                // disabled={this.returnChangeState('JYSYRGX')}
                onChange={this.handleTypeChange}
              >
                {this.dicZjlbCreate('GT_ZJLB')}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="控制人证件编号"
            colon={false}
            className={FormStyle.formItem}
            // validateStatus={this.returnChangeWarning('JYSYRGX')}
          >
            {getFieldDecorator('SJKZRZJBH', {
              rules: [
                { required: true, message: '请填写控制人证件编号' },
                { validator: this.checkBenefiterId },
              ],
              initialValue: stepFormData.SJKZRZJBH || '',
            })(
              <Input
                id="benefiterId"
                className={FormStyle.formInput}
                autoComplete="off"
                maxLength="30"
                // disabled={this.returnChangeState('JYSYRGX')}
              />,
            )}
          </FormItem>
          <div className={FormStyle.formBlank} />
          <FormItem
            {...formLongItemLayout}
            label="交易受益人"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('JYSYRGX', {
              rules: [
                { required: true, message: '请选择交易受益人' },
              ],
              initialValue: stepFormData.JYSYRGX || '',
            })(
              <RadioGroup>
                <Radio value={'5'}>账户的交易受益人为本机构</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <div className={FormStyle.returnWrapper} />
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
            // validateStatus={this.returnChangeWarning('FXQXX')}
          >
            {getFieldDecorator('XQFXDJ', {
              rules: [
                { required: true, message: '请选择反洗钱风险等级' },
              ],
              initialValue: dicData ? stepFormData.XQFXDJ || '0' : '',
            })(
              <Select
                className={FormStyle.formSelect}
                dropdownClassName="formOption"
                // disabled={this.returnChangeState('FXQXX')}
              >
                {this.dicOptsCreate('XQFXDJ')}
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
