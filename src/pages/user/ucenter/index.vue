import SubHeader from '@/components/sub-header';
<template>
    <div class="page-ucenter">
        <sub-header :title="headerName" :isBack="false"></sub-header>
        <div class="ucenter-head">
            <div class="head">
                <img :src="head ? head : require('@/assets/images/head_default.png')" :alt="nickname ? nickname: ''">
            </div>
            <div class="info-wrap">
                <p>{{ nickname ? nickname : '昵称' }}</p>
                <p>我的积分：{{ points }}</p>
            </div>
        </div>
        <div class="order-head">
            <h2 class="order-title">全部订单</h2>
            <span>查看全部订单 &gt;</span>
        </div>
        <div class="order-menu">
            <div class="menu-ele">待支付</div>
            <div class="menu-ele">待收货</div>
            <div class="menu-ele">待评价</div>
        </div>
        <div class="menu-wrap">
            <ul class="menu-list">
                <li>
                    <span>个人资料</span>
                </li>
                <li>
                    <span>收货地址</span>
                </li>
                <li>
                    <span>绑定手机</span>
                </li>
                <li>
                    <span>修改密码</span>
                </li>
                <li>
                    <span>我的收藏</span>
                </li>
            </ul>
            <div class="btn-wrap">
                <button type="button" class="btn" @click="isLogin ? outLogin() : goPage('/login') ">{{ isLogin ? '安全退出' : '登录/注册' }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapState, mapActions } from 'vuex'
    import { Dialog } from 'vant'
    import SubHeader from '@/components/sub-header'
    Vue.use(Dialog)
    export default {
        name: 'ucenter',
        components: {
            SubHeader
        },
        computed: {
            ...mapState({
                isLogin: state => state.user.isLogin,
                nickname: state => state.user.nickname,
                head: state => state.user.head,
                points: state => state.user.points
            })
        },
        data() {
            return {
                headerName: '个人中心'
            }
        },
        created(){
            this.getUserInfo()
        },
        methods:{
            ...mapActions({
                ansycOutLogin: 'user/outLogin',
                getUserInfo: 'user/getUserInfo'
            }),
            goPage(url) {
                this.$router.push(url)
            },
            outLogin() {
                Dialog.confirm({
                    title: '',
                    message: '确认要退出吗？',
                    confirmButtonColor: '#1989fa'
                })
                .then(()=>{
                    this.ansycOutLogin()
                })
                .catch(()=>{

                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/css/my/index.scss'
</style>