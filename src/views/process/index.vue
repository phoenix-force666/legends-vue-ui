<template>
  <div class="app-container">
    <BpmnDrawer v-if="dialogFormVisible" ref="bpmndrawer" @close="dialogFormVisible=false" @exportXML="exportXML"/>
    <div v-else>
      <div >
         <el-form :model="listQuery" ref="listQuery" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="模型名称" prop="name">
             <el-input v-model="listQuery.name" :placeholder="'请输入'+$t('flowModel.name')" @keyup.enter.native="handleFilter" />
          </el-form-item>

          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleFilter">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetForm">重置</el-button>
          </el-form-item>
         </el-form>

         <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="addClicked"
              v-hasPermi="['process:definition:add']"
            >新增流程</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table
        v-loading="listLoading"
        :data="objList"
        border
        style="width: 100%;">
        <el-table-column label="id" prop="id" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('flowModel.name')" prop="name" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('flowModel.key')" prop="createDate" align="center" width="240">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('flowModel.tenantId')" prop="tenantId" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.tenantId }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('flowModel.version')" prop="version" align="center" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column width="320" fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleAddOrEdit(scope.row)">绘图</el-button>
            <el-button size="mini" type="success" icon="el-icon-edit" @click="handleFormEdit(scope.row)">编辑表单</el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="renderedStartForm(scope.row)">发起流程</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"/>
    </div>

    <el-dialog
        title="scope.row"
        :v-if="dialogVisible"
        :visible.sync="dialogVisible">
        <div class="formData" v-html="form"></div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="startFlow()">提 交</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="流程定义"
        :visible.sync="addProcessVisible"
        width="80%"
        :v-if="addProcessVisible"
        :before-close="handleClose"
      >
        <process-add :close="close"></process-add>
    </el-dialog>

     <!-- 添加或修改表单定义对话框 -->
    <el-dialog :title="titleForm" v-if="openForm" :visible.sync="openForm"  :fullscreen="true" :before-close="formClose" append-to-body>
        <formGenerator :processFormData="processFormData" :editVisible="editVisible" @save="save" ></formGenerator>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { definitionsService } from '@/api/flow/definitions'
import { deploymentService } from '@/api/flow/deployment'
import { processService } from '@/api/flow/process'
import BpmnDrawer from '@/views/bpmn/bpmnDrawer.vue'
import blankbpmn from '@/views/bpmn/blankbpmn'
import {htmlFormUtils} from '@/utils/htmlFormUtils'
import processAdd from "./processAdd";
import formGenerator from "@/views/tool/build/index";
import {myProcessApplyService} from "@/api/process/myProcess";
import {formEngineService} from "@/api/formEngine/form";

export default {
  name: 'Model',
  components: {
    Pagination,
    BpmnDrawer,
    processAdd,
    formGenerator
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        T: 'success',
        F: 'danger'
      }
      return statusMap[status]
    }
  },
  data: function() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 弹出层标题（表单）
      titleForm: "",
      // 是否显示弹出层(编辑表单)
      openForm: false,
      processFormData:null,
      //表单编辑标识
      editVisible:true,
      isSave:false,
      //流程实例ID
      processDefId:null,
      addProcessVisible: false,
      form:'',
      id:'',
      dialogVisible: false,
      showCheckBox: true,
      editable: false,
      defaultChecked: { checkedpermissions: [], checkedrouters: [] },
      objList: [],
      dialogFormVisible: false,
      listLoading: true,
      total: 0,
      xmlmodel: undefined,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        createDate: undefined,
        latest: true
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.dialogFormVisible = false
      this.listLoading = true
      var _this = this
      definitionsService.count(this.listQuery).then(function(cres) {
        _this.listQuery.firstResult = (_this.listQuery.pageNo - 1) * _this.listQuery.pageSize
        _this.listQuery.maxResults = _this.listQuery.pageNo * _this.listQuery.pageSize
        definitionsService.list(_this.listQuery).then(res => {
          _this.objList = res
          _this.total = cres.count
          _this.listLoading = false
        }, err => {
          console.log(err)
          _this.listLoading = false
        })
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    renderedStartForm:function(item){
        processService.renderedStartForm(item.id, {}).then(res => {
        console.log(res);
        this.form = res;
        this.id=item.id;
        this.dialogVisible = true;
      },
      err => {
        console.log(err);
        this.form ='';
        this.id=item.id;
        this.dialogVisible = true;
      }
      );
    },
    startFlow: function(item) {
         var　parameter=htmlFormUtils.getParameter(".form-control");
      //组装请求报文
      var params={};
      params["variables"]=parameter;

      processService.start(this.id,params).then(function(res) {
        console.log(res)
      });
      this.dialogVisible = false;
    },
    resetForm() {
      this.listQuery = {}
    },
    dateRangeChange(data) {
      if (data) {
        this.listQuery.start_time = data[0]
        this.listQuery.end_time = data[1]
      }
    },
    //绘图
    handleAddOrEdit(item) {
      var _this = this
      this.dialogFormVisible = true
      if (item) {
        definitionsService.getBPMNXML(item.id).then(function(res) {
          _this.$nextTick(() => {
            _this.$refs.bpmndrawer.initCanvas(res.bpmn20Xml, item.id, item.name)
          })
        })
      } else {
        _this.$nextTick(() => {
          _this.$refs.bpmndrawer.initCanvas(blankbpmn, item.id.item.name)
        })
      }
    },
    //编辑表单
    handleFormEdit(item) {
      console.log('item:',item)
      this.processDefId=item.id;
      //获取流程表单
      formEngineService.getFormByProcessDefId(item.id).then(res => {
        if(res.code===200){
          console.log('res:',res)
          if(res.data && res.data.data){
            this.processFormData=res.data.data;
          }else{
            this.isSave=true;
          }
          this.openForm = true;
          this.titleForm = item.name+">表单编辑";
          console.log('this.processFormData:',this.processFormData);
        }
      }, err => {
        console.log(err)
      });

    },
    exportXML: function(xml, filename, modelId) {
      var _this = this
      deploymentService.deployment(xml, filename, _this.$store.getters.name).then(function(res) {
        _this.getList()
      })
    },
    close() {
      this.addProcessVisible = false;
    },
    formClose() {
      this.openForm=false;
      this.processFormData=null;
    },
    addClicked(){
        this.addProcessVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    save(formData){
      console.log('From the child:', formData);
      var savedata={
        "data": {},
        "name": "",
        "processDefId": "",
        "processKey": ""
      };

      savedata.data=formData;
      savedata.processDefId=this.processDefId;
      //无表单
      if(this.isSave){
        formEngineService.save(savedata).then(res =>{
          console.log('res',res);
        });
        //修改表单
      }else{

      }
     
     
     
    }
  }
}

</script>
<style>
</style>
