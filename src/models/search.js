/**
 * @file models/example.js
 * @author maoquan(maoquan@htsc.com)
 */

import api from '../api';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default {
  namespace: 'search',
  state: {
    listData: EMPTY_OBJECT,
    customerlist: EMPTY_ARRAY,
    registerlist: EMPTY_ARRAY,
    stopOpenAccountData: EMPTY_OBJECT,
    dataIndex: 1,
    recordList: EMPTY_ARRAY,
  },
  reducers: {
    clearRecordState(state) { // 清空历史记录
      return {
        ...state,
        recordList: [],
        listData: {},
      };
    },
    clearListDataState(state) {
      return {
        ...state,
        listData: {},
      };
    },
    clearState(state) {
      return {
        ...state,
        listData: {},
        customerlist: [],
        registerlist: [],
        stopOpenAccountData: {},
      };
    },
    getSearchListSuccess(state, action) {
      const { payload: {
        customerQuery: { resultData: customerlistData = EMPTY_ARRAY },
        registerQuery: { resultData: registerlistData = EMPTY_ARRAY },
      } } = action;
      const { listData } = state;
      listData.customerlist = customerlistData;
      listData.registerlist = registerlistData;
      return {
        ...state,
        listData,
        customerlist: customerlistData,
        registerlist: registerlistData,
      };
    },
    getRecordListSuccess(state, action) {
      const { payload: {
        registerQuery: { resultData: recordListData = EMPTY_ARRAY },
      } } = action;
      const { listData } = state;
      listData.recordList = recordListData;
      return {
        ...state,
        recordList: recordListData,
      };
    },
    stopOpenAccountSuccess(state, action) {
      const { payload: {
        stopOpenAccountQuery: { resultData: stopOpenAccountData = EMPTY_ARRAY },
      } } = action;
      const { dataIndex } = state;
      const newIndex = dataIndex + 1;
      const checkObj = stopOpenAccountData[0];
      checkObj.index = newIndex;
      return {
        ...state,
        stopOpenAccountData: checkObj,
        dataIndex: newIndex,
      };
    },
  },
  effects: {
    * getSearchList({ payload: query }, { call, put }) {
      const { searchKey, empId } = query;
      // const customerQuery = {
      //   resultData: [],
      // };
      let customerQuery = yield call(api.getsearchList, { khh: searchKey, zjbh: null });
      if (!customerQuery.resultData[0]) {
        customerQuery = yield call(api.getsearchList, { khh: null, zjbh: searchKey });
      }
      const registerQuery = yield call(api.getOpenList, {
        flag: 5,
        gyid: empId,
        sj: null,
        zjbh: null,
        zjlb: null,
        step: '',
        jgbz: null,
        ksrq: null,
        jsrq: null,
        khfs: 2,
        cxnr: searchKey,
      });
      yield put({
        type: 'getSearchListSuccess',
        payload: {
          customerQuery,
          registerQuery,
        },
      });
    },
    /*
    * 开户中止
    * */
    * stopOpenAccount({ payload: query }, { call, put }) {
      const stopOpenAccountQuery = yield call(api.stopOpenAccount, { bdid: query.bdid });
      yield put({
        type: 'stopOpenAccountSuccess',
        payload: {
          stopOpenAccountQuery,
        },
      });
      if (query.callback) {
        query.callback.call();
      }
    },
    /*
    * 历史记录
    * */
    * getRecordList({ payload: query }, { call, put }) {
      const registerQuery = yield call(api.getOpenList, {
        flag: 2,
        gyid: query.empId,
        sj: null,
        zjbh: null,
        zjlb: null,
        step: query.step,
        jgbz: query.jgbz,
        ksrq: query.ksrq,
        jsrq: query.jsrq,
        khfs: 2,
        cxnr: query.searchKey,
      });
      yield put({
        type: 'getRecordListSuccess',
        payload: {
          registerQuery,
        },
      });
    },
  },
  subscriptions: {},
};
