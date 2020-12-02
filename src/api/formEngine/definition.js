import request from '@/utils/request'

// 查询表单定义列表
export function listDefinition(query) {
  return request({
    url: '/formEngine/definition/list',
    method: 'get',
    params: query
  })
}

// 查询表单定义详细
export function getDefinition(definitionId) {
  return request({
    url: '/formEngine/definition/' + definitionId,
    method: 'get'
  })
}

// 新增表单定义
export function addDefinition(data) {
  return request({
    url: '/formEngine/definition',
    method: 'post',
    data: data
  })
}

// 修改表单定义
export function updateDefinition(data) {
  return request({
    url: '/formEngine/definition',
    method: 'put',
    data: data
  })
}

// 删除表单定义
export function delDefinition(definitionId) {
  return request({
    url: '/formEngine/definition/' + definitionId,
    method: 'delete'
  })
}
