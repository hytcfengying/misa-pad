/**
 * @file identity/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';
// import classNames from 'classnames';

import MenuLeft from '../../components/identity/menuLeft';
import Identity from '../../components/organizationAccount/Identity';
import NextPop from '../../components/personAccount/nextPop';

import styles from '../personAccount/homeGlobal.less';

const { Sider, Content } = Layout;

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class SearchHome extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    globalLoading: PropTypes.bool,
    location: PropTypes.object,
  }

  static defaultProps = {
    location: {},
    globalLoading: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 下一步
      accessState: true,
      nextStep: 'invest',
      thisIndex: 1,
      ZJYZLY: 1,
      stepValue: '',
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    const { push, location } = this.props;
    const { nextStep, thisIndex, stepValue, accessState } = this.state;
    return (
      <div className={styles.homeGlobal}>
        <Layout>
          <Sider
            trigger={null}
          >
            <MenuLeft
              push={push}
              location={location}
            />
          </Sider>
          <Layout>
            <Content>
              <div className={styles.contentBox}>
                <Identity />
                <NextPop
                  nextStep={nextStep}
                  thisIndex={thisIndex}
                  accessState={accessState}
                  push={push}
                  location={location}
                  stepValue={stepValue}
                />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
