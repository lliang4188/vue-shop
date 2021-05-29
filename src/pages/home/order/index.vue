<template>
  <div class="page-order">
    <sub-header :title="headerName"></sub-header>
    <div class="address-wrap" @click="$router.push('/address')">
      <div class="has-address" v-if="name">
        <p class="persion-info">
          <span>收货人：{{ name }}</span>
          <span class="phone-text">{{ cellphone }}</span>
        </p>
        <p class="address">{{ showArea }}</p>
      </div>
      <p class="address-null" v-else>您到收货地址为空，点击添加收货地址</p>
    </div>
    <div class="goods-wrap">
      <div class="goods-list" v-for="(item, index) in newCartData" :key="index">
        <div class="images">
          <img :src="item.img" :alt="item.title" />
        </div>
        <div class="info-wrap">
          <h4 class="title">{{ item.title }}</h4>
          <p class="attr">
            <span v-for="(item2, index2) in item.attrs" :key="index2"
              >{{ item2.title }}：<template v-for="item3 in item2.param">{{
                item3.title
              }}</template></span
            >
          </p>
          <div class="info">
            <p class="amount">x {{ item.amount }}</p>
            <p class="price">&yen; {{ item.price }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="total-wrap">
      <h2>商品总额</h2>
      <p>&yen; {{ total }}</p>
    </div>
    <div class="total-wrap">
      <h2>运费</h2>
      <p>&yen; {{ freight }}</p>
    </div>
    <div class="balance-wrap">
      <p class="price-wrap">
        实际金额：<span class="price">&yen; {{ total + freight }}</span>
      </p>
      <button type="button" class="btn">提交订单</button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import SubHeader from '@/components/sub-header'
  export default {
    name: 'order',
    components:{
      SubHeader
    },
    data() {
      return {
        headerName: '确认订单',
        aid:sessionStorage['addsid'],
        name: '',
        cellphone: '',
        showArea: ''
      }
    },
    created() {
      this.$utils.safeUser(this)
      if (this.aid) {
        this.getAddressInfo({aid: this.aid, success:(res)=>{
          this.name = res.data.name,
          this.cellphone = res.data.cellphone,
          this.showArea = res.data.province + res.data.city + res.data.area + res.data.address
        }})
      } else {
        this.getDefaultAddress({success:(res)=>{
          sessionStorage['addsid'] = res.data.aid
          this.name = res.data.name,
          this.cellphone = res.data.cellphone,
          this.showArea = res.data.province + res.data.city + res.data.area + res.data.address
        }})
      }


    },
    mounted(){
      document.title = this.$route.meta.title

    },
    computed: {
      ...mapState({
        cartData: state => state.cart.cartData
      }),
      ...mapGetters({
        total: 'cart/total',
        freight: 'cart/freight'
      }),
      newCartData() {
        if (this.cartData.length > 0) {
          let data = this.cartData.filter(item => {
            return item.checked
          })
          return data
        } else {
          return []
        }
      }
    },
    methods: {
      ...mapActions({
        getAddressInfo: 'address/getAddressInfo',
        getDefaultAddress: 'address/getDefaultAddress'
      })
    }
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/home/order/index.scss";
</style>