/**
 * @file personAccount/InfoForm.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Steps } from 'antd';
import _ from 'lodash';

import FormStyle from './infoForm.less';
import InfoFormOne from '../../components/personAccount/InfoFormOne';
import InfoFormTwo from '../../components/personAccount/InfoFormTwo';
import InfoFormThird from '../../components/personAccount/InfoFormThird';
import InfoFormForth from '../../components/personAccount/InfoFormForth';
import InfoFormFifth from '../../components/personAccount/InfoFormFifth';
import InfoFormSixth from '../../components/personAccount/InfoFormSixth';

const Step = Steps.Step;

export default class InfoForm extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object,
    countryInfo: PropTypes.array,
    provinceInfo: PropTypes.array,
    cityInfo: PropTypes.array,
    accountTmpInfo: PropTypes.array,
    bankInfo: PropTypes.array,
    fundCompanyInfo: PropTypes.array,
    mealInfo: PropTypes.array,
    getCityInfoFunc: PropTypes.func.isRequired,
    getCSDCReturnFunc: PropTypes.func.isRequired,
    dicData: PropTypes.object,
    empInforData: PropTypes.object,
    returnInfo: PropTypes.array,
    bdid: PropTypes.string.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getCerCodeFunc: PropTypes.func.isRequired,
    checkCerCodeFunc: PropTypes.func.isRequired,
    changeStepIndexFunc: PropTypes.func.isRequired,
    stepIndex: PropTypes.number.isRequired,
    changePopState: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
    checkMealFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    form: {},
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
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    const { stepCacheData, changeStepIndexFunc, stepIndex, returnOpinion } = this.props;
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
    changeStepIndexFunc({
      index: stepNumber,
    });
  }

  // 表单控制
  handleFormShow(step, form1, form2, form3, form4, form5, form6) {
    if (step === 0) {
      return form1;
    } else if (step === 1) {
      return form2;
    } else if (step === 2) {
      return form3;
    } else if (step === 3) {
      return form4;
    } else if (step === 4) {
      return form5;
    } else if (step === 5) {
      return form6;
    }
    return <div>empty!!!!!!!!!</div>;
  }

  @autobind
  stepOneClick() {
    this.handleStepClick(0);
  }

  @autobind
  stepTwoClick() {
    this.handleStepClick(1);
  }

  @autobind
  stepThreeClick() {
    this.handleStepClick(2);
  }

  @autobind
  stepFourClick() {
    this.handleStepClick(3);
  }

  @autobind
  stepFiveClick() {
    this.handleStepClick(4);
  }

  @autobind
  stepSixClick() {
    this.handleStepClick(5);
  }

  @autobind
  handleStepClick(index) {
    const { changePopState, changeStepIndexFunc, stepIndex } = this.props;
    if (index >= stepIndex) {
      return;
    }
    changePopState({
      popType: 'menuJump',
      popShow: true,
      callback: () => {
        changeStepIndexFunc({
          index,
        });
      },
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
      changeStepIndexFunc,
      stepIndex,
      returnOpinion,
      checkMealFunc,
    } = this.props;
    const FormOne = (
      <InfoFormOne
        replace={replace}
        push={push}
        location={location}
        dicData={dicData}
        accountTmpInfo={accountTmpInfo}
        empInforData={empInforData}
        bdid={bdid}
        stepCacheData={stepCacheData}
        saveStepFunc={saveStepFunc}
        changeStepIndexFunc={changeStepIndexFunc}
        returnOpinion={returnOpinion}
      />
    );
    const FormTwo = (
      <InfoFormTwo
        replace={replace}
        push={push}
        location={location}
        provinceInfo={provinceInfo}
        cityInfo={cityInfo}
        getCityInfoFunc={getCityInfoFunc}
        dicData={dicData}
        empInforData={empInforData}
        bdid={bdid}
        stepCacheData={stepCacheData}
        saveStepFunc={saveStepFunc}
        getCerCodeFunc={getCerCodeFunc}
        checkCerCodeFunc={checkCerCodeFunc}
        changeStepIndexFunc={changeStepIndexFunc}
        returnOpinion={returnOpinion}
      />
    );
    const FormThird = (
      <InfoFormThird
        replace={replace}
        push={push}
        location={location}
        countryInfo={countryInfo}
        dicData={dicData}
        empInforData={empInforData}
        bdid={bdid}
        stepCacheData={stepCacheData}
        saveStepFunc={saveStepFunc}
        changeStepIndexFunc={changeStepIndexFunc}
        returnOpinion={returnOpinion}
      />
    );
    const FormForth = (
      <InfoFormForth
        replace={replace}
        push={push}
        location={location}
        mealInfo={mealInfo}
        getCSDCReturnFunc={getCSDCReturnFunc}
        dicData={dicData}
        empInforData={empInforData}
        returnInfo={returnInfo}
        bdid={bdid}
        stepCacheData={stepCacheData}
        saveStepFunc={saveStepFunc}
        changeStepIndexFunc={changeStepIndexFunc}
        returnOpinion={returnOpinion}
        checkMealFunc={checkMealFunc}
      />
    );
    const FormFifth = (
      <InfoFormFifth
        replace={replace}
        push={push}
        location={location}
        bankInfo={bankInfo}
        fundCompanyInfo={fundCompanyInfo}
        dicData={dicData}
        empInforData={empInforData}
        bdid={bdid}
        stepCacheData={stepCacheData}
        saveStepFunc={saveStepFunc}
        returnOpinion={returnOpinion}
      />
    );
    const FormSixth = (
      <InfoFormSixth
        replace={replace}
        push={push}
        location={location}
        dicData={dicData}
        empInforData={empInforData}
        bdid={bdid}
        stepCacheData={stepCacheData}
        saveStepFunc={saveStepFunc}
        changeStepIndexFunc={changeStepIndexFunc}
        returnOpinion={returnOpinion}
      />
    );
    return (
      <div id="infoForm">
        <div className={FormStyle.stepWrapper}>
          <Steps current={stepIndex}>
            <Step onClick={this.stepOneClick} />
            <Step onClick={this.stepTwoClick} />
            <Step onClick={this.stepThreeClick} />
            <Step onClick={this.stepFourClick} />
            <Step onClick={this.stepFiveClick} />
            <Step onClick={this.stepSixClick} />
          </Steps>
        </div>
        {this.handleFormShow(
          stepIndex,
          FormOne,
          FormSixth,
          FormTwo,
          FormThird,
          FormForth,
          FormFifth,
        )}
      </div>
    );
  }
}
