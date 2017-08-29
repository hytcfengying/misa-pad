/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import _ from 'lodash';
import { setNavigatePageTitle } from '../../utils/cordova';

import styles from '../personAccount/homeGlobal.less';
import VideoSite from '../../components/personAccount/VideoSiteLogin';
import PopUp from '../../components/globalCom/popup';

const getBdid = loading => query => ({
  type: 'organizationAccount/getBdid',
  payload: query || {},
  loading,
});
const saveStep = loading => query => ({
  type: 'organizationAccount/saveStepCache',
  payload: query || {},
  loading,
});
const witnessLogin = loading => query => ({
  type: 'organizationAccount/witnessLogin',
  payload: query || {},
  loading,
});
const getInfoQuery = loading => query => ({
  type: 'organizationAccount/getInfoQuery',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  stepCacheData: state.organizationAccount.stepCacheData,
  bdid: state.organizationAccount.bdid,
  acceptorInfor: state.globalData.empInforData,
  acceptorPhoto: state.globalData.empPhoto,
  witness: state.organizationAccount.witnessInfo,
  popState: state.globalData.popState,
  toUrl: state.globalData.toUrl,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  getInfoQueryFunc: getInfoQuery(true),
  witnessLoginFunc: witnessLogin(true),
  initializeWitnessFunc: query => ({
    type: 'organizationAccount/initializeWitness',
    payload: query || null,
  }),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class VideoHome extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    witnessLoginFunc: PropTypes.func.isRequired,
    acceptorInfor: PropTypes.object.isRequired,
    acceptorPhoto: PropTypes.object.isRequired,
    getInfoQueryFunc: PropTypes.func.isRequired,
    witness: PropTypes.object.isRequired,
    initializeWitnessFunc: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    toUrl: PropTypes.string,
  }

  static defaultProps = {
    location: {},
    toUrl: '',
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentWillMount() {
    setNavigatePageTitle(
      ['双人现场见证', true],
      result => console.log(result),
      err => console.log(err),
    );
    const { acceptorInfor, getInfoQueryFunc, initializeWitnessFunc, witness } = this.props;
    if (!acceptorInfor) {
      getInfoQueryFunc();
    }
    if (!_.isEmpty(witness)) {
      initializeWitnessFunc();
    }
  }

  componentWillUnmount() {
    const { toUrl } = this.props;
    let show = false;
    if (toUrl) {
      show = true;
    }
    setNavigatePageTitle(
      ['', toUrl, show],
      result => console.log(result),
      err => console.log(err),
    );
  }

  render() {
    const {
      push,
      location,
      getBdidFunc,
      saveStepFunc,
      bdid,
      acceptorInfor,
      acceptorPhoto,
      stepCacheData,
      witnessLoginFunc,
      witness,
      popState,
      changePopState,
    } = this.props;
    return (
      <div className={styles.homeGlobal}>
        <VideoSite
          push={push}
          location={location}
          getBdidFunc={getBdidFunc}
          saveStepFunc={saveStepFunc}
          bdid={bdid}
          acceptor={_.assign(acceptorInfor, acceptorPhoto)}
          stepCacheData={stepCacheData}
          witness={witness}
          witnessLoginFunc={witnessLoginFunc}
        />
        <PopUp
          popType={'menuJump'}
          popState={popState}
          changePopState={changePopState}
          push={push}
        />
      </div>
    );
  }
}
