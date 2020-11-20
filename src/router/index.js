import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend/Recommend'
import Rank from '@/views/rank/Rank'
import Singer from '@/views/singer/Singer'
import Search from '@/views/search/Search'
import SingerDetail from '../components/content/detail/singer-detail'
import DescDetail from '../components/content/detail/desc-detail'
import RankDetail from '../components/content/detail/rank-detail'

Vue.use(Router)
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: DescDetail
      }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: RankDetail
      }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
