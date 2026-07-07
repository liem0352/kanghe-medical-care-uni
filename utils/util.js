/**
 * 通用工具函数
 */

// 格式化时间
export function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 格式化数字
export function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 防抖函数
export function debounce(func, wait, immediate) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            timeout = null
            if (!immediate) func(...args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func(...args)
    }
}

// 节流函数
export function throttle(func, limit) {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

// 深拷贝
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => deepClone(item))
    if (typeof obj === 'object') {
        const clonedObj = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key])
            }
        }
        return clonedObj
    }
}

// 生成唯一ID
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

// 获取当前时间戳
export function getCurrentTimestamp() {
    return Date.now()
}

// 计算两个日期之间的天数差
export function getDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000
    const diffTime = Math.abs(date2 - date1)
    return Math.ceil(diffTime / oneDay)
}

// 格式化文件大小
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 验证手机号
export function validatePhone(phone) {
    const reg = /^1[3-9]\d{9}$/
    return reg.test(phone)
}

// 验证邮箱
export function validateEmail(email) {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return reg.test(email)
}

// 验证身份证号
export function validateIdCard(idCard) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(idCard)
}

// 获取随机颜色
export function getRandomColor() {
    const colors = ['#19be6b', '#007aff', '#f0ad4e', '#dd524d', '#8f8f94', '#5856d6']
    return colors[Math.floor(Math.random() * colors.length)]
}

// 显示提示信息
export function showToast(title, icon = 'none', duration = 2000) {
    uni.showToast({
        title,
        icon,
        duration
    })
}

// 显示加载提示
export function showLoading(title = '加载中...') {
    uni.showLoading({
        title
    })
}

// 隐藏加载提示
export function hideLoading() {
    uni.hideLoading()
}

// 显示确认对话框
export function showModal(title, content, showCancel = true) {
    return new Promise((resolve) => {
        uni.showModal({
            title,
            content,
            showCancel,
            success: (res) => {
                resolve(res.confirm)
            }
        })
    })
}

// 获取系统信息
export function getSystemInfo() {
    return new Promise((resolve) => {
        uni.getSystemInfo({
            success: (res) => {
                resolve(res)
            }
        })
    })
}

// 获取网络状态
export function getNetworkType() {
    return new Promise((resolve) => {
        uni.getNetworkType({
            success: (res) => {
                resolve(res.networkType)
            }
        })
    })
}
