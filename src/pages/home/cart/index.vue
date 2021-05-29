<template>
    <div>
      <div class="cart-main">
        <sub-header :title="headerName" :isBack = "$route.query.from === 'goods_details' ? true : false"></sub-header>
        <div class="cart-list-wrap">
          <div class="cart-list" v-for="(item, index) in cartData" :key="index">
            <div :class="{'select':true, 'active':item.checked}" @click="selectItem(index)"></div>
            <div class="img-wrap">
              <div class="image">
                <img :src="item.img" alt="">
              </div>
              <span class="del" @click="delItem(index)">删除</span>
            </div>
            <div class="goods-wrap">
              <h4 class="goods-title">{{ item.title }}</h4>
              <div class="goods-attr">
                <span v-for="(item2, index2) in item.attrs" :key="index2">{{ item2.title }}：
                  <template v-for="item3 in item2.param">
                    {{ item3.title }}
                  </template>
                </span>

              </div>
              <div class="buy-wrap">
                <p class="price">&yen; {{ item.price }}</p>
                <div class="amount-input-wrap">
                    <div :class="item.amount >1 ? 'btn dec': 'btn dec active'" @click="DEC_AMOUNT({index:index})">-</div>
                    <div class="amount-input">
                      <input type="tel" :value="item.amount" @input="SET_AMOUNT({index:index,amount:$event.target.value })">
                    </div>
                    <div class="btn inc" @click="INC_AMOUNT({index:index})">+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-bottom-wrap">
          <div class="select-area">
            <div class="sleect-wrap" @click="allSelect()">
               <div :class="{'select':true, 'active':isAllSelect}"></div>
               <span>全选</span>
            </div>

            <div class="total">
              <span>运费：<strong>&yen; {{ freight }}</strong></span>
              <span>合计：<strong>&yen; {{ total }}</strong></span>
            </div>
          </div>
          <div :class="total > 0 ? 'btn' : 'btn disable'" @click="statement()" >结算</div>
        </div>
      </div>
    </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import SubHeader from '../../../components/sub-header'
  export default {
    name: "cart",
    data() {
      return {
        headerName: '购物车',
        isAllSelect : true
      }
    },
    components: {
      SubHeader
    },
    created () {
      this.checkAllSelect()
    },
    mounted() {
      document.title = this.$route.meta.title
    },
    computed: {
      ...mapState( {
        cartData: state => state.cart.cartData
      }),
      ...mapGetters( {
        total: 'cart/total',
        'freight' : 'cart/freight'
      })
    },
    methods: {
      ...mapMutations ({
        DEL_ITEM: 'cart/DEL_ITEM',
        SET_AMOUNT: 'cart/SET_AMOUNT',
        INC_AMOUNT: 'cart/INC_AMOUNT',
        DEC_AMOUNT: 'cart/DEC_AMOUNT',
        SELECT_ITEM: 'cart/SELECT_ITEM',
        ALL_SELECT_ITEM: 'cart/ALL_SELECT_ITEM'
      }),
      // 删除商品
      delItem (index) {
        this.DEL_ITEM({index:index})
        this.checkAllSelect()
      },
      // 选择商品
      selectItem (index) {
        this.SELECT_ITEM({index:index})
        this.checkAllSelect()
      },
      // 全选
      allSelect ( ) {
        if (this.cartData.length > 0) {
          this.isAllSelect = !this.isAllSelect
          this.ALL_SELECT_ITEM({checked: this.isAllSelect})
        }

      },
      // 检测是否全选
      checkAllSelect () {
        if (this.cartData.length > 0) {
          let isChecked = true
          for(let i=0; i<this.cartData.length; i++) {
            if (!this.cartData[i].checked) {
              isChecked = false
              break
            }
          }
          this.isAllSelect = isChecked
        } else {
          this.isAllSelect = false
        }
      },
      statement() {
        if (this.total > 0) {
          this.$router.push('/order')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '@/assets/css/cart/index';
</style>