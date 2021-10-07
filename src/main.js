import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import './index.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App).use(router).use(PerfectScrollbar).mount('#app')
