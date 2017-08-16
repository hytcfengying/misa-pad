/**
 * @file identity/indSecTab.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
import { Input, Button, Form } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import ExaResult from './indExaResult';
import NumResult from './numResult';
import NextPop from '../personAccount/nextPop';
import styles from './indTab.less';

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
    getSearchFunc: PropTypes.func.isRequired,
    getSearchNumFunc: PropTypes.func.isRequired,
    numQuery: PropTypes.array,
    veriResultData: PropTypes.object,
    empInforData: PropTypes.object,
    openAccCheckData: PropTypes.object,
    cacheKey: PropTypes.string.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    indexStepValue: PropTypes.object.isRequired,
    ZJYZLY: PropTypes.string.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    saveImgQueryFunc: PropTypes.func.isRequired,
    imgFilepath: PropTypes.string,
    imgBase64str: PropTypes.string,
    getNumReturnFunc: PropTypes.func.isRequired,
    numRequest: PropTypes.object,
  }

  static defaultProps = {
    numRequest: {},
    numQuery: [],
    veriResultData: {},
    empInforData: {},
    openAccCheckData: {},
    imgBase64str: '',
    imgFilepath: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      value: '',
      resultShow: false,
      disabled: false,
      errTxt: '',
      accessState: false,
      stepValue: '',
      newBool: false,
      newDataN: {},
      numShow: false,
      numQuery1: [],
    };
  }

  componentWillMount() {
    const { indexStepValue } = this.props;
    if (!_.isEmpty(indexStepValue) && indexStepValue.ZJYZLY === '2') {
      const valueObjct = {
        callStep: false,
        photo: this.props.imgBase64str || indexStepValue.ZJZP,
        khmc: indexStepValue.KHXM,
        sqxm: indexStepValue.KHXM,
        zjbh: indexStepValue.ZJBH,
        nation_note: indexStepValue.MZDMNOTE,
        xb_note: indexStepValue.XBNOTE,
        csrq: indexStepValue.CSRQ,
      };
      this.setState({
        errTxt: '',
        disabled: true,
        isActive: true,
        resultShow: true,
        newBool: true,
        newDataN: valueObjct,
        numShow: false,
      });
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { openAccCheckData, veriResultData, numQuery } = nextProps;
    const { empInforData, ZJYZLY } = this.props;
    // if (!_.isEqual(numRequest, this.props.numRequest) && numRequest && ZJYZLY === '2') {
    //   setTimeout(() => {
    //     this.props.getNumReturnFunc({
    //       sqbh: numRequest.o_sqbh,
    //     });
    //   }, 1000);
    // }
    if (!_.isEqual(numQuery, this.props.numQuery) && numQuery && ZJYZLY === '2') {
      const { jgdm, hbjgsm, clbz, nowIndex } = numQuery[0];
      let test = '';
      let popVis = false;
      if (nowIndex === '2') {
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
              resultShow: false,
              numQuery1: numQuery,
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
    if (!_.isEqual(openAccCheckData, this.props.openAccCheckData) && ZJYZLY === '2') {
      const sfyxkh = openAccCheckData.o_sfyxkh;
      const msg = openAccCheckData.o_msg;
      if (sfyxkh) {
        if (sfyxkh === 1) {
          this.setState({
            accessState: true,
            disabled: true,
            isActive: true,
            resultShow: true,
            numShow: false,
          });
        } else {
          this.setState({
            accessState: false,
            disabled: false,
            isActive: false,
            resultShow: false,
          });
          this.props.changePopState({
            popShow: true,
            popType: 'errPop',
            popTest: msg,
          });
        }
      }
    }
    if (!_.isEqual(veriResultData, this.props.veriResultData) && ZJYZLY === '2') {
      const callStep = veriResultData.callStep;
      if (!callStep) {
        const { cljg, jgsm } = veriResultData;
        if (cljg === 0) {
          this.setState({
            accessState: false,
            disabled: false,
            isActive: false,
            resultShow: false,
          });
          this.props.changePopState({
            popShow: true,
            popType: 'errPop',
            popTest: '未查到此人信息，请重新查',
          });
        } else if (cljg === -1) {
          this.setState({
            accessState: false,
            disabled: false,
            isActive: false,
            resultShow: false,
          });
          this.props.changePopState({
            popShow: true,
            popType: 'errPop',
            popTest: jgsm,
          });
        } else {
          const csrqN = veriResultData.csrq;
          if (!csrqN) {
            this.setState({
              accessState: false,
              disabled: false,
              isActive: false,
              resultShow: false,
            });
            this.props.changePopState({
              popShow: true,
              popType: 'errPop',
              popTest: '请再次查询！',
            });
          }
        }
      }
      let xb = callStep ? veriResultData.o_xb : veriResultData.xb;
      if (xb) {
        xb = xb.toString();
      }
      let mzdm = callStep ? veriResultData.o_nation : veriResultData.nation;
      if (mzdm) {
        mzdm = mzdm.toString();
      }
      if (veriResultData.photo) {
        this.props.saveImgQueryFunc({
          base64str: veriResultData.photo,
          filename: 'ZJZP',
        });
      }
      const SFYZData = {
        YYB: empInforData.yyb ? empInforData.yyb.toString() : '',
        KHXM: callStep ? veriResultData.o_xm : veriResultData.sqxm,
        KHQC: callStep ? veriResultData.o_xm : veriResultData.sqxm,
        XB: xb,
        XBNOTE: callStep ? veriResultData.o_xb_note : veriResultData.xb_note,
        ZJLB: '0',
        ZJBH: callStep ? veriResultData.o_sfzh : veriResultData.zjbh,
        ZJZP: this.props.imgFilepath,
        MZDM: mzdm,
        MZDMNOTE: callStep ? veriResultData.o_nation_note : veriResultData.nation_note,
        CSRQ: callStep ? veriResultData.o_csrq : veriResultData.csrq,
        ZJDZ: '',
        ZJFZJG: '',
        ZJQSRQ: '',
        ZJJZRQ: '',
        KHXZR: empInforData.id ? empInforData.id.toString() : '',
        JGBZ: '0',
        KHFS: '4',
        KHZD: '2',
        KHLY: '8',
        ZJYZLY: '2',
        CZZD: '',
      };
      this.setState({
        stepValue: JSON.stringify(SFYZData),
      });
    }
  }

  @autobind
  handleSearch() {
    const { getSearchNumFunc, empInforData } = this.props;
    const { replace, location: { query } } = this.props;
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
      ZJYZLY: '2',
    });
  }

  @autobind
  textChange() {
    this.setState({ isActive: false });
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
  handleSubmit(e) {
    e.preventDefault();
    const {
      form,
      getSearchFunc,
      empInforData,
      location: { query },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const ID = empInforData.id;
        const YYB = empInforData.yyb;
        const KHXM = values.KHXM;
        const ZJBH = values.ZJBH;
        let csrq;
        if (values.ZJBH.length === 15) {
          csrq = `19${ZJBH.substring(6, 12)}`;
        } else {
          csrq = ZJBH.substring(6, 14);
        }
        const isage = this.isAge(csrq);
        if (!isage) {
          this.props.changePopState({
            popShow: true,
            popType: 'isSure',
            popTest: '该用户年龄小于18周岁，是否继续开户！',
            callback: () => {
              getSearchFunc({
                ...query,
                id: ID,
                khxm: KHXM,
                zjbh: ZJBH,
                yyb: YYB,
                zjlb: 0,
                tabIndex: 1,
              });
            },
          });
        } else {
          getSearchFunc({
            ...query,
            id: ID,
            khxm: KHXM,
            zjbh: ZJBH,
            yyb: YYB,
            zjlb: 0,
            tabIndex: 1,
          });
        }
      }
    });
  }

  // 身份校验
  @autobind
  cardRule(rule, value, callback) {
    // 15位和18位身份证号码的正则表达式
    const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (value) {
      if (regIdCard.test(value)) {
        if (value.length === 18) {
          // 将前17位加权因子保存在数组里
          const valueWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          const valueY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
          let valueWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
          for (let i = 0; i < 17; i++) {
            valueWiSum += value.substring(i, i + 1) * valueWi[i];
          }
          const valueMod = valueWiSum % 11; // 计算出校验码所在数组的位置
          const valueLast = value.substring(17); // 得到最后一位身份证号码
          // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
          if (valueMod === 2) {
            if (valueLast === 'X' || valueLast === 'x') {
              callback();
            } else {
              callback('身份证号码错误！');
            }
          }
          if (valueMod !== 2) {
            if (valueLast === valueY[valueMod].toString()) {
              // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
              callback();
            } else {
              callback('身份证号码错误！');
            }
          }
        } else {
          callback();
        }
      } else {
        callback('身份证格式不正确！');
      }
    } else {
      callback();
    }
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
    return age >= 18;
  }

  render() {
    const {
      form,
      veriResultData,
      cacheKey,
      push,
      location,
      getBdidFunc,
      saveStepFunc,
      bdid,
      imgBase64str,
      imgFilepath,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      value,
      resultShow,
      disabled,
      accessState,
      stepValue,
      newBool,
      newDataN,
      numShow,
      numQuery1,
    } = this.state;
    // const { cljg, zjbhhcjg, xmhcjg } = veriResultData;
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
                    initialValue: newDataN.khmc,
                    rules: [
                      { required: true, message: '姓名不能为空!', whitespace: true },
                      { validator: this.nameCheck },
                    ],
                  },
                )(
                  <Input
                    placeholder="请输入姓名"
                    onFocus={this.textChange}
                    disabled={disabled}
                    autoComplete="off"
                  />,
                )}
              </FormItem>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="身份证"
                colon={false}
                className={styles.formItem}
              >
                {getFieldDecorator(
                  'ZJBH',
                  {
                    initialValue: newDataN.zjbh,
                    rules: [
                      { required: true, message: '身份证不能为空!', whitespace: true },
                      { validator: this.cardRule },
                    ],
                  },
                )(
                  <Input
                    placeholder="请输入身份证"
                    onFocus={this.textChange}
                    disabled={disabled}
                    autoComplete="off"
                  />,
                )}
              </FormItem>
            </div>
            <FormItem {...tailFormItemLayout} className={styles.buttBox}>
              <Button type="primary" htmlType="submit" className={`${styles.checkBut} ${isCheck}`}>身份核查</Button>
            </FormItem>
          </Form>
        </div>
        <ExaResult
          tableSelect={2}
          resultDataDetail2={newBool ? newDataN : veriResultData}
          location={location}
          resultShow={resultShow}
          imgBase64str={imgBase64str}
        />
        <NumResult
          location={location}
          numShow={numShow}
          numQuery={numQuery1}
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
          imgFilepath={imgFilepath}
        />
      </div>
    );
  }
}

