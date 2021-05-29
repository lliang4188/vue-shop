import {
  loginData,
  safeUserData,
  safeOutLoginData,
  checkVCodeData,
  isRegData,
  regUserData,
  getUserInfoData
} from '../../../api/user'
let modules = {
  namespaced: true,
  state: {
    uid: localStorage['uid'] ? localStorage['uid'] : '',
    nickname: localStorage['nickname'] ? localStorage['nickname'] : '',
    isLogin: localStorage['isLogin'] ? Boolean(localStorage['isLogin']) : false,
    authToken: localStorage['authToken'] ? localStorage['authToken'] : '',
    head: '',
    points: 0
  },
  getters: {
    //有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
    getUsers(state) {
      // console.log(state);
      let aUser = state.users.filter((item) => {
        return item.age >= 18
      })
      // console.log(aUser);
      return aUser
    },
  },
  mutations: {
    ['SET_LOGIN'](state, payload) {
      state.uid = payload.uid
      state.nickname = payload.nickname
      state.isLogin = payload.isLogin
      state.authToken = payload.authToken
      localStorage['uid'] = payload.uid
      localStorage['nickname'] = payload.nickname
      localStorage['isLogin'] = payload.isLogin
      localStorage['authToken'] = payload.authToken
    },
    ['OUT_LOGIN'](state) {
      state.uid = ''
      state.nickname = ''
      state.isLogin = false
      state.authToken = ''
      state.points = 0
      state.head = ''
      localStorage.removeItem('uid')
      localStorage.removeItem('nickname')
      localStorage.removeItem('isLogin')
      localStorage.removeItem('authToken')
      localStorage.removeItem('cartData')
    },
    ['SET_USER_INFO'] (state, payload) {
      state.head = payload.head
      state.points = payload.points
      state.nickname = payload.nickname
    }
  },
  actions: {
    //会员登录
    login(conText, payload) {
      loginData(payload).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          conText.commit('SET_LOGIN', {
            uid: res.data.uid,
            nickname: res.data.nickname,
            isLogin: true,
            authToken: res.data.auth_token,
          })
        }
        if (payload.success) {
          payload.success(res)
        }
      })
    },
    //安全退出
    outLogin(conText) {
      safeOutLoginData({ uid: conText.state.uid }).then((res) => {
        console.log(res)
      })
      conText.rootState.cart.cartData = []
      conText.commit('OUT_LOGIN')
    },
    //会员安全认证
    safeUser(conText, payload) {
      // console.log(conText.state.uid);
      safeUserData({
        uid: conText.state.uid,
        auth_token: conText.state.authToken,
      }).then((res) => {
        if (res.code !== 200) {
          conText.commit('OUT_LOGIN')
        }
        // console.log(res);
        if (payload.success) {
          payload.success(res)
        }
      })
    },
    // 检测图片验证码
    checkVCode(conText, payload) {
      return checkVCodeData(payload.vcode).then((res) => {
        return res
      })
    },
    // 检测是否注册会员
    isReg(conText, payload) {
      return isRegData(payload.username).then((res) => {
        return res
      })
    },
    // 注册会员
    regUser(conText, payload) {
      regUserData(payload).then((res) => {
        if (payload && payload.success) {
          payload.success(res)
        }
      })
    },
    // 获取用户信息
    getUserInfo (conText) {
      getUserInfoData(conText.state.uid).then(res => {
        console.log(res)
        if (res.code === 200) {
          conText.commit('SET_USER_INFO', {
            head: res.data.head,
            points: res.data.points,
            nickname: res.data.nickname
          })
        }
      })
    }
  },
}
export default modules
