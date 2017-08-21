/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { setNavigatePageTitle } from '../../utils/cordova';

import styles from './csdcHome.less';
import Detail from '../../components/csdc/Detail';

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  csdcQuery: state.csdc.csdcQuery,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CSDCDetail extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    csdcQuery: PropTypes.array.isRequired,
  }

  static defaultProps = {
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentWillMount() {
    setNavigatePageTitle(
      ['账户详情', true],
      result => console.log(result),
      err => console.log(err),
    );
  }
  componentWillUnmount() {
    setNavigatePageTitle(
      ['', false],
      result => console.log(result),
      err => console.log(err),
    );
  }

  render() {
    const { csdcQuery, location } = this.props;
    return (
      <div className={`${styles.codeHome} ${styles.homeGlobal}`}>
        <Detail
          location={location}
          csdcQuery={csdcQuery}
        />
      </div>
    );
  }
}
