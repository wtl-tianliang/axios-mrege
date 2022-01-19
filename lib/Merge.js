import md5 from 'md5'
import { getQuery, isFormData, parseFormData, getOrigin } from './utils'

export default class Merge {
  constructor(config) {
    let { url, method, data, params, baseURL = getOrigin() } = config
    if (!/^http(s)?/.test(url)) {
      url = baseURL + url
    }
    const _URL = new URL(url)
    const query = getQuery(url) // 从地址上提取 query 参数

    if (typeof data !== 'undefined' && !isFormData(data)) {
      data = JSON.parse(data)
    }
    if (isFormData(data)) {
      data = parseFormData(data)
    }

    const origin = {
      url: _URL.origin + _URL.pathname,
      method: method.toUpperCase(),
      data: Object.assign({}, data, params, query)
    }
    
    const hash = md5(JSON.stringify(origin)).toUpperCase()
    this.id = hash
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}