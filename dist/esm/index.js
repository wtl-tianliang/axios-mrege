import browserAdapter from 'axios/lib/adapters/xhr';
import nodeAdapter from 'axios/lib/adapters/http';
import md5 from 'md5';
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
