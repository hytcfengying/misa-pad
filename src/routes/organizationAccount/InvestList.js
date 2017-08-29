/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

// import CenterHeader from '../../components/mission/CenterHeader';
import InvestList from '../../components/personAccount/InvestList';
import MenuLeft from '../../components/identity/menuLeft';
import NextPop from '../../components/personAccount/nextPop';

import styles from '../personAccount/investList.less';

const { Sider, Content } = Layout;

const actionType = 'organizationAccount/getInvestList';

const getInvestFunction = loading => query => ({
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

const mapStateToProps = state => ({
  investList: state.organizationAccount.investList,
  investListFlag: state.organizationAccount.investListFlag,
  globalLoading: state.activity.global,
  stepCacheData: state.organizationAccount.stepCacheData,
  bdid: state.organizationAccount.bdid,
  menuState: state.organizationAccount.menuState,
  popState: state.globalData.popState,
});

const mapDispatchToProps = {
  getInvestFunc: getInvestFunction(true),
  push: routerRedux.push,
  replace: routerRedux.replace,
  changeInvestList: index => ({
    type: 'organizationAccount/changeInvestList',
    payload: index || null,
  }),
  setInvestReadFlag: query => ({
    type: 'organizationAccount/setInvestReadFlag',
    payload: query || null,
  }),
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class investListRouter extends PureComponent {
  static propTypes = {
    globalLoading: PropTypes.bool,
    investList: PropTypes.array,
    investListFlag: PropTypes.array.isRequired,
    getInvestFunc: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    changeInvestList: PropTypes.func.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    setInvestReadFlag: PropTypes.func.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    menuState: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    globalLoading: false,
    investList: [],
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      investStatus: false, // 是否列表都完成阅读
      accessState: !!_.find(props.stepCacheData, { key: 'TZZJY' }), // 我同意的按钮选择状态
      accessDisabledStatus: false, // 我同意按钮置灰状态
      // 下一步
      cacheKey: 'TZZJY',
      stepValue: 'sucess',
    };
  }

  componentWillMount() {
    const {
      getInvestFunc, setInvestReadFlag, stepCacheData, investList,
    } = this.props;
    let { investListFlag } = this.props;
    const stepStatus = _.find(stepCacheData, { key: 'TZZJY' });
    if (investList.length === 0) {
      getInvestFunc({
        status: stepStatus,
        query: {
          jgbz: 1,
        },
      });
    }
    // 若是已进行过该步骤，回头看，则默认选中我同意
    if (stepStatus) {
      this.setState({
        accessState: true,
        investStatus: true,
        accessDisabledStatus: true,
      });
      setInvestReadFlag({ flag: true });
      investListFlag = _.map(investListFlag, () => true);
    }
    // 将数据绑定已读未读
    investList.map(item =>
      _.assign(item, { read: investListFlag[item.indexId] }));
    // 设置同意协议是否可以点击的状态
    this.setAccessDisabledStatus(investListFlag);
  }

  // 设置同意协议是否可以点击的状态
  setAccessDisabledStatus(investListFlag) {
    let flag = true;
    investListFlag.forEach((item) => {
      if (!item) {
        flag = false;
      }
    });
    if (flag) {
      this.setState({ investStatus: true });
    }
  }

  @autobind
  accessClick() {
    const { investStatus, accessDisabledStatus } = this.state;
    if (!investStatus) {
      return;
    }
    if (accessDisabledStatus) {
      return;
    }
    this.setState({ accessState: !this.state.accessState });
  }

  render() {
    const {
      investList,
      push,
      changeInvestList,
      location,
      getBdidFunc,
      saveStepFunc,
      bdid,
      menuState,
      stepCacheData,
      popState,
      changePopState,
    } = this.props;
    const {
      accessState,
      accessDisabledStatus,
      investStatus,
      cacheKey,
      stepValue,
    } = this.state;
    const isInvestDisabled = investStatus ? '' : styles.investAccessDisabled;
    const isInvestChecked = accessState ? styles.investAccessChecked : '';
    const stepObj = _.find(stepCacheData, { key: 'TZZJY' });
    return (
      <div className={`${styles.invest} ${styles.homeGlobal}`}>
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
              <section className={styles.investSection} >
                <InvestList
                  push={push}
                  list={investList}
                  changeInvestList={changeInvestList}
                  type="organizationAccount"
                />
                <div className={`${styles.investAccess} ${isInvestDisabled} ${isInvestChecked}`}>
                  <span
                    className={styles.iconRadio}
                    onClick={this.accessClick}
                    disabled={accessDisabledStatus}
                  />
                  我同意以上协议
                  <span className={styles.iconRed}>*</span>
                </div>
              </section>
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
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
