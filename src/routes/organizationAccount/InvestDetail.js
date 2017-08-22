/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

// import CenterHeader from '../../components/mission/CenterHeader';
import InvestDetail from '../../components/personAccount/InvestDetail';
import MenuLeft from '../../components/identity/menuLeft';

import styles from '../personAccount/homeGlobal.less';

const { Sider, Content } = Layout;

const mapStateToProps = state => ({
  investDetail: state.organizationAccount.investDetail,
  investListFlag: state.organizationAccount.investListFlag,
  globalLoading: state.activity.global,
  menuState: state.organizationAccount.menuState,
  popState: state.globalData.popState,
  stepCacheData: state.organizationAccount.stepCacheData,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  changeInvestList: index => ({
    type: 'organizationAccount/changeInvestList',
    payload: index || null,
  }),
  getInvestDetail: index => ({
    type: 'organizationAccount/getInvestDetail',
    payload: index || null,
  }),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class InvestDetailRouter extends PureComponent {
  static propTypes = {
    globalLoading: PropTypes.bool,
    investDetail: PropTypes.object,
    push: PropTypes.func.isRequired,
    changeInvestList: PropTypes.func.isRequired,
    getInvestDetail: PropTypes.func.isRequired,
    location: PropTypes.object,
    investListFlag: PropTypes.array.isRequired,
    menuState: PropTypes.array.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    globalLoading: false,
    investDetail: {},
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    const { location: { query: { investKey } } } = this.props;
    this.props.getInvestDetail({ index: investKey });
  }

  getReadFlag() {
    const { location: { query: { investKey } }, investListFlag } = this.props;
    return investListFlag[investKey];
  }

  render() {
    const {
      investDetail,
      push,
      changeInvestList,
      getInvestDetail,
      location,
      menuState,
      stepCacheData,
      popState,
      changePopState,
    } = this.props;
    const stepObj = _.find(stepCacheData, { key: 'TZZJY' });
    const readFlag = this.getReadFlag();
    return (
      <div className={styles.homeGlobal}>
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
              <section className={styles.investDetail}>
                <InvestDetail
                  push={push}
                  location={location}
                  information={investDetail}
                  getInvestDetail={getInvestDetail}
                  changeInvestList={changeInvestList}
                  readFlag={readFlag}
                  type="organizationAccount"
                />
              </section>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
