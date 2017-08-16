/**
 * @file csdc/Result.js
 * @author zzc
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import _ from 'lodash';

import { setNavigatePageTitle } from '../../utils/cordova';

import SearchTop from '../../components/csdc/SearchTop';
import SearchList from '../../components/csdc/SearchList';
import PopUp from '../../components/globalCom/popup';

import resultStyle from './histRecord.less';


const nowday = new Date();
const year = nowday.getFullYear();
let month = nowday.getMonth() + 1;
let strDate = nowday.getDate();
if (month >= 1 && month <= 9) {
  month = `0${month}`;
}
if (strDate >= 0 && strDate <= 9) {
  strDate = `0${strDate}`;
}
const currentdate = `${year}${month}${strDate}`;

const getGloabInfoQueryFunc = loading => query => ({ // 字典
  type: 'globalData/getInfoQuery',
  payload: query || {},
  loading,
});

const stopOpenFunction = loading => query => ({ // 终止
  type: 'search/stopOpenAccount',
  payload: query || {},
  loading,
});

const getRecordListFunction = loading => query => ({ // 列表
  type: 'search/getRecordList',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  dicData: state.globalData.dicData,
  empInforData: state.globalData.empInforData,
  popState: state.globalData.popState,
  listData: state.search.listData,
  recordList: state.search.recordList,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  stopOpenFunc: stopOpenFunction(true),
  getGloabInfoFunc: getGloabInfoQueryFunc(true),
  getRecordListFunc: getRecordListFunction(true),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  clearListDataState: query => ({// 清空list
    type: 'search/clearRecordState',
    payload: query || null,
  }),
  clearRecordStateFunc: query => ({// 清空历史list
    type: 'search/clearRecordState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class SearchResult extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    getGloabInfoFunc: PropTypes.func.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    stopOpenFunc: PropTypes.func.isRequired,
    getRecordListFunc: PropTypes.func.isRequired,
    listData: PropTypes.object,
    recordList: PropTypes.array,
    clearListDataState: PropTypes.func.isRequired,
    clearRecordStateFunc: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    dicData: {},
    empInforData: {},
    recordList: [],
    listData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    setNavigatePageTitle(
      ['', false],
      result => console.log(result),
      err => console.log(err),
    );
    const { location: { query } } = this.props;
    this.props.clearRecordStateFunc();
    this.props.getRecordListFunc({
      searchKey: query.searchKey || '',
      empId: this.props.empInforData.id,
      step: query.step || '',
      ksrq: query.ksrq || currentdate,
      jsrq: query.jsrq || currentdate,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query } } = nextProps;
    const { location: { query: preQuery }, empInforData } = this.props;
    // 条件变化
    if (!_.isEqual(query, preQuery) &&
      !_.isEmpty(empInforData)) {
      // 如果列表滚动了很远，这时候切换列表数据源，
      // scrollTop不会自己恢复,需要手动搞一下
      this.resetScroll();
    }
  }

  resetScroll() {
    window.scroll(0, 0);
  }

  render() {
    const {
      replace,
      push,
      location,
      stopOpenFunc,
      getRecordListFunc,
      popState,
      changePopState,
      empInforData,
      dicData,
      recordList,
      listData,
      clearListDataState,
    } = this.props;
    return (
      <section className={resultStyle.page_searchResult}>
        <SearchTop
          replace={replace}
          push={push}
          location={location}
          getRecordListFunc={getRecordListFunc}
          clearListDataState={clearListDataState}
          empInforData={empInforData}
          dicData={dicData}
        />
        <SearchList
          push={push}
          replace={replace}
          location={location}
          stopOpenFunc={stopOpenFunc}
          popState={popState}
          changePopState={changePopState}
          empInforData={empInforData}
          getRecordListFunc={getRecordListFunc}
          recordList={recordList}
          listData={listData}
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
