import browserAdapter from 'axios/lib/adapters/xhr';
import nodeAdapter from 'axios/lib/adapters/http';
import axios from 'axios';

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var crypt = createCommonjsModule(function (module) {
  (function () {
    var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        crypt = {
      // Bit-wise rotation left
      rotl: function (n, b) {
        return n << b | n >>> 32 - b;
      },
      // Bit-wise rotation right
      rotr: function (n, b) {
        return n << 32 - b | n >>> b;
      },
      // Swap big-endian to little-endian and vice versa
      endian: function (n) {
        // If number given, swap endian
        if (n.constructor == Number) {
          return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
        } // Else, assume array and swap all items


        for (var i = 0; i < n.length; i++) n[i] = crypt.endian(n[i]);

        return n;
      },
      // Generate an array of any length of random bytes
      randomBytes: function (n) {
        for (var bytes = []; n > 0; n--) bytes.push(Math.floor(Math.random() * 256));

        return bytes;
      },
      // Convert a byte array to big-endian 32-bit words
      bytesToWords: function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) words[b >>> 5] |= bytes[i] << 24 - b % 32;

        return words;
      },
      // Convert big-endian 32-bit words to a byte array
      wordsToBytes: function (words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8) bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);

        return bytes;
      },
      // Convert a byte array to a hex string
      bytesToHex: function (bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 0xF).toString(16));
        }

        return hex.join('');
      },
      // Convert a hex string to a byte array
      hexToBytes: function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));

        return bytes;
      },
      // Convert a byte array to a base-64 string
      bytesToBase64: function (bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

          for (var j = 0; j < 4; j++) if (i * 8 + j * 6 <= bytes.length * 8) base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 0x3F));else base64.push('=');
        }

        return base64.join('');
      },
      // Convert a base-64 string to a byte array
      base64ToBytes: function (base64) {
        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
          if (imod4 == 0) continue;
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }

        return bytes;
      }
    };
    module.exports = crypt;
  })();
});

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function (str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },
    // Convert a byte array to a string
    bytesToString: function (bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },
  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function (str) {
      for (var bytes = [], i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 0xFF);

      return bytes;
    },
    // Convert a byte array to a string
    bytesToString: function (bytes) {
      for (var str = [], i = 0; i < bytes.length; i++) str.push(String.fromCharCode(bytes[i]));

      return str.join('');
    }
  }
};
var charenc_1 = charenc;

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var isBuffer_1 = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
} // For Node v0.10 support. Remove this eventually.


function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

