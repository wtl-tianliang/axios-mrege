import browserAdapter from 'axios/lib/adapters/xhr'
import nodeAdapter from 'axios/lib/adapters/http'
import Request from './Request'

export default function dispatchAdapter (customAdapter) {

  const requestQueue = this.requestQueue
  const ignoreQueue = this.ignoreQueue
  const adapter = customAdapter || typeof window !== 'undefined' ? browserAdapter : nodeAdapter

  return function dispathAxiosRequest (config) {
    const request = new Request(config)
    const isCancel = config.cancel || false
    if (config.ignoreRequest) { // if request config has ignoreRequest field will append to ignore queue.
      ignoreQueue.set(request.id, request)
    }
    if (isCancel || !requestQueue.has(request.id)) { // The request does not exist in the request queue
      adapter(config)
        .then(response => {
          if (!ignoreQueue.has(request.id)) {
            requestQueue.resolve(request.id, response)
          } else {
            request.resolve(response)
          }
        })
        .catch(error => {
          if (!ignoreQueue.has(request.id) && !isCancel) {
            requestQueue.reject(request.id, error)
          } else {
            request.reject(error)
          }
        })
    }

    if (!ignoreQueue.has(request.id)) {
      requestQueue.add(request) // Adding a request request to the queue
    }

    if (isCancel && requestQueue.has(request.id)) { // Eliminate predecessor requests and keep the last one
      requestQueue.cancel(request.id)
    }

    return request.promise
  }
}