<template>
    <div class="page">
        <header :class="{header:true, scroll:isScrollTop}" ref="header">
            <a class="icon-classify" @click="pushPage('/goods/classify')"></a>
            <div class="search-wrap" @click="searchShow.show=true"><span class="text">请输入宝贝名称</span></div>

            <!-- 已登录 -->
            <a class="icon-my" v-if="isLogin" @click="$router.push('/my')"></a>
             <!-- 未登录 -->
            <a class="login" @click="$router.push('/login')" v-else>登录</a>
        </header>
        <div class="banner-wrap">
            <van-swipe :autoplay="3000">
              <van-swipe-item v-for="(item, index) in banners" :key="index">
                <img v-lazy="item.image" />
              </van-swipe-item>
            </van-swipe>
        </div>
        <nav class="nav-quick" ref="nav-quick">
            <a class="item" v-for="item in navs" :key="item.cid">
                <i class="icon"></i>
                <span class="text">{{item.title}}</span>
            </a>
        </nav>
        <template v-for="(item,index) in goods">
            <div :class="'goods-main goods-main-'+index" :key="index" v-if="(index+1)%2 !==0">
                <h2 class="title-main">—— {{item.title}} ——</h2>
                <div class="goods-row-1">
                    <div class="goods-column" @click="$router.push('/goods/details?gid=' + (item.items && item.items[0].gid))">
                        <div class="goods-ones">
                            <h4 class="goods-title">{{item.items && item.items[0].title}}</h4>
                            <p class="goods-info-wrap"><span class="goods-tip">精品打折</span><span class="goods-price">{{ item.items && item.items[0].price }}元</span></p>
                            <div class="goods-image">
                                <img src="../../../assets/images/common/grey.jpg" :data-echo="item.items && item.items[0].image" :alt="item.items && item.items[0].title">
                            </div>
                        </div>
                    </div>
                    <div class="goods-column">
                        <div class="goods-list" v-for="(item2, index2) in item.items.slice(1, 3)" :key="index2" @click="$router.push('/goods/details?gid='+ item2.gid)">
                            <div class="list-info">
                                <h4 class="goods-title">{{item2.title}}</h4>
                                <p class="list-tips">品质精挑</p>
                            </div>
                            <div class="list-image">
                                <img src="../../../assets/images/common/grey.jpg" :data-echo="item2.image"  :alt="item2.title">
                            </div>
                        </div>

                    </div>
                </div>
                <div class="goods-row-2">
                    <div class="goods-list" v-for="(item2, index2) in item.items.slice(3, 7)" :key="index2" @click="$router.push('/goods/details?gid='+ item2.gid)" >
                        <h4 class="goods-title">{{item2.title}}</h4>
                        <div class="list-image">
                            <img src="../../../assets/images/common/grey.jpg" :data-echo="item2.image"  :alt="item2.title">
                        </div>
                        <p class="price">&yen;{{item2.price}}</p>
                        <p class="org-price">&yen;{{(item2.price * 1.6).toFixed(2)}}</p>
                    </div>
                </div>
            </div>
            <div :class="'goods-main goods-main-'+index" :key="index"  v-else>
                <h2 class="title-main">—— {{item.title}} ——</h2>
                <div class="goods-row-1">
                    <div class="goods-column" v-for="(item2, index2) in item.items.slice(0,2)" :key="index2" @click="$router.push('/goods/details?gid='+ item2.gid)">
                        <div class="goods-ones">
                            <h4 class="goods-title">{{item2.title}}</h4>
                            <p class="goods-info-wrap"><span class="goods-tip">精品打折</span></p>
                            <div class="goods-image">
                                <img src="../../../assets/images/common/grey.jpg" :data-echo="item2.image" :alt="item2.title">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-row-2">
                    <div class="goods-list" v-for="(item2, index2) in item.items.slice(2, 6)" :key="index2" @click="$router.push('/goods/details?gid='+ item2.gid)">
                        <h4 class="goods-title">{{item2.title}}</h4>
                        <div class="list-image">
                            <img src="../../../assets/images/common/grey.jpg" :data-echo="item2.image"  :alt="item2.title">
                        </div>
                        <p class="price">&yen;{{item2.price}}</p>
                        <p class="org-price">&yen;{{ (item2.price * 1.5).toFixed(2)}}</p>
                    </div>
                </div>
            </div>
        </template>

        <div class="goods-recommend">
            <div class="recommend-head">
                <h2 class="title-text">为您推荐</h2>
            </div>
            <div class="recommend-list">
                <div class="list-item" v-for="(item, index) in rmGoods" :key="index" @click="$router.push('/goods/details?gid='+ item.gid)">
                    <div class="inner">
                        <div class="goods-image">
                            <img src="../../../assets/images/common/grey.jpg" :data-echo="item.image" :alt="item.title">
                        </div>
                        <h4 class="list-title">{{ item.title }}</h4>
                        <p class="list-price">&yen;{{item.price}}</p>
                    </div>
                </div>
            </div>
        </div>
        <search-component :show="searchShow" ></search-component>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapActions, mapState } from 'vuex'
    import SearchComponent from '../../../components/search'
    import { Swipe, SwipeItem, Lazyload } from 'vant'

    Vue.use(Swipe)
    Vue.use(SwipeItem)
    Vue.use(Lazyload)
    export default {
      name: "index",
        data(){
            return {
              isScrollTop:false,
              searchShow: {
                show: false
              }
            }
        },
        components:{
          SearchComponent
        },
        created(){
            this.isScroll = true
            this.startTop = 0
            this.$nextTick(()=>{
              window.addEventListener('scroll',this.eventScrollTop)
            })
            this.getBanners()
            this.getNavs({
              success:()=>{
                this.$nextTick(()=>{
                  this.$utils.lazyImg()
                })
              }
            })
            this.getGoods({
              success:()=>{
                this.$nextTick(()=>{
                  this.$utils.lazyImg()
                })
              }
            })
            this.getRm({
              success:()=>{
                this.$nextTick(()=>{
                  this.$utils.lazyImg()
                })
              }
            })

        },
        mounted(){

        },
      computed:{
        ...mapState({
          banners:(state)=> state.index.banners,
          navs:(state)=> state.index.navs,
          goods:(state)=> state.index.goods,
          rmGoods:(state) => state.index.rmGoods,
          isLogin: state => state.user.isLogin
        })
      },
        methods:{
          ...mapActions({
            getBanners: 'index/getBanners',
            getNavs:'index/getNavs',
            getGoods: 'index/getGoods',
            getRm: 'index/getRecommend'
          }),
          eventScrollTop(){
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
             const $nav = this.$refs['nav-quick'],
                  $header = this.$refs['header'];

            this.startTop = $nav.offsetTop - $header.clientHeight
            if(scrollTop >= this.startTop){
              if (this.isScroll) {
                this.isScroll = false
                this.isScrollTop = true
              }

            } else {
              if(!this.isScroll){
                this.isScroll = true
                this.isScrollTop = false
              }

            }
          },
          pushPage(url){
            this.$router.push(url)
          },
        },

        destroyed(){
          window.removeEventListener('scroll',this.eventScrollTop)
        },
      activated(){
        this.$nextTick(()=>{
          const $nav = this.$refs['nav-quick'],
              $header = this.$refs['header'];
          this.startTop = $nav.offsetTop - $header.clientHeight
          window.addEventListener('scroll',this.eventScrollTop)
        })
      },
        deactivated(){
          window.removeEventListener('scroll',this.eventScrollTop)
        }

    }
</script>

<style lang="scss" scoped>
    @import "src/assets/css/home/index/index";
</style>