/**
 * @file 机构 代理人
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

import MenuLeft from '../../components/identity/menuLeft';
import InfoForm from '../../components/organizationAccount/AngentForm';

import styles from '../personAccount/identityHome.less';

const { Sider, Content } = Layout;

const saveStep = loading => query => ({// 保存步骤缓存
  type: 'organizationAccount/saveStepCache',
  payload: query || {},
  loading,
});
const getCountryList = loading => query => ({// 获得国籍
  type: 'organizationAccount/getCountryList',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  countryInfo: state.organizationAccount.countryInfo,
  dicData: state.globalData.dicData,
  empInforData: state.globalData.empInforData,
  bdid: state.organizationAccount.bdid,
  stepCacheData: state.organizationAccount.stepCacheData,
  menuState: state.organizationAccount.menuState,
  popState: state.globalData.popState,
  returnOpinion: state.organizationAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  saveStepFunc: saveStep(true),
  getCountryListFunc: getCountryList(true),
  changePopState: query => ({
    type: 'globalData/changePopState',
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
    countryInfo: PropTypes.array,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    getCountryListFunc: PropTypes.func.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    menuState: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    countryInfo: [],
    dicData: {},
    empInforData: {},
    returnOpinion: [],
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    this.props.getCountryListFunc();
  }

  componentDidMount() {
  }

  // componentWillReceiveProps(nextProps) {
  // }

  render() {
    const {
      replace,
      push,
      location,
      // 数据
      bdid,
      countryInfo,
      dicData,
      empInforData,
      menuState,
      stepCacheData,
      popState,
      changePopState,
      saveStepFunc,
      returnOpinion,
    } = this.props;
    const stepObj = _.find(stepCacheData, { key: 'KHDLR' });
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
              <section className={styles.infoSection} >
                <InfoForm
                  replace={replace}
                  push={push}
                  location={location}
                  bdid={bdid}
                  countryInfo={countryInfo}
                  dicData={dicData}
                  empInforData={empInforData}
                  stepCacheData={stepCacheData}
                  saveStepFunc={saveStepFunc}
                  returnOpinion={returnOpinion}
                />
              </section>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
