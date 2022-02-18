# axios-merge

## Description

axios-merge is an axios helper library for merging identical requests. The library provides the following features:

1. merge identical requests; subsequent requests will be merged into the preceding request, preserving the result of the preceding request.
2. identical-requests-cancel; the preceding request will be cancelled and the result of the subsequent request will be kept.

## Usage

### Packaged build

```javascript
npm run build
npm pack
```

### Install

```javascript
// node
npm install axios-merge --save

// browser
<script src="axios-merge/dist/index.min.js">
```

### parameter signature

```javascript
/**
 * Create merge helper function example
 * @params { axiosinstance } axiosInstance axios instance
 * @params { function } [customerAdaptar] axios custom adapter
 **/
const axiosmerge = new AxiosMerge(axiosInstance, customerAdaptar)

/**
 * @params { object } config request configuration, same as axios native configuration
 * @params { boolean } config.checkParams checks if the same request checks for parameters default true
 * @params { string } config.strategy set the processing strategy when this request is repeated. USE_FIRST keep the first result, USE_LAST keep the last result, USE_TUNNEL use the current result, default is USE_TUNNEL
 * @params { boolean } config.distributionResponse USE_LAST policy distributes the last response to the cancelled request default is true
 * @params { function } config.cancelFn function to cancel the request Note: This parameter only takes effect when strategy=USE_LAST https://axios-http.com/zh/docs/cancellation
 * @params { AxiosCancenToken } config.cancelToken The beacon to cancel the request Note: This parameter only takes effect when strategy=USE_LAST https://axios-http.com/zh/docs/cancellation
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

### Create an instance

```javascript
import axios from "axios";
import AXiosMerge, { strategy } from "axios-merge";

const instance = axios.create({ baseURL: "/" });
const axiosmerge = new AxiosMerge(instance);
// const axiosmerge = new AxiosMerge(axios)
```

### Use within request interceptors

```javascript
const CancelToken = axios;

instance.interceptors.request.use(
  function (config) {
    let fn = null;
    const cancelToken = new CancelToken((cancel) => {
      fn = cancel;
    });
    config.cancelToken = cancelToken; // beacon to cancel the request
    config.cancelFn = fn; // cancel function
    config.strategy = strategy.USE_FIRST; // USE_LAST USE_TUNNEL
    // do something before sending the request
    return config;
  },
  function (error) {
    // What to do about request errors
    return Promise.reject(error);
  }
);
```

*** Translated with www.DeepL.com/Translator (free version) ***

