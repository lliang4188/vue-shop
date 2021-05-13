<template>
  <div>
    <div class="review-main review-page">
      <h2 class="review-title">商品评价（{{ total }}）</h2>
      <div class="review-wrap" v-show="reviews.length > 0">
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
      </div>
      <div class="no-data" v-show="reviews.length <= 0">
        <p class="text">暂无评价!</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import UpRefresh from '../../../assets/js/lib/uprefresh'
  export default {
    name: "goods-review",
    data(){
      return {
        gid: this.$route.query.gid ? this.$route.query.gid : ''
      }
    },
    created(){
      this.pullUp = new UpRefresh
      this.getReview({gid:this.gid, success:(pageNum)=>{
        this.$nextTick(()=>{
          this.$utils.lazyImg()
        })
         this.pullUp.init({"curPage":1,"maxPage":parseInt(pageNum),"offsetBottom":100},(page)=>{
                        this.getReviewPage({gid:this.gid,page:page});
                    });
      }})
    },
    computed:{
      ...mapState({
        reviews: state => state.goodsReview.reviews,
        total: state => state.goodsReview.total
      })
    },
    methods:{
      ...mapActions({
        'getReview': 'goodsReview/getReview',
        'getReviewPage': 'goodsReview/getReviewPage'
      }),
    },
    beforeDestroy(){
      this.pullUp.uneventSrcoll()
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/css/home/goods/goods_detail_item.scss";
</style>