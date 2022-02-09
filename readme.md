# axios-merge

## Description

axios-merge is an axios helper library for merging identical requests. The library provides the following features:

1. merge identical requests; subsequent requests will be merged into the preceding request, preserving the result of the preceding request.
2. identical-requests-cancel; the preceding request will be cancelled and the result of the subsequent request will be kept.

## How to use

### Packaged builds

``` javascript
npm run build
npm pack
`` `

### Installation

```javascript
// node
npm install axios-merge --save

// browser
<script src="axios-merge/dist/index.min.js">
```

### Create an instance

```javascript
import axios from "axios";
import AXiosMerge from "axios-merge";

const instance = axios.create({ baseURL: "/" });
new AxiosMerge(instance);
```

### Initiating a request

```javascript
/**
 * @params { object } config request configuration, same as axios native configuration
 * @params { boolean } config.ignoreMerge Whether to not merge this request, default false Note: This parameter is mutually exclusive with the cancel parameter and cannot be configured at the same time.
 * @params { boolean } config.cancel Whether to enable preemptive cancellation, default false Note: This parameter is mutually exclusive with the ignoreMerge parameter and cannot be configured at the same time.
 * @params { function } config.cancelFn The function used to cancel the request https://axios-http.com/zh/docs/cancellation
 * @params { AxiosCancenToken } config.cancelToken The beacon to cancel the request https://axios-http.com/zh/docs/cancellation
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

### Use within request interceptors

```javascript
const CancelToken = axios;

instance.interceptors.request.use(
  function (config) {
    // config.ignoreMerge = true; // this request is not merged if it is identical
    config.cancel = true; // if the request is the same, cancel the previous request and keep the last one accordingly
    let fn = null;
    const cancelToken = new CancelToken((cancel) => {
      fn = cancel;
    });
    config.cancelToken = cancelToken; // beacon to cancel the request
    config.cancelFn = fn; // cancel function
    // do something before sending the request
    return config;
  },
  function (error) {
    // What to do about the request error
    return Promise.reject(error);
  }
);
```

*** Translated with www.DeepL.com/Translator (free version) ***

