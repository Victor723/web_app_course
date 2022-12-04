import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import User from '@/views/User.vue'
import DebugScreen from '@/views/DebugScreen.vue'
import Admin from '@/views/Admin.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/user",
      component: User,
    },
    {
      path: "/admin",
      component: Admin,
    }
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
