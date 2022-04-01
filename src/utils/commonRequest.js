import request from '@/utils/request'

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    request(url, {
      method: 'GET',
      params
    })
      .then(res => {
        const { code, msg = '', message = '', data } = res || {}
        if (code === '0' || code === 0) {
          resolve(data)
        } else {
          let errMsg = ''
          if (code === '999999') {
            errMsg = '系统繁忙，请稍后重试！'
          }
          reject({ code, msg: message || msg || errMsg })
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
export const post = (url, data, hideloading) => {
  return new Promise((resolve, reject) => {
    request(url, {
      method: 'POST',
      data,
      hideloading: hideloading
    })
      .then(res => {
        const { code, message = '', msg = '', data } = res || {}
        if (code === '0' || code === 0) {
          resolve(data)
        } else {
          let errMsg = message || msg
          if (code === '999999') {
            errMsg = '系统繁忙，请稍后重试！'
          }
          reject({ code, msg: errMsg })
        }
      })
      .catch(err => {
        reject({ msg: err.msg || err.message })
      })
  })
}
export const urlpost = (url, params, data) => {
  return new Promise((resolve, reject) => {
    request(url, {
      method: 'POST',
      params,
      data
    })
      .then(res => {
        const { code, message = '', ...rest } = res || {}
        if (code === '0') {
          resolve(rest)
        } else {
          reject(message)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
