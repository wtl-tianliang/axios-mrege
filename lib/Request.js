import md5 from 'md5'
import { getQuery, isFormData, parseFormData, getOrigin } from './utils'

function createHash (config = {}) {
  let { url, method, data, params, baseURL, checkParams = true } = config
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
    method: method.toUpperCase()
  }

  if (checkParams) {
    Object.assign(origin, { data, params, query })
  }

  const hash = md5(JSON.stringify(origin)).toUpperCase()
  return hash
}
export default class Request {
  constructor(config) {
    this.config = config
    this.id = createHash(config)
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  cancel () {
    const { cancelFn, cancelToken } = this.config
    cancelToken.promise = new Promise(() => {})
    if (typeof cancelFn !== 'function') {
      throw new Error('[axios-request] config.cancelFn not function')
    }
    cancelFn('[AxiosMerge cancel]')
    cancelToken.reason = undefined // 调用原生取消方法后将原因置空，拦截axios默认的取消操作
  }
}