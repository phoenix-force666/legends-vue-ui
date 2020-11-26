export const htmlFormUtils={
    // 封装方法，获取到form表单的数据。使用此方法，表单元素必须存在name属性。
    //el:元素的class名称。
    getParameter: function(el){
        var obj={};
        $(el).each(function(index,item){
            var temp={};
            // 判断元素的类型
            if(item.type=="text" || item.type=="password" || item.type=="select-one"  || item.type=="tel"  || 
                item.type=="search" || item.type=="range" || item.type=="number" || item.type=="month" || 
                item.type=="email" || item.type=="datetime-local" || item.type=="datetime" || item.type=="date" || 
                item.type=="color"){
                //获取到name的值,name的值就是向后台传递的数据
                obj[$(this).attr("name")]=$(this).val();
                temp["value"]=$(this).val();
                temp["type"]=$(this).attr("cam-variable-type");
                temp["valueInfo"]={};
            }else if(item.type=="checkbox"){
                var stamp=true;
                console.log($(this).attr("name"))
                if($(this).attr("name") && stamp){
                    stamp=false;
                    // 获取到复选框选中的元素
                    var checkboxEl=$("input[name="+$(item).attr('name')+"]:checked");
                    console.log("checkboxEl:"+checkboxEl);
                    if(checkboxEl){
                        var checkboxArr=[];
                        // 取出复选框选中的值
                        checkboxEl.each(function(idx,itm){
                            // checkboxArr.push($(itm).val());
                            checkboxArr.push(true);
                            console.log("选中的值："+$(itm).val());
                        });

                        if(checkboxArr.length===0){
                        checkboxArr.push(false);
                        console.log('未选中'); 
                        }
                        obj[$(this).attr("name")]=checkboxArr.join(",");
                        temp["value"]=checkboxArr.join(",");
                        temp["type"]=$(this).attr("cam-variable-type");
                        temp["valueInfo"]={};
                    }
                    
                }
            }else if(item.type=="radio"){
                // 获取到单选框选中的值
                var radio_val=$("input[name="+$(item).attr('name')+"]:checked").val();
                if(radio_val){
                    obj[$(item).attr("name")]=radio_val;
                    temp["value"]=radio_val;
                    temp["type"]=$(this).attr("cam-variable-type");
                    temp["valueInfo"]={};
                }
            }

            obj[$(this).attr("name")]=temp;
        });
        return obj;
    }
}


export const processService = {
    start: function(processDefinitionId,params) {
      return request.post('/flow/engine-rest/process-definition/' + processDefinitionId + '/start', params)
    },
    renderedStartForm:function(processDefinitionId, params){
      return request.get('/flow/engine-rest/process-definition/' + processDefinitionId + '/rendered-form', params)
    }
  }