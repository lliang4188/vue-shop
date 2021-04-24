import Vue from 'vue'
import Vuex from 'vuex';
import user from "./modules/user"
import index from "./modules/index"
import goods from "./modules/goods"
import search from "./modules/search"
Vue.use(Vuex);

let store=new Vuex.Store({
    modules:{
        index,
        user,
        goods,
        search
    }
});

export default store;