import request from '@/utils/request'

// 我提交的流程
export const formEngineService = {
    //获取流程表单
   getFormByProcessDefId : function(processDefId){
        return request({
        url: '/formEngine/form/'+processDefId,
        method: 'get'
        })
    },
    //获取表单及数据
    getFormInfoByProcessDefId : function(processDefId,processInstId){
        return request({
        url: '/formEngine/form/'+processDefId+'/'+processInstId,
        method: 'get'
        })
    },
    //保存表单及数据
    save : function(data){
        return request({
            url: '/formEngine/form',
            method: 'post',
            data: data
        })
    },
    // 修改表单
    upsertById: function(data) {
        return request({
        url: '/formEngine/form',
        method: 'put',
        data: data
        })
    },
}
