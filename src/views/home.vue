<template>
  <div class="home">
    <div class="header">
      <div></div>
    </div>
    <div class="content">
      <div class="fileDir">
        <div @click="toPlanFile">
          <img src="../assets/guihua.png" alt="" />
          <p>规划档案</p>
        </div>
        <div @click="toConstructFile">
          <img src="../assets/jsgc.png" alt="" />
          <p>建设工程档案</p>
        </div>
        <div>
          <img src="../assets/diji.png" alt="" />
          <p>地籍档案</p>
        </div>
      </div>
      <div class="searchReading" @click="toservice">
        <img src="../assets/yulan.png" alt="" />
      </div>
      <div class="info">
        <img src="../assets/yuyue.png" alt="" />
        <p>预约服务</p>
      </div>
      <div class="yuyue">
        <div @click="toSearchBooking"><img src="../assets/yuyuechaxun.png" alt="" /></div>
        <div @click="toConsultBooking"><img src="../assets/yuyuezixun.png" alt="" /></div>
      </div>
      <div class="info">
        <img src="../assets/danganchaxun.png" alt="" />
        <p>在线档案查询</p>
      </div>
      <div class="search">
        <div @click="toMap"><img src="../assets/gongchengguihua.png" alt="" /></div>
        <!-- <div @click="toConstructing"><img src="../assets/yongdiguihua.png" alt="" /></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { openFaceCertification } from '@digitalzz/jssdk'
export default {
  name: 'Home',
  data() {
    return {
      SearchBookingFlag: true,
      ConsultBookingFlag: true
    }
  },
  methods: {
    toPlanFile() {
      this.$router.push('/planFile')
    },
    toConstructFile() {
      this.$router.push('/constructFile')
    },
    toservice() {
      this.$router.push('/serviceContent')
    },

    toSearchBooking() {
      if (!this.SearchBookingFlag) {
        return
      }
      this.SearchBookingFlag = false
      openFaceCertification()
        .then((res) => {
          this.$router.push('/searchBooking')
          this.SearchBookingFlag = true
        })
        .catch((err) => {
          console.log(err)
          this.SearchBookingFlag = true
        })
    },

    toConsultBooking() {
      // this.$router.push('/consultBooking')
      if (!this.ConsultBookingFlag) {
        return
      }
      this.ConsultBookingFlag = false
      // 调取人脸识别
      openFaceCertification()
        .then((res) => {
          this.$router.push('/consultBooking')
          this.ConsultBookingFlag = true
        })
        .catch((err) => {
          console.log(err, 'err')
          this.ConsultBookingFlag = true
        })
    },
    toMap() {
      this.$router.push('/fileMaps')
    }
    // toConstructing() {
    //   this.$router.push('/constructing')
    // }
  }
}
</script>
<style lang="less" scoped>
.home {
  padding: 10px 0 20px;
  background: #fff;
  .header {
    width: 100%;
    height: 170px;
    position: relative;
    background: url(../assets/header.png) no-repeat;
    background-size: 100% 100%;
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 100px;
      background: url(../assets/headerText.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .content {
    padding: 0 20px;
  }
  .fileDir {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 35px;
        width: 35px;
        margin: 15px 0 10px 0;
      }
    }
  }
  .searchReading {
    width: 100%;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 100%;
    height: 26px;
    display: flex;
    margin-top: 30px;
    line-height: 26px;
    font-size: 20px;
    img {
      height: 24px;
      margin-right: 10px;
    }
  }
  .yuyue,
  .search {
    width: 100%;
    height: 160px;
    display: flex;
    margin-top: 15px;
    div {
      width: 50%;
      img {
        width: 100%;
        height: 100%;
      }
      &:first-child {
        padding-right: 8px;
      }
      &:last-child {
        padding-left: 8px;
      }
    }
  }
  .search {
    height: 110px;
  }
}
</style>
