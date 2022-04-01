import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
// 按需引入vant
import {
  Search,
  Col,
  Row,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Tabbar,
  TabbarItem,
  Button,
  Tab,
  Tabs,
  Toast,
  Icon,
  Lazyload,
  Popup,
  Overlay,
  ImagePreview,
  Form,
  Field,
  DatetimePicker,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Empty,
  Picker,
  Loading
} from 'vant'

// 引入axios
import axios from './utils/request'
Vue.prototype.$axios = axios
import global from './globle/globleApi'
Vue.prototype.global = global
axios.defaults.baseURL = global.baseURL
import AMap from 'vue-amap'
Vue.use(AMap)

import Vconsole from 'vconsole'

if (process.env.VUE_APP_ENV !== 'production') {
  let vConsole = new Vconsole()
  Vue.use(vConsole)
}

Vue.use(Search)
  .use(Col)
  .use(Row)
  .use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Button)
  .use(Icon)
  .use(Popup)
  .use(Overlay)
  .use(Form)
  .use(Field)
  .use(DatetimePicker)
  .use(Radio)
  .use(RadioGroup)
  .use(Cell)
  .use(CellGroup)
  .use(Empty)
  .use(Picker)
  .use(Toast)
  .use(Loading)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
