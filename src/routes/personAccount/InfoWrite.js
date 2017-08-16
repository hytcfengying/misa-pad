/**
 * @file personAccount/InfoWrite.js
 * @author fengwencong
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

import MenuLeft from '../../components/identity/menuLeft';
import InfoForm from '../../components/personAccount/InfoForm';
import infoStyle from './infoWrite.less';

const { Sider, Content } = Layout;
const formType = 'personAccount/getFormInfo';
const cityType = 'personAccount/getCityInfo';
const returnType = 'personAccount/getCSDCReturn';
const saveType = 'personAccount/saveStepCache';
const codeType = 'personAccount/getCerCode';
const checkType = 'personAccount/checkCerCode';
const stepType = 'personAccount/changeStepIndex';
const mealType = 'personAccount/checkMeal';

const getFormInfoFunction = loading => query => ({
  type: formType,
  payload: query || {},
  loading,
  show: query.show,
});

const getCityInfoFunction = loading => query => ({
  type: cityType,
  payload: query || {},
  loading,
});

const getCSDCReturnFunction = loading => query => ({
  type: returnType,
  payload: query || {},
  loading,
});

const saveStepFunction = loading => query => ({
  type: saveType,
  payload: query || {},
  loading,
});

const getCerCodeFunction = loading => query => ({
  type: codeType,
  payload: query || {},
  loading,
});

const checkCerCodeFunction = loading => query => ({
  type: checkType,
  payload: query || {},
  loading,
});

const changeStepIndexFunction = loading => query => ({
  type: stepType,
  payload: query || {},
  loading,
});

const checkMealFunction = loading => query => ({
  type: mealType,
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  countryInfo: state.personAccount.countryInfo,
  provinceInfo: state.personAccount.provinceInfo,
  cityInfo: state.personAccount.cityInfo,
  accountTmpInfo: state.personAccount.accountTmpInfo,
  bankInfo: state.personAccount.bankInfo,
  fundCompanyInfo: state.personAccount.fundCompanyInfo,
  mealInfo: state.personAccount.mealInfo,
  dicData: state.globalData.dicData,
  empInforData: state.globalData.empInforData,
  returnInfo: state.personAccount.returnInfo,
  bdid: state.personAccount.bdid,
  stepCacheData: state.personAccount.stepCacheData,
  menuState: state.personAccount.menuState,
  popState: state.globalData.popState,
  stepIndex: state.personAccount.stepIndex,
  returnOpinion: state.personAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getFormInfoFunc: getFormInfoFunction(true),
  getCityInfoFunc: getCityInfoFunction(true),
  getCSDCReturnFunc: getCSDCReturnFunction(true),
  saveStepFunc: saveStepFunction(true),
  getCerCodeFunc: getCerCodeFunction(true),
  checkCerCodeFunc: checkCerCodeFunction(true),
  changeStepIndexFunc: changeStepIndexFunction(true),
  checkMealFunc: checkMealFunction(true),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class InfoWrite extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    globalLoading: PropTypes.bool,
    countryInfo: PropTypes.array,
    provinceInfo: PropTypes.array,
    cityInfo: PropTypes.array,
    accountTmpInfo: PropTypes.array,
    bankInfo: PropTypes.array,
    fundCompanyInfo: PropTypes.array,
    mealInfo: PropTypes.array,
    getFormInfoFunc: PropTypes.func.isRequired,
    getCityInfoFunc: PropTypes.func.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    returnInfo: PropTypes.array,
    getCSDCReturnFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getCerCodeFunc: PropTypes.func.isRequired,
    checkCerCodeFunc: PropTypes.func.isRequired,
    checkMealFunc: PropTypes.func.isRequired,
    menuState: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    changeStepIndexFunc: PropTypes.func.isRequired,
    stepIndex: PropTypes.number.isRequired,
    returnOpinion: PropTypes.array,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
    countryInfo: [],
    provinceInfo: [],
    cityInfo: [],
    accountTmpInfo: [],
    bankInfo: [],
    fundCompanyInfo: [],
    mealInfo: [],
    dicData: {},
    empInforData: {},
    returnInfo: [],
    returnOpinion: [],
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    const {
      location: { query },
      empInforData,
      stepCacheData,
      stepIndex,
      returnOpinion,
      returnInfo,
    } = this.props;
    // 获取步骤缓存
    const stepForm = _.find(stepCacheData, { key: 'ZLTX' });
    const stepFormData = stepForm ?
      JSON.parse(stepForm.value || null) || {}
      : {};
    let stepNumber = stepFormData.formStep ? stepFormData.formStep + 1 : stepIndex;
    stepNumber = stepNumber > 5 ? 0 : stepNumber;
    if (!_.isEmpty(returnOpinion)) {
      stepNumber = 0;
    }
    this.props.getFormInfoFunc({
      ...query,
      empInforData,
      show: stepNumber === 4 && _.isEmpty(returnInfo),
    });
  }

  render() {
    const {
      replace,
      push,
      location,
      countryInfo,
      provinceInfo,
      cityInfo,
      accountTmpInfo,
      bankInfo,
      fundCompanyInfo,
      mealInfo,
      getCityInfoFunc,
      getCSDCReturnFunc,
      dicData,
      empInforData,
      returnInfo,
      bdid,
      stepCacheData,
      saveStepFunc,
      getCerCodeFunc,
      checkCerCodeFunc,
      menuState,
      popState,
      changePopState,
      changeStepIndexFunc,
      stepIndex,
      returnOpinion,
      checkMealFunc,
    } = this.props;
    const stepObj = _.find(stepCacheData, { key: 'ZLTX' });
    return (
      <div className={`${infoStyle.infoWrapper} ${infoStyle.homeGlobal}`}>
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
            <Content className={infoStyle.layContent}>
              <section className={infoStyle.infoSection} >
                <InfoForm
                  replace={replace}
                  push={push}
                  location={location}
                  countryInfo={countryInfo}
                  provinceInfo={provinceInfo}
                  cityInfo={cityInfo}
                  accountTmpInfo={accountTmpInfo}
                  bankInfo={bankInfo}
                  fundCompanyInfo={fundCompanyInfo}
                  mealInfo={mealInfo}
                  getCityInfoFunc={getCityInfoFunc}
                  getCSDCReturnFunc={getCSDCReturnFunc}
                  dicData={dicData}
                  empInforData={empInforData}
                  returnInfo={returnInfo}
                  bdid={bdid}
                  stepCacheData={stepCacheData}
                  saveStepFunc={saveStepFunc}
                  getCerCodeFunc={getCerCodeFunc}
                  checkCerCodeFunc={checkCerCodeFunc}
                  changeStepIndexFunc={changeStepIndexFunc}
                  stepIndex={stepIndex}
                  changePopState={changePopState}
                  returnOpinion={returnOpinion}
                  checkMealFunc={checkMealFunc}
                />
              </section>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
