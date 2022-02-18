export default class RequestQueue {
  constructor() {
    this.map = {}
  }
  add (request) {
    const requestId = request.id
    if (!this.map[requestId]) {
      this.map[requestId] = []
    }
    this.map[requestId].push(request)
  }
  resolve (requestId, data) {
    const list = this.map[requestId] || []
    while (list.length) {
      const request = list.pop()
      request.resolve(data)
    }
    this.map[requestId] = []
  }
  reject (requestId, error) {
    const list = this.map[requestId] || []
    while (list.length) {
      const request = list.pop()
      request.reject(error)
    }
    this.map[requestId] = []
  }
  cancel (requestId) {
    const list = this.map[requestId] || []
    list.forEach(request => { request.cancel() })
  }
  has (requestId) {
    return this.map[requestId] && this.map[requestId].length > 0
  }
}