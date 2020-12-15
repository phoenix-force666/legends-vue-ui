import request from '@/utils/request'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 登录方法
export function wxlogin(appid, code) {
  return request({
    url: '/auth/wxlogin',
    method: 'post',
    data: { appid, code }
  })
}
