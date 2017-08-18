import apiCreator from '../utils/apiCreator';

const api = apiCreator();

export default {

  // 暴露api上的几个底层方法: get / post
  ...api,

  // 获取开户申请ID
  getBdid: query => api.post('/groovynoauth/cif/OpenAcc/cifSaveOpenAccSerialNo', query),

  // 步骤缓存
  saveStepCache: query => api.post('/groovynoauth/cif/OpenAcc/cifSaveOpenAccStepCache', query),

  // 申请提交
  saveOpenAccount: query => api.post('/groovynoauth/cif/OpenAcc/cifSaveOpenAccount', query),

  // 退回重新提交
  saveStopOpenAccount: query => api.post('/groovynoauth/cif/OpenAcc/cifSaveOpenAccountReturn', query),

  // 查询步骤缓存
  getStepCacheQuery: query => api.post('/groovynoauth/cif/OpenAcc/cifQueryOpenAccStepCache', query),

  // 获取搜索列表
  getsearchList: query => api.post('/groovynoauth/cif/ClientAccount/cifQueryClientInfo', query),

  // 获取投资者协议列表
  getInvestList: query => api.post('/groovynoauth/cif/OpenAcc/cifQueryInvestorEdu', query),

  // 获取投资者协议详情
  getInvestDetail: query => api.post('/personAccount/investDetail', query),

  // 获取风险测评题目列表
  getQuestion: query => api.post('/groovynoauth/cif/SysConfig/cifQueryQuestionnaire', query),

  // 获取风险测评结果
  getQuestionResult: query => api.post('/groovynoauth/cif/Risk/cifRiskQuery', query),

  // 风险测评结果提交
  saveQuestionResult: query => api.post('/groovynoauth/cif/OpenAcc/cifInsertAssessPort', query),

  // 获取镜像影音列表
  getImageList: query => api.post('/groovynoauth/cif/OpenAcc/cifQueryOpenAccImage', query),

  // 见证人登陆
  witnessLogin: query => api.post('/doublewitness/checkQuery', query),

  // 核查 公安网核查申请
  getVeriResult: query => api.post('/groovynoauth/cif/Citizenship/cifSaveCitizenshipcheck', query),

  // 公民身份照片
  getShipPhoto: query => api.post('/groovynoauth/cif/Citizenship/cifGetCitizenshipPhoto', query),

  // 公安网核查结果
  getVeriResultData: query => api.post('/groovynoauth/cif/Citizenship/cifQueryCitizenship', query),

  // 核查结果 人工核查 是否允许开户
  openAccCheck: query => api.post('/groovynoauth/cif/OpenAcc/cifQueryOpenAccCheck', query),

  // 一码通号码查询
  getNumQuery: query => api.post('/groovynoauth/cif/CSDC/cifAddQueryCSDCAcodeAcc', query),

  // 证券账户查询
  getStockQuery: query => api.post('/groovynoauth/cif/CSDC/cifAddQueryCSDCStockAcc', query),

  // 关联关系查询
  getRelationQuery: query => api.post('/groovynoauth/cif/CSDC/cifAddQueryCSDCRelation', query),

  // 使用信息查询
  getInfoQuery: query => api.post('/groovynoauth/cif/CSDC/cifAddQueryCSDCUseInfo', query),

  // 使用信息查询
  getPartnerQuery: query => api.post('/groovynoauth/cif/CSDC/cifAddQueryCSDCPartner', query),

  // 一码通号码查询 中登回报
  getNumQueryReturn: query => api.post('/groovynoauth/cif/CSDC/cifQueryCSDCReturn', query),

  // 信息确认 查询开户申请
  getInforQuery: query => api.post('/groovynoauth/cif/OpenAcc/cifQueryOpenAccount', query),

  // 上传影像
  saveImgQuery: query => api.post('/groovynoauth/cif/VideoImage/cifUploadImage', query),

  // 下载影像
  getImgQuery: query => api.post('/groovynoauth/cif/VideoImage/cifDownloadImage', query),

  // 获取xx详情
  getDetail: query => api.post('/test/detail', query),

  // 保存xx详情
  saveDetail: query => api.post('/test/saveDetail', query),

  // 获得数据字典
  getDicData: query => api.post('/groovynoauth/cif/Dictionary/cifSysDictionary', query),

  // 获得员工信息
  getEmpInfo: query => api.post('/groovynoauth/cif/EmpInfo/cifQueryEmpInfo', query),

  // 获得员工头像
  getEmpPhoto: query => api.post('/groovynoauth/cif/EmpInfo/cifGetEmpPhoto', query),

  // 查询国家讯息
  getCountryInfo: query => api.post('/groovynoauth/cif/Dictionary/cifQueryCountry', query),

  // 查询省份信息
  getProvinceInfo: query => api.post('/groovynoauth/cif/Dictionary/cifQueryProvince', query),

  // 查询城市信息
  getCityInfo: query => api.post('/groovynoauth/cif/Dictionary/cifQueryCity', query),

  // 查询开户模板
  getOpenAccountTemplate: query => api.post('/groovynoauth/cif/SysConfig/cifQueryOpenAccountTemplate', query),

  // 查询存管银行
  getBank: query => api.post('/groovynoauth/cif/SysConfig/cifQueryBank', query),

  // 查询基金公司
  getFundCompany: query => api.post('/groovynoauth/cif/SysConfig/cifQueryFundCompany', query),

  // 查询佣金套餐
  getMeal: query => api.post('/groovynoauth/cif/Dictionary/cifQueryOrgDictionary', query),

  // 验证佣金套餐
  checkMeal: query => api.post('/groovynoauth/cif/OpenAcc/cifMinFeeCheck', query),

  // 证券账户查询申请
  getSqbh: query => api.post('/groovynoauth/cif/CSDC/cifAddQueryCSDCStockAcc', query),

  // 查询中登回报
  getCSDC: query => api.post('/groovynoauth/cif/CSDC/cifQueryCSDCReturn', query),

  // 获取验证码
  getCerCode: query => api.post('/mobile/sendUserSmsCode', query),

  // 校验验证码
  checkCerCode: query => api.post('/mobile/checkUserSmsCode', query),

  // 开户中止
  stopOpenAccount: query => api.post('/groovynoauth/cif/OpenAcc/cifStopOpenAccount', query),

  // 退回整改
  getReturnOpinion: query => api.post('/groovynoauth/cif/OpenAcc/cifQueryReturnOpinion', query),
};
