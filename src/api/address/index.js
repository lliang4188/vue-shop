import config from '../../assets/js/conf/config'
import { request } from '../../assets/js/utils/request'

// 收货地址列表
export function getAddressData (uid) {
  return request(
    config.baseApi + '/user/address/index?uid=' + uid + '&token=' + config.token
  )
}

// 删除收货地址
export function delAddressData (params) {
  return request(
    config.baseApi +
      '/user/address/del?uid='+ params.uid + '&aid=' + params.aid + '&token=' +
      config.token
  )
}

// 添加收货地址
export function addAddressData (data) {
  return request(
    config.baseApi + '/user/address/add?token=' + config.token,
    'post',
    data
  )
}

// 获取收货地址信息
export function getAddressInfoData (params) {
  return request(
    config.baseApi +
      '/user/address/info?uid=' + params.uid + '&aid=' + params.aid + '&token=' +
      config.token
  )
}

// 修改收货地址
export function modAddressData(data) {
  return request(
    config.baseApi + '/user/address/mod?token=' + config.token,
    'post',
    data
  )
}

// 获取默认收货地址
export function getDefaultAddressData (uid) {
  return request(
    config.baseApi + '/user/address/defaultAddress?uid=' + uid + '&token=' + config.token
  )
}
