import dispatchAdapter from './lib/dispatchAxiosRequest'
import Request from './lib/Request'
import RequestQueue from './lib/RequestQueue'
import strategy from './lib/strategy'


export default class AxiosMerge {
  /**
   * Create an axiosRequest instance
   * @param { AxiosInstance } instance
   * @param { Function } customAdapter Custom to set up request adapter
   */
  constructor(instance, customAdapter) {
    this.requestQueue = new RequestQueue()
    instance.defaults.adapter = dispatchAdapter.call(this, customAdapter)
  }
}

export {
  Request as Merge,
  strategy
}