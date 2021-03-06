import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router=new Router({
    mode:"hash",//1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL, //自动获取根目录路径
    scrollBehavior:(to,from,position)=>{
        if(position){
            return position
        }else{
            return {x:0,y:0}
        }
    },
    routes:[
        {
            path:"/",
            name:"home",
            component:()=>import("./pages/home/main/index"),//路由懒加载解决首屏加载慢，性能优化
            meta:{keepAlive:false},
            redirect: '/index',
            children: [
                {
                    path: 'index',
                    name:'index',
                    component:()=> import('./pages/home/index'),
                    meta:{keepAlive:true, title: 'Vue商城'}
                },
                {
                    path: 'cart',
                    name:'cart',
                    component:()=> import('./pages/home/cart'),
                    meta:{keepAlive:false, title:'购物车'}
                },
                {
                    path: 'my',
                    name: 'my',
                    component:()=> import('./pages/user/ucenter'),
                    meta:{keepAlive:false, title:'个人中心'}
                }
            ]
        },
        {
            path:"/login",
            name:"login",
            component:()=>import("./pages/home/login"),
            meta:{keepAlive:false}
        },
        {
            path:"/ucenter",
            name:"ucenter",
            component:()=>import("./pages/user/ucenter"),
            // meta:{auth:true}
            // beforeEnter:(to,from,next)=>{
            //     if (Boolean(localStorage['isLogin'])){
            //         next();
            //     } else{
            //         next("/login");
            //     }
            //
            // }
        },
        {
            path:"/goods/classify",
            name:"classify",
            component:()=>import("./pages/home/goods/classify"),
            redirect: '/goods/classify/item',
            children: [
                {
                    path: 'item',
                    name: 'goods-classify-item',
                    component:()=> import("./pages/home/goods/classify_item"),
                    meta: {title:'商品分类'}
                }
            ]
        },
        {
            path:"/skip",
            name:"skip",
            component:()=>import("./pages/skip")
        },
        {
            path: '/goods/search',
            name: 'goods-search',
            component:()=> import("./pages/home/goods/search")
        },
        {
            path: '/goods/details',
            name: 'goods-details',
            component: () => import("./pages/home/goods/details"),
            redirect: '/goods/details/item',
            children: [
                {
                    path: 'item',
                    name: 'goods-item',
                    component: ()=> import('./pages/home/goods/details_item')
                },
                {
                    path: 'content',
                    name: 'goods-content',
                    component: ()=> import('./pages/home/goods/details_content')
                },
                {
                    path: 'review',
                    name: 'goods-review',
                    component: ()=> import('./pages/home/goods/details_review')
                }
            ]
        }
    ]
});
// router.beforeEach((to,from,next)=>{
//     // console.log(to);
//     if (to.meta.auth){
//         if (Boolean(localStorage['isLogin'])){
//             next();
//         } else {
//             next("/login");
//         }
//     } else {
//         next();
//     }
// });

export default router;