import browserAdapter from 'axios/lib/adapters/xhr'
import nodeAdapter from 'axios/lib/adapters/http'
import Merge from './Merge'

export default function dispatchAdapter (customAdapter) {

  const mergeQueue = this.mergeQueue
  const ignoreQueue = this.ignoreQueue
  const adapter = customAdapter || typeof window !== 'undefined' ? browserAdapter : nodeAdapter

  return function dispathAxiosMerge (config) {
    const merge = new Merge(config)
    if (config.ignoreMerge) { // if request config has ignoreMerge field will append to ignore queue.
      ignoreQueue.set(merge.id, merge)
    }
    if (!mergeQueue.has(merge.id)) { // 请求队列中不存在该请求
      adapter(config)
        .then(response => {
          if (!ignoreQueue.has(merge.id)) {
            mergeQueue.resolve(merge.id, response)
          } else {
            merge.resolve(response)
          }
        })
        .catch(error => {
          if (!ignoreQueue.has(merge.id)) {
            mergeQueue.reject(merge.id, error)
          } else {
            merge.reject(error)
          }
        })
    }

    if (!ignoreQueue.has(merge.id)) {
      mergeQueue.add(merge) // 向队列添加合并请求
    }

    return merge.promise
  }
}