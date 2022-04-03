import request from '@/utils/request'

// 获取品牌列表
export function reqTradeMarkList(page, limit) {
  return request({
    url: `/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

export function reqAddOrUpdateTradeMark(data) {
  if (data.id) {
    return request({
      url: '/product/baseTrademark/update',
      method: 'put',
      data
    })
  } else {
    return request({
      url: '/product/baseTrademark/save',
      method: 'post',
      data
    })
  }
}

export function reqDeleteTradeMark(id) {
  return request({
    url: `/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
