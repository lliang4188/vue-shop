import Vue from 'vue'
import { getHotKeywordData, getSearchData, getAttrData} from '../../../api/search'

export default {
  namespaced: true,

  state: {
    historyKeywords: localStorage['historyKeywords']
      ? JSON.parse(localStorage['historyKeywords'])
      : [],
    hotKeywords: [],
    priceData: {
      isShow: true,
      items: [
        { price1: 1, price2: 50, active: false },
        { price1: 51, price2: 99, active: false },
        { price1: 100, price2: 300, active: false },
        { price1: 301, price2: 1000, active: false },
        { price1: 1001, price2: 4000, active: false },
        { price1: 4001, price2: 9999, active: false },
      ],
    },
    minPrice: '',
    maxPrice: '',
    attrs: [],
    searchData: [],
    cid: '',
    param: [],
    total: 0
  },
  mutations: {
    // 设置历史记录关键词
    ['SET_KEYWORDS'](state, payload) {
      state.historyKeywords = payload.historyKeywords
      localStorage['historyKeywords'] = JSON.stringify(state.historyKeywords)
    },
    // 清除搜索历史记录
    ['CLEAR_KEYWORDS'](state) {
      state.historyKeywords = []
      localStorage.removeItem('historyKeywords')
    },
    // 设置热门关键词
    ['SET_HOTKEYWORD'](state, payload) {
      state.hotKeywords = payload.hotKeywords
    },
    // 隐藏价格
    ['HIDE_PRICE'](state) {
      state.priceData.isShow = !state.priceData.isShow
    },
    // 选择价格
    ['SELECT_PRICE'](state, payload) {
      if (state.priceData.items.length > 0) {
        for (let i = 0; i < state.priceData.items.length; i++) {
          if (i !== payload.index) {
            if (state.priceData.items[i].active) {
              state.priceData.items[i].active = false
              break
            }
          }
        }
        state.priceData.items[payload.index].active = !state.priceData.items[
          payload.index
        ].active
        Vue.set(
          state.priceData.items,
          payload.index,
          state.priceData.items[payload.index]
        )
        state.minPrice = state.priceData.items[payload.index].active
          ? state.priceData.items[payload.index].price1
          : ''
        state.maxPrice = state.priceData.items[payload.index].active
          ? state.priceData.items[payload.index].price2
          : ''
      }
    },
    // 设置价格最小值
    ['SET_MINPRICE'](state, payload) {
      state.minPrice = payload.minPrice
      state.minPrice = state.minPrice.replace(/[^\d|/.]/g, '')
      console.log(state.minPrice)
    },
    // 设置价格最大值
    ['SET_MAXPRICE'](state, payload) {
      state.maxPrice = payload.maxPrice
      state.maxPrice = state.maxPrice.replace(/[^\d|/.]/g, '')
    },
    // 显示隐藏属性
    ['HIDE_ATTR'](state, payload) {
      state.attrs[payload.index].isShow = !state.attrs[payload.index].isShow
      Vue.set(state.attrs, payload.index, state.attrs[payload.index])
    },
    // 属性选择
    ['SELECT_ATTR'](state, payload) {
      if (state.attrs.length > 0) {
        state.attrs[payload.index].param[payload.index2].active = !state.attrs[
          payload.index
        ].param[payload.index2].active
        Vue.set(
          state.attrs[payload.index].param,
          payload.index2,
          state.attrs[payload.index].param[payload.index2]
        )
      }
    },
    // 设置搜索结果列表
    ['SET_SEARCH_DATA'](state, payload) {
      state.searchData = payload.searchData
      state.total = payload.total
    },
    // 增加分页数据
    ['SET_SEARCH_DATA_PAGE'](state, payload) {
      if (payload.searchData.length > 0) {
        for (let i = 0; i < payload.searchData.length; i++) {
          state.searchData.push(payload.searchData[i])
        }
      }
    },
    // 设置分类筛选 cid
    ['SET_CID'](state, payload) {
      state.cid = payload.cid
    },
    ['SET_ATTRS'] (state, payload) {
      state.attrs = payload.attrs
    },
    setParam (state) {
      if (state.attrs.length > 0) {
        state.param = []
        for (let i = 0; i < state.attrs.length; i++) {
          for (let j = 0; j < state.attrs[i].param.length; j++) {
            if (state.attrs[i].param[j].active) {
              state.param.push(state.attrs[i].param[j].pid)
            }
          }
        }

      }
    },
    resetScreen (state) {
      state.cid = ''
      // 重置价格
      state.minPrice = ''
      state.maxPrice = ''
      if (state.priceData.items.length > 0) {
        for (let i = 0; i < state.priceData.items.length; i++) {
          if (state.priceData.items[i].active) {
            state.priceData.items[i].active = false
            break
          }
        }
      }
      // 重置属性
      if (state.attrs.length > 0) {

        for (let i = 0; i < state.attrs.length; i++) {
          for (let j = 0; j < state.attrs[i].param.length; j++) {
            if (state.attrs[i].param[j].active) {
              state.attrs[i].param[j].active = false
            }
          }
          state.param = []
        }
      }
    }
  },
  actions: {
    getHotKeyword(conText) {
      getHotKeywordData().then((res) => {
        if (res.code === 200) {
          conText.commit('SET_HOTKEYWORD', { hotKeywords: res.data })
        }
      })
    },
    selectClassify(conText, payload) {
      if (conText.rootState.goods.classify.length > 0) {
        for (let i = 0; i < conText.rootState.goods.classify.length; i++) {
          if (i !== payload.index) {
            if (conText.rootState.goods.classify[i].active) {
              conText.rootState.goods.classify[i].active = false
              break
            }
          }
        }
        conText.rootState.goods.classify[payload.index].active = !conText
          .rootState.goods.classify[payload.index].active
      }
      Vue.set(
        conText.rootState.goods.classify,
        payload.index,
        conText.rootState.goods.classify[payload.index]
      )
      let cid = conText.rootState.goods.classify[payload.index].active
        ? conText.rootState.goods.classify[payload.index].cid
        : ''
      conText.commit('SET_CID', {
        cid: cid,
      })
    },
    getSearch(conText, payload) {
      getSearchData(payload).then((res) => {
        let pageNum = 0
        if (res.code === 200) {
          pageNum = res.pageinfo.pagenum
          conText.commit('SET_SEARCH_DATA', {
            searchData: res.data,
            total: res.pageinfo.total,
          })
          // console.log(res.pageinfo.total)

        } else {
          pageNum = 0
          conText.commit('SET_SEARCH_DATA', { searchData: [], total:0 })
        }
        if (payload && payload.success) {
          payload.success(pageNum)
        }
      })
    },
    getSearchPage(conText, payload) {
      getSearchData(payload).then((res) => {
        if (res.code === 200) {
          conText.commit('SET_SEARCH_DATA_PAGE', { searchData: res.data })
        }
      })
    },
    // 获取商品属性
    getAttrs (conText, payload) {
      getAttrData(payload.keyword).then(res => {

        if (res.code === 200) {
          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].isShow = true
              for (let j = 0; j < res.data[i].param.length; j++) {
                res.data[i].param[j].active = false
              }
            }
            conText.commit('SET_ATTRS', { attrs: res.data })
          }
        } else {
          conText.commit('SET_ATTRS', { attrs: [] })
        }
        if (payload && payload.success) {
          payload.success()
        }
      })
    },
    // 筛选重置按钮
    getReset (conText) {
      // 重置分类
      let classify = conText.rootState.goods.classify
      if (classify.length > 0) {
        for (let i = 0; i < classify.length; i++) {
          if (classify[i].active) {
            classify[i].active = false
            break
          }
        }
      }
      conText.commit('resetScreen')
    }
  },
}
