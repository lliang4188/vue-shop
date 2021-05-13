import { getReviewsData } from '../../../api/goods/review'

export default {
  namespaced: true,
  state: {
    reviews: [],
    total: 0,
  },
  mutations: {
    // 设置评价数据
    ['SET_REVIEWS'](state, payload) {
      (state.reviews = payload.reviews), (state.total = payload.total)
    },
    // 设置评价分页
    ['SET_REVIEWS_PAGE'] (state, payload) {
      state.reviews.push(...payload.reviews)
    }
  },
  actions: {
    getReview(conText, payload) {
      getReviewsData(payload.gid).then((res) => {
        let pageNum = 0
        if (res.code === 200) {
          conText.commit('SET_REVIEWS', {
            reviews: res.data,
            total: res.pageinfo.total,
          })
          pageNum = res.pageinfo.pagenum

        } else {
          conText.commit('SET_REVIEWS', {
            reviews: [],
            total: 0,
          })
          pageNum = 0
        }
         if (payload && payload.success) {
           payload.success(pageNum)
         }
      })
    },
    getReviewPage (conText, payload) {
      getReviewsData(payload.gid, payload.page).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          conText.commit('SET_REVIEWS_PAGE', {
            reviews: res.data
          })

        }
      })
    }
  },
}
