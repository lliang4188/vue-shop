import config from "../../assets/js/conf/config";
import {request} from "../../assets/js/utils/request";

// 获取分类菜单
export function getClassifyData() {
  return request(config.baseApi+ '/home/category/menu?token=' + config.token)
}

// 获取分类商品
export function getGoodsData(cid='') {
  return request(config.baseApi+ '/home/category/show?cid=' + cid + '&token=' +config.token)
 }