/**
 * @file
 * @author fengying zzc
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input, Select, Form, Button } from 'antd';
import _ from 'lodash';

import NextPop from './nextPop';

import formStyles from '../personAccount/form.less';
import styles from './identity.less';

// import BoxTitle from '../personAccount/BoxTitle';
// import SelectDepart from '../identity/selectDepart';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@Form.create()
export default class boxTitle extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    form: PropTypes.object.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    tapDisabled: PropTypes.bool.isRequired,
    openAccCheckFunc: PropTypes.func.isRequired,
    openAccCheckData: PropTypes.object,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    dicData: {},
    empInforData: {},
    openAccCheckData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      accessState: false,
      // 下一步
      stepValue: '',
      cacheKey: 'SFYZ',
      value: '',
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { openAccCheckData } = nextProps;
    if (!_.isEqual(openAccCheckData, this.props.openAccCheckData) &&
      !_.isEmpty(openAccCheckData)) {
      const sfyxkh = openAccCheckData.o_sfyxkh;
      const msg = openAccCheckData.o_msg;
      if (sfyxkh === 1) {
        setTimeout(() => {
          this.setState({
            isActive: true,
            accessState: true,
          });
        }, 200);
      } else {
        this.setState({
          isActive: false,
          accessState: false,
        });
        this.props.changePopState({
          popShow: true,
          popType: 'errPop',
          popTest: msg,
        });
      }
    }
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  // 数据字典选择项初始化
  @autobind
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
  emitEmpty() {
    this.searchInput.focus();
    this.setState({ value: '' });
  }

  @autobind
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  @autobind
  handleSearch() {
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault();
    const {
      form,
      openAccCheckFunc,
      empInforData,
      location: { query },
    } = this.props;
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        openAccCheckFunc({
          ...query,
          khqc: values.khqc,
          zjbh: values.zjbh,
          yyb: empInforData.yyb,
          zjlb: values.zjlb,
          tabIndex: 4,
        });
        const SFYZData = {
          YYB: empInforData.yyb ? empInforData.yyb.toString() : '',
          KHXM: values.khqc,
          XB: '',
          ZJLB: values.zjlb,
          ZJBH: values.zjbh,
          KHXZR: empInforData.id ? empInforData.id.toString() : '',
          JGBZ: '1',
          KHFS: '2',
          KHZD: '2',
          KHLY: '8',
          ZJYZLY: '3',
          CZZD: '',
        };
        this.setState({
          stepValue: JSON.stringify(SFYZData),
        });
      }
    });
  }

  render() {
    const {
      push,
      tapDisabled,
      getBdidFunc,
      saveStepFunc,
      bdid,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      value,
      accessState,
      cacheKey,
      stepValue,
    } = this.state;
    const isCheck = this.state.isActive ? styles.activited : '';
    const suffix = value ?
      <span className={styles.searchClear} onClick={this.emitEmpty} /> : null;
    const prefix = value ?
      <span className={styles.searchIcon} onClick={this.handleSearch} /> :
      <span className={styles.searchIconP} />;
    return (
      <div className={`${styles.identity} ${formStyles.form}`}>
        <div className={styles.searchBar}>
          <div className={styles.searchForm}>
            <Input
              placeholder="请输入一码通号码查询"
              prefix={prefix}
              suffix={suffix}
              value={value}
              onChange={this.handleChange}
              ref={(node) => { (this.searchInput = node); }}
              onPressEnter={this.handleSearch}
              maxLength={20}
              disbaled={tapDisabled}
            />
          </div>
        </div>
        <div className={`${styles.formArea} clearfix`}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="机构全称"
              colon={false}
            >
              {getFieldDecorator(
                'khqc',
                {
                  // initialValue: 'xxx',
                  rules: [
                    { required: true, message: '机构全称不能为空!', whitespace: true },
                  ],
                },
              )(
                <Input
                  placeholder="请输入机构全称"
                  autoComplete="off"
                  disbaled={tapDisabled}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="证件类型"
              colon={false}
            >
              {getFieldDecorator('zjlb', {
                rules: [
                  { required: true, message: '请选择证件类型！' },
                ],
              })(
                <Select disbaled={tapDisabled}>
                  {this.dicOptsCreate('GT_ZJLB')}
                </Select>,
              )}
            </FormItem>
            <div className={styles.tip}>
              <p>
                <span />营业执照：有效证件号为统一社会信用代码的，录入18位“社会信用代码”号码
              </p>
            </div>
            <FormItem
              {...formItemLayout}
              label="证件编号"
              colon={false}
              className={styles.label}
            >
              {getFieldDecorator('zjbh', {
                rules: [{
                  pattern: /^\d*$/, message: '证件编号输入错误!',
                }, {
                  required: true, message: '请输入证件编号!',
                }],
              })(
                <Input
                  placeholder="请输入证件编号"
                  autoComplete="off"
                  disbaled={tapDisabled}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="证件校验"
              colon={false}
              className={styles.label}
            >
              {getFieldDecorator('zjbhCheck', {
                rules: [{
                  pattern: /^\d*$/, message: '证件编号输入错误!',
                }, {
                  required: true, message: '请输入证件编号!',
                }],
              })(
                <Input
                  placeholder="请再次输入证件编号"
                  onPaste={this.handlePaste}
                  autoComplete="off"
                  disbaled={tapDisabled}
                />,
              )}
            </FormItem>
            <div className={styles.buttBox}>
              <Button
                type="primary"
                className={`${styles.checkBut} ${isCheck}`}
                onClick={this.handleSubmit}
              >机构核查</Button>
            </div>
          </Form>
        </div>
        <NextPop
          accessState={accessState}
          push={push}
          location={location}
          stepValue={stepValue}
          getBdidFunc={getBdidFunc}
          saveStepFunc={saveStepFunc}
          bdid={bdid}
          cacheKey={cacheKey}
        />
      </div>
    );
  }
}
