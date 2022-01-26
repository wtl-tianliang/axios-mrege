export function getQuery (url) {
  const query = {}
  const urlParams = new URLSearchParams((new URL(url)).search)
  window.urlParams = urlParams
  urlParams.forEach((value, key) => query[key] = value)
  return query
}
/**
 * 解包formData数据，生成唯一ID
 * @param {*} form 表单数据
 */
export function parseFormData (form) {
  const data = {}
  for (let [key, val] of form.entries()) {
    if (val instanceof Blob) {
      // todo 构造blob唯一ID
      data[key] = `${val.size}${val.type || 'text'}`
    } else {
      data[key] = val
    }
  }
  return JSON.stringify(data)
}

export function isFormData (data) {
  return data instanceof FormData
}

export function isFile (data) {
  return data instanceof File
}

/**
 * 获取当前执行环境的 origin
 * @returns 
 */
export function getOrigin () {
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser) {
    const local = new URL(location.href)
    return local.origin
  }
  return 'http://127.0.0.1'
}