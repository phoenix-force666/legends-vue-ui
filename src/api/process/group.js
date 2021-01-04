import request from '@/utils/request'

// 查询流程组树形结构
export function groupTreelist() {
  return request({
    url: '/process/lge/groups/treelist',
    method: 'get'
  })
}

// 更新流程组树形结构
export function updateTreelist(groupTree) {
  return request({
    url: '/process/lge/groups/treelist',
    method: 'post',
    data: groupTree
  })
}

// 查询【请填写功能名称】列表
export function listGroup(query) {
  return request({
    url: '/process/lge/groups',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getGroup(groupId) {
  return request({
    url: '/process/lge/groups/' + groupId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addGroup(lgeGroup) {
  return request({
    url: '/process/lge/groups',
    method: 'post',
    data: lgeGroup
  })
}

// 修改【请填写功能名称】
export function updateGroup(lgeGroup) {
  return request({
    url: '/process/lge/groups',
    method: 'put',
    data: lgeGroup
  })
}

// 删除组
export function deleteGroup(groupId) {
  return request({
    url: '/process/lge/groups/' + groupId,
    method: 'delete'
  })
}

// 为组添加用户
export function addGroupUsers(groupId, userids) {
  return request({
    url: '/process/lge/groups/' + groupId + '/users',
    method: 'post',
    data: userids
  })
}

// 删除组下用户
export function delGroupUsers(groupId, userids) {
  return request({
    url: '/process/lge/groups/' + groupId + '/users',
    method: 'delete',
    data: userids
  })
}