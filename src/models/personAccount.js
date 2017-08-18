/**
 * @file models/example.js
 * @author maoquan(maoquan@htsc.com)
 */

import _ from 'lodash';
// import { routerRedux } from 'dva/router';
import api from '../api';
import { menus } from '../config';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const LOOP_NUM = 8;

export default {
  namespace: 'personAccount',
  state: {
    menuState: menus,
    investList: EMPTY_ARRAY, // 投资者教育列表
    investDetail: EMPTY_OBJECT, // 投资者教育详情
    investListFlag: [false, false, false, false, false, false, false, false], // 投资者教育列表已读未读状态
    imageList: EMPTY_ARRAY, // 开户影音列表
    witnessInfo: EMPTY_OBJECT, // 见证人信息
    videoType: 'double', // 开户见证方式
    returnOpinion: EMPTY_ARRAY, // 退回整改信息
    veriResultData: EMPTY_OBJECT,
    openAccCheckData: EMPTY_OBJECT,
    dataIndex: 1,
    numQuery: EMPTY_ARRAY,
    numRequest: EMPTY_OBJECT,
    inforData: EMPTY_OBJECT,
    countryInfo: EMPTY_ARRAY,
    provinceInfo: EMPTY_ARRAY,
    cityInfo: EMPTY_ARRAY,
    accountTmpInfo: EMPTY_ARRAY,
    bankInfo: EMPTY_ARRAY,
    fundCompanyInfo: EMPTY_ARRAY,
    bdid: '0',
    mealInfo: EMPTY_ARRAY,
    returnInfo: EMPTY_ARRAY,
    stepIndex: 0,
    stepCacheData: [
      {
        id: null,
        bdid: null,
        key: 'SFYZ',
        value: '',
      },
    ],
    imgFilepath: '',
    imgBase64str: '',
    accountPersonAge: 0,
    question: [],
    questionResult: {},
    customerNumber: '',
    questionState: '',
  },
  reducers: {
    clearState(state) {
      const { menuState } = state;
      for (let i = 0; i < menuState.length; i++) {
        menuState[i].off = false;
        menuState[i].iconOn = false;
        menuState[i].show = true;
      }
      return {
        ...state,
        menuState,
        bdid: '0',
        stepIndex: 0,
        veriResultData: {},
        openAccCheckData: {},
        numQuery: [],
        stepCacheData: [],
        imgFilepath: '',
        imgBase64str: '',
        returnOpinion: [],
        inforData: {},
        returnInfo: [],
        question: [],
        questionResult: {},
        customerNumber: '',
        questionState: '',
      };
    },
    saveBdid(state, action) {
      const { payload: { bdid } } = action;
      return {
        ...state,
        bdid,
      };
    },
    changeMenuState(state, action) {
      const { payload: { index } } = action;
      const { menuState } = state;
      if (index < 0) {
        _.find(menus, { cacheKey: 'TZZJY' }).show = false;
        _.find(menus, { cacheKey: 'FXCP' }).show = false;
        _.find(menus, { cacheKey: 'KHJZ_LAST' }).show = false;
        const nIndex = (Math.abs(index)) === 1 ?
          0 : Math.abs(index);
        for (let i = 0; i < nIndex; i++) {
          menuState[i].off = true;
          menuState[i].iconOn = true;
        }
      } else {
        for (let i = 0; i < index; i++) {
          menuState[i].off = true;
          menuState[i].iconOn = true;
        }
      }
      return {
        ...state,
        menuState,
      };
    },
    changeStepcache(state, action) {
      const { payload: { query } } = action;
      const { stepCacheData } = state;
      const stepObjct = {
        id: null,
        bdid: state.bdid,
        key: query.key,
        value: query.value,
      };
      const obj = _.find(stepCacheData, { key: query.key });
      if (obj) {
        obj.value = query.value;
      } else {
        stepCacheData.push(stepObjct);
      }
      if (query.returnValue) { // 退回
        const returnObj = _.find(stepCacheData, { key: 'THZG' });
        const returnStepObj = {
          id: null,
          bdid: state.bdid,
          key: 'THZG',
          value: query.returnValue,
        };
        if (returnObj) {
          returnObj.value = query.returnValue;
        } else {
          stepCacheData.push(returnStepObj);
        }
      }
      return {
        ...state,
        stepCacheData,
      };
    },
    getStepCacheSucess(state, action) {
      const { payload: { stepCacheData: { resultData = EMPTY_ARRAY } } } = action;
      return {
        ...state,
        stepCacheData: resultData,
      };
    },
    getQuestionSuccess(state, action) {
      const { payload: {
        question: { resultData },
        age,
        inforQuery,
      } } = action;
      const { stepCacheData } = state;
      const arr = [];
      resultData.forEach((item) => {
        const index = _.findIndex(arr, { qid: _.parseInt(item.qid) });
        if (index !== -1) {
          arr[index][`${item.answer}_obj`] = item;
          arr[index].answerArr.push(item.answer);
        } else {
          const objArr = {
            qid: item.qid,
            qdescribe: item.qdescribe,
            sanswer: item.sanswer,
            selectState: false,
            answerArr: [item.answer],
          };
          arr.push(objArr);
          arr[arr.length - 1][`${item.answer}_obj`] = item;
        }
      });
      const stepData = _.find(stepCacheData, { key: 'FXCP' });
      if (stepData && stepData.value) {
        const tmdac = JSON.parse(stepData.value).TMDAC.split(';');
        tmdac.forEach((item) => {
          const ind = _.findIndex(arr, { qid: _.parseInt(item.split('|')[0]) });
          arr[ind].choice = item.split('|')[1];
          arr[ind].selectState = true;
        });
      }
      arr[16].selectState = true;
      arr[16].choice = age;
      return {
        ...state,
        question: arr,
        customerNumber: inforQuery.khh,
      };
    },
    getQuestionResultSuccess(state, action) {
      const { payload: { result: { resultData } } } = action;
      const arr = resultData[0].analyseList;
      const fxObj = _.find(arr, { attribCode: '811010' });
      const pzObj = _.find(arr, { attribCode: '811013' });
      const qxObj = _.find(arr, { attribCode: '811014' });
      const obj = {
        FXPCLX: fxObj.code || '',
        FXPCLXSM: fxObj.remark || '',
        FXPCLXVALUE: fxObj.value || '',
        TZPZ: pzObj.code || '',
        TZPZVALUE: pzObj.value || '',
        TZQX: qxObj.code || '',
        TZQXSM: qxObj.remark || '',
        TZQXVALUE: qxObj.value || '',
      };
      return {
        ...state,
        questionResult: obj,
      };
    },
    setQuestionState(state, action) {
      const { payload: { value } } = action;
      const { question } = state;
      const valueArr = value.split('|');
      const index = _.findIndex(question, { qid: _.parseInt(valueArr[0]) });
      question[index].selectState = true;
      question[index].choice = valueArr[1];
      return {
        ...state,
        question,
        questionState: value,
      };
    },
    /*
    *  设置开户人年龄
    * */
    setAccountPersonAge(state, action) {
      const { payload: { ageValue } } = action;
      return {
        ...state,
        accountPersonAge: _.parseInt(ageValue),
      };
    },
    /*
     * 获取投资者教育列表
     * */
    getInvestListSuccess(state, action) {
      const { payload: { investList: { resultData } } } = action;
      const { investListFlag } = state;
      return {
        ...state,
        investList: resultData.map((item, index) =>
          _.assign(item, { read: investListFlag[index] }, { indexId: index })),
      };
    },
    /*
    * 获取投资者教育信息详情
    * @param index
    * */
    getInvestDetail(state, action) {
      const { payload: { index } } = action;
      const { investList } = state;
      return {
        ...state,
        investDetail: _.find(investList, { indexId: _.parseInt(index) }),
      };
    },
    /*
     * 更改投资者教育列表已读未读状态(改成都是已读)
     * */
    setInvestReadFlag(state, action) {
      const { payload: { flag } } = action;
      const arr = [];
      for (let i = 0; i < 8; i++) {
        arr.push(flag);
      }
      return {
        ...state,
        investListFlag: arr,
      };
    },
    /*
    * 更改投资者教育列表已读未读状态
    * @param index
    * */
    changeInvestList(state, action) {
      const { payload: { index } } = action;
      const { investListFlag } = state;
      investListFlag[index] = true;
      return {
        ...state,
        investListFlag,
      };
    },
    setImageList(state, action) {
      const { payload: { lists } } = action;
      return {
        ...state,
        imageList: lists,
      };
    },
    /*
     * 更改开户影音资料列表的filepath
     * @param filepath
     * */
    changeImageFilepath(state, action) {
      const { payload: { mc, filepath } } = action;
      const { imageList } = state;
      const index = _.findIndex(imageList, { yxlxmc: mc });
      const result = _.cloneDeep(imageList);
      result[index].filepath = filepath;
      return {
        ...state,
        imageList: result,
      };
    },
    /*
    * 获取开户影音资料列表
    * */
    getImageListSuccess(state, action) {
      const { payload: {
        imageList: { resultData = EMPTY_ARRAY },
        imageArr,
        returnOpinion,
      } } = action;
      // 已保存步骤缓存的数据处理
      if (imageArr) {
        imageArr.forEach((item) => {
          const index = _.findIndex(resultData, { yxlx: item.YXLX });
          if (index !== -1) {
            resultData[index].filepath = item.FILEPATH;
          }
        });
      }
      // 退回整改数据的处理
      if (returnOpinion &&
        returnOpinion.value &&
        JSON.parse(returnOpinion.value).key === 'YXSM') {
        const returnArr = JSON.parse(returnOpinion.value).imageList;
        _.map(resultData, (item) => {
          _.assign(item, { returnChange: true, defaultFilepath: item.filepath });
        });
        returnArr.forEach((item) => {
          if (item.zd === 'YX') {
            const index = _.findIndex(resultData, { yxlx: item.yxlx });
            if (index > -1) {
              resultData[index].filepath = '';
              resultData[index] = _.assign(resultData[index], item);
            }
          }
        });
      }
      return {
        ...state,
        imageList: resultData,
      };
    },
    /*
     * 获取见证人信息
     * @param index
     * */
    witnessLoginSuccess(state, action) {
      const { payload: {
        witnessInfo: { resultData: witness = EMPTY_OBJECT },
        photoResult: { resultData: photo = EMPTY_ARRAY },
      } } = action;
      return {
        ...state,
        witnessInfo: _.assign(witness, (photo[0] || {})),
      };
    },
    /*
     * 设置开户见证类型
     * @param index
     * */
    setVideoType(state, action) {
      const { payload: { type: result } } = action;
      return {
        ...state,
        videoType: result,
      };
    },
    /*
     * 初始化见证人信息
     * @param index
     * */
    initializeWitness(state) {
      return {
        ...state,
        witnessInfo: EMPTY_OBJECT,
      };
    },
    getReturnOpinionSuccess(state, action) {
      const { payload: { returnOpinion: { resultData = EMPTY_ARRAY } } } = action;
      return {
        ...state,
        returnOpinion: resultData,
      };
    },
    getVeriResultSuccess(state, action) {
      const { payload: {
        callStep,
        veriResultQuery: { resultData: veriResult = EMPTY_ARRAY },
        openAccCheckQuery: { resultData: openAccCheck = EMPTY_ARRAY },
        photoQuery: { resultData: photo = EMPTY_ARRAY },
      } } = action;
      const { dataIndex } = state;
      const newIndex = dataIndex + 1;
      const checkObj = openAccCheck[0];
      checkObj.index = newIndex;
      const dataObj = veriResult[0];
      dataObj.callStep = callStep;
      dataObj.photo = photo[0].base64str;
      dataObj.index = newIndex;
      return {
        ...state,
        veriResultData: dataObj,
        openAccCheckData: checkObj,
        dataIndex: newIndex,
      };
    },
    openAccCheckSuccess(state, action) {
      const { payload: {
        openAccCheckQuery: { resultData = EMPTY_ARRAY },
      } } = action;
      const checkObj = resultData[0];
      const { dataIndex } = state;
      const newIndex = dataIndex + 1;
      checkObj.index = newIndex;
      return {
        ...state,
        dataIndex: newIndex,
        openAccCheckData: checkObj,
      };
    },
    getNumQuerySuccess(state, action) {
      const { payload: {
        query,
        responseQuery: { resultData: response = EMPTY_ARRAY },
        numQueryQuery: { resultData: numQuery = EMPTY_ARRAY },
      } } = action;
      const checkObj = response[0];
      const numObj = numQuery;
      const { dataIndex } = state;
      const newIndex = dataIndex + 1;
      checkObj.index = newIndex;
      numObj[0].index = newIndex;
      numObj[0].nowIndex = query.ZJYZLY;
      return {
        ...state,
        dataIndex: newIndex,
        numRequest: checkObj,
        numQuery: numObj,
      };
    },
    getNumQueryReturnSuccess(state, action) {
      const { payload: { numQuery: { resultData = EMPTY_ARRAY } } } = action;
      const checkObj = resultData[0];
      const { dataIndex } = state;
      const newIndex = dataIndex + 1;
      checkObj.index = newIndex;
      return {
        ...state,
        dataIndex: newIndex,
        numQuery: checkObj,
      };
    },
    getInforQuerySuccess(state, action) {
      const { payload: {
        photo,
        inforList: { resultData: inforData = EMPTY_ARRAY },
        jjCompanyList: { resultData: jjCompanyData = EMPTY_ARRAY },
      } } = action;
      const sqjjzhs = inforData[0].sqjjzh.split(';');
      const ids = _.map(jjCompanyData, 'id');
      const sqjjzhNote = [];
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < sqjjzhs.length; j++) {
          if (`${sqjjzhs[j]}` === `${ids[i]}`) {
            sqjjzhNote.push(jjCompanyData[i].jjgsqc);
          }
        }
      }
      const sqjjzhNoteN = sqjjzhNote.join(';');
      inforData[0].sqjjzh = sqjjzhNoteN;
      inforData[0].khzpImg = photo;
      return {
        ...state,
        inforData: inforData[0],
      };
    },
    getFormInfoSuccess(state, action) {
      const { payload: {
        countryList: { resultData: countryInfo = EMPTY_ARRAY },
        provinceList: { resultData: provinceInfo = EMPTY_ARRAY },
        cityList: { resultData: cityInfo = EMPTY_ARRAY },
        accountTmpList: { resultData: accountTmpInfo = EMPTY_ARRAY },
        bankList: { resultData: bankInfo = EMPTY_ARRAY },
        fundCompanyList: { resultData: fundCompanyInfo = EMPTY_ARRAY },
        mealList: { resultData: mealInfo = EMPTY_ARRAY },
      } } = action;
      return {
        ...state,
        countryInfo,
        provinceInfo,
        cityInfo,
        accountTmpInfo,
        bankInfo,
        fundCompanyInfo,
        mealInfo,
      };
    },
    getCityInfoSuccess(state, action) {
      const { payload: { cityList: { resultData = EMPTY_ARRAY } } } = action;
      return {
        ...state,
        cityInfo: resultData,
      };
    },
    getCerCodeSuccess(state, action) {
      const { payload: { cerCode: { code = '', resultData = '' }, callback } } = action;
      if (code === '0') {
        alert(resultData); // eslint-disable-line
        callback.call();
      }
      return {
        ...state,
      };
    },
    checkCerCodeSuccess(state, action) {
      const { payload: { checkCode: { code = '' }, failBack, sucBack } } = action;
      if (code !== '0') {
        failBack.call();
      } else {
        sucBack.call();
      }
      return {
        ...state,
      };
    },
    checkMealSuccess(state, action) {
      const { payload: { checkCode: { code = '', msg = '' }, failBack, sucBack } } = action;
      if (code !== '0') {
        failBack.call(this, msg);
      } else {
        sucBack.call();
      }
      return {
        ...state,
      };
    },
    getCSDCReturnSuccess(state, action) {
      const { payload: { csdcList: { resultData = EMPTY_ARRAY } } } = action;
      return {
        ...state,
        returnInfo: resultData,
      };
    },
    changeStepIndex(state, action) {
      const { payload: { index } } = action;
      return {
        ...state,
        stepIndex: index,
      };
    },
    saveImgQuerySuccess(state, action) {
      const { payload: {
        query,
        result: { resultData = EMPTY_ARRAY },
      } } = action;
      return {
        ...state,
        imgBase64str: query.base64str,
        imgFilepath: resultData[0].filepath,
      };
    },
    getImgQuerySuccess(state, action) {
      const { payload: { result: { resultData = EMPTY_ARRAY } } } = action;
      return {
        ...state,
        imgBase64str: resultData[0].o_base64str,
      };
    },
  },
  effects: {
    /*
     * 获取表单ID
     * */
    * getBdid({ payload: query }, { call, put }) {
      const bdidQuery = yield call(api.getBdid, query);
      const bdid = bdidQuery.resultData[0].o_lsh.toString();
      const key = query.key;
      const value = query.value;
      const stepCacheData = yield call(api.getStepCacheQuery, { bdid, key: null });
      const response = yield call(api.saveStepCache, { key, bdid, value });
      yield put({
        type: 'saveBdid',
        payload: {
          bdid,
        },
      });
      yield put({
        type: 'getStepCacheSucess',
        payload: {
          stepCacheData,
        },
      });
      yield put({
        type: 'changeStepcache',
        payload: {
          query,
        },
      });
      yield put({
        type: 'changeMenuState',
        payload: {
          index: 1,
          response,
        },
      });
      query.stepCallback.call();
    },
    /*
     * 查询步骤缓存
     * */
    * getStepCache({ payload: query }, { call, put }) {
      const { bdid, key } = query;
      const stepCacheData = yield call(api.getStepCacheQuery, { bdid, key });
      let sLength = (stepCacheData.resultData.length < menus.length) ?
        stepCacheData.resultData.length :
        (menus.length - 1);
      const obj = _.find(stepCacheData.resultData, { key: 'ZLTX' });
      if (obj && obj.value) {
        const valueObj = JSON.parse(obj.value);
        if (!valueObj.CGYH) {
          sLength = stepCacheData.resultData.length - 1;
        }
      }
      let step = menus[sLength].key;
      if (query.returnChange) {
        sLength = -1;
        step = 'identity';
        const returnObj = _.find(stepCacheData.resultData, { key: 'THZG' });
        if (returnObj && returnObj.value) {
          const reValueObj = JSON.parse(returnObj.value);
          sLength = reValueObj.index;
        }
      }
      yield put({
        type: 'saveBdid',
        payload: {
          bdid: query.bdid,
        },
      });
      yield put({
        type: 'getStepCacheSucess',
        payload: {
          stepCacheData,
        },
      });
      yield put({
        type: 'changeMenuState',
        payload: {
          index: sLength,
        },
      });
      if (!query.see) {
        sessionStorage.setItem('step', step);
        if (query.stepCallback) {
          query.stepCallback.call();
        }
      }
    },
    /*
     * 保存步骤缓存
     * */
    * saveStepCache({ payload: query }, { call, put }) {
      if (query.key === 'KHTJ') { // 最后一步申请提交
        yield call(api.saveOpenAccount, {
          bdid: query.bdid,
          jsonstr: JSON.stringify(query.value),
        });
      } else if (query.key === 'THTJ') { // 退回重新提交
        yield call(api.saveStepCache, {
          bdid: query.bdid,
          key: 'THZG',
          value: '',
        });
        yield call(api.saveStopOpenAccount, {
          bdid: query.bdid,
          jsonstr: query.value,
        });
      } else { // 其他的步骤缓存
        const menuObj = _.find(menus, { cacheKey: query.key });
        const thisIndex = _.findIndex(menus, menuObj);
        let response = {};
        if (query.key === 'FXCP') { // 风险测评提交
          const fxcpValue = JSON.parse(query.value);
          const fxcpQuery = _.assign(query, { value: JSON.stringify(fxcpValue.stepValue) });
          response = yield call(api.saveQuestionResult, { queryxml: fxcpValue.xmlValue }); // 提交
          response = yield call(api.saveStepCache, fxcpQuery);  // 风险测评保存步骤缓存
        } else { // 其他页面保存步骤缓存
          response = yield call(api.saveStepCache, query);
        }
        if (query.returnValue) { // 退回整改保存步骤
          response = yield call(api.saveStepCache, {
            bdid: query.bdid,
            key: 'THZG',
            value: query.returnValue,
          });
        }
        yield put({
          type: 'changeStepcache',
          payload: {
            query,
          },
        });
        if (!query.callback) {
          yield put({
            type: 'changeMenuState',
            payload: {
              index: thisIndex + 1,
              response,
            },
          });
        }
      }
      if (!query.callback) {
        query.stepCallback.call();
      }
      if (query.callback) {
        query.callback.call();
      }
    },
    /*
     * 获取投资者教育列表
     * */
    * getInvestList({ payload: query }, { call, put }) {
      const status = query.status;
      const investList = yield call(api.getInvestList, { jgbz: 0 });
      if (status) {
        yield put({
          type: 'setInvestReadFlag',
          payload: {
            flag: true,
          },
        });
      }
      yield put({
        type: 'getInvestListSuccess',
        payload: {
          investList,
        },
      });
    },
    /*
    * 获取开户影像资料列表
    * */
    * getImageList({ payload: query }, { call, put }) {
      const returnObj = _.find(query.stepData, { key: 'THZG' });
      const imageList = yield call(api.getImageList, { bdid: query.bdid });
      // if (returnObj && JSON.parse(returnObj.value).key === 'YXSM') { // 退回整改已经修改过部分
      //   yield put({
      //     type: 'setImageList',
      //     payload: {
      //       lists: JSON.parse(returnObj.value).imageList,
      //     },
      //   });
      // }
      yield put({
        type: 'getImageListSuccess',
        payload: {
          imageList,
          imageArr: query.valueInfo, // 步骤缓存里影像扫描的arr
          returnOpinion: returnObj, // 步骤缓存里退回整改的obj
        },
      });
    },
    /*
    * 获取见证人信息
    * */
    * witnessLogin({ payload: query }, { call, put }) {
      const witnessInfo = yield call(api.witnessLogin, query);
      let photoResult = {
        resultData: {},
      };
      if (witnessInfo.resultData && witnessInfo.resultData.zpid) {
        photoResult = yield call(api.getEmpPhoto, { id: witnessInfo.resultData.zpid });
      }
      yield put({
        type: 'witnessLoginSuccess',
        payload: {
          witnessInfo,
          photoResult,
        },
      });
    },
    * getQuestion({ payload: query }, { call, put }) {
      const question = yield call(api.getQuestion, query.param);
      const inforQuery = yield call(api.getInforQuery, {
        flag: 1,
        sqid: query.bdidValue,
        gyid: null,
        sj: null,
        zjbh: null,
        zjlb: null,
        step: null,
        jgbz: null,
        ksrq: null,
        jsrq: null,
        khfs: null,
        cxnr: null,
      });
      yield put({
        type: 'getQuestionSuccess',
        payload: {
          question,
          age: query.age,
          inforQuery: inforQuery.resultData[0],
        },
      });
    },
    * getQuestionResult({ payload: query }, { call, put }) {
      const result = yield call(api.getQuestionResult, query);
      yield put({
        type: 'getQuestionResultSuccess',
        payload: {
          result,
        },
      });
    },
    /*
    * 公安网 身份核查
    * */
    * getVeriResult({ payload: query }, { call, put }) {
      const response = yield call(api.getVeriResult, query);
      const id = response.resultData[0].o_id;
      const flag = response.resultData[0].o_flag;
      const khqc = query.khxm;
      const { yyb, zjbh, zjlb } = query;
      let veriResultQuery;
      let callStep;
      let openAccCheckQuery = {
        resultData: [{}],
      };
      if (flag === 1) {
        veriResultQuery = response;
        callStep = true;
        openAccCheckQuery = yield call(api.openAccCheck, { zjlb, zjbh, khqc, yyb });
      } else {
        callStep = false;
        veriResultQuery = yield call(api.getVeriResultData, { id });
        for (let i = 0; i < 3; i++) {
          if (veriResultQuery &&
            veriResultQuery.resultData[0].cljg !== 0 &&
            veriResultQuery.resultData[0].csrq) {
            if (veriResultQuery && veriResultQuery.resultData[0].cljg === 1) {
              openAccCheckQuery = yield call(api.openAccCheck, { zjlb, zjbh, khqc, yyb });
            }
            break;
          } else {
            veriResultQuery = yield call(api.getVeriResultData, { id });
          }
        }
      }
      const photoQuery = yield call(api.getShipPhoto, { id });
      yield put({
        type: 'getVeriResultSuccess',
        payload: {
          veriResultQuery,
          openAccCheckQuery,
          callStep,
          photoQuery,
        },
      });
    },
    /*
    * 是否开户 身份证 人工核查
    * */
    * openAccCheck({ payload: query }, { call, put }) {
      const openAccCheckQuery = yield call(api.openAccCheck, query);
      yield put({
        type: 'openAccCheckSuccess',
        payload: {
          openAccCheckQuery,
          tabIndex: query.tabIndex,
        },
      });
    },
    /*
    * 一码通 查询
    * */
    * getNumQuery({ payload: query }, { call, put }) {
      const responseQuery = yield call(api.getSqbh, query);
      const sqbh = responseQuery.resultData[0].o_sqbh;
      let numQueryQuery = yield call(api.getNumQueryReturn, { sqbh });
      for (let i = 0; i < 12; i++) {
        if (numQueryQuery.resultData[0].clbz === 3 || numQueryQuery.resultData[0].clbz === 4) {
          break;
        } else {
          numQueryQuery = yield call(api.getNumQueryReturn, { sqbh });
        }
      }
      yield put({
        type: 'getNumQuerySuccess',
        payload: {
          query,
          responseQuery,
          numQueryQuery,
        },
      });
    },
    * getNumQueryReturn({ payload: query }, { call, put }) {
      const sqbh = query.sqbh;
      let numQuery = yield call(api.getNumQueryReturn, { sqbh });
      for (let i = 0; i < 5; i++) {
        if (numQuery.resultData[0].clbz === 3 || numQuery.resultData[0].clbz === 4) {
          break;
        } else {
          numQuery = yield call(api.getNumQueryReturn, { sqbh });
        }
      }
      yield put({
        type: 'getNumQueryReturnSuccess',
        payload: {
          numQuery,
        },
      });
    },
    /*
    * 查询开户申请
    * */
    * getInforQuery({ payload: query }, { call, put }) {
      const [
        inforList,
        jjCompanyList,
      ] = yield [
        yield call(api.getInforQuery, query),
        yield call(api.getFundCompany, query),
      ];
      const filepath = inforList.resultData[0].khzp;
      // const filepath = 'Aw4wMjI0MTEyNTIwMTc0MDkwMDAuMzYzMTgxMjI0MQ==';
      let photo;
      if (filepath) {
        const photoQuery = yield call(api.getImgQuery, { filepath });
        photo = photoQuery.resultData[0].o_base64str;
      } else {
        photo = '';
      }
      yield put({
        type: 'getInforQuerySuccess',
        payload: {
          inforList,
          jjCompanyList,
          photo,
        },
      });
    },
    * getFormInfo({ payload: query }, { call, put }) {
      const [
        countryList,
        provinceList,
        cityList,
        accountTmpList,
        bankList,
        fundCompanyList,
        mealList,
      ] = yield [
        call(api.getCountryInfo, { gjdm: null }),
        call(api.getProvinceInfo, { sfdm: null }),
        call(api.getCityInfo, { sjdm: '110000' }),
        call(api.getOpenAccountTemplate, {
          yyb: 1,
          khfs: 4,
          jgbz: 0,
          zcsx: 0,
        }),
        call(api.getBank, { cgbz: 1 }),
        call(api.getFundCompany, { jjgsdm: null }),
        call(api.getMeal, { yyb: 1, fldm: 'GT_YJTC' }),
      ];
      yield put({
        type: 'getFormInfoSuccess',
        payload: {
          countryList,
          provinceList,
          cityList,
          accountTmpList,
          bankList,
          fundCompanyList,
          mealList,
        },
      });
    },
    * getCityInfo({ payload: {
      sjdm = '110000',
    } }, { call, put }) {
      const cityList = yield call(api.getCityInfo, { sjdm });
      yield put({
        type: 'getCityInfoSuccess',
        payload: {
          cityList,
        },
      });
    },
    * getCerCode({ payload: query }, { call, put }) {
      const cerCode = yield call(api.getCerCode, {
        mobile: query.mobile,
        yyb: query.yyb,
      });
      yield put({
        type: 'getCerCodeSuccess',
        payload: {
          cerCode,
          callback: query.callback,
        },
      });
    },
    * checkCerCode({ payload: query }, { call, put }) {
      const checkCode = yield call(api.checkCerCode, {
        mobile: query.mobile,
        code: query.code,
      });
      yield put({
        type: 'checkCerCodeSuccess',
        payload: {
          checkCode,
          failBack: query.failBack,
          sucBack: query.sucBack,
        },
      });
    },
    // 佣金套餐检验
    * checkMeal({ payload: query }, { call, put }) {
      const checkCode = yield call(api.checkMeal, {
        yyb: query.yyb,
        productCode: query.productCode,
      });
      yield put({
        type: 'checkMealSuccess',
        payload: {
          checkCode,
          failBack: query.failBack,
          sucBack: query.sucBack,
        },
      });
    },
    * getCSDCReturn({ payload: query }, { call, put }) {
      let loop = 0;
      let csdcList;
      const { empInforData, stepObj } = query;
      const stepInfo = JSON.parse(stepObj.value || null) || {};
      const codeList = yield call(api.getSqbh, {
        sqgy: empInforData.id || '',
        cxfs: 1,
        khxm: stepInfo.KHXM || '',
        zjlb: stepInfo.ZJLB || '',
        zjbh: stepInfo.ZJBH || '',
        khh: '',
      });
      const { resultData: codeInfo = EMPTY_ARRAY } = codeList;
      while (loop <= LOOP_NUM) {
        let returnList = [];
        if (codeInfo[0]) {
          returnList = yield call(api.getCSDC, { sqbh: codeInfo[0].o_sqbh });
          const { resultData: returnInfo = EMPTY_ARRAY } = returnList;
          if (returnInfo[0] && returnInfo[0].clbz === 3) {
            loop = LOOP_NUM;
          }
        }
        loop++;
        csdcList = returnList;
      }
      yield put({
        type: 'getCSDCReturnSuccess',
        payload: {
          csdcList,
        },
      });
    },
    /*
    * 上传影像
    * */
    * saveImgQuery({ payload: query }, { call, put }) {
      const result = yield call(api.saveImgQuery, query);
      yield put({
        type: 'saveImgQuerySuccess',
        payload: {
          query,
          result,
        },
      });
    },
    /*
    * 下载影像
    * */
    * getImgQuery({ payload: query }, { call, put }) {
      const result = yield call(api.getImgQuery, query);
      yield put({
        type: 'getImgQuerySuccess',
        payload: {
          result,
        },
      });
    },
    /*
    * 获取退回整改信息
    * */
    * getReturnOpinion({ payload: query }, { call, put }) {
      const returnOpinion = yield call(api.getReturnOpinion, query);
      yield put({
        type: 'getReturnOpinionSuccess',
        payload: {
          returnOpinion,
        },
      });
    },
    /*
    * 退回重新提交
    * */
    * saveStopOpenAccount({ payload: query }, { call }) {
      yield call(api.saveStopOpenAccount, query);
    },
  },
  subscriptions: {},
};
