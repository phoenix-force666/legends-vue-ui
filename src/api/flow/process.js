import request from '@/utils/request'

export const processService = {
  start: function(processDefinitionId,params) {
    return request.post('/flow/engine-rest/process-definition/' + processDefinitionId + '/start', params)
  },
  renderedStartForm:function(processDefinitionId, params){
    return request.get('/flow/engine-rest/process-definition/' + processDefinitionId + '/rendered-form', params)
  }
}

