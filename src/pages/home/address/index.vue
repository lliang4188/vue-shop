<template>
  <div class="page-address">
    <sub-header :title="headerName"></sub-header>
    <div class="address-head">
      <span>配送地址</span>
      <span @click="$router.push('/address/add')">+ 添加收货地址</span>
    </div>
    <template v-if="address.length > 0">
      <div class="address-list" v-for="(item, index) in address" :key="index" @click="selectAddress(item.aid)">
        <div class="address-info-wrap">
          <div class="check-mark" v-if="item.isdefault === '1' ? true : false"></div>
          <div class="address-info">
            <p class="person">
              <span>{{ item.name }}</span>
              <span>{{ item.cellphone }}</span>
            </p>
            <div class="address">
              <span class="default" v-if="item.isdefault === '1' ? true : false">默认</span>
              <p>{{ item.province + item.city + item.area + item.address }}</p>
            </div>
          </div>
        </div>
        <div class="handle-wrap">
          <div class="btn-handle" @click.stop="$router.push('/address/mod?aid=' + item.aid )"></div>
          <div class="btn-handle" @click.stop="delAddress(index, item.aid)"></div>
        </div>
      </div>
    </template>
    <div class="no-data" v-else>
        <p class="text">您还没有添加收货地址</p>
      </div>
  </div>
</template>

<script>
  import { Dialog } from 'vant'
  import { mapState, mapActions } from 'vuex'
  import SubHeader from '@/components/sub-header'
  export default {
    name: 'address-choose',
   components: {
     SubHeader
   },
    data() {
      return {
        headerName: '选择收货地址'
      }
    },
    created(){
      this.getAddress()
    },
    computed: {
      ...mapState({
        address: state => state.address.address
      })
    },
    mounted() {
      document.title = this.$route.meta.title
    },
    methods: {
      ...mapActions({
        getAddress: 'address/getAddress',
        ansycDelAddress: 'address/delAddress'
      }),

      // 删除收货地址
      delAddress (index, aid) {
        Dialog.confirm({
          title:'',
          message: '确定要删除吗？',
          confirmButtonColor: '#1989fa'
        })
        .then(()=>{
          this.ansycDelAddress({index:index, aid:aid})
        })
        .catch(()=> {
          console.log('cannel')
        })
      },
      // 选择收货地址
      selectAddress (aid) {
        sessionStorage['addsid'] = aid
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/home/address/index.scss";
</style>