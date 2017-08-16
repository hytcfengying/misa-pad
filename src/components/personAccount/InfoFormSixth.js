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
      benefitFlag: stepFormData.JYSYRGX ? stepFormData.JYSYRGX !== '4' : false,
      idType: '',
    };
  }

  // 表单提交
  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      cheatFlag,
      benefitFlag,
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
      if (!benefitFlag) {
        filterErr = _.omit(filterErr, ['benefiterName', 'benefiterType', 'benefiterId']);
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
          CXJL: cheatFlag ? values.cheatRecord.join(';') : '',
          SJKZRXM: stepData.KHXM,
          SJKZRZJLB: stepData.ZJLB,
          SJKZRZJBH: stepData.ZJBH,
          JYSYRGX: values.benefiter,
          JYSYRXM: values.benefiter === '4' ? stepData.KHXM : values.benefiterName,
          JYSYRZJLB: values.benefiter === '4' ? stepData.ZJLB : values.benefiterType,
          JYSYRZJBH: values.benefiter === '4' ? stepData.ZJBH : values.benefiterId,
          formStep: 1,
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
              index: 2,
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
    dicData[key].map((item) => {
      if (item.flag === 1 || item.flag === 3) {
        disOpts.push(<Option key={item.ibm}>{item.note}</Option>);
      }
      return disOpts;
    });
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
  handleBenefiterChange(value) {
    if (value.target.value === '4') {
      this.setState({
        benefitFlag: false,
      });
    } else {
      this.setState({
        benefitFlag: true,
      });
      this.props.form.setFieldsValue({
        benefiterName: '',
        benefiterType: '',
        benefiterId: '',
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
      this.props.form.validateFields(['benefiterId'], { force: true });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      cheatFlag,
      benefitFlag,
    } = this.state;
    const {
      stepCacheData,
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
            disabled={this.returnChangeState('CXJL')}
          />,
        )}
      </FormItem>
    );
    const benefitInfo = (
      <div>
        <FormItem
          {...formItemLayout}
          label="受益人姓名"
          colon={false}
          className={FormStyle.formItem}
          validateStatus={this.returnChangeWarning('JYSYRGX')}
        >
          {getFieldDecorator('benefiterName', {
            rules: [
              { required: true, message: '请填写受益人姓名' },
            ],
            initialValue: stepFormData.JYSYRGX === '4' ? '' : stepFormData.JYSYRXM || '',
          })(
            <Input
              id="benefiterName"
              className={FormStyle.formInput}
              autoComplete="off"
              disabled={this.returnChangeState('JYSYRGX')}
              maxLength="120"
            />,
          )}
        </FormItem>
        <div className={FormStyle.formBlank} />
        <FormItem
          {...formItemLayout}
          label="受益人证件类别"
          colon={false}
          className={FormStyle.formItem}
          validateStatus={this.returnChangeWarning('JYSYRGX')}
        >
          {getFieldDecorator('benefiterType', {
            rules: [
              { required: true, message: '请选择受益人证件类别' },
            ],
            initialValue: stepFormData.JYSYRGX === '4' ? '' : stepFormData.JYSYRZJLB || '',
          })(
            <Select
              className={FormStyle.formSelect}
              dropdownClassName="formOption angle"
              disabled={this.returnChangeState('JYSYRGX')}
              onChange={this.handleTypeChange}
            >
              {this.dicOptsCreate('GT_ZJLB')}
            </Select>,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="受益人证件编号"
          colon={false}
          className={FormStyle.formItem}
          validateStatus={this.returnChangeWarning('JYSYRGX')}
        >
          {getFieldDecorator('benefiterId', {
            rules: [
              { required: true, message: '请填写受益人证件编号' },
              { validator: this.checkBenefiterId },
            ],
            initialValue: stepFormData.JYSYRGX === '4' ? '' : stepFormData.JYSYRZJBH || '',
          })(
            <Input
              id="benefiterId"
              className={FormStyle.formInput}
              autoComplete="off"
              disabled={this.returnChangeState('JYSYRGX')}
            />,
          )}
        </FormItem>
      </div>
    );
    // 适当性退回整改意见
    const properReturn = this.properReturnReturnCreate();
    return (
      <Form layout="inline" className={FormStyle.formWrapper} onSubmit={this.handleSubmit}>
        <div className={FormStyle.formContent}>
          <div className={FormStyle.title}>
            <span>适当性</span>
          </div>
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
                disabled={this.returnChangeState('CXJL')}
              >
                <Radio value={'1'}>有</Radio>
                <Radio value={'2'}>无</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {cheatFlag ? cheatRecord : ''}
          <FormItem
            {...formLongItemLayout}
            label="实际控制人"
            colon={false}
            className={FormStyle.formLongItem}
          >
            {getFieldDecorator('controller', {
              rules: [
                { required: true, message: '请选择实际控制人' },
              ],
              initialValue: stepFormData.SJKZRXM ? '1' : '',
            })(
              <RadioGroup disabled={this.returnChangeState('CONTROLL')}>
                <Radio value={'1'}>本人承诺所开立的账户实际控制人为本人</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem
            {...formLongItemLayout}
            label="交易受益人"
            colon={false}
            className={`${FormStyle.formLongItem} ${FormStyle.benefiterItem}`}
          >
            {getFieldDecorator('benefiter', {
              rules: [
                { required: true, message: '请选择实际受益人' },
              ],
              initialValue: stepFormData.JYSYRGX || '',
            })(
              <RadioGroup
                onChange={this.handleBenefiterChange}
                disabled={this.returnChangeState('JYSYRGX')}
              >
                <Radio value={'4'} className={FormStyle.radioLine}>本人承诺所开立的账户交易受益人为本人</Radio>
                <span className={FormStyle.radioLabel}>
                  本人开立的账户交易受益人为：
                </span>
                <Radio value={'1'}>父母</Radio>
                <Radio value={'2'}>配偶</Radio>
                <Radio value={'3'}>子女</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {benefitFlag ? benefitInfo : ''}
          <div className={FormStyle.returnWrapper} >
            {properReturn}
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
