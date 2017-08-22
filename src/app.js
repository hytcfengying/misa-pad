/**
 * @file app.js
 * @author maoquan(maoquan@htsc.com)
 */

import dva from 'dva';
import { browserHistory } from 'dva/router';
import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import _ from 'lodash';

import { message } from 'antd';
import { getQuery } from './utils/helper';
import { navToLogin, initNativeMethod } from './utils/cordova';
import api from './api';
import createSensorsLogger from './middlewares/sensorsLogger';
import createActivityIndicator from './middlewares/createActivityIndicator';
import routerConfig from './router';
import persistConfig from './config/persist';
import FastClick from './utils/fastclick';

// 存储empId, deviceId, token等授权信息
const query = getQuery(location.search);
const authInfo = _.pick(query, 'empId', 'deviceId', 'token');
api.setAuthInfo(authInfo);

const extraEnhancers = [];
if (persistConfig.active) {
  extraEnhancers.push(autoRehydrate());
}

// 各平台出错信息不一样
// 貌似也没有status code
const NETWORK_ERROR_MESSAGE = [
  'Failed to fetch',
  'Network request failed',
];

const getMessage = (msg) => {
  if (_.includes(NETWORK_ERROR_MESSAGE, msg)) {
    return '网络异常';
  }
  // 解决 toast 只有苦脸，没文字问题。默认文字为‘网络异常’
  if (!/[\u4E00-\u9FCB]+/.test(msg)) {
    return process.env.NODE_ENV === 'development' ? msg : '网络异常';
  }
  return msg;
};

// 错误处理
const onError = (e) => {
  const { message: msg } = e;
  if (msg === 'MAG0010') {
    message.error(
      '登录超时，请重新登录！',
      1,
      navToLogin,
    );
  } else if (msg) {
    message.error(getMessage(msg), 2);
  }
};

// 1. Initialize
const app = dva({
  history: browserHistory,
  onAction: [createLogger(), createSensorsLogger()],
  extraEnhancers,
  onError,
});

// 2. Plugins
app.use(createLoading({ effects: true }));
app.use(createActivityIndicator());

// 3. Model
// app.model(require('./models/app'));
app.model(require('./models/example'));
app.model(require('./models/search'));
app.model(require('./models/personAccount'));
app.model(require('./models/globalData'));
app.model(require('./models/csdc'));
app.model(require('./models/organizationAccount'));

// 4. Router
app.router(routerConfig);

// 5. Start
app.start('#app');

// 6. redux-persist
if (persistConfig.active) {
  persistStore(app._store, persistConfig); // eslint-disable-line
}

document.addEventListener('deviceready', () => {
  window.MisaPlugin = cordova.plugins.MisaPlugin;
}, false);

// fastclick
FastClick.attach(document.body);

// cordova
// 初始化给cordova提供的代码，挂在全局变量
initNativeMethod(app._store); // eslint-disable-line