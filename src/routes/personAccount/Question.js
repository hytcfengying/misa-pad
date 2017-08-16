/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './homeGlobal.less';
// import CenterHeader from '../../components/mission/CenterHeader';
import Question from '../../components/personAccount/Question';
import QuestionResult from '../../components/personAccount/QuestionResult';
import MenuLeft from '../../components/identity/menuLeft';
import NextPop from '../../components/personAccount/nextPop';

const { Sider, Content } = Layout;

const getBdid = loading => query => ({
  type: 'personAccount/getBdid',
  payload: query || {},
  loading,
});
const saveStep = loading => query => ({
  type: 'personAccount/saveStepCache',
  payload: query || {},
  loading,
});

const getQuestion = loading => query => ({
  type: 'personAccount/getQuestion',
  payload: query || {},
  loading,
});

const getQuestionResult = loading => query => ({
  type: 'personAccount/getQuestionResult',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  stepCacheData: state.personAccount.stepCacheData,
  bdid: state.personAccount.bdid,
  menuState: state.personAccount.menuState,
  popState: state.globalData.popState,
  question: state.personAccount.question,
  questionState: state.personAccount.questionState,
  questionResult: state.personAccount.questionResult,
  accountPersonAge: state.personAccount.accountPersonAge,
  customerNumber: state.personAccount.customerNumber,
});

