import config from '../../assets/js/conf/config'
import { request } from '../../assets/js/utils/request'

// 获取热门搜索数据
export function getHotKeywordData() {
  return request(config.baseApi + '/home/public/hotwords?token=' + config.token)
}

// 获取搜索列表
export function getSearchData(data) {
  let keyword = data.keyword ? data.keyword : ''
  let page = data.page ? data.page : 1
  let otype = data.otype ? data.otype : 'all'
  let cid = data.cid ? data.cid : ''
  let price1 = data.price1 ? data.price1 : ''
  let price2 = data.price2 ? data.price2 : ''
  let param = data.param && data.param !== '[]' ? data.param : ''
  let url =
    config.baseApi +
    'home/goods/search?kwords=' +
    keyword +
    '&param=' +
    param +
    '&page=' +
    page +
    '&price1=' +
    price1 +
    '&price2=' +
    price2 +
    '&otype=' +
    otype +
    '&cid=' +
    cid + '&token=' +
    config.token
  console.log(url)
  return request(url)
}

// 获取商品属性值
export function getAttrData(keyword) {
  return request(
    config.baseApi +
      '/home/goods/param?kwords=' +
      keyword +
      '&token=' +
      config.token
  )
}
