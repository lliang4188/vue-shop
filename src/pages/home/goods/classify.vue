<template>
    <div class="page">
        <div class="search-header">
            <a class="btn-back" @click="goBack"></a>
            <div class="search-wrap" @click="searchShow.show=true">请输入宝贝名称</div>
        </div>
        <div class="goods-main">
            <div class="classify-nav" ref="classify-scroll">
                <div>
                    <span :class="{'nav-item':true, active:item.active}" v-for="(item,index) in classify" :key="index" @click="replacePage('/goods/classify/item?cid='+item.cid,index)" ref="item">{{item.title}}</span>
                </div>

            </div>
            <div class="goods-container">
                <router-view></router-view>
            </div>
        </div>
        <search-component :show="searchShow" ></search-component>
    </div>
</template>

<script>
  import {mapActions, mapState, mapMutations} from 'vuex'
  import SearchComponent from '../../../components/search'
  import Iscroll from '../../../assets/js/lib/iscroll'
  export default {
    name: "classify",
    components:{
        SearchComponent
    },
    data(){
      return {
        searchShow: {
          show: false
        }
      }
    },
    created(){
      this.cid = this.$route.query.cid ? this.$route.query.cid : '';
      // console.log(this.cid);
        this.getClassify({
          success:()=>{
            this.$nextTick(()=>{
              this.myScroll.refresh();
              if(this.classify.length>0 && this.cid){
                let i=0;
                 for(; i<this.classify.length; i++){
                   if (this.classify[i].cid === this.cid){

                     break;
                   }
                 }
                 this.selectItem(i);
              } else{
                this.selectItem(0);
              }
            })
          }
        });
    },
    methods:{
      ...mapActions({
        getClassify: 'goods/getClassify'
      }),
      ...mapMutations({
        SET_ITEM:'goods/SET_ITEM'
      }),
      goBack(){
        this.$router.go(-1)
      },
      selectItem(index){
        let topHeight = this.$refs['item'][0].offsetHeight * index,
            halfHeight = this.$refs['classify-scroll'].offsetHeight/3,
            bottomHeight = parseInt(this.$refs['classify-scroll'].scrollHeight - topHeight);
        if (topHeight>halfHeight && bottomHeight > this.$refs['classify-scroll'].offsetHeight) {
          this.myScroll.scrollTo(0, -topHeight, 1000);
        }
        this.SET_ITEM({index:index})
      },
      replacePage(url,index){
        this.$router.replace(url);
        this.selectItem(index)

      }

    },
    computed: {
      ...mapState({
         classify:(state) => state.goods.classify
      })
    },
    mounted(){
      document.title = this.$route.meta.title;
      this.$refs['classify-scroll'].addEventListener('touchmove', function (e) { e.preventDefault();}, { passive: false });
      this.myScroll = new Iscroll(this.$refs['classify-scroll'], {
        scrollX:false,
        scrollY: true,
        preventDefault:false
      })
    },

    beforeDestroy(){
      this.$refs['classify-scroll'].removeEventListener('touchmove',  function (e) { e.preventDefault();}, { passive: false })
    }

  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/css/home/goods/classify";
</style>