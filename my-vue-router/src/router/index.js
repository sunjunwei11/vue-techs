import Vue from 'vue'
// import VueRouter from 'vue-router'
// import VueRouter from '../my-vue-router'
import VueRouter from 'gapj_vue_router';

import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    children: [
      {
        path: 'info',
        name: 'info',
        component: {
          render: h => h('div', 'this is info')
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
