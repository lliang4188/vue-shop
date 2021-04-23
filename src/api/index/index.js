import config from "../../assets/js/conf/config";
import {request} from "../../assets/js/utils/request";

// 首页导航
export function getNavsData() {
    return request(config.baseApi+"/home/index/nav?token="+config.token);
}

// 首页轮播图
export function getBannerData() {
    return request(config.baseApi+ '/home/index/slide?token=' + config.token);
}

// 首页产品区
export function getGoodsData() {
    return request(config.baseApi+ '/home/index/goodsLevel?token=' + config.token);
}

// 首页推荐区
export function getRmData() {
    return request(config.baseApi + '/home/index/recom?token='+ config.token);

}