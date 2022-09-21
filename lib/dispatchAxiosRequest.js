import browserAdapter from 'axios/lib/adapters/xhr'
import nodeAdapter from 'axios/lib/adapters/http'
import Request from './Request'
import STRATEGY from './strategy'
import axios from 'axios'

const CancelToken = axios.CancelToken
const { USE_FIRST, USE_LAST, USE_TUNNEL } = STRATEGY

export default function dispatchAdapter (customAdapter) {

  const requestQueue = this.requestQueue
  const adapter = customAdapter || typeof window !== 'undefined' ? browserAdapter : nodeAdapter

  return function dispathAxiosRequest (config) {
    if (config.strategy === USE_LAST && (typeof config.cancelToken !== 'function' || typeof config.cancelFn !== 'function')) {
      config.cancelToken = new CancelToken(cancel => {
        config.cancelFn = cancel
      })
    }

    if (typeof config.distributionResponse !== 'boolean') {
      config.distributionResponse = true
    }

    const request = new Request(config)
    const strategy = config.strategy || USE_TUNNEL

    if (strategy === USE_TUNNEL) {
      adapter(config).then(response =>
        request.resolve(response)
      ).catch(error =>
        request.reject(error)
      )
    }

    if (strategy === USE_FIRST && !requestQueue.has(request.id)) {
      adapter(config).then(response => {
        if (config.distributionResponse) {
          requestQueue.resolve(request.id, response)
        } else {
          request.resolve(response)
          requestQueue.clear(request.id)
        }
      }).catch(error => {
        requestQueue.reject(request.id, error)
      })
    }

    if (strategy === USE_LAST) {
      requestQueue.cancel(request.id)
      adapter(config).then(response => {
        if (config.distributionResponse) {
          requestQueue.resolve(request.id, response)
        } else {
          request.resolve(response)
        }
        if (requestQueue.isLastRequest(request)) {
          requestQueue.clear(request.id)
        }
      }).catch(error => {
        // 被取消的请求暂时挂起，等待最后一个请求完成后解决
        if (!error.__CANCEL__ && error.message !== 'Request aborted') {
          request.reject(error)
        }
        if (requestQueue.isLastRequest(request)) {
          requestQueue.clear(request.id)
        }
      })
    }

    if (strategy !== USE_TUNNEL) {
      requestQueue.add(request)
    }

    return request.promise
  }
}