import Vue from 'vue';
import {getClassifyData, getGoodsData } from '../../../api/goods';

export default {
  namespaced:true,
  state:{
    classify: [],
    aGoods:[]
  },
  mutations:{
    ['SET_CLASSIFY'](state,payload){
      state.classify = payload.classify
    },
    ['SET_ITEM'](state,payload){

      if(state.classify.length>0){
        for(let i=0; i<state.classify.length; i++){
          if(state.classify[i].active){
            state.classify[i].active= false
            break
          }
        }
      }
      state.classify[payload.index].active = true;
      Vue.set(state.classify, payload.index, state.classify[payload.index])
    },
    ['SET_GOODS'] (state, payload) {

      state.aGoods = payload.aGoods
    }
  },
  actions: {
    // 左侧分类
    getClassify(conText,payload){
      getClassifyData().then(res => {
        if(res.code === 200){
          for(let i=0; i<res.data.length; i++){
            res.data[i].active=false;
          }
          conText.commit('SET_CLASSIFY',{classify:res.data});
          if(payload.success){
            payload.success();
          }
        }
      })
    },
    // 分类右侧商品
    getGoods (conText, payload) {
      getGoodsData(payload.cid).then(res => {
        // console.log(res)
        if (res.code === 200) {
          conText.commit('SET_GOODS', { aGoods: res.data })
          if (payload.success) {
            payload.success()
          }
        } else {
          conText.commit('SET_GOODS', { aGoods: []})
        }
      })

    }
  }
}