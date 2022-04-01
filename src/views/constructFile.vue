<template>
  <div class="planFile">
    <div class="searchBox">
      <input type="text" v-model="value" placeholder="请输入搜索关键词" />
      <van-icon name="search" class="iconSer" @click="onSearch" />
    </div>
    <div class="listDataBox">
      <div v-for="(item, index) in data" :key="index" class="listBox">
        <div class="title">
          <img src="../assets/name.png" alt="" />
          <p>
            案卷名称：<span class="name">{{ item['xmmc'] }}</span>
          </p>
        </div>
        <p class="address">建设单位：{{ item['jsbzdw'] }}</p>
        <p class="address footer">
          <span>档案号：{{ item['jsajh'] }}</span>
        </p>
      </div>
    </div>
    <van-loading type="spinner" color="#1989fa" class="loadingIcon" v-show="loading" />
    <van-empty v-if="!data.length" image="search" description="没有查到数据" v-show="!loading" />
    <van-button type="info" class="backBtn" @click="goback()" v-show="!loading">返回</van-button>
  </div>
</template>
<script>
export default {
  name: 'PlanFile',
  data() {
    return {
      value: '',
      data: [],
      querying: false,
      currentPage: 0,
      pages: 0,
      flag: false,
      loading: true
    }
  },
  created() {
    // 获取目录数据
    this.$axios({
      method: 'POST',
      url: `/zzscjdagl/rest/zzsrestcontroller/findJsgcdamlBySearchcondition`,
      data: {
        index: 0,
        pagesize: 10
      }
    })
      .then((res) => {
        this.data = res.data?.custom.list || []
        this.pages = Math.floor(res.data?.custom.count / 10)
        this.loading = false
      })
      .catch((err) => {
        console.log(err)
        this.loading = false
      })
  },
  mounted() {
    window.addEventListener('scroll', this.scrollFun)
  },
  methods: {
    // 滚动事件
    scrollFun() {
      this.$nextTick(() => {
        if (!this.querying && this.currentPage < this.pages) {
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          //变量windowHeight是可视区的高度
          var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
          //变量scrollHeight是滚动条的总高度
          var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
          if (scrollTop + windowHeight + 400 >= scrollHeight) {
            this.selectInfo(this.currentPage + 1)
          }
        }
      })
    },

    selectInfo(pageNum) {
      this.querying = true
      this.currentPage = pageNum
      this.loading = true

      this.$axios({
        method: 'POST',
        url: '/zzscjdagl/rest/zzsrestcontroller/findJsgcdamlBySearchcondition',
        data: {
          index: this.currentPage,
          pagesize: 10,
          searchcondition: this.value
        }
      })
        .then((res) => {
          this.data = this.data.concat(res.data?.custom.list)
          this.loading = false

          this.$nextTick(() => {
            if (this.currentPage < this.pages) {
              let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
              //变量scrollHeight是滚动条的总高度
              let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
              if (windowHeight >= scrollHeight) {
                this.selectInfo(this.currentPage + 1)
              } else {
                this.querying = false
              }
            } else {
              console.log('到底了')
            }
          })
        })
        .catch((err) => {
          console.log(err)
          this.querying = false
          this.loading = false
        })
    },

    onSearch() {
      if (!this.value) {
        return
      }
      this.data = []
      this.currentPage = 0
      this.pages = 0
      this.loading = true

      this.$axios({
        method: 'POST',
        url: `/zzscjdagl/rest/zzsrestcontroller/findJsgcdamlBySearchcondition`,
        data: {
          index: 0,
          pagesize: 10,
          searchcondition: this.value
        }
      })
        .then((res) => {
          this.data = res.data?.custom.list || []
          this.pages = Math.floor(res.data?.custom.count / 10)
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },

    goback() {
      this.$router.push('/home')
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollFun)
  }
}
</script>
<style lang="less" scoped>
.planFile {
  padding: 10px 20px 20px;
  background: #f5f5f5;
  .searchBox {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 10;
    width: 100%;
    height: 50px;
    background-color: #fff;
    input {
      background: #f5f5f5;
      margin-top: 10px;
      margin-left: 20px;
      padding-left: 10px;
      height: 30px;
      outline: none;
      border: none;
      width: 80%;
    }
    .iconSer {
      position: absolute;
      top: 15px;
      right: 10px;
      font-size: 20px;
      color: #1260e7;
    }
  }
  .listDataBox {
    margin-top: 50px;
  }
  .listBox {
    border-bottom: 1px solid gray;
    .title {
      display: flex;
      p {
        margin-top: 10px;
      }
      img {
        margin-top: 5px;
        width: 30px;
        height: 30px;
      }
    }
    .address {
      color: gray;
      font-size: 14px;
      line-height: 24px;
    }
  }
  /deep/.van-loading__spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -40px;
    width: 80px;
    height: 80px;
  }
  .loadingIcon {
    font-size: 40px;
  }
  .backBtn {
    display: block;
    width: 300px;
    margin: 20px auto;
  }
}
</style>
