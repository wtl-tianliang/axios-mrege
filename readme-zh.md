# axios-merge

## 描述

axios-merge 是一个用来合并相同请求的 axios 辅助库。该库提供一下功能:

1. 相同请求合并；后续请求将被合并到前序请求中,保留前序请求的结果。
2. 相同请求取消；前序请求将被取消，保留后续请求的结果。

## 使用方法

### 打包构建

```javascript
npm run build
npm pack
```

### 安装

```javascript
// node
npm install axios-merge --save

// browser
<script src="axios-merge/dist/index.min.js">
```

### 参数签名

```javascript
/**
 * 创建合并辅助函数实例
 * @params { Axiosinstance } axiosInstance axios实例
 * @params { function } [customerAdaptar] axios自定义适配器
 **/
const axiosmerge = new AxiosMerge(axiosInstance, customerAdaptar)

/**
 * @params { object } config 请求配置,与axios原生配置相同
 * @params { boolean } config.checkParams 检查相同请求时是否校验参数 默认 true
 * @params { string } config.strategy 设置本次请求重复时的处理策略。 USE_FIRST保留首次结果， USE_LAST保留最后一次结果， USE_TUNNEL使用当次结果，默认为 USE_TUNNEL
 * @params { boolean } config.distributionResponse USE_LAST策略时将最后一次的响应分发到被取消的请求中 默认为 true
 * @params { function } [config.cancelFn]  可选参数 用于取消请求的函数 注意:该参数仅在 strategy=USE_LAST 时生效 https://axios-http.com/zh/docs/cancellation
 * @params { AxiosCancenToken } [config.cancelToken] 可选参数 取消请求的信标 注意:该参数仅在 strategy=USE_LAST 时生效 https://axios-http.com/zh/docs/cancellation
 **/
instance.request(config)
instance.get(url[, config])
instance.delete(url[, config])
instance.head(url[, config])
instance.options(url[, config])
instance.post(url[, data[, config]])
instance.put(url[, data[, config]])
instance.patch(url[, data[, config]])
```

### 创建实例

```javascript
import axios from "axios";
import AXiosMerge, { strategy } from "axios-merge";

const instance = axios.create({ baseURL: "/" });
const axiosmerge = new AxiosMerge(instance);
// const axiosmerge = new AxiosMerge(axios)
```

### 请求拦截器内使用

```javascript
const CancelToken = axios.CancelToken;

instance.interceptors.request.use(
  function (config) {
    let fn = null;
    const cancelToken = new CancelToken((cancel) => {
      fn = cancel;
    });
    config.cancelToken = cancelToken; // 取消请求的信标
    config.cancelFn = fn; // 取消函数
    config.strategy = strategy.USE_FIRST; // USE_LAST USE_TUNNEL
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
```
