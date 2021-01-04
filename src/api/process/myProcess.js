import request from '@/utils/request'

// 我提交的流程
export const myProcessApplyService = {
  //列表
  applyList: function (query) {
    return request({
      url: '/process/myProcess/apply/list',
      method: 'get',
      params: query
    })
  },
  //获取流程表单
   getProcessFormByProcessDefId : function(processDefId){
    return request({
      url: '/process/processFromRel/form/'+processDefId,
      method: 'get'
    })
  },
   //获取表单及数据
   getProcessFormInfoByProcessDefId : function(processDefId,processInstId){
    return request({
      url: '/process/processFromRel/form/'+processDefId+'/'+processInstId,
      method: 'get'
    })
  },
}

// 待办事项
export const myProcessApproveServcie={
  //列表
  approveList: function (query) {
    return request({
      url: '/process/myProcess/approve/list',
      method: 'get',
      params: query
    })
  }
}