/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else {
      // ios中不支持'-'，所以为了兼容ios，将日期转换为 '/' 连接，例如：2021/05/10
      if (typeof time === 'string' && time.includes('-')) {
        time = time.replace(/-/g, '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function alipayJSReady(callback) {
  if (window.AlipayJSBridge) {
    callback && callback()
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback, false)
  }
}

/**
 * 将数组array分成长度为subGroupLength的小数组并返回新数组
 * @param {*} array
 * @param {*} subGroupLength
 */
export function group(array, subGroupLength) {
  let index = 0
  const newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}

// 参数对象转字符串
export const paramsObjToStr = paramsObj =>
  '?' +
  Object.keys(paramsObj)
    .filter(key => paramsObj[key] !== null && typeof paramsObj[key] !== undefined)
    .map(key => `${key}=${paramsObj[key]}`)
    .join('&')

/**
 * 筛选出val数组中不是''，null，undefined的元素并返回
 * @param {*} val
 * @returns
 */
export const filterArrayItem = val => {
  const temp = val.filter(s => {
    return s && s.trim()
  })
  return temp
}

/*
 * 姓名脱敏
 */
export const nameHiddern = (str = '') => {
  const star = '*'
  if (str.length > 3) {
    return `${str.substring(0, 1)}${star}${str.substring(str.length - 2, str.length)}`
  } else if (str.length === 3) {
    return `${str.substring(0, 1)}${star}${str.substring(str.length - 1, str.length)}`
  } else {
    return `${str.substring(0, 1)}${star}`
  }
}
/**
 * 身份证号脱敏
 * @param {*} card
 * @returns
 */
export const noPassByCard = (card = '') => {
  if (card && card !== null && card !== undefined) {
    const str = card.substr(6, 8)
    return card.replace(str, '********')
  } else {
    return ''
  }
}
/**
 * 银行卡号：前6后4不脱敏，中间脱敏
 * @param {*} str
 * @returns
 */
export const noPassByBankaccount = (str = '') => {
  let star = '*'
  const len = str.toString().length - 10
  for (var i = 1; i < len; i++) {
    star = star + '*'
  }
  if (str && str !== null && str !== undefined) {
    return str.substring(0, 6) + star + str.substring(str.length - 4, str.length)
  } else {
    return ''
  }
}

/*
 * 社保卡号脱敏
 */
export const noPassBySocialCard = (str = '') => {
  if (str && str !== null && str !== undefined) {
    const pat = /(\d{3})\d*(\d{2})/
    return str.replace(pat, '$1****$2')
  } else {
    return ''
  }
}

/**
 * dict to map
 * @param {Array} list
 * @param {string} keyType 'string' | 'number'
 */
export function dictToMap(list = [], type = 'string') {
  const tmp = {}
  list.forEach(item => {
    const key = type === 'string' ? item['code'] : Number(item['code'])
    tmp[key] = item['val']
  })
  return tmp
}
