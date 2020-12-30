<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg">
      <el-col :span="4" class="group-treelist">
        <div>
          <div class="gt-hd"></div>
          <div class="gt-bd">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              @click="handleAddLvOne"
              v-hasPermi="['system:group:add']"
              >新增一级分组</el-button
            >
            <el-tree
              class="filter-tree"
              :data="groupOptions"
              :props="defaultProps"
              :filter-node-method="filterNode"
              :render-content="renderContent"
              @node-click="showGroupUsers"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              ref="tree"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="19">
        <div class="group-users">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
          >
            <el-form-item label="组名称" prop="groupName">
              <el-input
                v-model="queryParams.groupName"
                placeholder="请输入组名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="queryParams.groupName"
                placeholder="请输入用户名"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="cyan"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5"> </el-col>
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar>
          </el-row>

          <el-table
            v-loading="loading"
            :data="users"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="账号" align="center" prop="userId" />
            <el-table-column label="姓名" align="center" prop="userName" />
            <el-table-column label="邮箱" align="center" prop="email" />
            <el-table-column label="部门" align="center" prop="dept" />
            <el-table-column label="角色" align="center" prop="role" />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:group:remove']"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>
    <!-- 添加或修改用户组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!--         <el-form-item label="组类型" prop="groupType">
          <el-select v-model="form.groupType" placeholder="请选择组类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="组名称" prop="groupName">
          <el-input v-model="form.group.name" placeholder="请输入组名称" />
        </el-form-item>
        <el-form-item v-if="form.group.id" label="组用户" prop="groupUsers">
          <el-transfer
            filterable
            filter-placeholder="请输入姓名"
            v-model="editGroupUsers"
            :data="editAllGroupUsers"
            :titles="['未出战', '已出战']"
            :button-texts="['休养', '出战']"
            @change="changeGroupMember"
          >
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroupUsers } from "@/api/system/group";
import {
  groupTreelist,
  addGroup,
  updateGroup,
  deleteGroup,
  getGroup,
  addGroupUsers,
  delGroupUsers,
} from "@/api/process/group";

export default {
  name: "Group",
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
      // 用户组表格数据
      users: [],
      // 是否添加一级组
      isLvOne: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 过滤文本
      filterText: "",
      // 组树当前节点
      currentNode: null,
      // 组树当前节点数据
      currentData: null,
      // 组树当前节点父节点
      parentNode: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        username: null,
      },
      // 表单参数
      form: {
        //默认父级组ID
        parentId: "0",
        group: {
          id: null,
          name: null,
        },
      },
      // 表单校验
      rules: {},
      // 组树形结构
      groupOptions: [],

      // 已选组用户
      editGroupUsers: [],
      // 所有用户
      editAllGroupUsers: [],

      // 树形结构默认属性
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.getList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    /** 查询用户组列表 */
    getList() {
      this.loading = true;
      groupTreelist().then((response) => {
        this.groupOptions = response.groupOptions;
        this.loading = false;
      });
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return groupOptions.label.indexOf(value) !== -1;
    },
    // 渲染节点操作按钮
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="success"
              on-click={() => this.addSubGroup(data)}
              circle
            >
              添加
            </el-button>
            <el-button
              size="mini"
              type="primary"
              on-click={() => this.editGroup(node, data)}
              circle
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              on-click={() => this.delGroup(node, data)}
              circle
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    //添加子组
    addSubGroup(data) {
      console.log(data);
      this.reset();
      this.currentData = data;
      this.handleAdd();/* 
      const newChild = { id: 1000, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild); */
    },
    editGroup(node, data) {
      console.log(node);
      console.log(data);
      this.reset();
      this.currentNode = node;
      this.currentData = data;
      const groupId = data.id || this.ids;
      getGroup(groupId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户组";
      });
    },
    delGroup(node, data) {
      console.log(data);
      this.currentNode = node;
      this.currentData = data;
      this.parentNode = node.parent;
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      deleteGroup(node.id).then((response) => {
        children.splice(index, 1);
      });
    },
    // 添加一级组
    handleAddLvOne(node) {
      this.reset();
      console.log("in: " + node);
      this.handleAdd();
    },
    // 点击组后展示用户
    showGroupUsers(data) {
      console.log(data);
      getGroupUsers(data.id).then((response) => {
        console.log(response);
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
        parentId: "0",
        group: {
          id: null,
          name: null,
        },
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
      this.ids = selection.map((item) => item.groupId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加用户组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const groupId = row.groupId || this.ids;
      getGroup(groupId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.groupId != null) {
            updateGroup(this.form).then((response) => {
              //if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              //}
            });
          } else {
            addGroup(this.form).then((response) => {
              //if (response.code === 200) {
                console.log(response);
                this.msgSuccess("新增成功");

                const newChild = {
                  id: response.data,
                  label: this.form.group.name,
                  children: [],
                };
                if ("0" == this.form.parentId) {
                  this.groupOptions.push(newChild);
                } else {
                  if (!this.currentData.children) {
                    this.$set(this.currentData, "children", []);
                  }
                  this.currentData.children.push(newChild);
                  //this.getList();
                }
                  this.open = false;
              //}
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const groupIds = row.groupId || this.ids;
      this.$confirm(
        '是否确认删除用户组编号为"' + groupIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return this.delGroup(groupIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/group/export",
        {
          ...this.queryParams,
        },
        `system_group.xlsx`
      );
    },
    /**
     * 组编辑界面人员变动
     */
    changeGroupMember(value, direction, movedKeys) {
      // TODO: 添加更友好的操作反馈，人数、提醒
      if ("left" == direction) {
        delGroupUsers(this.form.group.id, movedKeys);
      } else if ("right" == direction) {
        addGroupUsers(this.form.group.id, movedKeys);
      }
    },
    /** 组拖拽相关操作 */
    // 拖动开始
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    // 拖动进入
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    // 拖动离开
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    // 拖动悬浮
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    // 拖动结束
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    // 处理拖动
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    // 允许释放，tree内置方法
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    // 允许拖动，tree内置方法
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.group-treelist {
box-shadow: inset 0 0 6px 0px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    background-color: #FEFEFE;
    padding: 10px;
    overflow: auto;
    height: 100%;
}
</style>