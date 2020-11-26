import request from '@/utils/request'

export const deploymentService = {
  list: function(params) {
    if (!params) {
      params = {}
      params.name = ''
    }
    return request({
      url: '/flow/engine-rest/deployment',
      method: 'get',
      params
    }, { indices: false })
  },
  count: function(params) {
    return request({
      url: '/flow/engine-rest/deployment/count',
      method: 'get',
      params
    })
  },
  deployment: function(xml, filename, tenantId) {
    const param = new FormData()
    param.append('tenant-id', tenantId)
    param.append('enable-duplicate-filtering', true)
    param.append('deployment-source', 'process application')
    param.append('deployment-name', filename)
    param.append('file', new Blob([xml], { type: 'text/xml' }), filename)
    return request.post('/flow/engine-rest/deployment/create', param, { headers: { 'Content-Type': 'multipart/form-data' }})
  },
  redeploy: function(xml, filename, tenantId, id) {
    const param = new FormData()
    param.append('tenant-id', tenantId)
    param.append('enable-duplicate-filtering', true)
    param.append('deploy-changed-only', true)
    param.append('deployment-source', 'process application')
    param.append('deployment-name', filename)
    param.append('file', new Blob([xml], { type: 'text/xml' }), filename)
    return request.post('/flow/engine-rest//deployment/' + id + '/redeploy', param, { headers: { 'Content-Type': 'multipart/form-data' }})
  },
  resources: function(id) {
    return request.get('/flow/engine-rest/deployment/' + id + '/resources')
  },
  delete: function(id) {
    return request.delete('/flow/engine-rest/deployment/' + id)
  }
}

