<template>
  <div class="wxlogin"></div>
</template>
<script>
import { getCodeImg } from "@/api/login";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      wxLoginForm: {
      code: "",
      appid: "",
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
  },
  mounted() {
    this.handleLogin();
  },
  methods: {
    getCode() {
      this.wxLoginForm.code = this.$route.query.code;
      this.wxLoginForm.appid = this.$route.query.appid;
      console.log(this.code);
    },
    handleLogin() {
      this.$store
        .dispatch("WxLogin", this.wxLoginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || "/" });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
