<template>
  <div class="success">
    <div class="content">
      <img :src="require('../assets/success.png')" alt="" />
      <p>提交成功</p>
      <div class="back" @click="goBack">返回</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Success',
  data() {
    return {}
  },
  methods: {
    goBack() {
      this.$router.replace('/home')
    }
  }
}
</script>
<style lang="less" scoped>
.success {
  width: 100%;
  background-color: #f5f5f5;
  padding-top: 70px;
  .content {
    img {
      display: block;
      width: 70px;
      height: 70px;
      margin: 0 auto;
      // margin-top: 80px;
    }
    p {
      width: 100%;
      text-align: center;
      height: 25px;
      margin: 0 auto;
      margin-top: 16px;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      line-height: 25px;
    }
    .back {
      width: 180px;
      height: 38px;
      margin: 0 auto;
      margin-top: 50px;
      background: #2f8eff;
      border-radius: 23px;
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 38px;
    }
  }
}
</style>
