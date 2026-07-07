/**
 * API接口管理
 */

import { showToast, showLoading, hideLoading } from './util.js'

// 基础配置
const BASE_URL = 'https://api.kanghe.com' // 替换为实际的API地址
const TIMEOUT = 10000

// 请求拦截器
const requestInterceptor = (config) => {
    // 添加token
    const token = uni.getStorageSync('token')
    if (token) {
        config.header = {
            ...config.header,
            'Authorization': `Bearer ${token}`
        }
    }
    
    // 添加基础header
    config.header = {
        'Content-Type': 'application/json',
        ...config.header
    }
    
    return config
}

// 响应拦截器
const responseInterceptor = (response) => {
    const { statusCode, data } = response
    
    if (statusCode === 200) {
        if (data.code === 0 || data.code === 200) {
            return data.data || data
        } else {
            showToast(data.message || '请求失败')
            return Promise.reject(data)
        }
    } else if (statusCode === 401) {
        // token过期，跳转登录
        uni.removeStorageSync('token')
        uni.reLaunch({
            url: '/pages/login/login'
        })
        return Promise.reject(response)
    } else {
        showToast('网络错误')
        return Promise.reject(response)
    }
}

// 通用请求方法
const request = (options) => {
    return new Promise((resolve, reject) => {
        const config = requestInterceptor(options)
        
        uni.request({
            url: BASE_URL + config.url,
            method: config.method || 'GET',
            data: config.data || {},
            header: config.header || {},
            timeout: TIMEOUT,
            success: (res) => {
                try {
                    const result = responseInterceptor(res)
                    resolve(result)
                } catch (error) {
                    reject(error)
                }
            },
            fail: (err) => {
                showToast('网络连接失败')
                reject(err)
            }
        })
    })
}

// 用户相关API
export const userAPI = {
    // 登录
    login: (data) => request({
        url: '/user/login',
        method: 'POST',
        data
    }),
    
    // 注册
    register: (data) => request({
        url: '/user/register',
        method: 'POST',
        data
    }),
    
    // 获取用户信息
    getUserInfo: () => request({
        url: '/user/info',
        method: 'GET'
    }),
    
    // 更新用户信息
    updateUserInfo: (data) => request({
        url: '/user/update',
        method: 'PUT',
        data
    }),
    
    // 修改密码
    changePassword: (data) => request({
        url: '/user/password',
        method: 'PUT',
        data
    })
}

// 健康数据API
export const healthAPI = {
    // 获取健康概览
    getHealthOverview: () => request({
        url: '/health/overview',
        method: 'GET'
    }),
    
    // 获取健康数据
    getHealthData: (params) => request({
        url: '/health/data',
        method: 'GET',
        data: params
    }),
    
    // 上传健康数据
    uploadHealthData: (data) => request({
        url: '/health/upload',
        method: 'POST',
        data
    }),
    
    // 获取健康报告
    getHealthReport: (params) => request({
        url: '/health/report',
        method: 'GET',
        data: params
    })
}

// 服务相关API
export const serviceAPI = {
    // 获取服务列表
    getServiceList: (params) => request({
        url: '/service/list',
        method: 'GET',
        data: params
    }),
    
    // 预约服务
    bookService: (data) => request({
        url: '/service/book',
        method: 'POST',
        data
    }),
    
    // 获取服务记录
    getServiceHistory: (params) => request({
        url: '/service/history',
        method: 'GET',
        data: params
    }),
    
    // 取消预约
    cancelService: (id) => request({
        url: `/service/cancel/${id}`,
        method: 'PUT'
    })
}

