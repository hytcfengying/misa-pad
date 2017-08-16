/**
 * @file identity/InforConfirm.js
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
import _ from 'lodash';
// import { autobind } from 'core-decorators';
// import classNames from 'classnames';
import { setNavigatePageTitle, setmTabMainVisual } from '../../utils/cordova';
import MenuLeft from '../../components/identity/menuLeft';
import NextPop from '../../components/personAccount/nextPop';

import Infor from '../../components/personAccount/inforDetail';

import styles from './homeGlobal.less';

const { Sider, Content } = Layout;

const actionType = 'personAccount/getInforQuery';
const getInforFunc = loading => query => ({
  type: actionType,
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
const getStepCacheQueryFunc = loading => query => ({// 获得步骤缓存
  type: 'personAccount/getStepCache',
  payload: query || {},
  loading,
});

const saveStopOpenAccount = loading => query => ({// 退回重新提交
  type: 'personAccount/saveStopOpenAccount',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  inforData: state.personAccount.inforData,
  empInforData: state.globalData.empInforData,
  bdid: state.personAccount.bdid,
  imageList: state.personAccount.imageList,
  menuState: state.personAccount.menuState,
  stepCacheData: state.personAccount.stepCacheData,
  popState: state.globalData.popState,
  returnOpinion: state.personAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getInfor: getInforFunc(true),
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  saveStopOpenFunc: saveStopOpenAccount(true),
  getStepCacheFunc: getStepCacheQueryFunc(false),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  clearStateFunc: query => ({// 清空state
    type: 'personAccount/clearState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class inforhHome extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    globalLoading: PropTypes.bool,
    location: PropTypes.object,
    getInfor: PropTypes.func.isRequired,
    inforData: PropTypes.object,
    empInforData: PropTypes.object.isRequired,
    imageList: PropTypes.array,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    menuState: PropTypes.array.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array,
    saveStopOpenFunc: PropTypes.func.isRequired,
    getStepCacheFunc: PropTypes.func.isRequired,
    clearStateFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    inforData: {},
    imageList: [],
    returnOpinion: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      accessState: true,
      // 下一步
      stepValue: 'sucess',
      nextContent: '下一步',
      cacheKey: 'XXQR',
    };
  }

  componentWillMount() {
    const { location: { query }, returnOpinion, stepCacheData } = this.props;
    if (query.see) {
      this.setState({
        accessState: false,
      });
      setNavigatePageTitle( // 返回
        ['信息详情', true],
        result => console.log(result),
        err => console.log(err),
      );
      setmTabMainVisual(
        [false],
        result => console.log(result),
        err => console.log(err),
      );
      this.props.clearStateFunc();// 清空state
      this.props.getStepCacheFunc({
        ...query,
        bdid: query.bdid,
        key: null,
      });
    } else {
      this.setState({
        accessState: true,
      });
    }
    if (_.isEmpty(returnOpinion)) {
      this.setState({
        cacheKey: 'XXQR',
        nextContent: '下一步',
        stepValue: 'sucess',
      });
    } else {
      const value = {
        YXSTR: [],
      };
      const stepObj = JSON.parse(_.find(stepCacheData, { key: 'ZLTX' }).value);
      const yxObj = JSON.parse(_.find(stepCacheData, { key: 'YXSM' }).value);
      _.forEach(yxObj.YXSTR, (item) => {
        // 退回整改
        if (item.ZT !== 1) {
          value.YXSTR.push(item);
        }
      });
      _.forEach(returnOpinion, (item) => {
        // 退回整改
        const zdKey = item.zd;
        if (item.zd !== 'YX') {
          switch (item.zd) {
            case 'LXXX':
              value.PROVINCE = stepObj.PROVINCE;
              value.CITY = stepObj.CITY;
              value.DZ = stepObj.DZ;
              value.YZBM = stepObj.YZBM;
              value.SJ = stepObj.SJ;
              value.DH = stepObj.DH;
              value.EMAIL = stepObj.EMAIL;
              break;
            case 'BJXX':
              value.XB = stepObj.XB;
              value.CSRQ = stepObj.CSRQ;
              value.ZYDM = stepObj.ZYDM;
              value.XL = stepObj.XL;
              value.GJ = stepObj.GJ;
              value.XB = stepObj.XB;
              break;
            case 'FXQXX':
              value.XQFXDJ = stepObj.XQFXDJ;
              break;
            case 'ZJZH':
              value.YJTC = stepObj.YJTC;
              value.YXBZ = stepObj.YXBZ;
              value.WTFS = stepObj.WTFS;
              value.KHQX = stepObj.KHQX;
              break;
            case 'GDKH_SH':
              value.GDKH_SH = stepObj.GDKH_SH;
              value.GDDJ_SH = stepObj.GDDJ_SH;
              break;
            case 'GDKH_SZ':
              value.GDKH_SZ = stepObj.GDKH_SZ;
              value.GDDJ_SZ = stepObj.GDDJ_SZ;
              break;
            case 'JJKH':
              value.SQJJZH = stepObj.SQJJZH;
              break;
            case 'YHZH':
              value.CGYH = stepObj.CGYH;
              value.CGYHZH = stepObj.CGYHZH;
              break;
            case 'JYSYRGX':
              value.JYSYRGX = stepObj.JYSYRGX;
              value.JYSYRXM = stepObj.JYSYRXM;
              value.JYSYRZJLB = stepObj.JYSYRZJLB;
              value.JYSYRZJBH = stepObj.JYSYRZJBH;
              break;
            default:
              value[`${zdKey}`] = stepObj[`${zdKey}`] || '';
          }
        } else if (item.zd === 'YX' && item.yxlx === 9) {
          value.KHZP = yxObj.KHZP;
        }
      });
      if (value.YXSTR.length < 1) {
        delete value.YXSTR;
      }
      // console.log(value)
      this.setState({
        cacheKey: 'THTJ',
        nextContent: '提交',
        stepValue: JSON.stringify(value),
      });
    }
    this.props.getInfor({
      flag: 1,
      sqid: query.bdid ? query.bdid : this.props.bdid,
      // sqid: '1195526',
      gyid: null,
      sj: null,
      zjbh: null,
      zjlb: null,
      step: null,
      jgbz: null,
      ksrq: null,
      jsrq: null,
      khfs: null,
      cxnr: null,
    });
  }

  componentWillUnmount() {
  }

  render() {
    const {
      push,
      location,
      inforData,
      getBdidFunc,
      saveStepFunc,
      bdid,
      menuState,
      stepCacheData,
      popState,
      changePopState,
    } = this.props;
    const { accessState, stepValue, nextContent, cacheKey } = this.state;
    const stepObj = _.find(stepCacheData, { key: 'XXQR' });
    const seeNone = accessState ? '' : styles.none;
    return (
      <div className={styles.homeGlobal}>
        <Layout>
          <Sider
            trigger={null}
            className={seeNone}
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
              <Infor
                inforData={inforData}
                stepCacheData={stepCacheData}
                accessState={accessState}
              />
              <NextPop
                accessState={accessState}
                push={push}
                location={location}
                stepValue={stepValue}
                getBdidFunc={getBdidFunc}
                saveStepFunc={saveStepFunc}
                bdid={bdid}
                content={nextContent}
                cacheKey={cacheKey}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
