/**
 * @file identity/Home.js
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout, Button, Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import classNames from 'classnames';
import { getIDCard, setmTabMainVisual, setNavigatePageTitle } from '../../utils/cordova';

import MenuLeft from '../../components/identity/menuLeft';
import TabSec from '../../components/identity/indSecTab';
import TabArti from '../../components/identity/indArtiTab';
import ExaResult from '../../components/identity/indExaResult';
import TopSel from '../../components/identity/selectDepart';
import NextPop from '../../components/personAccount/nextPop';
import PopUp from '../../components/globalCom/popup';

import styles from './identityHome.less';

const { Header, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;

const actionType = 'personAccount/getVeriResult';
const actionType2 = 'personAccount/openAccCheck';
const getVeriResultFunc = loading => query => ({
  type: actionType,
  payload: query || {},
  loading,
});
const openAccCheck = loading => query => ({
  type: actionType2,
  payload: query || {},
  loading,
});
const getNumQueryFunc = loading => query => ({
  type: 'personAccount/getNumQuery',
  payload: query || {},
  loading,
});
const getNumQueryReturnFunc = loading => query => ({
  type: 'personAccount/getNumQueryReturn',
  payload: query || {},
  loading,
});
const getStepCacheQueryFunc = loading => query => ({
  type: 'personAccount/getStepCache',
  payload: query || {},
  loading,
});
const getGloabInfoQueryFunc = loading => query => ({
  type: 'globalData/getInfoQuery',
  payload: query || {},
  loading,
});
const getReturnOpinion = loading => query => ({// 退回意见
  type: 'personAccount/getReturnOpinion',
  payload: query || {},
  loading,
});

const getBdid = loading => query => ({
  type: 'personAccount/getBdid',
  payload: query || {},
  loading,
});
const saveStep = loading => query => ({
  type: 'personAccount/saveStepCache',
  payload: query || {},
  loading,
});

const saveImgQuery = loading => query => ({
  type: 'personAccount/saveImgQuery',
  payload: query || {},
  loading,
});
const getImgQuery = loading => query => ({
  type: 'personAccount/getImgQuery',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  openAccCheckData: state.personAccount.openAccCheckData,
  veriResultData: state.personAccount.veriResultData,
  numRequest: state.personAccount.numRequest,
  numQuery: state.personAccount.numQuery,
  globalLoading: state.activity.global,
  dicData: state.globalData.dicData,
  empInforData: state.globalData.empInforData,
  bdid: state.personAccount.bdid,
  stepCacheData: state.personAccount.stepCacheData,
  menuState: state.personAccount.menuState,
  popState: state.globalData.popState,
  imgFilepath: state.personAccount.imgFilepath,
  imgBase64str: state.personAccount.imgBase64str,
  returnOpinion: state.personAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getSearchFunc: getVeriResultFunc(true),
  openAccCheckFunc: openAccCheck(true),
  getSearchNumFunc: getNumQueryFunc(true),
  getNumReturnFunc: getNumQueryReturnFunc(true),
  getGloabInfoFunc: getGloabInfoQueryFunc(false),
  getStepCacheFunc: getStepCacheQueryFunc(true),
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  saveImgQueryFunc: saveImgQuery(true),
  getImgQueryFunc: getImgQuery(true),
  getReturnOpinionFunc: getReturnOpinion(false),
  clearStateFunc: query => ({// 清空state
    type: 'personAccount/clearState',
    payload: query || null,
  }),
  clearPopStateFunc: query => ({// 清空global的state
    type: 'globalData/clearPopState',
    payload: query || null,
  }),
  setInvestReadFlag: query => ({// 将投资者教育界面所有已读标记为未读
    type: 'personAccount/setInvestReadFlag',
    payload: query || null,
  }),
  setAccountPersonAge: query => ({// 将开户人年龄存下来
    type: 'personAccount/setAccountPersonAge',
    payload: query || null,
  }),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  changeMenuState: query => ({// 改变左侧导航
    type: 'personAccount/changeMenuState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class SearchHome extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    globalLoading: PropTypes.bool,
    location: PropTypes.object,
    veriResultData: PropTypes.object,
    numQuery: PropTypes.array,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    openAccCheckData: PropTypes.object,
    getSearchFunc: PropTypes.func.isRequired,
    openAccCheckFunc: PropTypes.func.isRequired,
    getSearchNumFunc: PropTypes.func.isRequired,
    getGloabInfoFunc: PropTypes.func.isRequired,
    getStepCacheFunc: PropTypes.func.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    menuState: PropTypes.array.isRequired,
    setInvestReadFlag: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    clearStateFunc: PropTypes.func.isRequired,
    clearPopStateFunc: PropTypes.func.isRequired,
    saveImgQueryFunc: PropTypes.func.isRequired,
    getImgQueryFunc: PropTypes.func.isRequired,
    imgFilepath: PropTypes.string,
    imgBase64str: PropTypes.string,
    getNumReturnFunc: PropTypes.func.isRequired,
    numRequest: PropTypes.object,
    getReturnOpinionFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array,
    setAccountPersonAge: PropTypes.func.isRequired,
    changeMenuState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    veriArtResultData: {},
    veriResultData: {},
    numRequest: {},
    numQuery: [],
    dicData: {},
    empInforData: {},
    openAccCheckData: {},
    imgBase64str: '',
    imgFilepath: '',
    returnOpinion: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      tapDisabled: false,
      isActive: false,
      accessState: false,
      resultShow: false,
      scanPopVis: false,
      scanPopTxt: '身份读取失败，请重试！',
      scanDetailData: {},
      indexStepValue: {},
      // 下一步
      ZJYZLY: '1',
      stepValue: '',
      cacheKey: 'SFYZ',
      newAccessState: false,
    };
  }

  componentWillMount() {
    this.setState({
      ZJYZLY: '1',
    });
    setmTabMainVisual(
      [false],
      result => console.log(result),
      err => console.log(err),
    );
    const { location: { query }, stepCacheData, setInvestReadFlag, empInforData } = this.props;
    if (query.bdid) {
      let url = `/search/result?deviceId=${query.deviceId}&empId=${query.empId}&searchKey=${query.searchKey}&token=${query.token}&userId={query.userId}`;
      if (query.source && query.source === 'record') {
        url = `histRecord?current=${query.current}&deviceId=${query.deviceId}&empId=${query.empId}&jsrq=${query.jsrq}&ksrq=${query.ksrq}&searchKey=${query.searchKey}&step=${query.step}&jgbz=${query.jgbz}&token=${query.token}`;
      }
      setNavigatePageTitle( // 返回
        ['', true, url],
        result => console.log(result),
        err => console.log(err),
      );
    }
    if (query.empId && query.deviceId && query.token) {
      this.props.clearStateFunc();// 首次开户清空state
      this.props.clearPopStateFunc();
      if (_.isEmpty(empInforData)) {
        this.props.getGloabInfoFunc({
          ...query,
          id: null,
          userid: query.empId,
        });
      }
      this.getStep(); // 查询步骤缓存
      if (query.returnChange) { // 退回整改信息
        this.props.getReturnOpinionFunc({
          bdid: query.bdid,
          zt: 0,
        });
      }
    } else {
      const obj = _.find(stepCacheData, { key: 'SFYZ' });
      if (obj && obj.value) {
        const value = JSON.parse(obj.value);
        this.setState({
          tapDisabled: true,
          indexStepValue: value,
          ZJYZLY: value.ZJYZLY,
          newAccessState: true,
        });
        if (value.ZJZP) {
          this.props.getImgQueryFunc({
            filepath: value.ZJZP,
          });
        }
        if (value.ZJYZLY === '1') {
          const scanData = {
            Name: value.KHXM,
            Gender: value.XBNOTE,
            ID: value.ZJBH,
            Nation: value.MZDMNOTE,
            BirthDate: value.CSRQ,
            Address: value.ZJDZ,
            Department: value.ZJFZJG,
            EndDate: value.ZJJZRQ,
            StartDate: value.ZJQSRQ,
          };
          this.setState({
            scanDetailData: scanData,
            resultShow: true,
            isActive: true,
          });
        }
      }
    }
    // 若是从第二步投资者教育回来，需要将已经阅读的都置成未读
    setInvestReadFlag({ flag: false });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { openAccCheckData, stepCacheData } = nextProps;
    const { ZJYZLY } = this.state;
    if (!_.isEqual(openAccCheckData, this.props.openAccCheckData)) {
      const sfyxkh = openAccCheckData.o_sfyxkh;
      const msg = openAccCheckData.o_msg;
      if (ZJYZLY === '1' && sfyxkh) {
        if (sfyxkh === 1) {
          this.setState({
            accessState: true,
            isActive: true,
            tapDisabled: true,
            resultShow: true,
          });
          this.props.saveImgQueryFunc({
            base64str: this.state.scanDetailData.Bmpfile,
            filename: 'ZJZP',
          });
        } else {
          this.setState({
            accessState: false,
            isActive: false,
            scanPopVis: true,
            scanPopTxt: msg,
            resultShow: false,
          });
          this.props.changePopState({
            popShow: true,
            popType: 'errPop',
            popTest: msg,
          });
        }
      } else if (sfyxkh === 1) {
        this.setState({
          tapDisabled: true,
        });
      }
    }
    if (!_.isEqual(stepCacheData, this.props.stepCacheData)) {
      const obj = _.find(stepCacheData, { key: 'SFYZ' });
      if (obj && obj.value) {
        const value = JSON.parse(obj.value);
        this.setState({
          tapDisabled: true,
          indexStepValue: value,
          ZJYZLY: value.ZJYZLY,
          newAccessState: true,
        });
        if (value.ZJZP) {
          this.props.getImgQueryFunc({
            filepath: value.ZJZP,
          });
        }
        if (value.ZJYZLY === '1') {
          const scanData = {
            Name: value.KHXM,
            Gender: value.XBNOTE,
            ID: value.ZJBH,
            Nation: value.MZDMNOTE,
            BirthDate: value.CSRQ,
            Address: value.ZJDZ,
            Department: value.ZJFZJG,
            EndDate: value.ZJJZRQ,
            StartDate: value.ZJQSRQ,
          };
          this.setState({
            scanDetailData: scanData,
            resultShow: true,
            isActive: true,
          });
        }
      }
    }
  }

  @autobind
  getStep() {
    const getStepCache = (props) => {
      const promise = new Promise((resolve, reject) => {
        try {
          const { location: { query }, getStepCacheFunc } = props;
          const load = false;
          const nowBdid = load ? '1196879' : (query.bdid || '');
          getStepCacheFunc({
            ...query,
            bdid: nowBdid,
            key: null,
            stepCallback: () => {
              resolve(true);
            },
          });
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    };
    const { push, location: { query } } = this.props;
    getStepCache(this.props).then(() => {
      const step = sessionStorage.getItem('step');
      sessionStorage.removeItem('step');
      if (step !== 'identity' ||
        (step === 'identity' && query.returnChange)) {
        push(`/personAccount/${step}`);
      }
    });
  }
  @autobind
  callback(key) {
    console.log(key);
    this.setState({
      ZJYZLY: key,
    });
  }

  @autobind
  handleScanning() {
    const { empInforData, openAccCheckFunc, location: { query } } = this.props;
    getIDCard(
      (result) => {
        const resultObjct = JSON.parse(result);
        // alert(resultObjct.Bmpfile)
        const isage = this.isAge(resultObjct.Birthday);
        if (!isage) {
          this.props.changePopState({
            popType: 'menuJump',
            popShow: true,
            popTest: '该用户年龄小于18周岁，是否继续开户！',
            callback: () => {
              openAccCheckFunc({
                ...query,
                khqc: resultObjct.Name,
                zjbh: resultObjct.ID,
                yyb: empInforData.yyb,
                zjlb: '0',
                tabIndex: 0,
              });
            },
          });
        } else {
          // alert(resultObjct.Name+'xx'+resultObjct.ID)
          openAccCheckFunc({
            ...query,
            khqc: resultObjct.Name,
            zjbh: resultObjct.ID,
            yyb: empInforData.yyb,
            zjlb: '0',
            tabIndex: 0,
          });
        }
        const SFYZData = {
          YYB: empInforData.yyb ? empInforData.yyb.toString() : '',
          KHXM: resultObjct.Name,
          KHQC: resultObjct.Name,
          XB: resultObjct.GenderCode,
          XBNOTE: resultObjct.Gender,
          ZJLB: '0',
          ZJBH: resultObjct.ID,
          ZJZP: this.props.imgFilepath,
          MZDM: resultObjct.NationCode,
          MZDMNOTE: resultObjct.Nation,
          CSRQ: resultObjct.Birthday,
          ZJDZ: resultObjct.Address,
          ZJFZJG: resultObjct.Department,
          ZJQSRQ: resultObjct.StartDate,
          ZJJZRQ: resultObjct.EndDate,
          KHXZR: empInforData.id ? empInforData.id.toString() : '',
          JGBZ: '0',
          KHFS: '4',
          KHZD: '2',
          KHLY: '8',
          ZJYZLY: '1',
          CZZD: '',
        };
        this.setState({
          scanDetailData: resultObjct,
          stepValue: JSON.stringify(SFYZData),
        });
      },
      (err) => {
        console.log(err);
        this.props.changePopState({
          popShow: true,
          popType: 'errPop',
          popTest: '身份读取失败，请重试！',
        });
      },
    );
  }

  @autobind
  handleOk(e) {
    console.log(e);
    this.setState({
      scanPopVis: false,
      isActive: false,
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
    return age >= 18;
  }

  @autobind
  netClick() {
    const { push, returnOpinion } = this.props;
    if (!_.isEmpty(returnOpinion)) {
      this.props.changeMenuState({
        index: 1,
      });
      push('/personAccount/info');
      return;
    }
    push('/personAccount/invest');
  }

  render() {
    const {
      replace,
      push,
      location,
      // 数据
      veriResultData,
      numRequest,
      numQuery,
      empInforData,
      openAccCheckData,
      // 方法
      openAccCheckFunc,
      getSearchFunc,
      getSearchNumFunc,
      getNumReturnFunc,
      getBdidFunc,
      saveStepFunc,
      bdid,
      menuState,
      stepCacheData,
      popState,
      changePopState,
      saveImgQueryFunc,
      imgFilepath,
      imgBase64str,
      setAccountPersonAge,
    } = this.props;
    const {
      accessState,
      resultShow,
      scanDetailData,
      indexStepValue,
      // 下一步
      cacheKey,
      ZJYZLY,
      stepValue,
      tapDisabled,
      newAccessState,
    } = this.state;
    const stepObj = _.find(stepCacheData, { key: 'SFYZ' });
    const isReady = this.state.isActive ? styles.activited : '';
    const isNextBtnClass = newAccessState ? styles.activited : '';
    return (
      <div className={`${styles.pageIdentityHome} ${styles.homeGlobal}`}>
        <Layout>
          <Sider
            trigger={null}
          >
            <MenuLeft
              push={push}
              location={location}
              menuState={menuState}
              stepObj={stepObj}
              popState={popState}
              changePopState={changePopState}
            />
          </Sider>
          <Layout>
            <Content>
              <div className={styles.contentBox}>
                <Header>
                  <div className={styles.box}>
                    <div className={`${styles.box_flex1} ${styles.title}`}>
                      <span>身份信息核查</span>
                    </div>
                    <span className={styles.box_flex1}>
                      <TopSel
                        push={push}
                        replace={replace}
                        location={location}
                        empInforData={empInforData}
                        tapDisabled={tapDisabled}
                      />
                    </span>
                  </div>
                </Header>
                <div className={styles.cardContainer}>
                  <Tabs activeKey={`${ZJYZLY}`} onChange={this.callback}>
                    <TabPane tab="读卡器" key="1" disabled={tapDisabled}>
                      <div className={styles.butBox}>
                        <Button type="primary" className={`${styles.readyCardBut} ${isReady}`} onClick={this.handleScanning}>读卡</Button>
                      </div>
                      <ExaResult
                        tableSelect={1}
                        resultDataDetail={scanDetailData}
                        location={location}
                        resultShow={resultShow}
                        imgBase64str={imgBase64str}
                      />
                      <NextPop
                        accessState={accessState}
                        push={push}
                        location={location}
                        stepValue={stepValue}
                        getBdidFunc={getBdidFunc}
                        saveStepFunc={saveStepFunc}
                        bdid={bdid}
                        imgBase64str={imgBase64str}
                        cacheKey={cacheKey}
                      />
                    </TabPane>
                    <TabPane tab="公安网" key="2" disabled={tapDisabled}>
                      <TabSec
                        push={push}
                        replace={replace}
                        location={location}
                        getSearchFunc={getSearchFunc}
                        getSearchNumFunc={getSearchNumFunc}
                        numQuery={numQuery}
                        veriResultData={veriResultData}
                        empInforData={empInforData}
                        cacheKey={cacheKey}
                        openAccCheckData={openAccCheckData}
                        getBdidFunc={getBdidFunc}
                        saveStepFunc={saveStepFunc}
                        bdid={bdid}
                        indexStepValue={indexStepValue}
                        ZJYZLY={ZJYZLY}
                        setAccountPersonAge={setAccountPersonAge}
                        popState={popState}
                        changePopState={changePopState}
                        saveImgQueryFunc={saveImgQueryFunc}
                        imgFilepath={imgFilepath}
                        imgBase64str={imgBase64str}
                        getNumReturnFunc={getNumReturnFunc}
                        numRequest={numRequest}
                      />
                    </TabPane>
                    <TabPane tab="人工核查" key="3" disabled={tapDisabled}>
                      <TabArti
                        push={push}
                        replace={replace}
                        location={location}
                        openAccCheckFunc={openAccCheckFunc}
                        getSearchNumFunc={getSearchNumFunc}
                        empInforData={empInforData}
                        numQuery={numQuery}
                        cacheKey={cacheKey}
                        openAccCheckData={openAccCheckData}
                        getBdidFunc={getBdidFunc}
                        saveStepFunc={saveStepFunc}
                        bdid={bdid}
                        indexStepValue={indexStepValue}
                        ZJYZLY={ZJYZLY}
                        setAccountPersonAge={setAccountPersonAge}
                        popState={popState}
                        changePopState={changePopState}
                        getNumReturnFunc={getNumReturnFunc}
                        numRequest={numRequest}
                      />
                    </TabPane>
                  </Tabs>
                  <div className={styles.nexPopBox}>
                    <Button type="primary" className={`${styles.nextBut} ${isNextBtnClass}`} onClick={this.netClick}>下一步</Button>
                  </div>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
        <PopUp
          popType={'isSure'}
          popState={popState}
          changePopState={changePopState}
          push={push}
        />
        <PopUp
          popType={'errPop'}
          popState={popState}
          changePopState={changePopState}
          push={push}
        />
      </div>
    );
  }
}
