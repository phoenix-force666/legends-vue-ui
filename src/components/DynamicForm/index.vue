<template>
    <div></div>
</template>

<script>
export default {
  name: "DynamicForm",
  props: {
      formConfig: {type:Object,required:true},
      value:{type:Object,required:true},
      disabled:{type:Boolean,required:true},
  },
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    this.init();
  },
  methods: {
  },
};
</script>

<style>

</style>