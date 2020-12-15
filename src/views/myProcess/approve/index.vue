<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流程标题" prop="title">
        <el-input
          v-model="queryParams.procName"
          placeholder="所属流程"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="流程分类" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择流程分类" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>

      <el-form-item label="流程开始时间" prop="startTime" >
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择流程开始时间">
        </el-date-picker>
      </el-form-item>

       <el-form-item label="流程结束时间" prop="endTime" >
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择流程结束时间">
        </el-date-picker>
      </el-form-item>


      <el-form-item label="流程状态" prop="state">
        <el-select v-model="queryParams.status" placeholder="请选择发布状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['process:myProcess:list']"
        >新建流程</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['process:myProcess:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['process:myProcess:remove']"
        >删除</el-button>
      </el-col>
  
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="approveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程标题" align="center" prop="title" />
      <el-table-column label="所属流程" align="center" prop="procName" />
      <el-table-column label="所属流程分类" align="center" prop="category" />
       <el-table-column label="流程状态" align="center" prop="state" />
      <el-table-column label="流程开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
     <el-table-column label="流程结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前节点" align="center" prop="taskName" />
      <el-table-column label="当前审批人" align="center" prop="assignee" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['process:myProcess:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['process:myProcess:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 流程选择 -->
    <el-dialog class="dialog-myProcess-sr" :title="title" :visible.sync="open"  width="100%" append-to-body>
      <div class="list-obj">
          <el-card class="list-item" @click.native="createProcess(processObj)" v-for="(processObj, index) in objList" :key="index" :offset="index > 0 ? objList : 0" :body-style="{ padding: '0px' }">
           
            <svg class="iconxinfangtousu" v-if="index%2===0" aria-hidden="true">
              <use xlink:href="#iconxinfangtousu"></use>
            </svg>

            <svg class="icontousugongdan-copy" v-if="index%2===1" aria-hidden="true">
              <use xlink:href="#icontousugongdan-copy"></use>
            </svg>

            <div style="padding: 14px;">
              <span>{{ processObj.name }}</span>
            </div>
          </el-card>
      </div>
    </el-dialog>




    <!-- 流程表单 -->
    <el-dialog :title="processTitle" :visible.sync="processOpen" width="800px" append-to-body>
      <div v-html = 'processFormData'></div>
    </el-dialog>
    
  </div>
</template>

<script>
import {myProcessApproveServcie} from "@/api/process/myProcess";
import { definitionsService } from '@/api/flow/definitions';

import {
  exportDefault, beautifierConf, isNumberStr, titleCase ,deepCloneTwo,deepClone
} from '@/utils/index'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/utils/generator/html'
import { makeUpJs } from '@/utils/generator/js'
import { makeUpCss } from '@/utils/generator/css'
export default {
  name: "myProcess",
  data() {
    return {
      // 遮罩层
      loading: true,
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

      // 流程表单标题
      processTitle:"",
      // 是否显示流程表单弹出层
      processOpen: false,
      //表单数据
      processFormData: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deployName: null,
        deployTime: null,
        status: null,
        tenantId: null,
        source: null,
        createUser: null,
        updateUser: null,
        version: null
      },
      // 流程数据
      objList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询表单部署列表 */
    getList() {
      this.loading = true;
      myProcessApproveServcie.approveList(this.queryParams).then(response => {
        this.approveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deployId: null,
        deployName: null,
        deployTime: null,
        status: 0,
        tenantId: null,
        source: null,
        createUser: null,
        updateUser: null,
        createTime: null,
        updateTime: null,
        version: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deployId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新建流程";

      definitionsService.list({}).then(res => {
        this.objList = res
      }, err => {
        console.log(err)
      })

    },
    createProcess(row){
      console.log('row:',row)
      this.open = false;
      this.processTitle = "流程表单";
      this.processOpen=true;
      var type='file';
      var formDataJson={
  "fields": [{
    "layout": "colFormItem",
    "tagIcon": "input",
    "label": "手机号",
    "vModel": "mobile",
    "formId": 6,
    "tag": "el-input",
    "placeholder": "请输入手机号",
    "defaultValue": "",
    "span": 24,
    "style": {
      "width": "100%"
    },
    "clearable": true,
    "prepend": "",
    "append": "",
    "prefix-icon": "el-icon-mobile",
    "suffix-icon": "",
    "maxlength": 11,
    "show-word-limit": true,
    "readonly": false,
    "disabled": false,
    "required": true,
    "changeTag": true,
    "regList": [{
      "pattern": "/^1(3|4|5|7|8|9)\\d{9}$/",
      "message": "手机号格式错误"
    }]
  }],
  "formRef": "elForm",
  "formModel": "formData",
  "size": "medium",
  "labelPosition": "right",
  "labelWidth": 100,
  "formRules": "rules",
  "gutter": 15,
  "disabled": false,
  "span": 24,
  "formBtns": true
};
      this.processFormData = vueTemplate(makeUpHtml(formDataJson, type))
      console.log("html:",this.processFormData);
      // =html;
    

      "<div>" +
       " <el-form ref=\"elForm\" :model=\"formData\" :rules=\"rules\" size=\"medium\" label-width=\"100px\">" +
        "  <el-form-item label=\"单行文本\" prop=\"field103\">"+
         "   <el-input v-model=\"formData.field103\" placeholder=\"请输入单行文本\" clearable :style=\"{width: '100%'}\">"+
          "  </el-input>" +
          "</el-form-item>"+
          "<el-form-item size=\"large\">"+
            "<el-button type=\"primary\" @click=\"submitForm\">提交</el-button>"+
            "<el-button @click=\"resetForm\">重置</el-button>"+
          "</el-form-item>"+
        "</el-form>"+
      "</div>";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deployId = row.deployId || this.ids
      getDeployment(deployId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改表单部署";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deployId != null) {
            updateDeployment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDeployment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deployIds = row.deployId || this.ids;
      this.$confirm('是否确认删除表单部署编号为"' + deployIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDeployment(deployIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};

</script>

<style  lang="scss" scoped>
  .image {
    width: 100%;
    display: block;
  }

  
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .list-obj{
    display: flex;
    // justify-content: space-around; 
    align-items: center;

  }
  .list-item{
    margin:0 10px;
    padding: 10px 0;
    text-align: center;
    border-radius: 10%;
    // background-color: #ff8800;
  }
   .dialog-myProcess-sr{
    transition: margin-left .28s;
    margin-left: 200px;
    height: 100vh;
  }
  /deep/ .iconxinfangtousu,.icontousugongdan-copy{
    width: 48px;
    height: 48px;
    margin: 0 auto;
  }

  /deep/ .el-icon-s-promotion{
    font-size: 48px;
    text-align: center;
  }



  
</style>