<template>
  <div class="page">
    <div class="swiper-wrap">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in details.images" :key="index">
          <img v-lazy="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="goods-ele-main">
      <h4 class="goods-title">
        {{ details.title }}
      </h4>
      <p class="price">&yen; {{ details.price }}</p>
      <div class="sales-wrap">
        <span>快递：{{ details.freight }}元</span>
        <span>月销量 {{ details.sales }} 件</span>
      </div>
    </div>
    <div class="review-main">
      <h2 class="review-title">商品评价（{{ total }}）</h2>

      <div class="review-wrap" v-if="reviews.length > 0">
        <div class="review-list">
          <div class="list-item" v-for="(item, index) in reviews" :key="index">
            <div class="user-info">
              <div class="head">
                <img
                  src="../../../assets/images/common/grey.jpg"
                  :data-echo="item.head"
                  :art="item.nickname"
                />
              </div>
              <span class="nickname">{{ item.nickname }}</span>
            </div>
            <div class="review-content" v-html="item.content"></div>
            <p class="review-date">{{ item.times }}</p>
          </div>
        </div>
        <div
          class="review-more"
          @click="$router.replace('/goods/details/review?gid=' + gid)"
        >
          查看更多评价
        </div>
      </div>
      <div class="no-data" v-else>
        <p class="text">暂无评价!</p>
      </div>
    </div>
    <div class="bottom-btn-wrap">
      <div class="btn">收藏</div>
      <div class="btn" @click="showPanel()">加入购物车</div>
    </div>
    <div class="mask" v-if="isPanel" @click="hidePanel()"></div>
    <div
      :class="isPanel ? 'cart-panel up' : 'cart-panel down'"
      ref="cart-panel"
    >
      <span class="close" @click="hidePanel()">
        <i class="spot"></i>
      </span>
      <div class="goods-info" ref="goods-info">
        <div class="goods-img" ref="goods-img">
          <img :src="details.images && details.images[0]" alt="" />
        </div>
        <div class="goods-wrap">
          <h4 class="goods-title">
            {{ details.title }}
          </h4>
          <div class="goods-other">
            <span class="price">&yen; {{ details.price }}</span>
            <span>商品编码:{{ details.gid }}</span>
          </div>
        </div>
      </div>
      <div class="attr-wrap">
        <div class="attr-list" v-for="(item, index) in attrs" :key="index">
          <h3 class="attr-title">{{ item.title }}</h3>
          <div class="val-wrap">
            <span
              :class="{ val: true, active: item2.active }"
              v-for="(item2, index2) in item.values"
              :key="index2"
              @click="SELECT_ATTR({index: index, index2: index2})"
            >
              {{ item2.value }}
            </span>
          </div>
        </div>
      </div>
      <div class="amount-wrap">
        <h3 class="amount-name">购买数量</h3>
        <div class="amount-input-wrap">
          <div
            :class="amount > 1 ? 'btn dec' : 'btn dec active'"
            @click="amount > 1 ? amount-- : 1"
          >
            -
          </div>
          <div class="amount-input">
            <input type="tel" :value="amount" @input="setAmount($event)" />
          </div>
          <div class="btn inc" @click="amount++">+</div>
        </div>
      </div>
      <div class="btn-sure" @click="sureSubmit()">确定</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  import { mapState, mapMutations, mapActions} from 'vuex'

  import TweenMax from '../../../assets/js/lib/TweenMax'
  import { Toast, Swipe, SwipeItem, Lazyload } from 'vant';
  Vue.use(Toast)
  Vue.use(Swipe)
  Vue.use(SwipeItem)
  Vue.use(Lazyload)
  export default {
    name: "goods-item",
    data(){
      return {
        isPanel: false,
        amount: 1,
        gid: this.$route.query.gid ? this.$route.query.gid : ''
      }
    },
    computed:{
      ...mapState({
        attrs: state => state.goods.attrs,
        details: state => state.goods.details,
        reviews: state => state.goodsReview.reviews,
        total: state => state.goodsReview.total
      })
    },
    created() {
      this.isMove = true
      this.getDetails({gid:this.gid})
      this.getSpec({gid:this.gid})
      this.getReview({gid:this.gid, success:()=>{
        this.$nextTick(()=>{
          this.$utils.lazyImg()
        })
      }})
    },
    mounted(){
    },
    methods:{
      ...mapMutations({
        'SELECT_ATTR':'goods/SELECT_ATTR',
        'ADD_ITEM': 'cart/ADD_ITEM'
      }),
      ...mapActions({
        'getDetails': 'goods/getDetails',
        'getSpec' : 'goods/getSpec',
        'getReview': 'goodsReview/getReview'
      }),
      // 显示属性面板
      showPanel(){
        this.isPanel = true
      },
      // 隐藏属性面板
      hidePanel(){
        if (this.isMove) {
          this.isPanel = false
        }
      },
      // 设置数量
      setAmount(e) {
        this.amount=e.target.value
        this.amount = this.amount.replace(/[^\d]/g, '')
        if (!this.amount || this.amount == 0) {
          this.amount = 1
        }
      },
      // 确认提交
      sureSubmit(){
        if (this.attrs.length > 0 ) {
          let isActive = false
          for (let i=0; i<this.attrs.length; i++) {
            isActive = false
            for(let j=0; j<this.attrs[i].values.length; j++) {
              if (this.attrs[i].values[j].active){
                isActive = true
                break
              }
            }
            if (!isActive) {
              Toast('请选择'+ this.attrs[i].title)
              break
            }
          }
          if (isActive) {
            this.addCart()
          }
        }
      },
      // 添加到购物车
      addCart() {
        if (this.isMove) {
          this.isMove = false
            let goodsImg = this.$refs['goods-img'],
            goodsInfo = this.$refs['goods-info'],
            cloneImg = goodsImg.cloneNode(true),
            iconCart = document.getElementById('icon-cart'),
            cartPanel = this.$refs['cart-panel']

        const cartTop = window.innerHeight - cartPanel.offsetHeight
        cloneImg.style.cssText = 'position:absolute; z-index:10; left:0.3rem; top:0.2rem; width:0.4rem; height:0.4rem; margin:0'
        goodsInfo.appendChild(cloneImg)
        TweenMax.to(cloneImg, 2, {bezier:[{x: cloneImg.offsetLeft, y: -100}, {x:iconCart.offsetLeft, y:-cartTop}], onComplete: ()=> {
            // 加入购物车
            let attrs = [], param = []
            if (this.attrs.length > 0){
              for (let i=0; i<this.attrs.length; i++) {
                param = []
                for (let j=0; j < this.attrs[i].values.length; j++) {
                  if ( this.attrs[i].values[j].active) {
                    param.push({
                      paramid: this.attrs[i].values[j].vid,
                      title: this.attrs[i].values[j].value
                    })
                  }

                }
                attrs.push({
                  attrid: this.attrs[i].attrid,
                  title: this.attrs[i].title,
                  param: param
                   })
              }
            }
            let cartData = {
              gid: this.gid,
              title: this.details.title,
              amount: this.amount,
              price: this.details.price,
              img: this.details.images[0],
              checked: true,
              freight: this.details.freight,
              attrs: attrs

            }
          // console.log(cartData)
          this.ADD_ITEM({cartData:cartData})
          cloneImg.remove()
          this.isMove = true
          this.hidePanel()
        }})
        TweenMax.to(cloneImg, 0.2, {rotation:360, repeat:-1})
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
@import "src/assets/css/home/goods/goods_detail_item.scss";
</style>