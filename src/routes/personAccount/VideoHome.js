/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';

import MenuLeft from '../../components/identity/menuLeft';
import BoxTitle from '../../components/personAccount/BoxTitle';
import Video from '../../components/personAccount/Video';

import styles from './homeGlobal.less';

const { Sider, Content } = Layout;

const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  menuState: state.personAccount.menuState,
  popState: state.globalData.popState,
  stepCacheData: state.personAccount.stepCacheData,
  empInforData: state.globalData.empInforData,
  videoType: state.personAccount.videoType,
  bdid: state.personAccount.bdid,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
  setVideoType: query => ({
    type: 'personAccount/setVideoType',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class VideoHome extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    menuState: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    empInforData: PropTypes.object.isRequired,
    videoType: PropTypes.string.isRequired,
    setVideoType: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
  }

  static defaultProps = {
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      push,
      location,
      menuState,
      popState,
      changePopState,
      stepCacheData,
      empInforData,
      videoType,
      setVideoType,
      bdid,
    } = this.props;
    const stepObj = {
      value: 'sucess',
    };
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
              <section className={styles.videoSection} >
                <BoxTitle
                  title="开户见证"
                />
                <Video
                  checked={videoType}
                  push={push}
                  stepCacheData={stepCacheData}
                  empInforData={empInforData}
                  setVideoType={setVideoType}
                  bdid={bdid}
                />
              </section>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
