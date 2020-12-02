import request from '@/utils/request'
import aa from '@/utils/aa'
export const definitionsService = {
  list: function(params) {
    if (!params) {
      params = {}
      params.name = ''
    }
    return request({
      url: '/flow/engine-rest/process-definition',
      method: 'get',
      params
    })
  },
  count: function(params) {
    return request({
      url: '/flow/engine-rest/process-definition/count',
      method: 'get',
      params
    })
  },
  getBPMNXML: function(id) {
    return request({
      url: '/flow/engine-rest/process-definition/' + id + '/xml',
      method: 'get'
    })
  },
  aa: function(id) {
  return aa({
      url: '/api/rtsmboradod/api/wisdomSite/people/v2/team/groupDay?dayType=1',
      method: 'get'
    })
  }

}

