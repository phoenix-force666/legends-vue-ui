import request from '@/utils/request'

// 查询表单部署列表
export function listDeployment(query) {
  return request({
    url: '/formEngine/deployment/list',
    method: 'get',
    params: query
  })
}

// 查询表单部署详细
export function getDeployment(deployId) {
  return request({
    url: '/formEngine/deployment/' + deployId,
    method: 'get'
  })
}

// 新增表单部署
export function addDeployment(data) {
  return request({
    url: '/formEngine/deployment',
    method: 'post',
    data: data
  })
}

// 修改表单部署
export function updateDeployment(data) {
  return request({
    url: '/formEngine/deployment',
    method: 'put',
    data: data
  })
}

// 删除表单部署
export function delDeployment(deployId) {
  return request({
    url: '/formEngine/deployment/' + deployId,
    method: 'delete'
  })
}
