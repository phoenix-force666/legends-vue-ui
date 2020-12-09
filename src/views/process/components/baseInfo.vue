<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <!-- <el-col :span="23"> -->
        <el-col >
          <el-form-item label="流程名称" prop="field102">
            <el-input v-model="formData.field102" placeholder="请输入流程名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col >
        <!-- <el-col :span="23"> -->
          <el-form-item label="流程编码" prop="field103">
            <el-input v-model="formData.field103" placeholder="请输入流程编码" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
        <!-- <el-col :span="23"> -->
          <el-form-item label="流程分类" prop="field104">
            <el-select v-model="formData.field104" placeholder="请选择流程分类" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in field104Options" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
        <!-- <el-col :span="23"> -->
          <el-form-item label="表单类型" prop="field105">
            <el-select v-model="formData.field105" placeholder="请选择表单类型" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in field105Options" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field102: undefined,
        field103: undefined,
        field104: undefined,
        field105: undefined,
      },
      rules: {
        field102: [{
          required: true,
          message: '请输入流程名称',
          trigger: 'blur'
        }],
        field103: [{
          required: true,
          message: '请输入流程编码',
          trigger: 'blur'
        }],
        field104: [{
          required: true,
          message: '请选择流程分类',
          trigger: 'change'
        }],
        field105: [{
          required: true,
          message: '请选择表单类型',
          trigger: 'change'
        }],
      },
      field104Options: [{
        "label": "a类",
        "value": "a"
      }, {
        "label": "b类",
        "value": "b"
      }],
      field105Options: [{
        "label": "自定义表单",
        "value": 1
      }, {
        "label": "外链表单",
        "value": 2
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style>
</style>
