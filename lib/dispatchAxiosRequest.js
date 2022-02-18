import browserAdapter from 'axios/lib/adapters/xhr'
import nodeAdapter from 'axios/lib/adapters/http'
import Request from './Request'
import STRATEGY from './strategy'
const { USE_FIRST, USE_LAST, USE_TUNNEL } = STRATEGY

export default function dispatchAdapter (customAdapter) {

  const requestQueue = this.requestQueue
  const adapter = customAdapter || typeof window !== 'undefined' ? browserAdapter : nodeAdapter

  return function dispathAxiosRequest (config) {
    const request = new Request(config)
    const strategy = config.strategy || USE_TUNNEL

    if (strategy !== USE_FIRST || (strategy === USE_FIRST && !requestQueue.has(request.id))) {
      adapter(config).then(response => {
        if (strategy === USE_TUNNEL) {
          request.resolve(response)
        } else {
          requestQueue.resolve(request.id, response)
        }
      }).catch(error => {
        if (strategy === USE_TUNNEL) {
          request.reject(error)
        } else {
          if (!error.__CANCEL__) {
            requestQueue.reject(request.id, error)
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