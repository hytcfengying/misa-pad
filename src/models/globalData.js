/**
 * @file models/example.js
 * @author zzc
 */
import _ from 'lodash';
import { toMainPage } from '../utils/cordova';
import api from '../api';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = {};

export default {
  namespace: 'globalData',
  state: {
    dicData: EMPTY_OBJECT,
    empInforData: EMPTY_OBJECT,
    empPhoto: EMPTY_OBJECT,
    popState: {
      menuJump: false,
      isSure: false,
      errPop: false,
      nativeUse: '',
      callback: '',
      popTest: '',
    }, // 弹出框
    toUrl: '',
  },
  reducers: {
    clearPopState(state) {
      const { popState } = state;
      popState.menuJump = false;
      popState.isSure = false;
      popState.errPop = false;
      popState.nativeUse = '';
      return {
        ...state,
        popState,
        toUrl: '',
      };
    },
    clearGlobalState(state) {
      const { popState } = state;
      popState.menuJump = false;
      popState.isSure = false;
      popState.errPop = false;
      popState.nativeUse = '';
      return {
        ...state,
        popState,
        dicData: {},
        empInforData: {},
        toUrl: '',
      };
    },
    saveToUrl(state, action) {
      const { payload: { toUrl } } = action;
      return {
        ...state,
        toUrl,
      };
    },
    getInfoQuerySuccess(state, action) {
      const { payload: {
        dicDataResult: { resultData: dicData = EMPTY_OBJECT },
        empInforDataResult: { resultData: empInforData = EMPTY_OBJECT },
        empPhotoResult: { resultData: empPhoto = EMPTY_ARRAY },
      } } = action;
      return {
        ...state,
        dicData, // 数据字典
        empInforData, //  员工信息
        empPhoto: empPhoto[0] || {}, // 员工头像
      };
    },
    changePopStateSuccess(state, action) {
      const { payload: { query: {
        popType,
        callback,
        popTest,
        popShow,
        nativeUse,
      } } } = action;
      const { popState } = state;
      const result = _.cloneDeep(popState);
      if (popShow) {
        result[`${popType}`] = true;
      } else {
        result[`${popType}`] = false;
      }
      if (callback) {
        result.callback = callback;
      } else {
        result.callback = '';
      }
      if (popTest) {
        result.popTest = popTest;
      } else {
        result.popTest = '';
      }
      if (nativeUse) {
        const pathL = location.pathname.split('/');
        const pathIndex = pathL[1];
        const str = location.href.split('?');
        let codeIndex = -1;
        if (str[1]) {
          codeIndex = str[1].indexOf('see');
        }
        if ((pathIndex === 'personAccount' || pathIndex === 'organizationAccount') &&
          codeIndex === -1) {
          result.nativeUse = nativeUse;
        } else {
          result.nativeUse = '';
          result[`${popType}`] = false;
          toMainPage(
            sucess => console.log(sucess),
            err => console.log(err),
          );
        }
      } else {
        result.nativeUse = '';
      }
      return {
        ...state,
        popState: result,
      };
    },
  },
  effects: {
    * getInfoQuery({ payload: query }, { call, put }) {
      const [dicDataResult, empInforDataResult] = yield [
        call(api.getDicData, query),
        call(api.getEmpInfo, query),
      ];
      let empPhotoResult = {
        resultData: [],
      };
      if (empInforDataResult.resultData.zpid) {
        empPhotoResult = yield call(api.getEmpPhoto, { id: empInforDataResult.resultData.zpid });
      }
      yield put({
        type: 'getInfoQuerySuccess',
        payload: {
          dicDataResult,
          empInforDataResult,
          empPhotoResult,
        },
      });
      if (query.callback) {
        query.callback.call();
      }
    },
    * changePopState({ payload: query }, { put }) {
      yield put({
        type: 'changePopStateSuccess',
        payload: {
          query,
        },
      });
    },
  },
  subscriptions: {},
};
