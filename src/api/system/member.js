import request from '@/utils/request'

// 查询租户成员（用户/组）列表
export function listMember(query) {
  return request({
    url: '/system/member/list',
    method: 'get',
    params: query
  })
}

// 查询租户成员（用户/组）详细
export function getMember(tenantMemberId) {
  return request({
    url: '/system/member/' + tenantMemberId,
    method: 'get'
  })
}

// 新增租户成员（用户/组）
export function addMember(data) {
  return request({
    url: '/system/member',
    method: 'post',
    data: data
  })
}

// 修改租户成员（用户/组）
export function updateMember(data) {
  return request({
    url: '/system/member',
    method: 'put',
    data: data
  })
}

// 删除租户成员（用户/组）
export function delMember(tenantMemberId) {
  return request({
    url: '/system/member/' + tenantMemberId,
    method: 'delete'
  })
}
