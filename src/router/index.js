import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend/Recommend'
import Rank from '@/views/rank/Rank'
import Singer from '@/views/singer/Singer'
import Search from '@/views/search/Search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
