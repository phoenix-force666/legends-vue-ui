'use strict'
const axios = require('axios')
const { jsonSort } = require('@bj-nsc/functions')
const queryString = require('query-string')
const _ = require('lodash')
const md5 = require('md5')

/**
 * 返回请求参数
 * @param {*} data 参数体
 */
const _parseData = data => {
  const obj = {}
  const s = data
  const arr = s.split('&')

  arr.forEach(str => {
    const arr2 = decodeURIComponent(str).split('=')
    const [ key, value ] = arr2
    if (key === 'theme') {
      obj[key] = value
    } else {
      obj[key] = value
    }
  })

  return obj
}

/**
 * 创建附带防篡改功能的请求实体
 * @param {any} axiosArgs axios配置参数
 * @param {object} param 防篡改参数
 * @param {number} [param.timestamp=0] 时间戳
 * @param {string} param.onceStr 随机字符串
 * @param {string} param.signature 加密串
 * @return {axios} axios实例
 */
function createAxios(axiosArgs, { timestamp = 0, onceStr, signature } = {}) {
  const { headers, ...restArgs } = axiosArgs
  const axiosObj = axios.create({
    ...restArgs,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      timestamp:1606816343630,
      onceStr:'19d41cc0-1522-4970-aed7-28585a044be4',
      signature
    }
  })

  axiosObj.interceptors.request.use(function (config) {
    if (!config.url.includes('/api') && !config.url.startsWith('http') && !config.url.startsWith('//')) {
      config.url = `/api${config.url}`
    }

    const url = config.url
    console.log(url)

    // 不需要传Authorization的接口
    const noHeaders = [ '/security/captcha/type', '/security/encrypt/rsa' ]

    const isNoAuth = noHeaders.some(str => url.includes(str))

    const interceptorsHeaders = {
      timestamp:1606816343630,
      onceStr:'19d41cc0-1522-4970-aed7-28585a044be4',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZWVkQmluZERldmljZSI6ZmFsc2UsInNpZ25pblR5cGUiOiIyMDEiLCJpc2NfdXNlcl9pZCI6Im51bGwiLCJ1c2VyX25hbWUiOiIxOTg5ODk4OTg5OCIsIm1vYmlsZSI6bnVsbCwiY2xpZW50X2lkIjoiZWljIiwiY2hhbmdlUGFzc3dvcmQiOmZhbHNlLCJwcm92aWRlciI6ImplcnJ5Y2hpciIsInVzZXJfaWQiOiIxMzI2ODcwMzk5ODQ1MjY5NTA2Iiwic2NvcGUiOlsiYWxsIl0sIm5hbWUiOiLkvZnnjonnjokiLCJleHAiOjE2MTU0NTYyOTYsImp0aSI6IjI4NTAyMTZjLTlmODktNDY2My04OWMwLTI4NDVhMTQ4ZTlhZSJ9.CF6DcIO5Nn8nWYfDVlVcTQGmZKTBGAm9SJQMrVZpYe8'
    }

    const q = queryString.stringify({ ...config.params })

    const newUrl = _.isEmpty(config.params) ? url : url + '?' + q

    const optData = (() => {
      let result
      if (typeof config.data === 'string' && config.data !== '') {
        if (config.data.includes('=')) {
          result = _parseData(config.data)
        } else {
          result = {
            data: config.data.splice(',')
          }
        }
      } else {
        if (_.isEmpty(config.data)) {
          if (_.isArray(config.data)) {
            result = {
              data: []
            }
          } else if (!_.isUndefined(config.data)) {
            result = {
              data: {}
            }
          }
        } else if (_.isArray(config.data)) {
          result = {
            data: config.data
          }
        } else {
          result = config.data
        }
      }
      return result
    })()


    const params = { url: newUrl, ...interceptorsHeaders, ...optData }
    console.log('params:',params)
    const sortParam = jsonSort(params, config.method)
    console.log('sortParam:',sortParam)
    const stringParam = JSON.stringify(sortParam)
    console.log('stringParam:',stringParam)
    const safeHeaders = {
      signature: md5(stringParam)
    }

    if (typeof config.data === 'string'
     && config.data !== '') {
      try {
        JSON.parse(config.data)
      } catch (error) {
        if (config.data !== '' && config.data.includes('=')) {
          config.url += `?${config.data}`
        }
      }
    }

    const finalHeaders = {
      ...interceptorsHeaders,
      ...config.headers,
      ...safeHeaders,
    }

    if (isNoAuth) {
      delete finalHeaders.Authorization
    }

    config.headers = finalHeaders

    return config
  })

  return axiosObj
}

module.exports = createAxios
