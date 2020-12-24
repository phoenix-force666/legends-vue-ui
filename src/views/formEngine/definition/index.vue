<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户" prop="tenantId">
        <el-input
          v-model="queryParams.tenantId"
          placeholder="请输入租户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单定义名称" prop="definitionName">
        <el-input
          v-model="queryParams.definitionName"
          placeholder="请输入表单定义名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单定义key" prop="definitionKey">
        <el-input
          v-model="queryParams.definitionKey"
          placeholder="请输入表单定义key"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单定义描述" prop="definitionDesc">
        <el-input
          v-model="queryParams.definitionDesc"
          placeholder="请输入表单定义描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单部署ID" prop="deploymentId">
        <el-input
          v-model="queryParams.deploymentId"
          placeholder="请输入表单部署ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单数据ID(存放在mongodb中）" prop="dataId">
        <el-input
          v-model="queryParams.dataId"
          placeholder="请输入表单数据ID(存放在mongodb中）"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单定义分类" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入表单定义分类"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createUser">
        <el-input
          v-model="queryParams.createUser"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateUser">
        <el-input
          v-model="queryParams.updateUser"
          placeholder="请输入修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['formEngine:definition:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['formEngine:definition:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['formEngine:definition:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['formEngine:definition:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="definitionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单定义ID" align="center" prop="definitionId" />
      <el-table-column label="租户" align="center" prop="tenantId" />
      <el-table-column label="表单定义名称" align="center" prop="definitionName" />
      <el-table-column label="表单定义key" align="center" prop="definitionKey" />
      <el-table-column label="表单定义描述" align="center" prop="definitionDesc" />
      <el-table-column label="表单部署ID" align="center" prop="deploymentId" />
      <el-table-column label="表单数据ID(存放在mongodb中）" align="center" prop="dataId" />
      <el-table-column label="表单定义分类" align="center" prop="categoryId" />
      <el-table-column label="创建人" align="center" prop="createUser" />
      <el-table-column label="修改人" align="center" prop="updateUser" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['formEngine:definition:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['formEngine:definition:remove']"
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

    <!-- 添加或修改表单定义对话框 -->
    <el-dialog :title="title" :visible.sync="open"  :fullscreen="true"  append-to-body>

      <el-steps :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="表单设计"></el-step>
        <el-step title="流程设计"></el-step>
      </el-steps>

      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <!-- 表单基本信息 -->
      <div class="info" v-if="active==1">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px">
          <el-form-item label="租户" prop="tenantId">
            <el-input v-model="form.tenantId" placeholder="请输入租户" />
          </el-form-item>
          <el-form-item label="表单定义名称" prop="definitionName">
            <el-input v-model="form.definitionName" placeholder="请输入表单定义名称" />
          </el-form-item>
          <el-form-item label="表单定义key" prop="definitionKey">
            <el-input v-model="form.definitionKey" placeholder="请输入表单定义key" />
          </el-form-item>
          <el-form-item label="表单定义描述" prop="definitionDesc">
            <el-input v-model="form.definitionDesc" placeholder="请输入表单定义描述" />
          </el-form-item>
          <el-form-item label="表单部署ID" prop="deploymentId">
            <el-input v-model="form.deploymentId" placeholder="请输入表单部署ID" />
          </el-form-item>
          <el-form-item label="表单数据ID(存放在mongodb中）" prop="dataId">
            <el-input v-model="form.dataId" placeholder="请输入表单数据ID(存放在mongodb中）" />
          </el-form-item>
          <el-form-item label="表单定义分类" prop="categoryId">
            <el-input v-model="form.categoryId" placeholder="请输入表单定义分类" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>

    <!-- 表单设计 -->
    <div class="info" v-if="active==2">
     <formGenerator></formGenerator>
    </div>
    <!-- 完成-->
    <div class="info" v-if="active==3">
      
    </div>
  

    </el-dialog>
  </div>
</template>

<script>
import { listDefinition, getDefinition, delDefinition, addDefinition, updateDefinition } from "@/api/formEngine/definition";
import formGenerator from "@/views/tool/build/index";

export default {
  name: "Definition",
  components:{
    formGenerator
  },
  data() {
    return {
      active:1,
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
      // 表单定义表格数据
      definitionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tenantId: null,
        definitionName: null,
        definitionKey: null,
        definitionDesc: null,
        deploymentId: null,
        dataId: null,
        categoryId: null,
        createUser: null,
        updateUser: null,
        version: null
      },
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
    /** 查询表单定义列表 */
    getList() {
      this.loading = true;
      listDefinition(this.queryParams).then(response => {
        this.definitionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //下一步
    next() {
        if (this.active++ > 2) this.active = 0;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        definitionId: null,
        tenantId: null,
        definitionName: null,
        definitionKey: null,
        definitionDesc: null,
        deploymentId: null,
        dataId: null,
        categoryId: null,
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
      this.ids = selection.map(item => item.definitionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "表单定义";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const definitionId = row.definitionId || this.ids
      getDefinition(definitionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改表单定义";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.definitionId != null) {
            updateDefinition(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDefinition(this.form).then(response => {
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
      const definitionIds = row.definitionId || this.ids;
      this.$confirm('是否确认删除表单定义编号为"' + definitionIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDefinition(definitionIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('formEngine/definition/export', {
        ...this.queryParams
      }, `formEngine_definition.xlsx`)
    }
  }
};
</script>