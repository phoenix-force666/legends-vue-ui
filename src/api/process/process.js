import request from '@/utils/request'

// 流程
export const processService = {
  //初始化
  init: function (data) {
    return request({
      url: '/process/process/init',
      method: 'post',
      data: data
    })
  },

   //审批
   approve: function (data) {
    return request({
      url: '/process/process/approve',
      method: 'post',
      data: data
    })
  },

   //流程撤回
   undo: function (data) {
    return request({
      url: '/process/process/undo',
      method: 'post',
      data: data
    })
  },

   //流程驳回
   rollback: function (data) {
    return request({
      url: '/process/process/rollback',
      method: 'post',
      data: data
    })
  },
}