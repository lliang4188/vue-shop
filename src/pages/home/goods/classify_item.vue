<template>
  <div class="list-wrap" ref="list-scroll">
    <div v-show="aGoods.length > 0">
      <div class="list-item" v-for="(item, index) in aGoods" :key="index">
        <h2 class="title">{{ item.title }}</h2>
        <div class="list-inner">
          <div class="item" v-for="(item2, index2) in item.goods" :key="index2">
            <div class="image">
              <img
                src="../../../assets/images/common/grey.jpg"
                :data-echo="item2.image"
                :art="item.title"
              />
            </div>
            <p class="goods-title">{{ item2.title }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-show="aGoods.length <= 0" class="no-data">
      <p class="text">没有相关商品</p>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Iscroll from '../../../assets/js/lib/iscroll'
  export default {
    name: "goods-classify-item",
    data(){
      return {}
    },
    created(){
        this.cid = this.$route.query.cid ? this.$route.query.cid : '';
        this.init(this.cid)
    },
    methods:{
        ...mapActions({
            getGoods:'goods/getGoods'
        }),
        init(cid){
        this.getGoods({cid:cid,success:()=>{
            this.$nextTick(()=>{
                 this.myScroll.refresh()
                 this.$utils.lazyImg()
            })
        }})
        }
    },
    computed:{
        ...mapState({
            aGoods:(state)=> state.goods.aGoods
        })
    },
    beforeRouteUpdate(to, from, next){
        this.init(to.query.cid)
        // this.myScroll.scrollTo(0,0,200)
        next()
    },

    mounted(){
      this.$refs['list-scroll'].addEventListener('touchmove', function (e) { e.preventDefault();},{passive: false});
      this.myScroll =  new Iscroll(this.$refs['list-scroll'], {
        scrollX:false,
        scrollY: true,
        preventDefault:false
      })
      this.myScroll.on('scrollEnd',()=>{
          this.$utils.lazyImg()
      })
    },
    beforeDestroy(){
      this.$refs['list-scroll'].removeEventListener('touchmove',  function (e) { e.preventDefault();}, { passive: false })
    }
  }
</script>

<style lang="scss" scoped>
@import "src/assets/css/home/goods/classify_item";
</style>