/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import styles from './questionResult.less';

import BoxTitle from './BoxTitle';

export default class QuestionResult extends PureComponent {

  static propTypes = {
    list: PropTypes.array,
    finishState: PropTypes.bool.isRequired,
    questionState: PropTypes.string.isRequired,
    questionResult: PropTypes.object.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    question: PropTypes.array.isRequired,
  }

  static defaultProps = {
    list: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      questionState: props.questionState,
    };
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.questionState) {
      console.log(nextProps.questionState);
      this.setState({
        questionState: nextProps.questionState,
      });
    }
  }

  @autobind
  getItem() {
    const { questionResult, stepCacheData } = this.props;
    const obj = _.find(stepCacheData, { key: 'FXCP' });
    let result = null;
    if (!_.isEmpty(questionResult)) {
      result = questionResult;
    } else if (obj && obj.value) {
      result = JSON.parse(obj.value);
    }
    return result;
  }
  @autobind
  notDone() {
    const { list } = this.props;
    let notStr = '第';
    list.forEach((item, index) => {
      if (!item.selectState) {
        notStr += `<a class=${styles.changeIcon} href='#question_${item.qid}'>${index + 1}</a>`;
      }
    });
    notStr += '道题还未选择答案！';
    return notStr;
  }
  render() {
    const { finishState, question } = this.props;
    const notStr = this.notDone();
    const item = this.getItem() || {};
    const thin = true;
    return (
      <div className={`${styles.questionResult} clearfix`}>
        {
          question.length > 0 ?
            <section>
              <BoxTitle
                title="评估匹配结果"
                thin={thin}
              />
              {
                finishState ?
                  <div className={styles.result}>
                    <table className="tableArea">
                      <tBody>
                        <tr>
                          <td width="20%" className="label">风险测评类型</td>
                          <td className={styles.red} width="30%">{item.FXPCLXVALUE}</td>
                          <td width="20%" className="label">投资期限</td>
                          <td>{item.TZQXVALUE}</td>
                        </tr>
                        <tr>
                          <td className="label">风险测评类型说明</td>
                          <td colSpan="3">{item.FXPCLXSM}</td>
                        </tr>
                        <tr>
                          <td className="label">投资品种</td>
                          <td colSpan="3">{item.TZPZVALUE}</td>
                        </tr>
                      </tBody>
                    </table>
                  </div> :
                  <div
                    className={styles.result}
                    dangerouslySetInnerHTML={{ __html: notStr }}
                  />
              }
            </section> : ''
        }
      </div>
    );
  }
}
