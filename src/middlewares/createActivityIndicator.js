/**
 * @file middlewares/createActivityIndicator.js
 *  山寨了一个dva-loading,只用于activetyIndicator显示
 * @author maoquan(maoquan@htsc.com)
 */

const SHOW = '@@HT_LOADING/SHOW_ACTIVITY_INDICATOR';
const HIDE = '@@HT_LOADING/HIDE_ACTIVITY_INDICATOR';
const NAMESPACE = 'activity';

export { SHOW, HIDE };

export default function createActivityIndicator(opts = {}) {
  const namespace = opts.namespace || NAMESPACE;
  const initialState = {
    global: false,
    txt: '加载中...',
  };

  const extraReducers = {
    [namespace](state = initialState, { type, txt }) {
      let ret;
      switch (type) {
        case SHOW:
          ret = {
            ...state,
            global: true,
            txt: txt || '加载中...',
          };
          break;
        case HIDE:
          ret = {
            ...state,
            global: false,
            txt: '加载中...',
          };
          break;
        default:
          ret = state;
          break;
      }
      return ret;
    },
  };

  function onEffect(effect, { put }) {
    return function* (...args) {
      const { loading = false, show = false, hide = false } = args[0];
      if (loading !== false && hide !== true) {
        yield put({ type: SHOW });
      }
      yield effect(...args);
      if (loading !== false && show !== true) {
        yield put({ type: HIDE });
      }
    };
  }

  return {
    extraReducers,
    onEffect,
  };
}
