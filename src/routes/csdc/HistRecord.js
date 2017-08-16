/**
 * @file csdc/Result.js
 * @author zzc
 */

import { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import _ from 'lodash';

import { setNavigatePageTitle } from '../../utils/cordova';

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

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  empInforData: state.globalData.empInforData,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getGloabInfoFunc: getGloabInfoQueryFunc(true),
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
    empInforData: PropTypes.object,
    clearRecordStateFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    empInforData: {},
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
    const { location: { query }, push } = this.props;
    this.props.clearRecordStateFunc();
    if (_.isEmpty(this.props.empInforData)) {
      const getList = (props, nowquery) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const { getGloabInfoFunc } = props;
            getGloabInfoFunc({
              id: null,
              userid: nowquery.empId,
              callback: () => {
                resolve(true);
              },
            });
          } catch (e) {
            reject(e);
          }
        });
        return promise;
      };
      getList(this.props, query).then(() => {
        push({
          pathname: '/histRecord/histRecordList',
          query: {
            ...query,
            step: query.step ? query.step : '',
            current: query.current ? query.current : '',
            searchKey: query.searchKey ? query.searchKey : '',
            ksrq: query.ksrq ? query.ksrq : currentdate,
            jsrq: query.jsrq ? query.jsrq : currentdate,
          },
        });
      });
    } else {
      push({
        pathname: '/histRecord/histRecordList',
        query: {
          ...query,
          step: query.step ? query.step : '',
          current: query.current ? query.current : '',
          searchKey: query.searchKey ? query.searchKey : '',
          ksrq: query.ksrq ? query.ksrq : currentdate,
          jsrq: query.jsrq ? query.jsrq : currentdate,
        },
      });
    }
  }

  render() {
    return null;
  }
}
