import request from '@/utils/request'
export const tasksService = {
  list: function(params) {
    return request({
      url: '/flow/engine-rest/task',
      method: 'get',
      params
    })
  },
  count: function(params) {
    return request({
      url: '/flow/engine-rest/task/count',
      method: 'get',
      params
    })
  },
  complete: function(id, params) {
    return request.post('/flow/engine-rest/task/' + id + '/complete', params)
  },
  renderedForm:function(id, params){
    return request.get('/flow/engine-rest/task/' + id +'/rendered-form', params)
  }
}

