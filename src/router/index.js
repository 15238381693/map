import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import serviceContent from '../views/serviceContent.vue'
import planFile from '../views/planFile.vue'
import constructFile from '../views/constructFile.vue'
import fileMaps from '../views/fileMaps.vue'
import Test from '../views/test.vue'
import searchBooking from '../views/searchBooking/home.vue'
import booking from '../views/searchBooking/booking.vue'
import consultBooking from '../views/consultBooking/home.vue'
import consultbook from '../views/consultBooking/booking.vue'
import success from '../views/success.vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: home
  },
  {
    path: '/serviceContent',
    name: 'ServiceContent',
    component: serviceContent
  },
  {
    path: '/planFile',
    name: 'PlanFile',
    component: planFile
  },
  {
    path: '/constructFile',
    name: 'ConstructFile',
    component: constructFile
  },
  // {
  //   path: '/fileMaps',
  //   name: 'FileMaps',
  //   component: fileMaps
  // },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/searchBooking',
    name: 'SearchBooking',
    component: searchBooking
  },
  {
    path: '/booking',
    name: 'Booking',
    component: booking
  },
  {
    path: '/consultBooking',
    name: 'ConsultBooking',
    component: consultBooking
  },
  {
    path: '/consultbook',
    name: 'Consultbook',
    component: consultbook
  },
  {
    path: '/success',
    name: 'Success',
    component: success
  }
]

const router = new VueRouter({
  routes
})

export default router
