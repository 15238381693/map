import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
    }
    // if (store.getters.token) {
    //   config.headers.accessToken =å `${store.getters.token}`
    // }
    const userInfo = localStorage.getItem('userInfo')
    if (store.getters.userToken) {
      config.headers.accessToken = `${store.getters.userToken}`
    } else if (userInfo) {
      config.headers.accessToken = JSON.parse(userInfo).accessToken
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  async response => {
    const req = response.config
    Toast.clear()
    const res = response.data
    // 已改 res.status=>reponse.status
    if (response.status && response.status !== 200) {
      // 登录超时,重新登录
      if (response.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else if (response.status && response.status === 200) {
      const { code } = res
      // 处理提交申报时，存在policyId，但是不存在caseId的情况
      if (code === 603 || code === '603') {
        // 用来接受真正的成功的返回数据
        let realResponse = null
        const { url } = req
        const method = req.method.toLocaleLowerCase()
        // 根据不同请求 取不同的参数
        const pyload = (method === 'get' ? req.params : req.data) || {}
        let parsePyload = {}
        try {
          parsePyload = JSON.parse(pyload)
        } catch (err) {
          parsePyload = {}
        }
        // 获取caseId
        const innerReceived = async () => {
          const res = await service('/case_center/process/innerReceived', {
            method: 'POST',
            data: {
              policyId: parsePyload.policyId,
              applyChannel: 'zhbChannel'
            }
          })
          console.log('new', res)
          const { code, data } = res || {}
          if (code === 0) {
            // 存入caseId
            parsePyload.caseId = data.caseId
            // 处理请求体
            const requestBody = {
              ...req
            }
            // 根据不同的请求方法，将消息体装载上去
            if (method === 'get') {
              requestBody.params = parsePyload
            } else if (method === 'post') {
              requestBody.data = parsePyload
            }
            // 重新发起请求， 并获取响应体
            realResponse = await service(url, requestBody)
          }
        }
        await innerReceived()
        return realResponse
      }
      return Promise.resolve(res)
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err ' + error) // for debug
    return Promise.reject(error)
  }
)
export default service