var md5 = createCommonjsModule(function (module) {
  (function () {
    var crypt$1 = crypt,
        utf8 = charenc_1.utf8,
        isBuffer = isBuffer_1,
        bin = charenc_1.bin,
        // The core
    md5 = function (message, options) {
      // Convert to byte array
      if (message.constructor == String) {
        if (options && options.encoding === 'binary') message = bin.stringToBytes(message);else message = utf8.stringToBytes(message);
      } else if (isBuffer(message)) message = Array.prototype.slice.call(message, 0);else if (!Array.isArray(message) && message.constructor !== Uint8Array) message = message.toString(); // else, assume byte array already

      var m = crypt$1.bytesToWords(message),
          l = message.length * 8,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878; // Swap endian

      for (var i = 0; i < m.length; i++) {
        m[i] = (m[i] << 8 | m[i] >>> 24) & 0x00FF00FF | (m[i] << 24 | m[i] >>> 8) & 0xFF00FF00;
      } // Padding


      m[l >>> 5] |= 0x80 << l % 32;
      m[(l + 64 >>> 9 << 4) + 14] = l; // Method shortcuts

      var FF = md5._ff,
          GG = md5._gg,
          HH = md5._hh,
          II = md5._ii;

      for (var i = 0; i < m.length; i += 16) {
        var aa = a,
            bb = b,
            cc = c,
            dd = d;
        a = FF(a, b, c, d, m[i + 0], 7, -680876936);
        d = FF(d, a, b, c, m[i + 1], 12, -389564586);
        c = FF(c, d, a, b, m[i + 2], 17, 606105819);
        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i + 4], 7, -176418897);
        d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
        c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i + 7], 22, -45705983);
        a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
        d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i + 10], 17, -42063);
        b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
        a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
        d = FF(d, a, b, c, m[i + 13], 12, -40341101);
        c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
        b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
        a = GG(a, b, c, d, m[i + 1], 5, -165796510);
        d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
        c = GG(c, d, a, b, m[i + 11], 14, 643717713);
        b = GG(b, c, d, a, m[i + 0], 20, -373897302);
        a = GG(a, b, c, d, m[i + 5], 5, -701558691);
        d = GG(d, a, b, c, m[i + 10], 9, 38016083);
        c = GG(c, d, a, b, m[i + 15], 14, -660478335);
        b = GG(b, c, d, a, m[i + 4], 20, -405537848);
        a = GG(a, b, c, d, m[i + 9], 5, 568446438);
        d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
        c = GG(c, d, a, b, m[i + 3], 14, -187363961);
        b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
        a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
        d = GG(d, a, b, c, m[i + 2], 9, -51403784);
        c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
        b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
        a = HH(a, b, c, d, m[i + 5], 4, -378558);
        d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
        b = HH(b, c, d, a, m[i + 14], 23, -35309556);
        a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
        d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
        c = HH(c, d, a, b, m[i + 7], 16, -155497632);
        b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
        a = HH(a, b, c, d, m[i + 13], 4, 681279174);
        d = HH(d, a, b, c, m[i + 0], 11, -358537222);
        c = HH(c, d, a, b, m[i + 3], 16, -722521979);
        b = HH(b, c, d, a, m[i + 6], 23, 76029189);
        a = HH(a, b, c, d, m[i + 9], 4, -640364487);
        d = HH(d, a, b, c, m[i + 12], 11, -421815835);
        c = HH(c, d, a, b, m[i + 15], 16, 530742520);
        b = HH(b, c, d, a, m[i + 2], 23, -995338651);
        a = II(a, b, c, d, m[i + 0], 6, -198630844);
        d = II(d, a, b, c, m[i + 7], 10, 1126891415);
        c = II(c, d, a, b, m[i + 14], 15, -1416354905);
        b = II(b, c, d, a, m[i + 5], 21, -57434055);
        a = II(a, b, c, d, m[i + 12], 6, 1700485571);
        d = II(d, a, b, c, m[i + 3], 10, -1894986606);
        c = II(c, d, a, b, m[i + 10], 15, -1051523);
        b = II(b, c, d, a, m[i + 1], 21, -2054922799);
        a = II(a, b, c, d, m[i + 8], 6, 1873313359);
        d = II(d, a, b, c, m[i + 15], 10, -30611744);
        c = II(c, d, a, b, m[i + 6], 15, -1560198380);
        b = II(b, c, d, a, m[i + 13], 21, 1309151649);
        a = II(a, b, c, d, m[i + 4], 6, -145523070);
        d = II(d, a, b, c, m[i + 11], 10, -1120210379);
        c = II(c, d, a, b, m[i + 2], 15, 718787259);
        b = II(b, c, d, a, m[i + 9], 21, -343485551);
        a = a + aa >>> 0;
        b = b + bb >>> 0;
        c = c + cc >>> 0;
        d = d + dd >>> 0;
      }

      return crypt$1.endian([a, b, c, d]);
    }; // Auxiliary functions


    md5._ff = function (a, b, c, d, x, s, t) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };

    md5._gg = function (a, b, c, d, x, s, t) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };

    md5._hh = function (a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };

    md5._ii = function (a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    }; // Package private blocksize


    md5._blocksize = 16;
    md5._digestsize = 16;

    module.exports = function (message, options) {
      if (message === undefined || message === null) throw new Error('Illegal argument ' + message);
      var digestbytes = crypt$1.wordsToBytes(md5(message, options));
      return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt$1.bytesToHex(digestbytes);
    };
  })();
});

function getQuery(url) {
  var query = {};
  var urlParams = new URLSearchParams(new URL(url).search);
  urlParams.forEach(function (value, key) {
    return query[key] = value;
  });
  return query;
}
/**
 * 解包formData数据，生成唯一ID
 * @param {*} form 表单数据
 */

function parseFormData(form) {
  var data = {};

  var _iterator = _createForOfIteratorHelper(form.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          val = _step$value[1];

      if (val instanceof Blob) {
        data[key] = "".concat(val.name || 'FILE').concat(val.size).concat(val.type || 'text');
      } else {
        data[key] = val;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return JSON.stringify(data);
}
function isFormData(data) {
  return data instanceof FormData;
}
/**
 * 获取当前执行环境的 origin
 * @returns 
 */

function getOrigin() {
  var isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    var local = new URL(location.href);
    return local.origin;
  }

  return 'http://127.0.0.1';
}

function createHash() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = config.url,
      method = config.method,
      data = config.data,
      params = config.params,
      baseURL = config.baseURL,
      _config$checkParams = config.checkParams,
      checkParams = _config$checkParams === void 0 ? true : _config$checkParams;

  if (!baseURL || !/^http(s)?/.test(baseURL)) {
    baseURL = getOrigin();
  }

  if (!/^http(s)?/.test(url)) {
    url = baseURL + url;
  }

  var _URL = new URL(url);

  var query = getQuery(url); // 从地址上提取 query 参数

  if (_typeof(data) === 'object' && !isFormData(data)) {
    data = JSON.stringify(data);
  }

  if (isFormData(data)) {
    data = parseFormData(data);
  }

  var origin = {
    url: _URL.origin + _URL.pathname,
    method: method.toUpperCase()
  };

  if (checkParams) {
    Object.assign(origin, {
      data: data,
      params: params,
      query: query
    });
  }

  var hash = md5(JSON.stringify(origin)).toUpperCase();
  return hash;
}

