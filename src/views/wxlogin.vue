<template>
  <div class="wxlogin">
    <lottie-player
      src="https://assets8.lottiefiles.com/packages/lf20_7z8wtyb0.json"
      background="transparent"
      speed="1"
      style="width: 500px; height: 500px"
      loop
      autoplay
    ></lottie-player>
  </div>
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
        agentid: "",
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
      this.wxLoginForm.agentid = this.$route.query.agentid;
      console.log(this.code);
      console.log(this.agentid);
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
.wxlogin {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
}
</style>
