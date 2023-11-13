import {post,get,put,del} from "./request";

// 账号密码登录
export const getToken = (data) => {
    return get('/official/people/getWechatInfo',data)
}
// 绑定手机号
export const bindPhone = (data) => {
    return post('/official/people/bindMobile',data)
}
// 上传
export const upLoadFiles = (data) => {
    return post('/app/user/uploadImage',data)
}
// 获取菜单列表
export const listPeopleMenu = (data) => {
    return get('/official/roleMenu/listPeopleMenu',data)
}

/**
 * 游艇会信息管理
*/
// 获取菜单列表
export const getDataBoard = (data) => {
    return get('/official/dataBoard/getDataBoard',data)
}

/**
 * 游艇会信息管理
*/
// 获取游艇会信息
export const getClubInfo = (data) => {
    return get(`/official/people/getClubInfo`,data)
}
// 修改游艇会信息
export const editClubMessage = (data) => {
    return put(`/official/people/editClubMessage`,data)
}
// 游艇会保险列表
export const listInsure = (data) => {
    return get(`/official/yacht/listInsure`,data)
}

/**
 * 游艇管理
*/
// 获取游艇列表
export const yachtList = (data) => {
    return get(`/official/yacht/list`,data,true)
}
// 添加游艇
export const addYacht = (data) => {
    return post(`/official/yacht`,data)
}
// 获取游艇详情
export const yachtDetail = (yachtId) => {
    return get(`/official/yacht/yachtDetail/${yachtId}`)
}
// 修改游艇信息
export const updateYacht = (data) => {
    return put(`/official/yacht/update`,data)
}
// 删除游艇
export const delYacht = (id) => {
    return del(`/official/yacht/${id}`)
}
// 获取游艇类型列表
export const listType = (data) => {
    return get(`/official/yacht/listType`,data)
}
// 获取客服列表
export const customerService = (clubId) => {
    return get(`/official/people/listCustomer/${clubId}`)
}
// 获取保养列表
export const upkeepList = (data) => {
    return get(`/official/yacht/maintain/list`,data,true)
}
// 添加/修改保养信息
export const postOrPutMaintain = (data,type) => {
    if (type == 'add') {
        return post(`/official/yacht/maintain`,data) // 添加
    }else{
        return put(`/official/yacht/maintain`,data) // 修改
    }
}
// 删除保养信息
export const delMaintain = (id) => {
    return del(`/official/yacht/maintain/${id}`)
}



/**
 * 船主管理
*/
// 获取船主列表
export const shipownerList = (clubId) => {
    return get(`/official/people/listOwner/${clubId}`,null,true)
}

/**
 * 船长管理
*/

// 获取船长列表
export const captainList = (clubId) => {
    return get(`/official/people/listCaptain/${clubId}`,null,true)
}
// 添加/修改船长
export const editCaptains = (data,type) => {
    if (type == 'add') {
        return post(`/official/people/addCaptain`,data)
    }else{
        return put(`/official/people/updateCaptain`,data)
    }
}


/**
 * 订单管理
*/
// 订单列表
export const orderList = (data) => {
    return get(`/official/order/list`,data,true)
}
// 订单详情
export const orderDetail = (orderId) => {
    return get(`/official/order/detail/${orderId}`)
}
// 设置订单船长或客服
export const updateCaptain = (data) => {
    return put(`/official/order/updateCaptain`,data)
}
// 查询可选的船长和客服
export const listFreePeople = (data) => {
    return get(`/official/people/listFreePeople`,data)
}
// 修改订单信息
export const updateOrder = (data) => {
    return put(`/official/order/updateOrder`,data)
}


/**
 * 角色管理
*/
// 获取角色列表
export const listAllRole = (data) => {
    return get(`/official/roleMenu/listAllRole`,data,true)
}
// 获取菜单列表
export const listSettingRole = (roleId) => {
    return get(`/official/roleMenu/listSettingRole/${roleId}`)
}
// 设置角色权限
export const setRoleMenu = (data) => {
    return post(`/official/roleMenu/setRoleMenu`,data,true)
}

/**
 * 财务管理
*/
// 获取用户账单
export const checkList = (data) => {
    return get(`/official/commission`,data,true)
}
// 申请提现
export const cashOut = (data) => {
    return post(`/official/commission/cashOut`,data)
}
// 提现记录
export const pageCashOut = (data) => {
    return get(`/official/commission/pageCashOut`,data)
}

/**
 * 个人信息
*/
// 获取个人信息
export const getUserDetail = (peopleId) => {
    return get(`/official/people/selectById/${peopleId}`)
}
// 银行卡列表
export const listBankCar = (data) => {
    return get(`/official/yacht/people/bankCard/listBankCar`,data)
}
// 添加/修改银行卡
export const bankCard = (data,type) => {
    if (type == 'add') {
        return post(`/official/yacht/people/bankCard`,data)
    }else{
        return put(`/official/yacht/people/bankCard`,data)
    }
}






