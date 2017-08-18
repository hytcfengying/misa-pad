/**
 * @file models/example.js
 * @author maoquan(maoquan@htsc.com)
 */

import _ from 'lodash';
import api from '../api';

export default {
  namespace: 'csdc',
  state: {
    csdcQuery: null, // 中登回报的结果
    identityQuery: null, // 证件中登回报的结果
    codeQuery: null, // 一码通中登回报的结果
    shareholderQuery: null, // 证券中登回报的结果
    identityArr: [], // 证件类别
    accountArr: [], // 账户类别
    searchObj: {}, // 搜索的内容
    showState: 'identity',
  },
  reducers: {
    clearQuery(state) {
      return {
        ...state,
        csdcQuery: null,
        identityQuery: null,
        codeQuery: null,
        shareholderQuery: null,
        searchObj: {},
        showState: 'identity',
      };
    },
    setShowState(state, action) {
      const { payload: { show } } = action;
      const { csdcQuery, identityQuery, codeQuery, shareholderQuery } = state;
      let query = [];
      switch (show) {
        case 'identity':
          query = _.cloneDeep(identityQuery);
          break;
        case 'code':
          query = _.cloneDeep(codeQuery);
          break;
        case 'shareholder':
          query = _.cloneDeep(shareholderQuery);
          break;
        default:
          query = _.cloneDeep(csdcQuery);
          break;
      }
      return {
        ...state,
        csdcQuery: query,
        showState: show,
      };
    },
    setSearchObj(state, action) {
      const { payload: { obj } } = action;
      const { searchObj } = state;
      return {
        ...state,
        searchObj: _.assign(searchObj, obj),
      };
    },
    getcsdcQuerySuccess(state, action) {
      const { payload: {
        csdcQuery: { resultData: csdcQueryArr },
        query,
      } } = action;
      const { identityQuery, codeQuery, shareholderQuery } = state;
      const clbzArr = ['申请中', '申报中', '成功', '失败'];
      csdcQueryArr.forEach((item, index) => {
        csdcQueryArr[index].clbz_note = clbzArr[item.clbz - 1];
        const date = item.hbrq.toString();
        if (date) {
          csdcQueryArr[index].hbrq =
          `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
        }
      });
      const type = query.type;
      return {
        ...state,
        identityQuery: type === 'identity' ? csdcQueryArr : identityQuery,
        codeQuery: type === 'code' ? csdcQueryArr : codeQuery,
        shareholderQuery: type === 'shareholder' ? csdcQueryArr : shareholderQuery,
        csdcQuery: csdcQueryArr,
      };
    },
    getDictionaryQuerySuccess(state, action) {
      const { payload: {
        identityArray,
        accountArray,
      } } = action;
      const { accountArr } = state;
      return {
        ...state,
        identityArr: identityArray.resultData.ZDZH_ZJLB,
        accountArr: accountArray.resultData ? accountArray.resultData.ZDZH_ZHLB : accountArr,
      };
    },
  },
  effects: {
    /*
     * 查询
     * */
    * getCodeQuery({ payload: query }, { call, put }) {
      const pathname = query.path;
      let responseQuery = {};
      switch (pathname) {
        case 'codeSearch':
          responseQuery = yield call(api.getNumQuery, query.query);
          break;
        case 'stockSearch':
          responseQuery = yield call(api.getStockQuery, query.query);
          break;
        case 'relationSearch':
          responseQuery = yield call(api.getRelationQuery, query.query);
          break;
        case 'infoSearch':
          responseQuery = yield call(api.getInfoQuery, query.query);
          break;
        case 'partnerSearch':
          responseQuery = yield call(api.getPartnerQuery, query.query);
          break;
        default:
          responseQuery = yield call(api.getNumQuery, query.query);
          break;
      }
      const sqbh = responseQuery.resultData[0].o_sqbh;
      let csdcQuery = yield call(api.getNumQueryReturn, { sqbh });
      for (let i = 0; i < 12; i++) {
        if (csdcQuery.resultData[0].clbz === 3 || csdcQuery.resultData[0].clbz === 4) {
          break;
        } else {
          csdcQuery = yield call(api.getNumQueryReturn, { sqbh });
        }
      }
      yield put({
        type: 'getcsdcQuerySuccess',
        payload: {
          query,
          csdcQuery,
        },
      });
    },
    /*
    * 数字字典 查询
    */
    * getDictionaryQuery({ payload: query }, { call, put }) {
      const identityArray = yield call(api.getDicData, query[0]);
      let accountArray = {};
      if (query[1]) {
        accountArray = yield call(api.getDicData, query[1]);
      }
      yield put({
        type: 'getDictionaryQuerySuccess',
        payload: {
          identityArray,
          accountArray,
        },
      });
    },
  },
  subscriptions: {},
};
