import dispatchAdapter from './lib/dispatchAxiosRequest'
import Request from './lib/Request'
import RequestQueue from './lib/RequestQueue'


export default class AxiosMerge {
  /**
   * Create an axiosRequest instance
   * @param { AxiosInstance } instance
   * @param { Function } customAdapter Custom to set up request adapter
   */
  constructor(instance, customAdapter) {
    this.requestQueue = new RequestQueue()
    this.ignoreQueue = new Map()
    instance.defaults.adapter = dispatchAdapter.call(this, customAdapter)
  }

  /**
   * ignore merge request
   * @param {*} config axios request config
   */
  ignore (config) {
    const request = new Request(config)
    this.ignoreQueue.set(request.id, request)
    return request
  }
}

export {
  Request as Merge
}