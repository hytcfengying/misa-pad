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
import { setNavigatePageTitle, setmTabMainVisual } from '../../utils/cordova';
import MenuLeft from '../../components/identity/menuLeft';
import NextPop from '../../components/personAccount/nextPop';

import Infor from '../../components/organizationAccount/ConfirmForm';

import styles from '../personAccount/homeGlobal.less';

const { Sider, Content } = Layout;

const actionType = 'organizationAccount/getInforQuery';
const getInforFunc = loading => query => ({
  type: actionType,
  payload: query || {},
  loading,
});

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
const getStepCacheQueryFunc = loading => query => ({// 获得步骤缓存
  type: 'organizationAccount/getStepCache',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  inforData: state.organizationAccount.inforData,
  empInforData: state.globalData.empInforData,
  bdid: state.organizationAccount.bdid,
  imageList: state.organizationAccount.imageList,
  menuState: state.organizationAccount.menuState,
  stepCacheData: state.organizationAccount.stepCacheData,
  popState: state.globalData.popState,
  returnOpinion: state.organizationAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getInfor: getInforFunc(true),
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  getStepCacheFunc: getStepCacheQueryFunc(false),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  clearStateFunc: query => ({// 清空state
    type: 'organizationAccount/clearState',
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
    const { location: { query }, returnOpinion } = this.props;
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
      this.setState({
        cacheKey: 'THTJ',
        nextContent: '提交',
        stepValue: '',
      });
    }
    this.props.getInfor({
      bdid: query.bdid ? query.bdid : this.props.bdid,
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
