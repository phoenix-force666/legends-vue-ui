import request from '@/utils/request'
export const tasksService = {
  list: function(params) {
    return request({
      url: '/flow/rest/task',
      method: 'get',
      params
    })
  },
  count: function(params) {
    return request({
      url: '/flow/rest/task/count',
      method: 'get',
      params
    })
  },
  complete: function(id, params) {
    return request.post('/flow/rest/task/' + id + '/complete', params)
  },
  renderedForm:function(id, params){
    return request.get('/flow/rest/task/' + id +'/rendered-form', params)
  }
}

