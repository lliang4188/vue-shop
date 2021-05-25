<template>
    <div class="page-login">
       <sub-header :title="headerName"></sub-header>
       <div class="login-main">
           <form>
                <div class="login-item">
                    <input type="tel" placeholder="手机号" v-model="cellphone">
                </div>
                <div class="login-item login-password">
                    <input :type="isOpen ? 'text' : 'password'" placeholder="密码" autocomplete="true" v-model="password">
                    <span :class="isOpen ? 'eyes open': 'eyes'" @click="eye()"></span>
                </div>
                <button type="button" class="btn-login" @click="doLogin()">登录</button>
                <div class="other-info">
                    <span class="btn-other">忘记密码</span>
                    <span class="btn-other" @click="$router.push('/reg')">立即注册</span>
                </div>
           </form>
       </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { Toast } from 'vant'
    import SubHeader from '@/components/sub-header'
    import { mapActions } from 'vuex'
    Vue.use({
        Toast
     })
    export default {
        name: "login",

        data(){
            return {
                headerName: '会员登录',
                isOpen: false,
                cellphone: '',
                password: ''
            }
        },
        components: {
            SubHeader
        },
        methods:{
            ...mapActions({
                login:"user/login"
            }),
            eye() {
             this.isOpen = !this.isOpen
            },
            doLogin(){
                if (this.cellphone.match(/^\s*$/)){
                    Toast('请输入手机号')
                    return
                }

               if (!this.cellphone.match(/^1[3|4|5|7|8]\d{9}$/)) {
                   Toast('请输入正确的手机号')
                   return
               }

                if (this.password.match(/^\s*$/)){
                    Toast("请输入密码")
                    return
                }
                this.login({cellphone:this.cellphone,password:this.password,success:(res)=>{
                        // console.log(res);
                        if (res.code===200){
                            if (this.$route.query.from === 'reg') {
                                this.$router.go(-3)
                            } else {
                                this.$router.go(-1)
                            }

                        } else{
                            Toast(res.data)
                        }
                    }});
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/css/home/login/index.scss';
</style>