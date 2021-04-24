<template>
  <div class="search-component" v-show="show.show">
    <div class="search-header">
      <a class="btn-close" @click="show.show = false"></a>
      <div class="search-wrap">
        <div class="search-input-wrap">
          <input type="text" placeholder="请输入宝贝名称" v-model="keyword" />
        </div>
        <button class="btn-search" @click="goSearch()"></button>
      </div>
    </div>
    <div class="search-main" v-if="historyKeywords.length > 0">
      <div class="head-wrap">
        <h2 class="title">最近搜索</h2>
        <a class="btn-delete" @click="clearHistory()"></a>
      </div>
      <div class="search-list">
        <div class="item" v-for="(item, index) in historyKeywords" :key="index">
          <span class="inner">{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="search-main">
      <div class="head-wrap">
        <h2 class="title">热门搜索</h2>
      </div>
      <div class="search-list">
        <div class="item" v-for="(item,index) in hotKeywords" :key="index" v-show="item.title !==''" @click="goSearch(item.title)">
          <span class="inner">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Dialog } from 'vant'
  import {mapMutations, mapState, mapActions} from 'vuex'

  Vue.use(Dialog)
  export default {
    name:'my-search',
    data(){
      return {
        keyword:''
      }
    },
    props:{
      show:{
        type:Object
      }
    },
    created(){
      this.keywords = this.historyKeywords ? this.historyKeywords : [];
      this.getHotKeyword();

    },
    computed:{
      ...mapState({
        'historyKeywords':state => state.search.historyKeywords,
        'hotKeywords':state => state.search.hotKeywords
      })
    },
    methods:{
      ...mapMutations({
        'SET_KEYWORDS': 'search/SET_KEYWORDS',
        'CLEAR_KEYWORDS': 'search/CLEAR_KEYWORDS'
      }),
      ...mapActions({
        'getHotKeyword': 'search/getHotKeyword'
      }),
      // 搜索按钮事件
      goSearch(keyword){
        let tmpKeyword = keyword || this.keyword || ''
        if(tmpKeyword){
          if(this.keywords.length > 0){
            for(let i=0; i<this.keywords.length; i++){
                if(this.keywords[i] === tmpKeyword) {
                  this.keywords.splice(i--,1)
                }
            }
          }
          this.keywords.unshift(tmpKeyword)
          this.SET_KEYWORDS({historyKeywords:this.keywords})
          console.log(this.historyKeywords)
        }

      },
      // 清除历史记录
      clearHistory(){
        if(this.historyKeywords.length > 0){
          Dialog.confirm({
            message:'确定要删除吗？',
            confirmButtonColor:'#4994df'
            }).then(()=>{
            this.CLEAR_KEYWORDS()
            }).catch(()=>{

          })
        }

      }
    }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/components/search/index";
</style>