var Request = /*#__PURE__*/function () {
  function Request(config) {
    var _this = this;

    _classCallCheck(this, Request);

    this.config = config;
    this.id = createHash(config);
    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }

  _createClass(Request, [{
    key: "cancel",
    value: function cancel() {
      var _this$config = this.config,
          cancelFn = _this$config.cancelFn,
          cancelToken = _this$config.cancelToken;
      cancelToken.promise = new Promise(function () {});

      if (typeof cancelFn !== 'function') {
        throw new Error('[axios-request] config.cancelFn not function');
      }

      cancelFn('[AxiosMerge cancel]');
      cancelToken.reason = undefined; // 调用原生取消方法后将原因置空，拦截axios默认的取消操作
    }
  }]);

  return Request;
}();

var STRATEGY = {
  USE_FIRST: 'USE_FIRST',
  USE_LAST: 'USE_LAST',
  USE_TUNNEL: 'USE_TUNNEL'
};

var CancelToken = axios.CancelToken;
var USE_FIRST = STRATEGY.USE_FIRST,
    USE_LAST = STRATEGY.USE_LAST,
    USE_TUNNEL = STRATEGY.USE_TUNNEL;
function dispatchAdapter(customAdapter) {
  var requestQueue = this.requestQueue;
  var adapter = customAdapter || typeof window !== 'undefined' ? browserAdapter : nodeAdapter;
  return function dispathAxiosRequest(config) {
    if (config.strategy === USE_LAST && (typeof config.cancelToken !== 'function' || typeof config.cancelFn !== 'function')) {
      config.cancelToken = new CancelToken(function (cancel) {
        config.cancelFn = cancel;
      });
    }

    if (typeof config.distributionResponse !== 'boolean') {
      config.distributionResponse = true;
    }

    var request = new Request(config);
    var strategy = config.strategy || USE_TUNNEL;

    if (strategy === USE_TUNNEL) {
      adapter(config).then(function (response) {
        return request.resolve(response);
      })["catch"](function (error) {
        return request.reject(error);
      });
    }

    if (strategy === USE_FIRST && !requestQueue.has(request.id)) {
      adapter(config).then(function (response) {
        if (config.distributionResponse) {
          requestQueue.resolve(request.id, response);
        } else {
          request.resolve(response);
          requestQueue.clear(request.id);
        }
      })["catch"](function (error) {
        requestQueue.reject(request.id, error);
      });
    }

    if (strategy === USE_LAST) {
      requestQueue.cancel(request.id);
      adapter(config).then(function (response) {
        if (config.distributionResponse) {
          requestQueue.resolve(request.id, response);
        } else {
          request.resolve(response);
        }

        if (requestQueue.isLastRequest(request)) {
          requestQueue.clear(request.id);
        }
      })["catch"](function (error) {
        // 被取消的请求暂时挂起，等待最后一个请求完成后解决
        if (!error.__CANCEL__ && error.message !== 'Request aborted') {
          request.reject(error);
        }

        if (requestQueue.isLastRequest(request)) {
          requestQueue.clear(request.id);
        }
      });
    }

    if (strategy !== USE_TUNNEL) {
      requestQueue.add(request);
    }

    return request.promise;
  };
}

var RequestQueue = /*#__PURE__*/function () {
  function RequestQueue() {
    _classCallCheck(this, RequestQueue);

    this.map = {};
  }

  _createClass(RequestQueue, [{
    key: "add",
    value: function add(request) {
      var requestId = request.id;

      if (!this.map[requestId]) {
        this.map[requestId] = [];
      }

      this.map[requestId].push(request);
    }
  }, {
    key: "resolve",
    value: function resolve(requestId, data) {
      var list = this.map[requestId] || [];

      while (list.length) {
        var request = list.pop();
        request.resolve(data);
      }

      this.map[requestId] = [];
    }
  }, {
    key: "reject",
    value: function reject(requestId, error) {
      var list = this.map[requestId] || [];

      while (list.length) {
        var request = list.pop();
        request.reject(error);
      }

      this.map[requestId] = [];
    }
  }, {
    key: "cancel",
    value: function cancel(requestId) {
      var list = this.map[requestId] || [];
      list.forEach(function (request) {
        request.cancel();
      });
    }
  }, {
    key: "has",
    value: function has(requestId) {
      return this.map[requestId] && this.map[requestId].length > 0;
    }
  }, {
    key: "isLastRequest",
    value: function isLastRequest(request) {
      var requestId = request.id;
      var list = this.map[requestId];
      return list[list.length - 1] === request;
    }
  }, {
    key: "clear",
    value: function clear(requestId) {
      this.map[requestId] = [];
    }
  }]);

  return RequestQueue;
}();

var AxiosMerge = /*#__PURE__*/_createClass(
/**
 * Create an axiosRequest instance
 * @param { AxiosInstance } instance
 * @param { Function } customAdapter Custom to set up request adapter
 */
function AxiosMerge(instance, customAdapter) {
  _classCallCheck(this, AxiosMerge);

  this.requestQueue = new RequestQueue();
  instance.defaults.adapter = dispatchAdapter.call(this, customAdapter);
});

export { Request as Merge, AxiosMerge as default, STRATEGY as strategy };
