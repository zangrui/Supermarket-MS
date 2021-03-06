//引入vue
import Vue from 'vue'
//引入路由
import Router from 'vue-router'
//注册路由
Vue.use(Router);
//导出路由实例
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },
    {
      path: '/',
      component: () => import('./views/Index/Index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('./views/Home/Home.vue')
        },
        {
          path: 'accountmanage',
          name: 'accountmanage',
          component: () => import('./views/AccountManage/AccountManage.vue')
        },
        {
          path: 'accountadd',
          name: 'accountadd',
          component: () => import('./views/AccountAdd/AccountAdd.vue')
        },
        {
          path: 'passwordmodify',
          name: 'passwordmodify',
          component: () => import('./views/PasswordModify/PasswordModify.vue')
        },
        {
          path: 'goodsmanage',
          name: 'goodsmanage',
          component: () => import('./views/GoodsManage/GoodsManage.vue')
        },
        {
          path: 'goodsadd',
          name: 'goodsadd',
          component: () => import('./views/GoodsAdd/GoodsAdd.vue')
        },
        {
          path: 'salestatistics',
          name: 'salestatistics',
          component: () => import('./views/SaleStatistics/SaleStatistics.vue')
        },
        {
          path: 'stockmanage',
          name: 'stockmanage',
          component: () => import('./views/StockManage/StockManage.vue')
        },
        {
          path: 'stockadd',
          name: 'stockadd',
          component: () => import('./views/StockAdd/StockAdd.vue')
        },
        {
          path: 'saleslist',
          name: 'saleslist',
          component: () => import('./views/SalesList/SalesList.vue')
        },
        {
          path: 'goodsoutstock',
          name: 'goodsoutstock',
          component: () => import('./views/GoodsOutStock/GoodsOutStock.vue')
        },
        {
          path: 'goodsreturn',
          name: 'goodsreturn',
          component: () => import('./views/GoodsReturn/GoodsReturn.vue')
        },
        {
          path: 'classifymanage',
          name: 'classifymanage',
          component: () => import('./views/ClassifyManage/ClassifyManage.vue')
        },
        {
          path: 'classifyadd',
          name: 'classifyadd',
          component: () => import('./views/ClassifyAdd/ClassifyAdd.vue')
        },
        {
          path: 'membermanage',
          name: 'membermanage',
          component: () => import('./views/MemberManage/MemberManage.vue')
        },
        {
          path: 'memberadd',
          name: 'memberadd',
          component: () => import('./views/MemberAdd/MemberAdd.vue')
        },
        {
          path: 'personal',
          name: 'personal',
          component: () => import('./views/Personal/Personal.vue')
        }
      ]
    }, 
    {
      path: '*',
      name: '404',
      component: () => import('./views/NotFound/NotFound.vue')
    }
  ]
})
