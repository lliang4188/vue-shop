<template>
    <div>
        <router-view></router-view>
        <div class="nav-bottom">
            <span :class="{item:true, active:isActive===0}" @click="goPage('/index')">首页</span>
            <span :class="{item:true, active:isActive===1}" @click="goPage('/cart')">购物车<i class="spot" v-if="$store.state.cart.cartData.length>0"></i></span>
            <span :class="{item:true, active:isActive===2}" @click="goPage('/ucenter')">我的</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "home",
    data(){
      return{
        isActive:0
      }
    },
    created(){
      this.changeNav(this.$route.name)
      document.title = this.$route.meta.title
    },
    mounted(){

    },
    methods:{
      goPage(url){
        this.$router.replace(url)
      },
      changeNav(name){
        switch (name) {
          case 'index':
            this.isActive =0
            break
          case 'cart':
            this.isActive = 1
            break
          case 'ucenter':
            this.isActive = 2
            break
          default:
            this.isActive = 0
            break
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      document.title=to.meta.title;
      this.changeNav(to.name)
      next()
    },
    activated(){
      this.changeNav(this.$route.name)
      document.title = this.$route.meta.title
    }
  }
</script>

<style lang="scss" scoped>
    .nav-bottom{
        width: 100%;
        height: 1.2rem;
        position: fixed;
        background-color:#fff;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
        left: 0;
        bottom: 0;
        display: flex;
        align-content: center;
        justify-content: space-between;
        z-index: 60;
        .item{
            flex: 1;
            padding: 0.16rem 0 0;
            text-align: center;
            position: relative;
            font-size: 0.28rem;
            cursor: pointer;
            &::before{
                font-family: iconfont;
                font-size: 0.52rem;
                display: block;
                margin: 0 auto;
            }
            &:nth-child(1)::before{
                content: '\e600';
            }
            &:nth-child(2)::before{
                content: '\e630';
            }
            &:nth-child(3)::before{
                content: '\e67a';
            }
            &.active{
                color:#eb1625;
            }
            .spot {
              width: 0.16rem;
              height: 0.16rem;
              background-color: #eb1625;
              border-radius: 100%;
              position: absolute;
              left: 50%;
              margin-left: .24rem;
              top:0.16rem;
              z-index: 1;
              display: block;
            }
        }
    }
</style>