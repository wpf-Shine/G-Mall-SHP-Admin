import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/index/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/index/logout',
    method: 'post'
  })
}
