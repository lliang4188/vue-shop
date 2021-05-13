<template>
  <div class="content" v-html="details.bodys"></div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: "goods-content",
    data(){
      return {
        gid: this.$route.query.gid ?  this.$route.query.gid : ''
      }
    },
    created(){
      this.getDetails({gid:this.gid})
    },
    computed: {
      ...mapState({
        details: state => state.goods.details
      })
    },
    methods:{
      ...mapActions({
        getDetails: 'goods/getDetails'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    background-color:#fff;
    font-size: 0.32rem;
    padding: 0.2rem 0.3rem;
    line-height: 0.44rem;
  }
</style>