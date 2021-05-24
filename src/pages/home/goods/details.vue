<template>
    <div>
       <div class="detail-header">
            <a class='back' @click="$router.go(-1)"></a>
            <div class="header-nav">
                <div :class="{'nav-item':true, active:itemState===1}" @click="$router.replace('/goods/details?gid=' + gid)"><span class="text">商品</span></div>
                <div :class="{'nav-item':true, active:itemState===2}" @click="$router.replace('/goods/details/content?gid=' + gid)"><span class="text">详情</span></div>
                <div :class="{'nav-item':true, active:itemState===3}" @click="$router.replace('/goods/details/review?gid=' + gid)"><span class="text">评价</span></div>
            </div>
            <div class="icon-cart" id="icon-cart" @click="$router.push('/cart?from=goods_details')">
                <span class="spot" v-if="$store.state.cart.cartData.length>0"></span>
            </div>

       </div>
       <div class="sub-page">
           <router-view></router-view>
       </div>
    </div>
</template>

<script>
    export default {
        name: "goods-details",
        data(){
            return {
                gid: this.$route.query.gid ?  this.$route.query.gid : '',
                itemState: 1
            }
        },
        created() {
            this.changeTabStyle(this.$route.name)
        },
        methods:{
            changeTabStyle(name){
                switch (name) {
                    case ('goods-item'):
                        this.itemState = 1
                        break
                    case ('goods-content'):
                        this.itemState = 2
                        break
                    case ('goods-review'):
                        this.itemState = 3
                        break
                    default:
                        this.itemState = 1
                        break
                }
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.changeTabStyle(to.name)
            next()
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/assets/css/home/goods/goods_header.scss'
</style>