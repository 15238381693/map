<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { containerType } from '@/utils/alipay'
export default {
  name: 'app',
  components: {},
  data() {
    return {}
  },

  created() {
    const promise = {}
    promise.promise = new Promise((r, j) => {
      promise.resolve = r
      promise.reject = j
    })
    window.globalPromise = promise
    this.$store.dispatch('app/setUserInfo')

    // eslint-disable-next-line no-labels
    // if (containerType() !== 'app') {
    //   this.$dialog.alert({
    //     message: '请打开郑好办App查看',
    //     showConfirmButton: false
    //   })
    //   window.location.href = 'izziphoneapp://'
    //   return
    // }

    this.$store.dispatch('app/setAppInfo')
  },
  methods: {}
}
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}
* {
  padding: 0;
  margin: 0;
}
</style>
