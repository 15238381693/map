<template>
  <div class="home">
    <div v-for="(item, index) in homeList" :key="index">
      <div class="listBox" @click="toBooking(item.type)">
        <span>{{ item.name }}</span> <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBooking',
  data() {
    return {
      homeList: [
        {
          name: '1.建设工程档案咨询预约服务（房建）',
          type: '01'
        },
        {
          name: '2.建设工程档案咨询预约服务（市政道路）',
          type: '02'
        },
        {
          name: '3.建设工程档案咨询预约服务（市政地下管线）',
          type: '03'
        },
        {
          name: '4.建设工程档案咨询预约服务（市政桥梁工程）',
          type: '04'
        },
        {
          name: '5.建设工程档案咨询预约服务（其他）',
          type: '99'
        }
      ]
    }
  },
  methods: {
    toBooking(type) {
      this.$router.push({ path: '/consultbook', query: { type } })
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  padding: 20px;
  background: #f5f5f5;
  .listBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
}
</style>
