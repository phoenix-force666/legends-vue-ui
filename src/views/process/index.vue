<template>
  <div>
    <el-button @click="addClicked" >新增</el-button>
    <el-dialog
      title="流程定义"
      :visible.sync="addProcessVisible"
      width="80%"
      :before-close="handleClose"
    >
      <process-add :close="close"></process-add>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="addProcessVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProcessVisible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import processAdd from "./processAdd";
export default {
  name: "Index",
  components: {
    processAdd
  },
  data() {
    return {
      addProcessVisible: false
    };
  },
  created() {},
  methods: {
      close() {
 this.addProcessVisible = false;
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
    }

    // 实时检测刷新token
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header{
    display: none  !important;
}
</style>
