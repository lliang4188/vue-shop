import Vue from 'vue';
import {getClassifyData, getGoodsData, getDetailData, getSpecData } from '../../../api/goods';

export default {
  namespaced: true,
  state: {
    classify: [],
    aGoods: [],
    attrs: [],
    details:{}
  },
  mutations: {
    ['SET_CLASSIFY'](state, payload) {
      state.classify = payload.classify
    },
    ['SET_ITEM'](state, payload) {
      if (state.classify.length > 0) {
        for (let i = 0; i < state.classify.length; i++) {
          if (state.classify[i].active) {
            state.classify[i].active = false
            break
          }
        }
      }
      state.classify[payload.index].active = true
      Vue.set(state.classify, payload.index, state.classify[payload.index])
    },
    ['SET_GOODS'](state, payload) {
      state.aGoods = payload.aGoods
    },
    ['SELECT_ATTR'] (state, payload) {

      if (state.attrs.length > 0) {
        for (let i = 0; i < state.attrs[payload.index].values.length; i++) {
          if (state.attrs[payload.index].values[i].active) {
            state.attrs[payload.index].values[i].active = false
            break
          }

        }

        state.attrs[payload.index].values[payload.index2].active = true

        Vue.set(
          state.attrs[payload.index].values[payload.index2],
          payload.index2,
          state.attrs[payload.index].values[payload.index2]
        )
      }
    },
    // 设置商品详情
    ['SET_DETAILS'] (state, payload) {
        state.details = payload.details
    },
    // 商品规格
    ['SET_ATTRS'] (state, payload) {
      state.attrs = payload.attrs
    }
  },
  actions: {
    // 左侧分类
    getClassify(conText, payload) {
      getClassifyData().then((res) => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].active = false
          }
          conText.commit('SET_CLASSIFY', { classify: res.data })
          if (payload && payload.success) {
            payload.success()
          }
        }
      })
    },
    // 分类右侧商品
    getGoods(conText, payload) {
      getGoodsData(payload.cid).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          conText.commit('SET_GOODS', { aGoods: res.data })
          if (payload.success) {
            payload.success()
          }
        } else {
          conText.commit('SET_GOODS', { aGoods: [] })
        }
      })
    },
    // 商品详情
    getDetails (conText, payload) {
      getDetailData(payload.gid).then((res) => {
        if (res.code === 200) {
          conText.commit('SET_DETAILS', { details: res.data })
          if (payload && payload.success) {
            payload.success()
          }
        }
      })
    },

    // 商品规格
    getSpec (conText, payload) {
      getSpecData(payload.gid).then(res => {
        // console.log(res)
        if (res.code === 200) {
          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              for (let j = 0; j < res.data[i].values.length; j++) {
                res.data[i].values[j].active= false
              }
              conText.commit('SET_ATTRS', {attrs:res.data})
            }
          }
        }
      })
    }
  },
}