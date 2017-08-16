/**
 * @file invest/Home.js
 * @author fengying
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
import { Layout } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import MenuLeft from '../../components/identity/menuLeft';
import BoxTitle from '../../components/personAccount/BoxTitle';
import Image from '../../components/personAccount/Image';
import NextPop from '../../components/personAccount/nextPop';

import { menus } from '../../config';

import styles from './homeGlobal.less';

const { Sider, Content } = Layout;


const getListFunction = loading => query => ({
  type: 'personAccount/getImageList',
  payload: query || {},
  loading,
});

const changeImageFilepath = loading => query => ({
  type: 'personAccount/changeImageFilepath',
  payload: query || {},
  loading,
});

const getBdid = loading => query => ({
  type: 'personAccount/getBdid',
  payload: query || {},
  loading,
});
const saveStep = loading => query => ({
  type: 'personAccount/saveStepCache',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  imageList: state.personAccount.imageList,
  globalLoading: state.activity.global,
  bdid: state.personAccount.bdid,
  menuState: state.personAccount.menuState,
  stepCacheData: state.personAccount.stepCacheData,
  popState: state.globalData.popState,
  returnOpinion: state.personAccount.returnOpinion,
});

const mapDispatchToProps = {
  getListFunc: getListFunction(),
  push: routerRedux.push,
  saveStepFunc: saveStep(true),
  getBdidFunc: getBdid(true),
  changefilepathFunc: changeImageFilepath(),
  changePopState: query => ({
    type: 'globalData/changePopState',
    payload: query || null,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ImageHome extends PureComponent {
  static propTypes = {
    globalLoading: PropTypes.bool,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    imageList: PropTypes.array,
    getListFunc: PropTypes.func.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    menuState: PropTypes.array.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    globalLoading: false,
    location: {},
    imageList: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      accessState: false,
      // 下一步
      cacheKey: 'YXSM',
    };
  }

  componentWillMount() {
    const { stepCacheData, returnOpinion } = this.props;
    let value = [];
    const obj = _.find(stepCacheData, { key: 'YXSM' });
    if (obj) {
      value = JSON.parse(obj.value).YXSTR;
    }
    this.props.getListFunc({
      // bdid: 3210030,
      bdid: this.props.bdid,
      valueInfo: value,
      retunChange: returnOpinion,
      stepData: stepCacheData,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { imageList } = nextProps;
    if (imageList.length > 0) {
      this.setState({ accessState: this.getAccessStatus(imageList) });
    }
  }
  @autobind
  getAccessStatus(imageList) {
    let flag = true;
    imageList.forEach((item) => {
      if (item.bx === 1 && !item.filepath) {
        flag = false;
      }
    });
    return flag;
  }
  getStepValue() {
    const { imageList } = this.props;
    const value = {
      YXSTR: [],
      KHZP: '',
    };
    _.forEach(imageList, (item) => {
      let submitState = 1;
      // 退回整改
      if (item.returnChange) {
        // 有filepath
        if (item.filepath && item.shr) {
          submitState = 2;
        }
        // 第一次没拍，退回整改又加上
        if (!item.defaultFilepath && item.filepath) {
          submitState = 3;
        }
        // 第一次拍了，退回整改又删了
        if (item.defaultFilepath && !item.filepath) {
          submitState = 3;
        }
      }
      const image = {
        YXLX: item.yxlx,
        YXLXMC: item.yxlxmc,
        FILEPATH: item.filepath,
        ZT: submitState,
      };
      value.YXSTR.push(image);
      if (item.yxlx === 9) {
        value.KHZP = item.filepath;
      }
    });
    // value.lists = imageList;
    console.log(value);
    return JSON.stringify(value);
  }
  @autobind
  getReturnObj() {
    const menuObj = _.find(menus, { cacheKey: 'YXSM' });
    const thisIndex = _.findIndex(menus, menuObj);
    if (this.props.returnOpinion.length === 0) { // 如果不是退回整改则返回空字符串
      return '';
    }
    const retrunObj = {
      key: 'YXSM',
      index: -(thisIndex + 1),
      imageList: this.props.imageList,
    };
    return JSON.stringify(retrunObj);
  }

  render() {
    const { cacheKey } = this.state;
    const {
      push,
      location,
      imageList,
      getBdidFunc,
      saveStepFunc,
      bdid,
      menuState,
      stepCacheData,
      popState,
      changePopState,
    } = this.props;
    const stepObj = _.find(stepCacheData, { key: 'YXSM' });
    const state = this.getAccessStatus(imageList);
    const value = this.getStepValue();
    const returnObj = this.getReturnObj();
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
              <section className={styles.imageSection} >
                <BoxTitle
                  title="个人影像资料"
                />
                <Image
                  list={imageList}
                  location={location}
                />
              </section>
              <NextPop
                cacheKey={cacheKey}
                push={push}
                accessState={state}
                location={location}
                stepValue={value}
                getBdidFunc={getBdidFunc}
                saveStepFunc={saveStepFunc}
                bdid={bdid}
                returnValue={returnObj}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
