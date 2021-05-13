import {getNavsData, getBannerData, getGoodsData, getRmData} from "../../../api/index";

export default {
    namespaced:true,
    state:{
        navs:[],
        banners:[],
        goods:[],
        rmGoods:[]
    },
    mutations:{
        ["SET_NAVS"](state,payload){
            state.navs=payload.navs;
            // console.log(state.navs);
        },
        ["SET_BANNERS"](state,payload){
            state.banners = payload.banners;

        },
        ["SET_GOODS"](state,payload){
            state.goods = payload.goods;

        },
        ["SET_RMGOODS"](state, payload) {
            state.rmGoods = payload.rmGoods;
        }
    },
    actions:{
        getNavs(conText, payload){
            getNavsData().then(res=>{
                 // console.log(res);
                if (res.code===200){
                    conText.commit("SET_NAVS",{navs:res.data});
                    if(payload.success){
                        payload.success()
                    }
                }
            })
        },
        getBanners(conText, payload){
            getBannerData().then(res =>{
                if (res.code === 200){
                    conText.commit("SET_BANNERS",{banners:res.data})
                    if(payload && payload.success){
                        payload.success()
                    }

                }
            })
        },
        getGoods(conText, payload){
            getGoodsData().then(res => {
                if(res.code === 200) {
                    conText.commit("SET_GOODS",{goods:res.data})
                    if(payload.success){
                        payload.success()
                    }
                }
            })
        },
        getRecommend(conText, payload){
            getRmData().then(res =>{
               if(res.code === 200) {
                   conText.commit("SET_RMGOODS",{rmGoods:res.data});
                   if(payload.success){
                       payload.success()
                   }
               }
            })
        }
    }
}