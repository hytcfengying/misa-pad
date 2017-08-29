/**
 * @file identity/indAriTab.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
import { Input, Button, Select, DatePicker, Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import NextPop from '../personAccount/nextPop';
import NumResult from './numResult';
import styles from './indTab.less';

const Option = Select.Option;
const dateFormat = 'YYYYMMDD';
const FormItem = Form.Item;
const FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

@Form.create()
export default class indTab extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    openAccCheckFunc: PropTypes.func.isRequired,
    getSearchNumFunc: PropTypes.func.isRequired,
    numQuery: PropTypes.array,
    cacheKey: PropTypes.string.isRequired,
    empInforData: PropTypes.object,
    openAccCheckData: PropTypes.object,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    indexStepValue: PropTypes.object.isRequired,
    ZJYZLY: PropTypes.string.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    getNumReturnFunc: PropTypes.func.isRequired,
    setAccountPersonAge: PropTypes.func.isRequired,
    numRequest: PropTypes.object,
  }

  static defaultProps = {
    numRequest: {},
    numQuery: [],
    empInforData: {},
    openAccCheckData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      value: '',
      disabled: false,
      IdType: '4',
      errPopN: false,
      errTxtN: '',
      accessState: false,
      stepValue: '',
      newData: {},
      numShow: false,
      numQuery2: [],
    };
  }

  componentWillMount() {
    const { indexStepValue } = this.props;
    if (!_.isEmpty(indexStepValue) && indexStepValue.ZJYZLY === '3') {
      const valueObjct = {
        khmc: indexStepValue.KHXM,
        sqxm: indexStepValue.KHXM,
        zjlb: indexStepValue.ZJLB,
        zjbh: indexStepValue.ZJBH,
        nation: indexStepValue.MZDM,
        xb: indexStepValue.XB,
        csrq: indexStepValue.CSRQ,
        photo: indexStepValue.ZJZP,
      };
      this.setState({
        disabled: true,
        isActive: true,
        newData: valueObjct,
        IdType: indexStepValue.ZJLB,
      });
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { openAccCheckData, numQuery, ZJYZLY } = nextProps;
    // if (!_.isEqual(numRequest, this.props.numRequest) && ZJYZLY === '3') {
    //   setTimeout(() => {
    //     this.props.getNumReturnFunc({
    //       sqbh: numRequest.o_sqbh,
    //     });
    //   }, 5000);
    // }
    if (!_.isEqual(numQuery, this.props.numQuery) && numQuery && ZJYZLY === '3') {
      const { jgdm, hbjgsm, clbz, nowIndex } = numQuery[0];
      let test = '';
      let popVis = false;
      if (nowIndex === '3') {
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
              numQuery2: numQuery,
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
    if (!_.isEqual(openAccCheckData, this.props.openAccCheckData) && ZJYZLY === '3') {
      const sfyxkh = openAccCheckData.o_sfyxkh;
      const msg = openAccCheckData.o_msg;
      if (sfyxkh) {
        if (sfyxkh === 1) {
          // this.setState({
          //   isActive: true,
          //   accessState: true,
          //   disabled: true,
          // });
          setTimeout(() => {
            this.setState({
              isActive: true,
              accessState: true,
              disabled: true,
              numShow: false,
            });
          }, 200);
        } else {
          this.setState({
            isActive: false,
            accessState: false,
            disabled: false,
          });
          this.props.changePopState({
            popShow: true,
            popType: 'errPop',
            popTest: msg,
          });
        }
      }
    }
  }

  // 粘贴禁止
  handlePaste(e) {
    e.preventDefault();
    return false;
  }

  @autobind
  handleSearch() {
    const { getSearchNumFunc, replace, location: { query }, empInforData } = this.props;
    const { value } = this.state;
    replace({
      pathname: '/personAccount/identity',
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
      ZJYZLY: '3',
    });
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
  handleChangeID(valueID) {
    console.log(`selected ${valueID}`);
    this.setState({ IdType: valueID });
    this.props.form.setFieldsValue({ ZJBH: '' });
    this.props.form.setFieldsValue({ checkCode: '' });
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
    const { IdType } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const YYB = empInforData.yyb;
        const KHXM = values.KHXM;
        const ZJBH = values.ZJBH;
        const isage = this.isAge(values.CSRQ.format(dateFormat));
        if (!isage) {
          this.props.changePopState({
            popShow: true,
            popType: 'isSure',
            popTest: '该用户年龄小于18周岁，是否继续开户！',
            callback: () => {
              openAccCheckFunc({
                ...query,
                khqc: KHXM,
                zjbh: ZJBH,
                yyb: YYB,
                zjlb: IdType,
                tabIndex: 2,
              });
            },
          });
        } else {
          openAccCheckFunc({
            ...query,
            khqc: KHXM,
            zjbh: ZJBH,
            yyb: YYB,
            zjlb: IdType,
            tabIndex: 2,
          });
        }
        const SFYZData = {
          YYB: empInforData.yyb ? empInforData.yyb.toString() : '',
          KHXM: values.KHXM,
          KHQC: values.KHXM,
          XB: '',
          XBNOTE: '',
          ZJLB: IdType,
          ZJBH: values.ZJBH,
          ZJZP: '',
          MZDM: '',
          MZDMNOTE: '',
          CSRQ: values.CSRQ.format(dateFormat),
          ZJDZ: '',
          ZJFZJG: '',
          ZJQSRQ: '',
          ZJJZRQ: '',
          KHXZR: empInforData.id ? empInforData.id.toString() : '',
          JGBZ: '0',
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

  // 判断出生日期 是否大于18
  @autobind
  isAge(date) {
    const y = parseInt(date.substring(0, 4), 10);
    const m = parseInt(date.substring(4, 6), 10) - 1;
    const d = parseInt(date.substring(6, 8), 10);
    const nowday = new Date();
    const birthday = new Date(y, m, d);
    const age = nowday.getFullYear() - birthday.getFullYear() -
      ((nowday.getMonth() < birthday.getMonth()) ||
      (nowday.getMonth() === birthday.getMonth() && nowday.getDate() < birthday.getDate()) ?
      1 : 0);
    // console.log(age);
    this.props.setAccountPersonAge({ ageValue: age });
    return age >= 18;
  }

  // 姓名校验
  @autobind
  nameCheck(rule, value, callback) {
    if (value) {
      const length = this.asciilen(value);
      if (length > 30 && length !== 0) {
        callback('姓名长度必须小于15个汉字或30个英文字符');
      }
      callback();
    } else {
      callback();
    }
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

  // 校验
  @autobind
  checkId1(rule, value, callback) {
    if (value && this.props.form.getFieldValue('checkCode')) {
      this.props.form.validateFields(['checkCode'], { force: true });
    }
    callback();
  }

  // 确认校验
  @autobind
  checkId(rule, value, callback) {
    if (!value ||
        !this.props.form.getFieldValue('ZJBH') ||
        value === this.props.form.getFieldValue('ZJBH')) {
      callback();
      return;
    }
    callback('请保持证件号一致！');
  }

  @autobind
  cardRule(rule, value, callback) {
    const { IdType } = this.state;
    const re1 = /^[HM]{1}([0-9]{10}|[0-9]{8})$/;
    const re2 = /^[0-9]{8}$/;
    if (value) {
      switch (IdType) {
        case '0':
          if (value.length > 18) {
            callback('身份证长度不能超过18个字符！');
          } else {
            callback();
          }
          break;
        case '4':
          if (re1.test(value)) {
            callback();
          } else {
            callback('证件格式不正确！');
          }
          break;
        case '15':
          if (re2.test(value)) {
            callback();
          } else {
            callback('证件格式不正确！');
          }
          break;
        case '18':
          if (value.length > 30) {
            callback('证件格式不正确！');
          } else {
            callback();
          }
          break;
        default:
          callback();
      }
    }
    callback();
  }

  // 限制日期选择范围
  @autobind
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  @autobind
  handleOk(e) {
    console.log(e);
    this.setState({
      errPopN: false,
      errTxtN: '',
    });
  }

  render() {
    const {
      form,
      cacheKey,
      push,
      location,
      getBdidFunc,
      saveStepFunc,
      bdid,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      value,
      disabled,
      accessState,
      stepValue,
      newData,
      numShow,
      numQuery2,
    } = this.state;
    const isCheck = this.state.isActive ? styles.activited : '';
    const suffix = value ?
      <span className={styles.searchClear} onClick={this.emitEmpty} /> : null;
    const prefix = value ?
      <span className={styles.searchIcon} onClick={this.handleSearch} /> :
      <span className={styles.searchIconP} />;
    return (
      <div>
        <div className={styles.indSecTab}>
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
                disabled={disabled}
                maxLength={20}
              />
            </div>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <div className={styles.formContent}>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="姓名"
                colon={false}
                className={styles.formItem}
              >
                {getFieldDecorator(
                  'KHXM',
                  {
                    initialValue: newData.khmc ? newData.khmc : '',
                    rules: [
                      { required: true, message: '姓名不能为空!', whitespace: true },
                      { validator: this.nameCheck },
                    ],
                  },
                )(
                  <Input placeholder="请输入姓名" disabled={disabled} autoComplete="off" />,
                )}
              </FormItem>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="证件类别"
                colon={false}
                className={styles.formItem}
              >
                {getFieldDecorator(
                  'ZJLB',
                  {
                    initialValue: newData.zjlb ? newData.zjlb : '4',
                    rules: [],
                  },
                )(
                  <Select
                    onChange={this.handleChangeID}
                    disabled={disabled}
                  >
                    <Option value="4">港澳居民来往内地通行证</Option>
                    <Option value="15">台湾居民来往大陆通行证</Option>
                    <Option value="18">外国人永久居留证</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="证件编号"
                colon={false}
                className={styles.formItem}
              >
                {getFieldDecorator(
                  'ZJBH',
                  {
                    initialValue: newData.zjbh ? newData.zjbh : '',
                    rules: [
                      { required: true, message: '证件编号不能为空!', whitespace: true },
                      { validator: this.cardRule },
                      { validator: this.checkId1 },
                    ],
                  },
                )(
                  <Input placeholder="请输入证件编号" disabled={disabled} autoComplete="off" />,
                )}
              </FormItem>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="证件校验"
                colon={false}
                className={styles.formItem}
              >
                {getFieldDecorator(
                  'checkCode',
                  {
                    initialValue: newData.zjbh,
                    rules: [
                      { required: true, message: '校验码不能为空!', whitespace: true },
                      { validator: this.checkId },
                    ],
                  },
                )(
                  <Input
                    placeholder="请输入校验码"
                    disabled={disabled}
                    onPaste={this.handlePaste}
                    autoComplete="off"
                  />,
                )}
              </FormItem>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="出生日期"
                colon={false}
                className={styles.formItem}
              >
                {getFieldDecorator(
                  'CSRQ',
                  {
                    initialValue: newData.csrq ? moment(newData.csrq, 'YYYYMMDD') : null,
                    rules: [{ type: 'object', required: true, message: '出生日期不能为空!', whitespace: true }],
                  },
                )(
                  <DatePicker
                    disabledDate={this.disabledDate}
                    placeholder="请选择日期"
                    format={dateFormat}
                    disabled={disabled}
                    showToday={false}
                  />,
                )}
              </FormItem>
            </div>
            <FormItem {...tailFormItemLayout} className={styles.buttBox}>
              <Button type="primary" htmlType="submit" className={`${styles.checkBut} ${isCheck}`}>身份核查</Button>
            </FormItem>
          </Form>
        </div>
        <NumResult
          location={location}
          numShow={numShow}
          numQuery={numQuery2}
        />
        <NextPop
          cacheKey={cacheKey}
          accessState={accessState}
          push={push}
          location={location}
          stepValue={stepValue}
          getBdidFunc={getBdidFunc}
          saveStepFunc={saveStepFunc}
          bdid={bdid}
        />
      </div>
    );
  }
}

