<template>
  <div class="container">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 流程表单</span>
        <parser v-if="open"  ref="parser" :form-conf="processForm" @submit="sumbitProcess"/>
      </el-tab-pane>
      <el-tab-pane label="流程图">流程图</el-tab-pane>
      <el-tab-pane label="审批记录">审批记录</el-tab-pane>
    </el-tabs>

    <div>
      <!-- <tinymce v-model="approvalComments" placeholder="请输入签字意见" :height="300"></tinymce> -->
      <el-input v-model="approvalComments" type="textarea" placeholder="请输入审批意见" :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      <el-button type="primary" class = "topBtn"  size="small" style="margin-top: 12px;" @click="approve">通过</el-button>
      <el-button type="danger"  class = "topBtn"  size="small" style="margin-top: 12px;" @click="rollback">驳回</el-button>
      <el-button class = "topBtn"  size="small" style="margin-top: 12px;" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import Parser from '@/components/parser'
import {myProcessApplyService} from "@/api/process/myProcess";
import {processService} from "@/api/process/process";
import {formEngineService} from "@/api/formEngine/form";

export default {
  name: "myProcess",
  components: {
    Parser
  },
  data() {
    return {
      // 遮罩层
      loading: true,
       //表单数据
      processForm: "",
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表单部署表格数据
      approveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
      },
      formData:{},
      //流程实例ID
      processInstId:"",
      taskId:"",
      taskDefKey:"",
      processDefId:"",
      approvalComments:""
    };
  },
  created() {
    this.processDefId=this.$parent.$parent.processDefId;
    this.processInstId=this.$parent.$parent.processInstId;
    this.taskId=this.$parent.$parent.taskId;
    this.taskDefKey=this.$parent.$parent.taskDefKey;
    //获取流程表单
    formEngineService.getFormInfoByProcessDefId(this.processDefId,this.processInstId).then(res => {
       
      if(res.code===200){
        if(res.data){
          this.processForm=res.data.form;
          this.formData=res.data.formData;
          if(this.processForm && this.formData){
            this.fillFormData(this.processForm,this.formData);
          }
          
        }
        this.open=true;
      }
      
    }, err => {
      console.log(err)
    });
  },
  methods: {
    // 取消按钮
    cancel() {
      // this.open = false;
      this.$parent.$parent.open=false;
    },
    //审批通过
    approve(){
        var data={
        // "formData": {},
        // "jumpType": "string",
        "localVariables": {},
        // "nextUserId": "string",
        // "processBusinessKey": "string",
        "processDefId": "",
        // "processDefKey": "string",
        "processInstId": "",
        // "rejectType": "string",
        // "starter": "string",
        "taskDefKey": "",
        "taskId": "",
        // "title": "string",
        // "toActId": "string",
        // "userId": "string",
        "variables": {}
      };
      data.processInstId=this.processInstId;
      data.taskId=this.taskId;
      data.taskDefKey=this.taskDefKey;
      data.processDefId=this.processDefId;
      //审批通过
      data.variables=this.$refs.parser.formData;
      processService.approve(data).then(res => {
        if(res.code==='0000'){
          this.$parent.$parent.open=false;
          this.$parent.$parent.getList();
        }
      }, err => {
        console.log(err)
      });
    },

    //驳回表单
    rollback(){
      var data={
        // "formData": {},
        // "formId": 0,
        // "jumpType": "string",
        "localVariables": {},
        // "nextUserId": "string",
        // "processBusinessKey": "string",
        // "processDefId": "string",
        // "processDefKey": "string",
        "processInstId": "",
        "rejectType": "2",
        // "starter": "string",
        // "taskDefKey": "string",
        "taskId": "",
        // "title": "string",
        // "toActId": "string",
        // "userId": "string",
        "variables": {}
      };
      data.processInstId=this.processInstId;
      data.taskId=this.taskId;
      data.taskDefKey=this.taskDefKey;
      console.log('驳回请求参数：',data);
      processService.rollback(data).then(res => {
        console.log('res:',res);
        if(res.code==='0000'){
          this.$parent.$parent.open=false;
          this.$parent.$parent.getList();
        }
      }, err => {
        console.log(err)
      });
    },
    sumbitProcess(){

    },
    //回填数据
    fillFormData(form, data) {
      form.fields.forEach(item => {
        const val = data[item.__vModel__]
        if (val) {
          item.__config__.defaultValue = val
        }
      })
    },
  }
};

</script>

<style  lang="scss" scoped>
  
</style>