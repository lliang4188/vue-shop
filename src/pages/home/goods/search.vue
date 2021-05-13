<template>
  <div class="search-page">
    <div class="search-head-wrap">
      <header class="search-header">
        <a class="btn-back" @click="$router.go(-1)"></a>
        <div class="input-wrap" @click="searchShow.show = true">
          <span class="text">{{ keyword }}</span>
        </div>
        <a class="btn-screen" @click="isScreen = true">筛选</a>
      </header>
      <div class="screen-main">
        <div
          :class="{ 'screen-item': true, active: isPriceOrder }"
          @click="selectPrice()"
        >
          <span class="text">价格排序</span>
          <div class="screen-menu" v-if="isPriceOrder">
            <span
              :class="{ 'menu-item': true, active: item.active }"
              v-for="(item, index) in priceOrderList"
              :key="index"
              @click="selectPriceOrder(index)"
              >{{ item.title }}</span
            >
          </div>
        </div>
        <div
          :class="{
            'screen-item': true,
            'screen-num': true,
            active: isScalesOrder,
          }"
          @click="selectScales()"
        >
          <span class="text">销量</span>
        </div>
      </div>
    </div>
    <div class="goods-list">
      <template v-if="searchData.length > 0">
        <div class="list-item" v-for="(item, index) in searchData" :key="index" @click="$router.push('/goods/details?gid=' + item.gid )">
          <div class="pic-wrap">
            <img
              src="../../../assets/images/common/grey.jpg"
              :data-echo="item.image"
              :alt="item.title"
            />
          </div>
          <div class="goods-content">
            <h4 class="goods-title">
              {{ item.title }}
            </h4>
            <p class="price">&yen; {{ item.price }}</p>
            <p class="sales">
              销量 <span>{{ item.sales }}</span> 件
            </p>
          </div>
        </div>
      </template>
      <template v-if="searchData.length <= 0">
        <div class="no-data">
          <p>没找到相关商品</p>
        </div>
      </template>
    </div>
    <!-- 筛选弹出 -->
    <div class="mask" v-if="isScreen" @click="isScreen = false"></div>
    <div :class="{ 'dialog-screen': true, move: isScreen }" ref="screen">
      <div>
        <div class="attr-item">
          <div
            :class="{ 'attr-head': true, active: isClassify }"
            @click="isClassify = !isClassify"
          >
            <h2 class="title">分类</h2>
            <span class="btn-arrow"></span>
          </div>
          <div class="attr-list" v-if="isClassify">
            <div
              :class="{ item: true, active: item.active }"
              v-for="(item, index) in classify"
              :key="index"
              @click="selectClassify({ index: index })"
            >
              <span class="inner">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div class="attr-item">
          <div
            :class="{ 'attr-head': true, active: priceData.isShow }"
            @click="HIDE_PRICE()"
          >
            <h2 class="title">价格区间</h2>
            <div class="price-sort" v-if="true">
              <div class="input-wrap" @click.stop>
                <div class="input-price">
                  <input
                    type="tel"
                    placeholder="最低价"
                    :value="minPrice"
                    @input="SET_MINPRICE({ minPrice: $event.target.value })"
                  />
                </div>
                <span class="line"></span>
                <div class="input-price">
                  <input
                    type="tel"
                    placeholder="最高价"
                    :value="maxPrice"
                    @input="SET_MAXPRICE({ maxPrice: $event.target.value })"
                  />
                </div>
              </div>
              <span class="btn-arrow"></span>
            </div>
          </div>
          <div class="attr-list" v-if="priceData.isShow">
            <div
              :class="{ item: true, active: item.active }"
              v-for="(item, index) in priceData.items"
              :key="index"
              @click="SELECT_PRICE({ index: index })"
            >
              <span class="inner">{{ item.price1 }}-{{ item.price2 }}</span>
            </div>
          </div>
        </div>
        <div class="attrs-wrap">
          <div class="attr-item" v-for="(item, index) in attrs" :key="index">
            <div
              :class="{ 'attr-head': true, active: item.isShow }"
              @click="HIDE_ATTR({ index: index })"
            >
              <h2 class="title">{{ item.title }}</h2>
              <span class="btn-arrow"></span>
            </div>
            <div class="attr-list" v-if="item.isShow">
              <div
                :class="{ item: true, active: item2.active }"
                v-for="(item2, index2) in item.param"
                :key="index2"
                @click="SELECT_ATTR({ index: index, index2: index2 })"
              >
                <span class="inner">{{ item2.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="height-1rem"></div>
      </div>

      <div class="handle-wrap">
        <a class="btn-item">共<span>{{ total }}</span>件</a>
        <a class="btn-item rest" @click="getReset()">全部重置</a>
        <a class="btn-item sure" @click="sureSubmit()">确定</a>
      </div>
    </div>
    <search-component :show="searchShow" :isLocal="true"></search-component>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import SearchComponent from '../../../components/search'
  import Iscroll from '../../../assets/js/lib/iscroll'
  import UpRefresh from '../../../assets/js/lib/uprefresh'
  export default {
    name: 'goods-search',
    components:{
      SearchComponent
    },
    data(){
      return {
        keyword: this.$route.query.keyword ? this.$route.query.keyword : '',
        searchShow:{
          show: false
        },
        isPriceOrder: false,
        isScalesOrder: false,
        isScreen: false,
        isClassify:true,
        priceOrderList:[
          {otype: 'all', title: '综合', active: true },
          {otype: 'up', title: '价格从低到高', active: false},
          {otype: 'down', title: '价格从高到低', active: false}
        ]
      }
    },
    created(){
      this.otype = 'all'
      this.pullUp = new UpRefresh()
      this.getClassify({
        success:()=>{
          this.$nextTick(()=>{
            this.myScroll.refresh()
          })
        }
      })
      this.getReset()
      this.getAttrs({keyword: this.keyword, success:()=>{
         this.$nextTick(()=>{
            this.myScroll.refresh()
          })
      }})
      this.init()

    },
    mounted() {
      this.$refs.screen.addEventListener('touchmove', function (e) { e.preventDefault();},{passive: false})
      this.myScroll =  new Iscroll(this.$refs.screen, {
        scrollX:false,
        scrollY: true,
        preventDefault:false
      })
    },
    computed: {
      ...mapState({
        classify:state => state.goods.classify,
        priceData: state => state.search.priceData,
        minPrice: state => state.search.minPrice,
        maxPrice: state => state.search.maxPrice,
        searchData: state => state.search.searchData,
        cid: state => state.search.cid,
        attrs: state => state.search.attrs,
        param: state => state.search.param,
        total: state => state.search.total
      })
    },
    methods: {
      ...mapActions({
        getClassify: 'goods/getClassify',
        selectClassify: 'search/selectClassify',
        getSearch: 'search/getSearch',
        getSearchPage: 'search/getSearchPage',
        getAttrs: 'search/getAttrs',
        getReset: 'search/getReset'

      }),
      ...mapMutations({
        'HIDE_PRICE': 'search/HIDE_PRICE',
        'SELECT_PRICE': 'search/SELECT_PRICE',
        'SET_MINPRICE': 'search/SET_MINPRICE',
        'SET_MAXPRICE': 'search/SET_MAXPRICE',
        'HIDE_ATTR': 'search/HIDE_ATTR',
        'SELECT_ATTR': 'search/SELECT_ATTR',
        'SET_SEARCH_DATA': 'search/SET_SEARCH_DATA',
        'SET_SEARCH_DATA_PAGE': 'search/SET_SEARCH_DATA_PAGE',
        setParam :'search/setParam'
      }),
      selectPrice(){
        this.isPriceOrder = !this.isPriceOrder
        if (this.isPriceOrder) {
          this.isScalesOrder = false
          this.priceOrderList[0].active = true
        }
      },
      // 价格排序
      selectPriceOrder(index){
        if(this.priceOrderList.length > 0 ) {

           for (let i in this.priceOrderList){
             if( this.priceOrderList[i].active){
               this.priceOrderList[i].active = false
               break
             }
        }
        this.priceOrderList[index].active = true
        this.$set(this.priceOrderList, index, this.priceOrderList[index])

        this.isScalesOrder = false

        }
        this.otype = this.priceOrderList[index].otype
        this.init()

      },
      // 销量排序
      selectScales(){
        this.isScalesOrder = ! this.isScalesOrder
        this.isPriceOrder = false
         if(this.priceOrderList.length > 0 ) {
           for (let i in this.priceOrderList){
             if( this.priceOrderList[i].active){
               this.priceOrderList[i].active = false
               break
             }
          }
          if (this.isScalesOrder){
            this.otype = 'sales'
            this.init()
          } else {
            this.priceOrderList[0].active = true
            this.otype = 'all'
            this.init()
          }
      }
    },
    init() {
      let jsonParams = {keyword: this.keyword, otype: this.otype, cid: this.cid, price1: this.minPrice, price2: this.maxPrice, param: JSON.stringify(this.param)}
       this.getSearch({...jsonParams, success:(pageNum)=>{
         this.$nextTick(()=>{
           this.$utils.lazyImg()
         })
         this.pullUp.init({"curPage":1,"maxPage":parseInt(pageNum),"offsetBottom":100},(page) => {
           this.getSearchPage({...jsonParams ,page:page})
        });
      }})
    },
    sureSubmit(){
      this.isScreen =false
      this.setParam()
      this.init()
    },
   },
  beforeRouteUpdate (to, from, next){

      this.keyword = to.query.keyword
      // console.log(this.keyword)
      this.isPriceOrder = false
      this.isScalesOrder = false
      if (this.priceOrderList.length > 0) {
         for (let i in this.priceOrderList){
             if( this.priceOrderList[i].active){
               this.priceOrderList[i].active = false
               break
           }
        }
        this.priceOrderList[0].active = true

      }

      this.getSearch({keyword: this.keyword})
       this.getAttrs({ keyword: this.keyword, success:()=>{
         this.$nextTick(()=>{
            this.myScroll.refresh()
          })
      }})
      this.otype = 'all'
      this.getReset()
      this.init()
       this.getAttrs({ keyword: this.keyword, success:()=>{
         this.$nextTick(()=>{
            this.myScroll.refresh()
          })
      }})
      next()

    },
    beforeDestroy(){
      this.$refs.screen.removeEventListener('touchmove',  function (e) { e.preventDefault();}, { passive: false })
      this.pullUp.uneventSrcoll()
    }
  }
</script>

<style lang="scss" scoped>
@import "src/assets/css/home/goods/search";
</style>