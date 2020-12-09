<template>
  <div class="container">
    <div class="header">
      <el-steps class="step" :active="active" simple>
        <el-step title="基础信息"></el-step>
        <el-step title="表单设计"></el-step>
        <el-step title="流程设计"></el-step>
      </el-steps>
      <el-button class = "topBtn"  size="small" style="margin-top: 12px;" @click="last">上一步</el-button>
      <el-button class = "topBtn"  size="small" style="margin-top: 12px;" @click="next">下一步</el-button>
      <el-button class = "topBtn"  size="small" style="margin-top: 12px;" @click="confirm">确定</el-button>
      <el-button class = "topBtn"  size="small" style="margin-top: 12px;" @click="reset">取消</el-button>
    </div>
    <div class = "con">
        <base-info v-if="active==0"></base-info>
        <form-build v-if="active==1"></form-build>
        <bpmn  v-if="active==2"></bpmn>
    </div>
  </div>
</template>

<script>
import baseInfo from './components/baseInfo'
// import formBuild from '@/views/tool/build'
import formBuild from './components/formBuild'
import bpmn from './components/bpmn'
export default {
  name: "Index",
  components: {
      baseInfo,
      formBuild,
      bpmn
  },
  props:{
      close: Function
  },
  data() {
    return {
      active: 0
    };
  },
  created() {},
  methods: {
      confirm(){

      },
      reset(){
          this.close();

      },
    last() {
      if (this.active-- < 1) this.active = 0;
    },
    next() {
      console.log(this.active);
      if (this.active++ > 1) this.active = 2;
    }
    // 实时检测刷新token
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-steps--simple{
    background: #fff;
}
/deep/ .v-model{
    display:none !important;
}
.container{
    position: relative;
    .header{
        display: flex;
        background-color: #fff;
        .step {
            flex: 8;
        }
        .topBtn{
            flex: 1;
        }
    }
    .con{
        // height:100%;
        margin-top: 30px;
        padding-top: 20px;
    }
}
</style>
