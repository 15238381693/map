import { Toast } from 'vant'
import { containerType, loginApp, getonverified } from '@/utils/alipay'
import { alipayJSReady } from '@/utils'

/**
 * 获取用户信息，并判断是否登录，实名权限最低为L1
 * @param {*} callback
 */
const getUseInfo = (callback) => {
  if (containerType() === 'app') {
    // app用法
    window.AlipayJSBridge.call('getAppUserInfo', (result) => {
      const { userInfo } = result
      // console.log(userInfo.accessToken) // undefined-IOS无法往下执行
      // console.log('userInfo', userInfo)
      if (!result) {
        console.log('not result', result)
      } else if (result.success === 'false') {
        Toast({
          message: '请先完成登录',
          duration: 3000
        })
        setTimeout(() => {
          loginApp((login) => {
            if (login.result) {
              getUseInfo((val) => {
                callback(val)
              })
            } else {
              window.AlipayJSBridge.call('exitApp')
            }
          })
        }, 500)
      } else if (userInfo.authLevel !== 2 && userInfo.authLevel !== 1) {
        Toast({
          message: '请先完成实名与人脸识别认证',
          duration: 3000
        })
        setTimeout(() => {
          getonverified((verified) => {
            if (verified.authLevel === 2 || verified.authLevel === 1) {
              getUseInfo((val) => {
                callback(val)
              })
            } else {
              window.AlipayJSBridge.call('exitApp')
            }
          })
        }, 500)
      } else {
        callback(userInfo)
      }
    })
  } else {
    callback()
  }
}

/**
 * 获取用户信息，并判断是否登录，实名权限必须为L2
 * @param {*} callback
 */
const getUseInfoL2 = (callback) => {
  if (containerType() === 'app') {
    // app用法
    window.AlipayJSBridge.call('getAppUserInfo', (result) => {
      const { userInfo } = result
      // console.log('accessToken', userInfo.accessToken)
      // console.log('userInfo', userInfo)
      if (!result) {
        console.log('not result', result)
      } else if (result.success === 'false') {
        Toast({
          message: '查看提交历史需先完成登录',
          duration: 3000
        })
        setTimeout(() => {
          loginApp((login) => {
            if (login.result) {
              getUseInfoL2((val) => {
                callback(val)
              })
            }
          })
        }, 500)
      } else if (userInfo.authLevel !== 2) {
        Toast({
          message: '请先完成实名与人脸识别认证',
          duration: 3000
        })
        setTimeout(() => {
          getonverified((verified) => {
            if (verified.authLevel === 2) {
              getUseInfoL2((val) => {
                callback(val)
              })
            }
          })
        }, 500)
      }
    })
  } else {
    callback({})
  }
}

const getAppInfo = (callback) => {
  if (containerType() === 'app') {
    window.AlipayJSBridge.call('appbasicinfo', {}, (result) => {
      const { appVersion } = result
      let useZhb = false
      // 郑好办版本大于等于3.0.2，使用郑好办JSApi（郑好办安卓11上传文件有问题）
      // 否则使用vant组件选取上传图片，区分安卓和IOS（郑好办安卓无法调取摄像头）
      if (appVersion >= '3.0.2') {
        useZhb = true
      }
      callback({ useZhb, ...result })
    })
  } else {
    callback()
  }
}

const state = {
  userInfo: {},
  appInfo: {},
  isIdentify: false
}

const mutations = {
  SET_USER_INFO(state, data) {
    state.userInfo = data
    window.globalPromise.resolve && window.globalPromise.resolve()
  },
  SET_APP_INFO(state, data) {
    state.appInfo = data
  },
  SET_IDENTIFY(state, data) {
    state.isIdentify = data
  }
}

const actions = {
  /**
   * 设置用户信息，并判断是否登录，至少L1等级
   */
  setUserInfo: ({ commit }) => {
    return new Promise((resolve) => {
      alipayJSReady(() => {
        getUseInfo((res) => {
          localStorage.setItem('userInfo', JSON.stringify(res))
          commit('SET_USER_INFO', res)
          resolve(res)
        })
      })
    })
  },
  /**
   * 设置用户信息，必须L2等级
   */
  setUserInfoL2: ({ commit }) => {
    return new Promise((resolve) => {
      alipayJSReady(() => {
        getUseInfoL2((res) => {
          localStorage.setItem('userInfo', JSON.stringify(res))
          commit('SET_USER_INFO', res)
          resolve(res)
        })
      })
    })
  },
  setAppInfo: ({ commit }) => {
    return new Promise((resolve) => {
      alipayJSReady(() => {
        getAppInfo((res) => {
          commit('SET_APP_INFO', res)
          resolve(res)
        })
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
