/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
// import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Radio } from 'antd';

import styles from './question.less';

import BoxTitle from './BoxTitle';

const RadioGroup = Radio.Group;

export default class Question extends PureComponent {

  static propTypes = {
    list: PropTypes.array,
    setQuestionState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    list: [],
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  @autobind
  handleChange(e) {
    console.log(e.target.value);
    const { setQuestionState } = this.props;
    setQuestionState({
      value: e.target.value,
    });
  }
  render() {
    const { list } = this.props;
    // const age = this.getAgeChoice();
    return (
      <div className={`${styles.question} clearfix`}>
        <section>
          <BoxTitle
            title="评测题目"
          />
          <ul className={`clearfix ${styles.questionUl}`}>
            {
              list.map(item =>
                <li key={item.qid} className="clearfix" id={`question_${item.qid}`}>
                  <div className={styles.title}>{item.qdescribe}</div>
                  <div className={`clearfix ${styles.answerUl}`}>
                    <RadioGroup
                      onChange={this.handleChange}
                      defaultValue={`${item.qid}|${item.choice}`}
                    >
                      {
                        item.sanswer.split(';').map((item1, index) =>
                          <div className={styles.radioArea}>
                            <Radio
                              key={item.answerArr[index]}
                              value={`${item.qid}|${item.answerArr[index]}`}
                              disabled={item.qid === 226}
                            >
                              {item1.split('|')[1]}
                            </Radio>
                          </div>,
                        )
                      }
                    </RadioGroup>
                  </div>
                </li>,
              )
            }
          </ul>
        </section>
      </div>
    );
  }
}
