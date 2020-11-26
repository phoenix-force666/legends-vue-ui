import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listGroup(query) {
  return request({
    url: '/system/group/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addGroup(data) {
  return request({
    url: '/system/group',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateGroup(data) {
  return request({
    url: '/system/group',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delGroup(groupId) {
  return request({
    url: '/system/group/' + groupId,
    method: 'delete'
  })
}
