export default class MergeQueue {
  constructor() {
    this.map = {}
  }
  add (merge) {
    const mergeId = merge.id
    if (!this.map[mergeId]) {
      this.map[mergeId] = []
    }
    this.map[mergeId].push(merge)
  }
  resolve (mergeId, data) {
    const list = this.map[mergeId]
    while (list.length) {
      const merge = list.pop()
      merge.resolve(data)
    }
    this.map[mergeId] = []
  }
  reject (mergeId, error) {
    const list = this.map[mergeId]
    while (list.length) {
      const merge = list.pop()
      merge.reject(error)
    }
    this.map[mergeId] = []
  }
  has (mergeId) {
    return this.map[mergeId] && this.map[mergeId].length > 0
  }
}