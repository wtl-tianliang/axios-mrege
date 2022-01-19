import browserAdaptor from 'axios/lib/adapters/xhr'
import nodeAdaptor from 'axios/lib/adapters/http'
import Merge from './lib/Merge'
import MergeQueue from './lib/MergeQueue'

export default function AxiosMerge (customAdaptor) {
  // 设置请求适配器
  const adaptor = customAdaptor || typeof window !== 'undefined' ? browserAdaptor : nodeAdaptor
  const queue = new MergeQueue()
  return function dispathAxiosMerge (config) {
    const merge = new Merge(config)
    if (!queue.has(merge.id)) { // 请求队列中不存在该请求
      adaptor(config)
        .then(response => { queue.resolve(merge.id, response) })
        .catch(error => { queue.reject(merge.id, error) })
    }
    queue.add(merge) // 向队列添加合并请求
    return merge.promise
  }
}