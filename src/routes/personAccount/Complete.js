/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { toMainPage } from '../../utils/cordova';

import styles from './complete.less';

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  returnOpinion: state.personAccount.returnOpinion,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class VideoHome extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array,
  }

  static defaultProps = {
    location: {},
    returnOpinion: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      content: '开户申请提交成功',
    };
  }

  componentWillMount() {
    window.scroll(0, 0);
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      this.setState({
        content: '开户申请提交成功',
      });
    } else {
      this.setState({
        content: '退回修改提交成功',
      });
    }
  }

  @autobind
  handClick() {
    toMainPage(
      result => console.log(result),
      err => console.log(err),
    );
  }

  render() {
    const { content } = this.state;
    return (
      <div className={styles.complete}>
        <div className={styles.font}>
          <span className={styles.fontArea}>
            {content}
          </span>
        </div>
        <a className={styles.btn} onClick={this.handClick}>
          <span className={styles.returnIcon}>
            返回首页
          </span>
        </a>
      </div>
    );
  }
}
