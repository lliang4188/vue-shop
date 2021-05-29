import SubHeader from '@/components/sub-header';
<template>
  <div class="page-address">
    <sub-header :title="headerName"></sub-header>
    <div class="address-input-wrap">
      <h2 class="title-text">收货人</h2>
      <input type="text" placeholder="收货人姓名" v-model.trim="name" />
    </div>
    <div class="address-input-wrap">
      <h2 class="title-text">手机号码</h2>
      <input type="tel" placeholder="收货人手机号码" v-model.trim="cellphone" />
    </div>
    <div class="address-input-wrap">
      <h2 class="title-text">所在地区</h2>
      <input
        type="text"
        placeholder="请选择地区"
        readonly
        class="area"
        :value="showArea"
        @click="areaShow = true"
      />
    </div>
    <div class="address-input-wrap">
      <h2 class="title-text">详细地址</h2>
      <input type="text" placeholder="街道、楼牌号等" v-model.trim="address" />
    </div>
    <div class="address-input-wrap">
      <h2 class="title-text">设置为默认地址</h2>
      <input type="checkbox" v-model="isDefault" />
    </div>
    <div class="btn-wrap">
      <button type="button" class="btn-address" @click="submit()">修改</button>
    </div>
    <van-popup v-model="areaShow" position="bottom">
      <van-area
        title="地区选择"
        :area-list="areaList"
        @cancel="areaShow = false"
        @confirm="selectArea"
      ></van-area>
    </van-popup>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import SubHeader from '@/components/sub-header'
  import { areaList } from '@vant/area-data'
  import { Toast, Area, Popup } from 'vant'
  Vue.use(Toast)
  Vue.use(Area)
  Vue.use(Popup)

  export default {
    name: 'address-mod',
    components: {
      SubHeader
    },
    data() {
      return {
        headerName: '修改收货地址',
        name: '',
        cellphone: '',
        showArea: '',
        address: '',
        isDefault: false,
        areaList,
        areaShow: false,
        province: '',
        city: '',
        area: ''
      }
    },
    created(){
      this.aid = this.$route.query.aid ? this.$route.query.aid : ''
      this.isSubmit = true
      console.log(this.aid)
      this.getAddressInfo({aid: this.aid, success:(res) =>{
        this.name = res.data.name
        this.cellphone = res.data.cellphone
        this.province = res.data.province
        this.city = res.data.city
        this.area = res.data.area
        this.showArea = this.province + ' ' + this.city+ ' ' + this.area

        this.address = res.data.address
        this.isDefault = res.data.isdefault ==='1' ? true : false

      }})
    },
    mounted() {
      document.title = this.$route.meta.title
    },
    methods: {
      ...mapActions({
        addAddress: 'address/addAddress',
        getAddressInfo: 'address/getAddressInfo'
      }),
      submit() {
        if (this.name.match(/^\s*$/)) {
          Toast('请输入收货人姓名')
          return
        }
        if (this.cellphone.match(/^\s*$/)) {
          Toast('请输入收货人手机号码')
          return
        }
        if (!this.cellphone.match(/^1[3|4|5|7|8]\d{9}$/)) {
          Toast('请输入正确的手机号')
          return
        }
        if (this.showArea.match(/^\s*$/)) {
          Toast('请选择所在地区')
          return
        }
        if (this.address.match(/^\s*$/)) {
          Toast('请输入详情的地址')
          return
        }
        if (this.isSubmit) {
          this.isSubmit = false
          this.addAddress({
          aid: this.aid,
          name: this.name,
          cellphone: this.cellphone,
          province: this.province,
          city: this.city,
          area: this.area,
          address: this.address,
          isdefault: this.isDefault ? '1' : '0',
          success: (res)=> {
            if (res.code === 200) {
              Toast({
                duration: 2000,
                message: '修改成功！',
                onClose: ()=>{
                  this.$router.go(-1)
                }
              })
            }
          }
        })
        }

      },
      // 选择地区
      selectArea(val) {
        this.areaShow = false
        let tmpVal = []
        if (val.length > 0) {
          val.map((item) => {
            tmpVal.push(item.name)
          })
          this.province = tmpVal[0]
          this.city = tmpVal[1]
          this.area = tmpVal[2]
        }
        this.showArea = tmpVal.join(' ')
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/home/address/index.scss";
</style>