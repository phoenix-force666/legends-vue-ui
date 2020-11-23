import request from '@/utils/request'

export const processService = {
  start: function(processDefinitionId,params) {
    return request.post('/flow/rest/process-definition/' + processDefinitionId + '/start', params)
  },
  renderedStartForm:function(processDefinitionId, params){
    return request.get('/flow/rest/process-definition/' + processDefinitionId + '/rendered-form', params)
  }
}

