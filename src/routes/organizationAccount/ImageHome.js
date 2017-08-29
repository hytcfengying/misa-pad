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
import Image from '../../components/personAccount/Image';
import NextPop from '../../components/personAccount/nextPop';

import { menus } from '../../config';

import styles from '../personAccount/homeGlobal.less';

const { Sider, Content } = Layout;


const getListFunction = loading => query => ({
  type: 'organizationAccount/getImageList',
  payload: query || {},
  loading,
});

const changeImageFilepath = loading => query => ({
  type: 'organizationAccount/changeImageFilepath',
  payload: query || {},
  loading,
});

const getBdid = loading => query => ({
  type: 'organizationAccount/getBdid',
  payload: query || {},
  loading,
});
const saveStep = loading => query => ({
  type: 'organizationAccount/saveStepCache',
  payload: query || {},
  loading,
});

const mapStateToProps = state => ({
  imageList: state.organizationAccount.imageList,
  globalLoading: state.activity.global,
  bdid: state.organizationAccount.bdid,
  menuState: state.organizationAccount.menuState,
  stepCacheData: state.organizationAccount.stepCacheData,
  popState: state.globalData.popState,
  returnOpinion: state.organizationAccount.returnOpinion,
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
  getArray(list) {
    const identityArr = [];
    const businessArr = [];
    list.forEach((item) => {
      // if (!item.bz) {
      //   businessArr.push(item);
      //   return;
      // }
      // const bzArr = item.bz.toString().split(';');
      // if (bzArr.length === 1) {
      //   businessArr.push(item);
      //   return;
      // }
      // if (_.findIndex(bzArr, bz => bz === '身份证明资料') > -1) {
      //   identityArr.push(item);
      // } else {
      //   businessArr.push(item);
      // }
      if (item.yxsx) {
        identityArr.push(item);
      } else {
        businessArr.push(item);
      }
    });
    return {
      ideArr: identityArr,
      busArr: businessArr,
    };
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
    // 影像列表分类
    const listObj = this.getArray(imageList, 'identity');
    const ideImage = listObj.ideArr;
    const busImage = listObj.busArr;
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
              {
                ideImage.length > 0 ?
                  <Image
                    title="身份证明资料"
                    list={ideImage}
                    location={location}
                  /> : ''
              }
              {
                busImage.length > 0 ?
                  <Image
                    title="业务影像资料"
                    list={busImage}
                    location={location}
                  /> : ''
              }
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
