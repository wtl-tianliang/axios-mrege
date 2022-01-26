import dispatchAdapter from './lib/dispatchAxiosMerge'
import Merge from './lib/Merge'
import MergeQueue from './lib/MergeQueue'


export default class AxiosMerge {
  constructor(instance, customAdapter) {
    this.mergeQueue = new MergeQueue()
    this.ignoreQueue = new Map()
    instance.defaults.adapter = dispatchAdapter.call(this, customAdapter)
  }
  ignore (config) {
    const merge = new Merge(config)
    this.ignoreQueue.set(merge.id, merge)
    return merge
  }
}

export {
  Merge
}