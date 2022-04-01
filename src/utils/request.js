import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import qs from 'qs'
// 根据环境不同引入不同api地址
// create an axios instance
const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    // 不传递默认开启loading
    // let token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  async (response) => {
    const req = response.config
    const res = response.data
    // 已改 res.status=>reponse.status
    if (response.status && response.status !== 200) {
      // 登录超时,重新登录
      if (response.status === 403) {
        const res = await service({
          method: 'POST',
          url: `/zzscjdagl/rest/oauth2/token`,
          data: qs.stringify({
            client_id: 'admin',
            client_secret: 'zhbduijie',
            grant_type: 'client_credentials'
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        localStorage.setItem('token', res.data.custom.access_token)
      }
      return Promise.reject(res || 'error')
    } else if (response.status && response.status === 200) {
      return Promise.resolve({ data: res })
    } else {
      return Promise.resolve({ data: res })
    }
  },
  async (error, res) => {
    console.log(error.message)
    if (error.message.includes(403)) {
      const res = await service({
        method: 'POST',
        url: `/zzscjdagl/rest/oauth2/token`,
        data: qs.stringify({
          client_id: 'admin',
          client_secret: 'zhbduijie',
          grant_type: 'client_credentials'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      localStorage.setItem('token', res.data.custom.access_token)
    }
    return Promise.resolve(error)
  }
)

// 请求前拦截判断是否有token，没有就获取token之后执行请求
const serviceWithToken = new Proxy(service, {
  get(target, key, receiver) {
    const methods = ['get', 'post', 'request', 'delete', 'put', 'head', 'patch'] // 拦截的请求方式
    let token = store.getters.token
    const userInfo = localStorage.getItem('userInfo')
    if (!token && userInfo) {
      token = JSON.parse(userInfo).accessToken
    }
    if (methods.includes(key) && !token) {
      console.log('!token')
      return new Proxy(Reflect.get(target, key, receiver), {
        apply: this.apply
      })
    } else {
      console.log('token', token)
      return Reflect.get(target, key, receiver)
    }
  },
  apply(target, ctx, args) {
    return new Promise((resolve, reject) => {
      // 在这里添加异步操作
      store.dispatch('app/setUserInfo').then((res) => {
        // 最后再调用一次被拦截的方法
        target(...args)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }
})

export default service
