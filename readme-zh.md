# axios-merge

## 描述

axios-merge 是一个用来合并相同请求的 axios 辅助库。该库提供一下功能:

1. 相同请求合并；后续请求将被合并到前序请求中,保留前序请求的结果。
2. 相同请求取消；前序请求将被取消，保留后续请求的结果。

## 使用方法

### 打包构建

``` javascript
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

### 参数API
``` javascript
/**
 * 创建合并辅助函数实例
 * @params { Axiosinstance } axiosInstance axios实例
 * @params { function } customerAdaptar axios自定义适配器
 **/
const axiosmerge = AxiosMerge(axiosInstance, customerAdaptar)

/**
 * 对某些请求忽略合并
 * @params { AxiosConfig } config axios请求配置
 **/
axiosmerge.ignore(config)

/**
 * @params { object } config 请求配置,与axios原生配置相同
 * @params { boolean } config.checkParams 检查相同请求时是否校验参数 默认 true
 * @params { boolean } config.ignoreMerge 是否对本次请求不做合并，默认 false 注意:该参数与 cancel 参数互斥，不可同时配置
 * @params { boolean } config.cancel 是否启用前序取消功能，默认 false 注意:该参数与 ignoreMerge 参数互斥，不可同时配置
 * @params { function } config.cancelFn 用于取消请求的函数 https://axios-http.com/zh/docs/cancellation
 * @params { AxiosCancenToken } config.cancelToken 取消请求的信标 https://axios-http.com/zh/docs/cancellation
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
import AXiosMerge from "axios-merge";

const instance = axios.create({ baseURL: "/" });
const axiosmerge = new AxiosMerge(instance);
```

### 请求拦截器内使用

```javascript
const CancelToken = axios.CancelToken;

instance.interceptors.request.use(
  function (config) {
    // config.ignoreMerge = true; // 本次请求如有相同不做合并
    // axiosmerge.ignore(config) // 本次请求如有相同不做合并

    config.cancel = true; // 本次请求如有相同，取消前序请求，保留最后一次的响应
    let fn = null;
    const cancelToken = new CancelToken((cancel) => {
      fn = cancel;
    });
    config.cancelToken = cancelToken; // 取消请求的信标
    config.cancelFn = fn; // 取消函数
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
```
