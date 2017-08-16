/**
 * @file utils/helper.js
 *  常用工具方法
 * @author maoquan(maoquan@htsc.com)
 */

const helper = {

  /**
   * 将{ a: 1, b: 2 } => a=1&b=2
   * @param {object} query
   */
  queryToString(query = {}) {
    const encode = encodeURIComponent;
    return Object.keys(query).map(
      key => (`${encode(key)}=${encode(query[key])}`),
    ).join('&');
  },

  /**
   * 由?a=1&b=2 ==> {a:1, b:2}
   * @param {string} search 一般取自location.search
   */
  getQuery(search) {
    const query = {};
    // 去掉`?`
    const searchString = search.slice(1);
    if (searchString) {
      searchString.split('&').map(
        item => item.split('='),
      ).forEach(
        (item) => { (query[item[0]] = item[1]); },
      );
    }
    return query;
  },

  isLocalStorageSupport() {
    const KEY = 'STORAGE_TEST_KEY';
    try {
      localStorage.setItem(KEY, KEY);
      localStorage.removeItem(KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 获取属性的属性值
   * 针对类似 `a.b.c` 的命名路径，获取最后的 `c` 的属性
   *
   * @param {object} object 要获取值的对象
   * @param {string} name 属性名
   * @return {*}
   */
  getProperty(object, name) {
    const paths = name.split('.');
    let property = object[paths.shift()];

    while (paths.length) {
      if (property === null || property === undefined) {
        return property;
      }
      property = property[paths.shift()];
    }

    return property;
  },


  hasClass(elem, className) {
    return elem.className.indexOf(className) > -1;
  },

  checkIdentity(value, type, source) {
    const re1 = /^[HM]{1}([0-9]{10}|[0-9]{8})$/;
    const re2 = /^[0-9]{8}$/;
    const src = typeof (source) === 'undefined' ? 'GT' : source;
    if (src === 'GT') {
      switch (type) {
        case '0':
          // 身份证
          return this.checkIdentification(value);
        case '4':
          // 港澳居民来往内地通行证
          if (re1.test(value)) {
            return true;
          }
          return false;
        case '15':
          // 台湾居民来往大陆通行证
          if (re2.test(value)) {
            return true;
          }
          return false;
        case '57':
          return this.checkIdentification(value);
        default:
          return true;
      }
    } else {
      switch (type) {
        case '1':
          // 身份证
          return this.checkIdentification(value);
        case '7':
          // 港澳居民来往内地通行证
          if (re1.test(value)) {
            return true;
          }
          return false;
        case '8':
          // 台湾居民来往大陆通行证
          if (re2.test(value)) {
            return true;
          }
          return false;
        default:
          return true;
      }
    }
  },

  checkIdentification(value) {
    // 15位和18位身份证号码的正则表达式
    const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (value) {
      if (regIdCard.test(value)) {
        if (value.length === 18) {
          // 将前17位加权因子保存在数组里
          const valueWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          const valueY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
          let valueWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
          for (let i = 0; i < 17; i++) {
            valueWiSum += value.substring(i, i + 1) * valueWi[i];
          }
          const valueMod = valueWiSum % 11; // 计算出校验码所在数组的位置
          const valueLast = value.substring(17); // 得到最后一位身份证号码
          // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
          if (valueMod === 2) {
            if (valueLast === 'X' || valueLast === 'x') {
              return true;
            }
            return false;
          }
          if (valueMod !== 2) {
            if (valueLast === valueY[valueMod].toString()) {
              // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
              return true;
            }
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
    return true;
  },

};

export default helper;
