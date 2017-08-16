/**
 * @file layouts/Frame.js
 * @author fwc
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';

import Loading from './Loading';
import style from '../css/main.less';

const mapStateToProps = state => ({
  loading: state.activity.global,
  loadingTxt: state.activity.txt,
});

const mapDispatchToProps = {
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
class Frame extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingTxt: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // componentWillReceiveProps(nextProps) {}

  render() {
    const { children, loading = false, loadingTxt } = this.props;
    return (
      <div className={style.page_wrapper}>
        <Loading loading={loading} loadingTxt={loadingTxt} />
        {children}
      </div>
    );
  }
}

export default withRouter(Frame);
