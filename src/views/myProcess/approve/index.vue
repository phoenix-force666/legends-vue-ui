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

      <el-form-item label="流程开始时间" prop="startTime" label-width="98px">
        <el-date-picker clearable size="small" style="width: 150px"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择流程开始时间">
        </el-date-picker>
      </el-form-item>

       <el-form-item label="流程结束时间" prop="endTime" label-width="98px">
        <el-date-picker clearable size="small" style="width: 150px"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择流程结束时间">
        </el-date-picker>
      </el-form-item>


      <el-form-item label="流程状态" prop="state">
        <el-select v-model="queryParams.status" placeholder="请选择发布状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
          <el-option label="ACTIVE" value="ACTIVE" />
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
          type="success"
          icon="el-icon-s-check"
          size="mini"
          :disabled="single"
          @click="handleApprove"
          v-hasPermi="['process:process:approve']"
        >审批</el-button>
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
            icon="el-icon-s-check"
            @click="handleApprove(scope.row)"
            v-hasPermi="['process:process:approve']"
          >审批</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['process:process:info']"
          >详情</el-button>
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
      <approve v-if="open" ></approve>
    </el-dialog>
  </div>
  
</template>

<script>
import {myProcessApproveServcie} from "@/api/process/myProcess";

import {
  exportDefault, beautifierConf, isNumberStr, titleCase ,deepCloneTwo,deepClone
} from '@/utils/index'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html';
import approve from "./approve";
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
export default {
  name: "myProcess",
  components: {
    approve
  },
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        procName: null,
        category: null,
        state: null,
        startTime: null,
        endTime: null
      },
      // 流程数据
      objList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //流程定义ID
      processDefId: "",
      //流程实例ID
      processInstId: "",
      taskId:"",
      taskDefKey:""
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
        title: null,
        procName: null,
        category: null,
        state: null,
        startTime: null,
        endTime: null
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
    /** 审核按钮操作 */
    handleApprove(row) {
      console.log('row:',row)
      this.reset();
      this.open = true;
      this.title = "流程审核";
      this.processDefId=row.processDefId;
      this.processInstId=row.processInstId;
      this.taskId=row.taskId;
      this.taskDefKey=row.taskDefKey;
    },
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