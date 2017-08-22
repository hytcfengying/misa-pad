/**
 * @file identity/Home.js
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import classNames from 'classnames';
import { setmTabMainVisual, setNavigatePageTitle } from '../../utils/cordova';

import MenuLeft from '../../components/identity/menuLeft';
import TopSel from '../../components/identity/selectDepart';
import PopUp from '../../components/globalCom/popup';

import Identity from '../../components/organizationAccount/Identity';

import styles from '../personAccount/identityHome.less';

const { Header, Sider, Content } = Layout;

const openAccCheck = loading => query => ({// 校验
  type: 'organizationAccount/openAccCheck',
  payload: query || {},
  loading,
});
const getStepCacheQueryFunc = loading => query => ({// 获得步骤缓存
  type: 'organizationAccount/getStepCache',
  payload: query || {},
  loading,
});
const getGloabInfoQueryFunc = loading => query => ({// 字典
  type: 'globalData/getInfoQuery',
  payload: query || {},
  loading,
});
const getReturnOpinion = loading => query => ({// 退回意见
  type: 'organizationAccount/getReturnOpinion',
  payload: query || {},
  loading,
});

const getBdid = loading => query => ({// 获取bdid
  type: 'organizationAccount/getBdid',
  payload: query || {},
  loading,
});
const saveStep = loading => query => ({// 保存步骤缓存
  type: 'organizationAccount/saveStepCache',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  dicData: state.globalData.dicData,
  empInforData: state.globalData.empInforData,
  openAccCheckData: state.organizationAccount.openAccCheckData,
  bdid: state.organizationAccount.bdid,
  stepCacheData: state.organizationAccount.stepCacheData,
  menuState: state.organizationAccount.menuState,
  popState: state.globalData.popState,
  returnOpinion: state.organizationAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  openAccCheckFunc: openAccCheck(true),
  getGloabInfoFunc: getGloabInfoQueryFunc(false),
  getStepCacheFunc: getStepCacheQueryFunc(true),
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  getReturnOpinionFunc: getReturnOpinion(false),
  clearStateFunc: query => ({// 清空state
    type: 'organizationAccount/clearState',
    payload: query || null,
  }),
  clearPopStateFunc: query => ({// 清空global的state
    type: 'globalData/clearPopState',
    payload: query || null,
  }),
  setInvestReadFlag: query => ({// 将投资者教育界面所有已读标记为未读
    type: 'organizationAccount/setInvestReadFlag',
    payload: query || null,
  }),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  changeMenuState: query => ({// 改变左侧导航
    type: 'organizationAccount/changeMenuState',
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
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    openAccCheckFunc: PropTypes.func.isRequired,
    openAccCheckData: PropTypes.object,
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
    getReturnOpinionFunc: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array,
    changeMenuState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    dicData: {},
    empInforData: {},
    openAccCheckData: {},
    returnOpinion: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      tapDisabled: false,
      newAccessState: false,
    };
  }

  componentWillMount() {
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
        this.setState({
          tapDisabled: true,
          newAccessState: true,
        });
      }
    }
    // 若是从第二步投资者教育回来，需要将已经阅读的都置成未读
    setInvestReadFlag({ flag: false });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { openAccCheckData, stepCacheData } = nextProps;
    if (!_.isEqual(openAccCheckData, this.props.openAccCheckData) &&
      !_.isEmpty(openAccCheckData)) {
      const sfyxkh = openAccCheckData.o_sfyxkh;
      if (sfyxkh === 1) {
        this.setState({
          tapDisabled: true,
        });
      } else {
        this.setState({
          tapDisabled: false,
        });
      }
    }
    if (!_.isEqual(stepCacheData, this.props.stepCacheData)) {
      const obj = _.find(stepCacheData, { key: 'SFYZ' });
      if (obj && obj.value) {
        this.setState({
          tapDisabled: true,
          newAccessState: true,
        });
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
        push(`/organizationAccount/${step}`);
      }
    });
  }

  @autobind
  netClick() {
    const { push, returnOpinion } = this.props;
    if (!_.isEmpty(returnOpinion)) {
      this.props.changeMenuState({
        index: 1,
      });
      push('/organizationAccount/info');
      return;
    }
    push('/organizationAccount/invest');
  }

  render() {
    const {
      replace,
      push,
      location,
      // 数据
      dicData,
      empInforData,
      openAccCheckData,
      // 方法
      openAccCheckFunc,
      getBdidFunc,
      saveStepFunc,
      bdid,
      menuState,
      stepCacheData,
      popState,
      changePopState,
    } = this.props;
    const {
      tapDisabled,
      newAccessState,
    } = this.state;
    const stepObj = _.find(stepCacheData, { key: 'SFYZ' });
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
                      <span>证件信息</span>
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
                <Identity
                  push={push}
                  replace={replace}
                  location={location}
                  openAccCheckFunc={openAccCheckFunc}
                  openAccCheckData={openAccCheckData}
                  stepCacheData={stepCacheData}
                  dicData={dicData}
                  empInforData={empInforData}
                  tapDisabled={tapDisabled}
                  getBdidFunc={getBdidFunc}
                  saveStepFunc={saveStepFunc}
                  bdid={bdid}
                  popState={popState}
                  changePopState={changePopState}
                />
                <div className={styles.nexPopBox}>
                  <Button type="primary" className={`${styles.nextBut} ${isNextBtnClass}`} onClick={this.netClick}>下一步</Button>
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
