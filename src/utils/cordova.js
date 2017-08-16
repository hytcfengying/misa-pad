/**
 * @file utils/cordova.js
 *  封装app提供的cordova相关方法
 * @author maoquan(maoquan@htsc.com)
 */

import { routerRedux } from 'dva/router';
// import helper from './helper';

const AppVersion = window.AppVersion || {};
const device = window.device || {};

function exec(method, ...args) {
  try {
    MisaPlugin[method].apply(null, args);
  } catch (e) {
    console.log(e);
  }
}

const cordova = {
  navToLogin() {
    exec('navToLogin');
  },
  getEnvVars() {
    // $app_version 字符串 应用的版本
    // $manufacturer 字符串 设备制造商，例如Apple
    // $model  字符串 设备型号，例如iphone6
    // $os 字符串 操作系统，例如iOS
    // $os_version 字符串 操作系统版本，例如8.1.1
    // $screen_height  数值  屏幕高度，例如1920
    // $screen_width 数值  屏幕宽度，例如1080
    // $wifi BOOL  是否使用wifi，例如true
    // $browser  字符串 浏览器名，例如Chrome
    // $browser_version  字符串 浏览器版本，例如Chrome 45
    // $carrier  字符串 运营商名称，例如ChinaNet
    // $network_type 字符串 网络类型，例如4G

    let browser = 'unknown';
    const androidMatch = /Android\s+([0-9.]+)/.exec(navigator.userAgent);
    if (androidMatch) {
      browser = androidMatch[0];
    } else {
      const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
      if (isIOS) {
        browser = 'ios';
      }
    }
    const connection = navigator.connection || { type: 'unknown' };
    return {
      $app_version: AppVersion.version,
      $manufacturer: device.manufacturer,
      $model: navigator.platform,
      $os: device.platform,
      $os_version: device.version,
      $screen_width: screen.width,
      $screen_height: screen.height,
      $network_type: connection.type,
      $browser: browser,
      $carrier: 'unknown',
      uuid: device.uuid,
    };
  },
  /**
   * 使用native webview打开新页面
   */
  openUrl(args) {
    exec('openUrl', args);
  },
  getIDCard(args) {
    exec('getIDCard', args);
  },
  // 单项视频见证
  unidirectionalVideo(args) {
    exec('unidirectionalVideo', args);
  },
  // 双项视频见证
  bilateralVideo(args) {
    exec('bilateralVideo', args);
  },
  // 显示影像信息
  showImgFile(args) {
    exec('showImgFile', args);
  },
  // 上传影像信息
  uploadImgFile(args) {
    exec('uploadImgFile', args);
  },
  // 修改pad标题
  setNavigatePageTitle(args) {
    exec('setNavigatePageTitle', args);
  },
  // 返回首页
  toMainPage(args) {
    exec('toMainPage', args);
  },
  // 只显示图片，没有其它操作
  onlyShowImgFile(args) {
    exec('onlyShowImgFile', args);
  },
  // 下面菜单显隐
  setmTabMainVisual(args) {
    exec('setmTabMainVisual', args);
  },
  /**
   * 退出APP，仅安卓有效
   * @return {[type]} [description]
   */
  // exitApp() {
  //   exec('exitApp');
  // },

  /**
   * 初始化暴露给native的方法
   * @param  {object} store app.store
   */
  initNativeMethod(store) {
    window.navToUrl = (url) => {
      store.dispatch(routerRedux.push(url));
    };
    window.dispatch = (action) => {
      store.dispatch(action);
    };
    window.go = (num) => {
      store.dispatch(routerRedux.go(num));
    };
    window.getState = () => (store.getState());
  },

  /**
   * 判断网络是否可用
   * @return {Boolean} 网络是否可用
   */
  isConnected() {
    const connection = navigator.connection || {};
    return connection.type !== 'none';
  },
  // addBackbuttonListener() {
  //   // 安卓返回键
  //   document.addEventListener('backbutton', triggerBackBtn, false);
  // },

  // removeBackbuttonListener() {
  //   // 安卓返回键
  //   document.removeEventListener('backbutton', handleBackbutton, false);
  // },
};


export default cordova;
