<template>
  <div class="page-login">
    <sub-header :title="headerName"></sub-header>
    <div class="login-main">
      <form>
        <div class="login-item code-item">
          <input type="text" placeholder="验证码" v-model="vcode" />
          <div class="img-code">
            <img :src="showCode" @click="changeCode($event)" />
          </div>
        </div>
        <div class="login-item reg-cellphone">
          <div class="reg-input-con">
            <input type="tel" placeholder="手机号" v-model.trim="cellphone" @input="checkCellphone" />
          </div>
          <div :class="{ 'btn-code': true, success: isSendMsgCode }" @click="isSendMsgCode && getMsgCode()">
            {{ sendMsgText }}
          </div>
        </div>
        <div class="login-item">
          <input
            type="text"
            placeholder="请输入短信验证码"
            v-model.trim="msgCode"
          />
        </div>
        <div class="login-item login-password">
          <input
            :type="eyesShow ? 'text' : 'password'"
            placeholder="请输入密码"
            v-model.trim="password"
            autocomplete="false"
          />
          <span
            :class="eyesShow ? 'eyes open' : 'eyes'"
            @click="eyesShow = !eyesShow"
          ></span>
        </div>
        <div class="login-item login-password">
          <input
            :type="rsEyesShow ? 'text' : 'password'"
            placeholder="请确认密码"
            v-model.trim="rsPassword"
            autocomplete="false"
          />
          <span
            :class="rsEyesShow ? 'eyes open' : 'eyes'"
            @click="rsEyesShow = !rsEyesShow"
          ></span>
        </div>
        <button type="button" class="btn-login" @click="submit()">注册</button>
      </form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Toast } from 'vant'
  import { mapActions } from 'vuex'
  import SubHeader from '@/components/sub-header'

  Vue.use(Toast)

  export default {
    'name': 'reg',
    components: {
      SubHeader
    },
    data () {
      return {
        headerName: '会员注册',
        showCode:  this.$config.baseApi + '/vcode/chkcode?token=' + this.$config.token,
        vcode: '',
        cellphone: '',
        msgCode: '',
        password: '',
        rsPassword: '',
        eyesShow: false,
        rsEyesShow: false,
        isSendMsgCode: false,
        sendMsgText: '获取短信验证码'
      }
    },
    created (){
      this.timer = null
    },
    methods: {
      ...mapActions({
        checkVCode: 'user/checkVCode',
        isReg: 'user/isReg',
        regUser: 'user/regUser'
      }),
      changeCode (e) {
        e.target.src = this.$config.baseApi + '/vcode/chkcode?token=' + this.$config.token + '&random=' + new Date().getTime()
      },
      async submit () {
        if (this.vcode.match(/^\s*$/)) {
          Toast('请输入图片验证码')
          return
        }
        let vcodeData = await this.checkVCode({vcode:this.vcode})

        if (vcodeData.code !== 200) {
          Toast('您输入的图片验证码不正确')
          return
        }

        if (this.cellphone.match(/^\s*$/)) {
          Toast('请输入手机号')
          return
        }

        if (!this.cellphone.match(/^1[3|4|5|7|8]\d{9}$/)) {
          Toast('请输入正确的手机号')
          return
        }
        let resData = await this.isReg({username: this.cellphone})
        if (resData.data.isreg ==='1') {
          Toast('此手机号已注册，请更换手机号')
          return
        }
        if (this.msgCode.match(/^\s*$/)) {
          Toast('请输入图片验证码')
          return
        }

        if (this.password.match(/^\s*$/)) {
          Toast('请输入密码')
          return
        }

        if (this.password.length < 6) {
          Toast('密码长度不能小于6位')
          return
        }

         if (this.rsPassword.match(/^\s*$/)) {
          Toast('请确认密码')
          return
        }

        if (this.rsPassword !== this.password) {
          Toast('两次输入密码不一致')
          return
        }

        this.regUser({
          cellphone: this.cellphone,
          password: this.password,
          vcode: this.vcode,
          success: (res) => {
            if (res.code === 200) {
              this.$router.push('/login?from=reg')
            } else {
              Toast(res.data)
            }
          }
          })
      },

      // 获取短信验证码
      async getMsgCode() {
         if (this.cellphone.match(/^\s*$/)) {
          Toast('请输入手机号')
          return
        }

        if (!this.cellphone.match(/^1[3|4|5|7|8]\d{9}$/)) {
          Toast('请输入正确的手机号')
          return
        }
        let resData = await this.isReg({username: this.cellphone})
        if (resData.data.isreg ==='1') {
          Toast('此手机号已注册，请更换手机号')
          return
        }
        let time = 10
        this.sendMsgText = '('+ time +')秒后重新获取'
        this.isSendMsgCode = false
        this.timer = setInterval(() =>{
          if (time > 0) {
            time--
            this.sendMsgText = '('+ time +')秒后重新获取'

          } else {
            clearInterval(this.timer)
            this.sendMsgText= '获取短信验证码'
            this.isSendMsgCode = true
          }

        },1000)

      },
      checkCellphone() {
        let isChecked = true

        if (this.cellphone.match(/^\s*$/)) {
           isChecked = false
        }
         if (!this.cellphone.match(/^1[3|4|5|7|8]\d{9}$/)) {
          isChecked = false
        }
        if (isChecked) {
          this.isSendMsgCode = true
        } else {
          this.isSendMsgCode = false
        }
      }
    },
    beforeDestroy(){
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/home/login/index.scss";
</style>