const mapDispatchToProps = {
  getQuestionFunc: getQuestion(true),
  getQuestionResultFunc: getQuestionResult(true),
  push: routerRedux.push,
  replace: routerRedux.replace,
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  setQuestionState: query => ({
    type: 'personAccount/setQuestionState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class questionRoutes extends PureComponent {

  static propTypes = {
    globalLoading: PropTypes.bool,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    menuState: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    question: PropTypes.array.isRequired,
    getQuestionFunc: PropTypes.func.isRequired,
    setQuestionState: PropTypes.func.isRequired,
    questionState: PropTypes.string.isRequired,
    getQuestionResultFunc: PropTypes.func.isRequired,
    questionResult: PropTypes.object.isRequired,
    customerNumber: PropTypes.string.isRequired,
    // accountPersonAge: PropTypes.number.isRequired,
  }

  static defaultProps = {
    list: [],
    globalLoading: false,
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      valueState: 0,
      accessState: _.find(props.stepCacheData, { key: 'FXCP' }) || false,
      cacheKey: 'FXCP',
    };
  }

  componentWillMount() {
    const { getQuestionFunc, bdid } = this.props;
    getQuestionFunc({
      param: {
        wjbm: 'FXCSNL',
        jgbz: '0',
      },
      bdidValue: bdid,
      age: this.getAgeChoice(),
    });
  }
  componentWillReceiveProps(nextProps) {
    const {
      question,
      questionState,
      getQuestionResultFunc,
      questionResult,
    } = nextProps;
    if (this.props.questionState !== questionState) {
      let flag = true;
      const list = [];
      question.forEach((item) => {
        // 判断答案完成的状态
        if (!item.selectState) {
          flag = false;
        } else {
          list.push({
            attribId: item[`${item.choice}_obj`].crmtmbm,
            comment: '',
            valueId: item[`${item.choice}_obj`].crmdabm,
          });
        }
      });
      if (flag) {
        getQuestionResultFunc({
          customerNumber: this.props.customerNumber,
          templateId: question[0].A_obj.crmwjbm,
          valueList: list,
        });
        this.setState({
          accessState: true,
        });
      }
    }
    if (_.isEmpty(this.props.questionResult) && !_.isEmpty(questionResult)) {
      this.setState({
        valueState: this.state.valueState++,
      });
    }
  }
  @autobind
  getStepValue() {
    const { accessState } = this.state;
    const { question, questionResult, customerNumber } = this.props;
    let result = '';
    if (accessState && question.length > 0) {
      const crmtmbm = [];
      const tmdac = [];
      const xmlArr = [];
      question.forEach((item) => {
        const crmtmbmValue = item[`${item.choice}_obj`].crmtmbm;
        const answerValue = item[`${item.choice}_obj`].crmdabm;
        crmtmbm.push(crmtmbmValue);
        tmdac.push(`${item.qid}|${item.choice}`);
        xmlArr.push(`<ActionAssessmentValue><Attrib_id>${crmtmbmValue}</Attrib_id><Value_Id>${answerValue}</Value_Id><Comment></Comment></ActionAssessmentValue>`);
      });
      // 保存步骤缓存所需数据
      const value = {
        CRMTMDAC: crmtmbm.join('|'),
        CRMWJID: question[0].A_obj.crmwjbm,
        FXPCLX: questionResult.FXPCLX,
        FXPCLXSM: questionResult.FXPCLXSM,
        FXPCLXVALUE: questionResult.FXPCLXVALUE,
        TMDAC: tmdac.join(';'),
        TZPZ: questionResult.TZPZ,
        TZPZVALUE: questionResult.TZPZVALUE,
        TZQX: questionResult.TZQX,
        TZQXSM: questionResult.TZQXSM,
        TZQXVALUE: questionResult.TZQXVALUE,
        WJID: question[0].A_obj.wjid,
      };
      // 最后提交
      const xml = `<web_modification action='insert_assessment' source='102260'><customer><customer_num>${customerNumber}</customer_num><customer_num_type>102010</customer_num_type><ActionAssessment_Type>风险评估</ActionAssessment_Type><ActionAssessment><Template_Id>${question[0].A_obj.crmwjbm}</Template_Id><Description></Description>${xmlArr.join('')}</ActionAssessment></customer></web_modification>`;
      console.log(xml);
      result = JSON.stringify({
        stepValue: value,
        xmlValue: xml.toString(),
      });
    }
    return result;
  }
  @autobind
  getAgeChoice() {
    const { stepCacheData } = this.props;
    const accountPersonAge = this.isAge(JSON.parse(_.find(stepCacheData, { key: 'SFYZ' }).value).CSRQ);
    let answer = '';
    if (accountPersonAge < 31 && accountPersonAge > 18) {
      answer = 'A';
    }
    if (accountPersonAge < 41 && accountPersonAge > 30) {
      answer = 'B';
    }
    if (accountPersonAge < 51 && accountPersonAge > 40) {
      answer = 'C';
    }
    if (accountPersonAge < 61 && accountPersonAge > 50) {
      answer = 'D';
    }
    if (accountPersonAge < 19 || accountPersonAge > 60) {
      answer = 'E';
    }
    console.log(answer);
    return answer;
  }
  // 判断出生日期,计算年龄
  @autobind
  isAge(date) {
    const y = parseInt(date.substring(0, 4), 10);
    const m = parseInt(date.substring(4, 6), 10) - 1;
    const d = parseInt(date.substring(6, 8), 10);
    const nowday = new Date();
    const birthday = new Date(y, m, d);
    const age = nowday.getFullYear() - birthday.getFullYear() -
      ((nowday.getMonth() < birthday.getMonth()) ||
      (nowday.getMonth() === birthday.getMonth() && nowday.getDate() < birthday.getDate()) ?
        1 : 0);
    console.log(age);
    return age;
  }

  render() {
    const {
      push,
      location,
      getBdidFunc,
      saveStepFunc,
      bdid,
      menuState,
      popState,
      changePopState,
      question,
      setQuestionState,
      questionState,
      stepCacheData,
      questionResult,
    } = this.props;
    const {
      accessState,
      cacheKey,
    } = this.state;
    const value = this.getStepValue();
    const stepObj = _.find(stepCacheData, { key: 'FXCP' });
    return (
      <div className={styles.homeGlobal}>
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
            <Content>
              <section >
                <Question
                  list={question}
                  setQuestionState={setQuestionState}
                />
                <QuestionResult
                  list={question}
                  questionState={questionState}
                  finishState={accessState}
                  questionResult={questionResult}
                  stepCacheData={stepCacheData}
                  question={question}
                />
              </section>
              <NextPop
                accessState={accessState}
                push={push}
                cacheKey={cacheKey}
                location={location}
                stepValue={value}
                getBdidFunc={getBdidFunc}
                saveStepFunc={saveStepFunc}
                bdid={bdid}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
