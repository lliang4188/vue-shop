<template>
    <div>
        <ul>
            <li>
                <router-link to="/news">新闻页面</router-link>
            </li>
            <li>
                <router-link to="/goods">商品页面</router-link>
            </li>
            <li>
                <router-link to="/login">会员登录</router-link>
            </li>
            <li>
                <router-link to="/ucenter">个人中心</router-link>
            </li>
            <li>
                <router-link to="/classify">商品分类</router-link>
            </li>
        </ul>
        <Counter></Counter>
        计数器：<button type="button" @click="decCount()">-</button> {{$store.state.counter.total}} <button type="button" @click="incCount()">+</button>
        商品金额：<button type="button" @click="decCartCount()">-</button> {{$store.state.cart.total}} <button type="button" @click="incCartCount()">+</button>
        <ul>
            <li v-for="(item,index) in users" :key="index">{{item.name}}，{{item.age}}</li>
        </ul>
        <ul>
            <li v-for="(item,index) in navs" :key="index">{{item.title}}</li>
        </ul>
    </div>
</template>

<script>
    import {mapState,mapMutations,mapActions,mapGetters} from 'vuex';
    import Counter from '../../../components/counter';
    import {INC_COUNT,DEC_COUNT} from '../../../store/modules/mutation-types.js';
    export default {
        name: "index",
        data(){
            return {
                num:0,
                amount:0
            }
        },
        components:{
            Counter
        },
        computed:{
            // ...mapState(['total']),
            // ...mapState({
            //     total:"total"
            // }),
            ...mapState({
                navs:(state)=>state.index.navs
            }),
            // ...mapGetters(["getUsers"]),
            ...mapGetters({
                users:"user/getUsers"
            })
        },
        created(){
            this.getNavs();
        },
        methods:{
            // ...mapMutations(['INC_COUNT',"DEC_COUNT"]),
            ...mapMutations({
               INC_COUNT: INC_COUNT,
                DEC_COUNT:DEC_COUNT
            }),
            // ...mapActions(["incTotal","decTotal"]),
            ...mapActions({
                incTotal:"counter/incTotal",
                decTotal:"counter/decTotal",
                getNavs:"index/getNavs"
            }),
            incCount(){
                // this.$store.commit("INC_COUNT",{total:++this.num});
                // this.INC_COUNT({total:++this.num});
                // this.$store.dispatch("incTotal",{total:++this.num});
                this.incTotal({total:++this.num})
            },
            decCount(){
                // this.$store.commit("DEC_COUNT",{total:--this.num});
                // this.DEC_COUNT({total:--this.num});
                // this.$store.dispatch("decTotal",{total:--this.num});
                this.decTotal({total:--this.num});
            },
            incCartCount(){
                this.$store.commit("cart/"+INC_COUNT,{total:++this.amount});
            },
            decCartCount(){
                this.$store.commit("cart/"+DEC_COUNT,{total:--this.amount});
            }
        }
    }
</script>

<style scoped>

</style>