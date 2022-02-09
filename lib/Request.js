import md5 from 'md5'
import { getQuery, isFormData, parseFormData, getOrigin } from './utils'

export default class Request {
  constructor(config) {
    this.config = config
    this.createHash()
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
  createHash () {
    let { url, method, data, params, baseURL } = this.config
    if (!baseURL || !/^http(s)?/.test(baseURL)) {
      baseURL = getOrigin()
    }
    if (!/^http(s)?/.test(url)) {
      url = baseURL + url
    }
    const _URL = new URL(url)
    const query = getQuery(url) // 从地址上提取 query 参数

    if (typeof data === 'object' && !isFormData(data)) {
      data = JSON.stringify(data)
    }
    if (isFormData(data)) {
      data = parseFormData(data)
    }

    const origin = {
      url: _URL.origin + _URL.pathname,
      method: method.toUpperCase(),
      data,
      params,
      query
    }
    const hash = md5(JSON.stringify(origin)).toUpperCase()
    this.id = hash
  }
  cancel () {
    const cancelFn = this.config.cancelFn
    if (typeof cancelFn !== 'function') {
      throw new Error('[axios-request] config.cancelFn not function')
    }
    cancelFn('axios-request canceled')
  }
}