/**
 * @file identity/Home.js
 * @author zhouzhengchun
 */

import React, { PureComponent, PropTypes } from 'react';
import { Button, Modal } from 'antd';
import { autobind } from 'core-decorators';
import { toMainPage } from '../../utils/cordova';

import styles from './popup.less';

export default class Popcom extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    changePopState: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    popType: PropTypes.string.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  // componentWillReceiveProps(nextProps) {
  // }

  @autobind
  handleOk(e) {
    console.log(e);
    const {
      changePopState,
      popState,
    } = this.props;
    changePopState({
      popType: this.props.popType,
      popShow: false,
    });
    if (popState.callback) {
      popState.callback.call();
    }
    switch (popState.nativeUse) {
      case 'toIndex':
        toMainPage(
          result => console.log(result),
          err => console.log(err),
        );
        break;
      default:
        break;
    }
  }

  @autobind
  handleCancel(e) {
    console.log(e);
    this.props.changePopState({
      popType: this.props.popType,
      popShow: false,
    });
  }

  // exit 退出
  @autobind
  exitCreate() {
    const { popType, popState } = this.props;
    const popVis = popState[`${popType}`];
    return (<Modal
      key="exit"
      title=""
      visible={popVis}
      closable={false}
      footer={[
        <Button key="1" size="large" onClick={this.handleCancel} className={styles.exitModalBut}>取消</Button>,
        <Button key="2" size="large" onClick={this.handleOk} className={styles.exitModalBut}>确认</Button>,
      ]}
    >
      <p>当前步骤还未完成操作，确认离开该步骤吗？</p>
      <p className={styles.d_block}>没通过验证将不会保存该步骤数据</p>
    </Modal>);
  }

  // 出生日期提示
  @autobind
  isSureCreate() {
    const { popType, popState } = this.props;
    const popVis = popState[`${popType}`];
    return (<Modal
      key="isSure"
      title=""
      visible={popVis}
      closable={false}
      footer={[
        <Button key="1" size="large" onClick={this.handleCancel} className={styles.exitModalBut}>取消</Button>,
        <Button key="2" size="large" onClick={this.handleOk} className={styles.exitModalBut}>确认</Button>,
      ]}
    >
      <p>{popState.popTest}</p>
    </Modal>);
  }

  // 出生日期提示
  @autobind
  errPopCreate() {
    const { popType, popState } = this.props;
    const popVis = popState[`${popType}`];
    return (<Modal
      key="newPop"
      title=""
      visible={popVis}
      closable={false}
      footer={[
        <Button key="12" size="large" onClick={this.handleOk} className={styles.modalBut}>确认</Button>,
      ]}
    >
      <p>{popState.popTest}</p>
    </Modal>);
  }

  render() {
    const { popType } = this.props;
    let html;
    switch (popType) {
      case 'menuJump':
        html = this.exitCreate();
        break;
      case 'isSure':
        html = this.isSureCreate();
        break;
      case 'errPop':
        html = this.errPopCreate();
        break;
      default:
        html = '';
        break;
    }
    return (
      <div className={styles.PopBox}>
        {html}
      </div>
    );
  }
}
