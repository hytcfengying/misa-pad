/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { setNavigatePageTitle } from '../../utils/cordova';

import styles from './codePass.less';
import Code from '../../components/csdc/CodePass';
import ResultList from '../../components/csdc/ResultList';

const getCodeFunc = loading => query => ({
  type: 'csdc/getCodeQuery',
  payload: query || {},
  loading,
});

const getDictionaryQueryFunc = loading => query => ({
  type: 'csdc/getDictionaryQuery',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  csdcList: state.csdc.csdcQuery,
  identityArr: state.csdc.identityArr,
  accountArr: state.csdc.accountArr,
  searchObj: state.csdc.searchObj,
  showState: state.csdc.showState,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getCodePassFunc: getCodeFunc(true),
  getDictionaryQuery: getDictionaryQueryFunc(true),
  clearQuery: query => ({
    type: 'csdc/clearQuery',
    payload: query || null,
  }),
  setSearchObj: query => ({
    type: 'csdc/setSearchObj',
    payload: query || null,
  }),
  setShowState: query => ({
    type: 'csdc/setShowState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class codePass extends PureComponent {
  static propTypes = {
    globalLoading: PropTypes.bool,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object,
    getCodePassFunc: PropTypes.func.isRequired,
    csdcList: PropTypes.array,
    identityArr: PropTypes.array.isRequired,
    accountArr: PropTypes.array.isRequired,
    getDictionaryQuery: PropTypes.func.isRequired,
    clearQuery: PropTypes.func.isRequired,
    setSearchObj: PropTypes.func.isRequired,
    searchObj: PropTypes.object.isRequired,
    setShowState: PropTypes.func.isRequired,
    showState: PropTypes.string.isRequired,
  }

  static defaultProps = {
    location: {},
    csdcList: null,
    globalLoading: false,
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentWillMount() {
    const {
      location: { query },
      identityArr,
      accountArr,
      getDictionaryQuery,
      clearQuery,
    } = this.props;
    let title = '';
    switch (location.pathname) {
      case '/codeSearch':
        title = '一码通查询';
        break;
      case '/stockSearch':
        title = '证券账户查询';
        break;
      case '/relationSearch':
        title = '关联关系查询';
        break;
      case '/infoSearch':
        title = '使用信息查询';
        break;
      case '/partnerSearch':
        title = '合伙人信息查询';
        break;
      default:
        break;
    }
    setNavigatePageTitle(
      [title, true],
      result => console.log(result),
      err => console.log(err),
    );
    const arr = [];
    if (identityArr && identityArr.length === 0) {
      arr.push({ fldm: 'ZDZH_ZJLB' });
    }
    if (accountArr && accountArr.length === 0 && location.pathname !== '/codeSearch') {
      arr.push({ fldm: 'ZDZH_ZHLB' });
    }
    if (arr.length > 0) {
      getDictionaryQuery(arr);
    }
    if (!query.searchState) {
      clearQuery();
    }
  }

  componentWillUnmount() {
    setNavigatePageTitle(
      ['', false],
      result => console.log(result),
      err => console.log(err),
    );
  }

  render() {
    const {
      getCodePassFunc,
      push,
      replace,
      location,
      csdcList,
      identityArr,
      accountArr,
      setSearchObj,
      searchObj,
      setShowState,
      showState,
    } = this.props;
    return (
      <div className={`${styles.codeHome} ${styles.homeGlobal}`}>
        <Code
          getCodePassFunc={getCodePassFunc}
          replace={replace}
          location={location}
          identityArr={identityArr}
          accountArr={accountArr}
          pathname={location.pathname.replace('/', '')}
          setSearchObj={setSearchObj}
          searchObj={searchObj}
          setShowState={setShowState}
        />
        {
          csdcList === null ? '' :
          <ResultList
            push={push}
            location={location}
            replace={replace}
            csdcList={csdcList}
            pathname={location.pathname.replace('/', '')}
            showState={showState}
          />
        }
      </div>
    );
  }
}
