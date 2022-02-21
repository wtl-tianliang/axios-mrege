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
    const request = new Request(config)
    const strategy = config.strategy || USE_TUNNEL

    if (strategy !== USE_FIRST || (strategy === USE_FIRST && !requestQueue.has(request.id))) {
      adapter(config).then(response => {
        if (strategy === USE_TUNNEL) { // 隧道模式一对一解决相应
          request.resolve(response)
        } else if (strategy === USE_FIRST) { // 保留第一次结果
          requestQueue.resolve(request.id, response)
        } else if (strategy === USE_LAST) { // 保留最后一次结果
          if (config.distributionResponse) { // 将最后一次的结果同步到被取消的请求中
            requestQueue.resolve(request.id, response)
          } else { // 不将最后一次的结果同步到被取消的请求中
            request.resolve(response)
          }
          if (requestQueue.isLastRequest(request)) {
            requestQueue.clear(request.id)
          }
        }
      }).catch(error => {
        if (strategy === USE_TUNNEL) { // 隧道模式一对一解决相应
          request.reject(error)
        } else if (strategy === USE_FIRST) { // 保留第一次结果
          requestQueue.reject(request.id, error)
        } else if (strategy === USE_LAST) { // 保留最后一次结果
          // 被取消的请求暂时挂起，等待最后一个请求完成后解决
          if (!error.__CANCEL__ && error.message !== 'Request aborted') {
            request.reject(error)
          }
          if (requestQueue.isLastRequest(request)) {
            requestQueue.clear(request.id)
          }
        }
      })
    }

    if (strategy === USE_LAST) {
      requestQueue.cancel(request.id)
    }

    if (strategy !== USE_TUNNEL) {
      requestQueue.add(request)
    }

    if (strategy === USE_FIRST) {
      return request.promise
    }

    return request.promise
  }
}