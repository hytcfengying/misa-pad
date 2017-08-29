/**
 * @file identity/Home.js
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { Button, Modal } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { menus, menusTwo } from '../../config';

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
    imgFilepath: PropTypes.string,
    returnValue: PropTypes.string,
    cacheKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    content: '下一步',
    imgFilepath: '',
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
    const pathL = location.pathname.split('/');
    const pathFirst = pathL[1];
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
            imgFilepath,
            cacheKey,
          } = props;
          const BDID = bdid;
          if (cacheKey === 'SFYZ') {
            const valueObjct = JSON.parse(stepValue);
            if (imgFilepath) {
              valueObjct.ZJZP = this.props.imgFilepath;
            }
            const stepValueN = JSON.stringify(valueObjct);
            getBdidFunc({
              ...query,
              khxzr: valueObjct.KHXZR,
              zjlb: valueObjct.ZJLB,
              zjbh: valueObjct.ZJBH,
              khqc: valueObjct.KHQC,
              jgbz: pathFirst === 'personAccount' ? 0 : 1,
              khfs: 2,
              yyb: valueObjct.YYB,
              key: cacheKey,
              value: stepValueN,
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
      const leftMenu = pathFirst === 'personAccount' ? menus : menusTwo;
      const menuObj = _.find(leftMenu, { cacheKey: this.props.cacheKey });
      const thisIndex = _.findIndex(leftMenu, menuObj);
      let nextStep = leftMenu[thisIndex + 1].key;
      if (cacheKey === 'KHTJ' || cacheKey === 'THTJ') {
        nextStep = 'complete';
      }
      push(`/${pathFirst}/${nextStep}`);
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
        <div className={styles.modalBox}>
          <Modal
            title=""
            visible={this.state.popVisible}
            closable={false}
            footer={[
              <Button size="large" onClick={this.handleCancel} className={styles.modalBut}>取消</Button>,
              <Button size="large" onClick={this.handleOk} className={styles.modalBut}>确认</Button>,
            ]}
          >
            <p>当前步骤还未完成操作，确认离开该步骤吗？</p>
            <p>没通过验证将不会保存该步骤数据</p>
          </Modal>
        </div>
      </div>
    );
  }
}
