/**
 * @file identity/Home.js
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { menusTwo } from '../../config';

import styles from './nextPop.less';

export default class nextPopcom extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    accessState: PropTypes.bool.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    bdid: PropTypes.string.isRequired,
    stepValue: PropTypes.string.isRequired,
    content: PropTypes.string,
    returnValue: PropTypes.string,
    cacheKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    content: '下一步',
    returnValue: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      popVisible: false,
    };
  }

  componentWillMount() {
  }

  @autobind
  showModalBut() {
    const nextBtnClick = (props) => {
      const promise = new Promise((resolve, reject) => {
        try {
          // func body
          const {
            // 数据
            bdid,
            stepValue,
            // 方法
            getBdidFunc,
            saveStepFunc,
            location: { query },
            cacheKey,
          } = props;
          const BDID = bdid;
          if (cacheKey === 'SFYZ') {
            const valueObjct = JSON.parse(stepValue);
            getBdidFunc({
              ...query,
              khxzr: valueObjct.KHXZR,
              zjlb: valueObjct.ZJLB,
              zjbh: valueObjct.ZJBH,
              khqc: valueObjct.KHQC,
              jgbz: 1,
              khfs: 2,
              yyb: valueObjct.YYB,
              key: cacheKey,
              value: stepValue,
              stepCallback: () => {
                resolve(true);
              },
            });
          } else {
            saveStepFunc({
              ...query,
              bdid: BDID,
              key: cacheKey,
              value: stepValue,
              returnValue: this.props.returnValue,
              stepCallback: () => {
                resolve(true);
              },
            });
          }
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    };
    const { push, cacheKey } = this.props;
    nextBtnClick(this.props).then(() => {
      const menuObj = _.find(menusTwo, { cacheKey: this.props.cacheKey });
      const thisIndex = _.findIndex(menusTwo, menuObj);
      let nextStep = menusTwo[thisIndex + 1].key;
      if (cacheKey === 'KHTJ' || cacheKey === 'THTJ') {
        nextStep = 'complete';
      }
      push(`/organizationAccount/${nextStep}`);
    });
  }
  @autobind
  handleOk(e) {
    console.log(e);
    this.setState({
      popVisible: false,
    });
  }

  @autobind
  handleCancel(e) {
    console.log(e);
    this.setState({
      popVisible: false,
    });
  }

  render() {
    const { accessState, content } = this.props;
    const isNextBtnClass = accessState ? styles.activited : '';
    return (
      <div className={styles.nexPopBox}>
        <Button type="primary" className={`${styles.nextBut} ${isNextBtnClass}`} onClick={this.showModalBut}>{content}</Button>
      </div>
    );
  }
}
