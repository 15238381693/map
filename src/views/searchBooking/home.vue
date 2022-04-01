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
          name: '1.建设工程档案查询预约服务（建筑）',
          type: '01'
        },
        {
          name: '2.建设工程档案查询预约服务（用地）',
          type: '02'
        },
        {
          name: '3.建设工程档案查询预约服务（城建档案）',
          type: '03'
        }
      ]
    }
  },
  methods: {
    toBooking(type) {
      this.$router.push({ path: '/booking', query: { type } })
      // console.log(type, '88')
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
