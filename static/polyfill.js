if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
if (!String.prototype.repeat) {
  (function() {
    'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
    var defineProperty = (function() {
      // IE 8 only supports `Object.defineProperty` on DOM elements
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var repeat = function(count) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      // `ToInteger`
      var n = count ? Number(count) : 0;
      if (n != n) { // better `isNaN`
        n = 0;
      }
      // Account for out-of-bounds indices
      if (n < 0 || n == Infinity) {
        throw RangeError();
      }
      var result = '';
      while (n) {
        if (n % 2 == 1) {
          result += string;
        }
        if (n > 1) {
          string += string;
        }
        n >>= 1;
      }
      return result;
    };
    if (defineProperty) {
      defineProperty(String.prototype, 'repeat', {
        'value': repeat,
        'configurable': true,
        'writable': true
      });
    } else {
      String.prototype.repeat = repeat;
    }
  }());
}