// 用药管理API
export const medicationAPI = {
    // 获取用药记录
    getMedicationList: (params) => request({
        url: '/medication/list',
        method: 'GET',
        data: params
    }),
    
    // 添加用药记录
    addMedication: (data) => request({
        url: '/medication/add',
        method: 'POST',
        data
    }),
    
    // 更新用药记录
    updateMedication: (data) => request({
        url: '/medication/update',
        method: 'PUT',
        data
    }),
    
    // 删除用药记录
    deleteMedication: (id) => request({
        url: `/medication/delete/${id}`,
        method: 'DELETE'
    }),
    
    // 获取用药提醒
    getMedicationReminders: () => request({
        url: '/medication/reminders',
        method: 'GET'
    }),
    
    // 设置用药提醒
    setMedicationReminder: (data) => request({
        url: '/medication/reminder',
        method: 'POST',
        data
    })
}

// 家庭账户API
export const familyAPI = {
    // 获取家庭成员
    getFamilyMembers: () => request({
        url: '/family/members',
        method: 'GET'
    }),
    
    // 添加家庭成员
    addFamilyMember: (data) => request({
        url: '/family/add',
        method: 'POST',
        data
    }),
    
    // 更新家庭成员信息
    updateFamilyMember: (data) => request({
        url: '/family/update',
        method: 'PUT',
        data
    }),
    
    // 删除家庭成员
    deleteFamilyMember: (id) => request({
        url: `/family/delete/${id}`,
        method: 'DELETE'
    }),
    
    // 获取家庭健康动态
    getFamilyHealthStatus: () => request({
        url: '/family/health-status',
        method: 'GET'
    })
}

// 咨询相关API
export const consultationAPI = {
    // 获取医生列表
    getDoctorList: (params) => request({
        url: '/consultation/doctors',
        method: 'GET',
        data: params
    }),
    
    // 发起咨询
    startConsultation: (data) => request({
        url: '/consultation/start',
        method: 'POST',
        data
    }),
    
    // 获取咨询记录
    getConsultationHistory: (params) => request({
        url: '/consultation/history',
        method: 'GET',
        data: params
    }),
    
    // 发送消息
    sendMessage: (data) => request({
        url: '/consultation/message',
        method: 'POST',
        data
    })
}

// 紧急求助API
export const emergencyAPI = {
    // 发送紧急求助
    sendSOS: (data) => request({
        url: '/emergency/sos',
        method: 'POST',
        data
    }),
    
    // 获取紧急联系人
    getEmergencyContacts: () => request({
        url: '/emergency/contacts',
        method: 'GET'
    }),
    
    // 添加紧急联系人
    addEmergencyContact: (data) => request({
        url: '/emergency/contact',
        method: 'POST',
        data
    })
}

// 提醒相关API
export const reminderAPI = {
    // 获取提醒列表
    getReminderList: (params) => request({
        url: '/reminder/list',
        method: 'GET',
        data: params
    }),
    
    // 添加提醒
    addReminder: (data) => request({
        url: '/reminder/add',
        method: 'POST',
        data
    }),
    
    // 更新提醒
    updateReminder: (data) => request({
        url: '/reminder/update',
        method: 'PUT',
        data
    }),
    
    // 删除提醒
    deleteReminder: (id) => request({
        url: `/reminder/delete/${id}`,
        method: 'DELETE'
    }),
    
    // 标记提醒完成
    completeReminder: (id) => request({
        url: `/reminder/complete/${id}`,
        method: 'PUT'
    })
}

// 文件上传API
export const uploadAPI = {
    // 上传图片
    uploadImage: (filePath) => {
        return new Promise((resolve, reject) => {
            uni.uploadFile({
                url: BASE_URL + '/upload/image',
                filePath,
                name: 'file',
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                },
                success: (res) => {
                    try {
                        const data = JSON.parse(res.data)
                        if (data.code === 0) {
                            resolve(data.data)
                        } else {
                            showToast(data.message || '上传失败')
                            reject(data)
                        }
                    } catch (error) {
                        showToast('上传失败')
                        reject(error)
                    }
                },
                fail: (err) => {
                    showToast('上传失败')
                    reject(err)
                }
            })
        })
    }
}

export default {
    userAPI,
    healthAPI,
    serviceAPI,
    medicationAPI,
    familyAPI,
    consultationAPI,
    emergencyAPI,
    reminderAPI,
    uploadAPI
}
