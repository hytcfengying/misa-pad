/**
 * @file
 * @author fengying zzc
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input, Select, Form, Button } from 'antd';
import _ from 'lodash';
import helper from '../../utils/helper';

import NextPop from './nextPop';
import NumResult from '../identity/numResult';
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
    openAccCheckFunc: PropTypes.func.isRequired,
    openAccCheckData: PropTypes.object,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    numQuery: PropTypes.array,
    getSearchNumFunc: PropTypes.func.isRequired,
    tapDisabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    location: {},
    dicData: {},
    empInforData: {},
    openAccCheckData: {},
    numQuery: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      accessState: false,
      numShow: false,
      idType: '8',
      newData: {},
      // 下一步
      stepValue: '',
      cacheKey: 'SFYZ',
      value: '',
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { openAccCheckData, numQuery } = nextProps;
    if (!_.isEqual(openAccCheckData, this.props.openAccCheckData) &&
      !_.isEmpty(openAccCheckData)) {
      const sfyxkh = openAccCheckData.o_sfyxkh;
      const msg = openAccCheckData.o_msg;
      if (sfyxkh === 1) {
        setTimeout(() => {
          this.setState({
            accessState: true,
            numShow: false,
          });
        }, 200);
      } else {
        this.setState({
          accessState: false,
        });
        this.props.changePopState({
          popShow: true,
          popType: 'errPop',
          popTest: msg,
        });
      }
    }
    if (!_.isEqual(numQuery, this.props.numQuery) && numQuery) {
      const { jgdm, hbjgsm, clbz, nowIndex } = numQuery[0];
      let test = '';
      let popVis = false;
      if (nowIndex === '999') {
        if (clbz === 1 || clbz === 2) {
          test = '该投资者尚未开立证券账号，请先至中国结算公司办理证券账号开户';
          popVis = true;
        } else if (clbz === 4) {
          test = '该一码通号不存在，查询出错';
          popVis = true;
        } else if (clbz === 3) {
          if (jgdm === '0000') {
            popVis = false;
            this.setState({
              numShow: true,
            });
          } else {
            test = hbjgsm;
            popVis = true;
          }
        }
        this.props.changePopState({
          popShow: popVis,
          popType: 'errPop',
          popTest: test,
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
    dicData[key].map((item) => {
      if (
        item.ibm === 8 ||
        item.ibm === 25 ||
        item.ibm === 61 ||
        item.ibm === 99
      ) {
        return disOpts.push(<Option key={item.ibm}>{item.note}</Option>);
      }
      return '';
    });
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

  // 机构全称校验
  @autobind
  nameCheck(rule, value, callback) {
    if (value) {
      const length = helper.asciilen(value);
      if (length > 120) {
        callback('机构全称长度必须小于120个字符');
      }
      callback();
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
        zjbh: '',
        zjbhCheck: '',
      });
    });
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

  // 确认校验
  @autobind
  checkId(rule, value, callback) {
    if (!value ||
        !this.props.form.getFieldValue('zjbh') ||
        value === this.props.form.getFieldValue('zjbh')) {
      callback();
      return;
    }
    callback('请保持证件号一致！');
  }

  @autobind
  handleSearch() {
    const { getSearchNumFunc, replace, location: { query }, empInforData } = this.props;
    const { value } = this.state;
    replace({
      pathname: '/organizationAccount/identity',
      query: {
        ...query,
        searchKey: value,
      },
    });
    getSearchNumFunc({
      sqgy: empInforData.id || '',
      cxfs: '2',
      khxm: '',
      zjlb: '',
      zjbh: '',
      ymth: value,
      zhlb: '',
      gdh: '',
      khh: '',
      ZJYZLY: '999',
    });
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
          KHQC: values.khqc,
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
      dicData,
      getBdidFunc,
      saveStepFunc,
      bdid,
      numQuery,
      tapDisabled,
      stepCacheData,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      value,
      accessState,
      cacheKey,
      stepValue,
      numShow,
    } = this.state;
    const obj = _.find(stepCacheData, { key: 'SFYZ' });
    let objValue = {};
    if (obj && obj.value) {
      objValue = JSON.parse(obj.value);
    }
    const isCheck = tapDisabled ? styles.activited : '';
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
              disabled={tapDisabled}
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
                  initialValue: objValue.KHQC || '',
                  rules: [
                    { required: true, message: '机构全称不能为空!', whitespace: true },
                    { validator: this.nameCheck },
                  ],
                },
              )(
                <Input
                  placeholder="请输入机构全称"
                  autoComplete="off"
                  disabled={tapDisabled}
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
                initialValue: dicData ? objValue.ZJLB || '8' : '',
              })(
                <Select
                  disabled={tapDisabled}
                  dropdownClassName="formOption angle"
                  onChange={this.handleTypeChange}
                >
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
                initialValue: objValue.ZJBH || '',
                rules: [
                  { validator: this.checkBenefiterId },
                  { required: true, message: '请输入证件编号!' },
                ],
              })(
                <Input
                  placeholder="请输入证件编号"
                  autoComplete="off"
                  disabled={tapDisabled}
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
                initialValue: objValue.ZJBH || '',
                rules: [
                  { required: true, message: '证件校验不能为空!', whitespace: true },
                  { validator: this.checkId },
                ],
              })(
                <Input
                  placeholder="请再次输入证件编号"
                  onPaste={this.handlePaste}
                  autoComplete="off"
                  disabled={tapDisabled}
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
        <NumResult
          location={location}
          numShow={numShow}
          numQuery={numQuery}
        />
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
