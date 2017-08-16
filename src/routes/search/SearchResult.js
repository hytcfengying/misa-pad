/**
 * @file search/Result.js
 * @author fengwencong
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import _ from 'lodash';

import { setmTabMainVisual, setNavigatePageTitle } from '../../utils/cordova';

import SearchInput from '../../components/search/SearchInput';
import SearchList from '../../components/search/SearchList';
import PopUp from '../../components/globalCom/popup';

import resultStyle from './searchResult.less';

const actionType = 'search/getSearchList';
const getSearchFunction = loading => query => ({
  type: actionType,
  payload: query || {},
  loading,
});

const stopOpenFunction = loading => query => ({
  type: 'search/stopOpenAccount',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  empInforData: state.globalData.empInforData,
  customerlist: state.search.customerlist,
  registerlist: state.search.registerlist,
  listData: state.search.listData,
  stopOpenAccountData: state.search.stopOpenAccountData,
  popState: state.globalData.popState,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getSearchFunc: getSearchFunction(true),
  stopOpenFunc: stopOpenFunction(true),
  clearListDataStateFunc: query => ({// 清空list
    type: 'search/clearListDataState',
    payload: query || null,
  }),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class SearchResult extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    globalLoading: PropTypes.bool,
    getSearchFunc: PropTypes.func.isRequired,
    location: PropTypes.object,
    empInforData: PropTypes.object,
    stopOpenFunc: PropTypes.func.isRequired,
    customerlist: PropTypes.array,
    registerlist: PropTypes.array,
    listData: PropTypes.object,
    stopOpenAccountData: PropTypes.object,
    clearListDataStateFunc: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customerlist: [],
    registerlist: [],
    location: {},
    globalLoading: false,
    empInforData: {},
    listData: {},
    stopOpenAccountData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    const { location: { query }, empInforData } = this.props;
    setNavigatePageTitle(
      ['', false],
      result => console.log(result),
      err => console.log(err),
    );
    setmTabMainVisual(
      [true],
      result => console.log(result),
      err => console.log(err),
    );
    this.props.getSearchFunc({
      ...query,
      searchKey: query.searchKey,
      empId: empInforData.id || query.userId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query } } = nextProps;
    const { location: { query: preQuery } } = this.props;
    // 条件变化
    if (!_.isEqual(query, preQuery)) {
      // this.props.getSearchFunc({
      //   ...query,
      //   searchKey: query.searchKey,
      //   empId: empInforData.id,
      // });
      // 如果列表滚动了很远，这时候切换列表数据源，
      // scrollTop不会自己恢复,需要手动搞一下
      this.resetScroll();
    }
  }

  resetScroll() {
    console.log('reset scroll');
  }

  render() {
    const {
      replace,
      push,
      location,
      stopOpenFunc,
      getSearchFunc,
      empInforData,
      customerlist,
      registerlist,
      listData,
      clearListDataStateFunc,
      popState,
      changePopState,
    } = this.props;
    return (
      <section className={resultStyle.page_searchResult}>
        <SearchInput
          replace={replace}
          push={push}
          location={location}
          stopOpenFunc={stopOpenFunc}
          getSearchFunc={getSearchFunc}
          empInforData={empInforData}
          clearListDataStateFunc={clearListDataStateFunc}
        />
        <SearchList
          push={push}
          replace={replace}
          location={location}
          getSearchFunc={getSearchFunc}
          stopOpenFunc={stopOpenFunc}
          customerlist={customerlist}
          registerlist={registerlist}
          listData={listData}
          empInforData={empInforData}
          popState={popState}
          changePopState={changePopState}
        />
        <PopUp
          popType={'isSure'}
          popState={popState}
          changePopState={changePopState}
          push={push}
        />
      </section>
    );
  }
}
