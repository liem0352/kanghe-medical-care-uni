/**
 * 紧急求助服务
 */

import { emergencyAPI } from '@/utils/api.js'
import { getCurrentLocation, getAddressInfo } from '@/utils/locator.js'
import { showToast, showLoading, hideLoading } from '@/utils/util.js'

// 紧急求助管理
export class EmergencyService {
    constructor() {
        this.contacts = []
        this.lastSOS = null
        this.isEmergencyMode = false
    }
    
    // 获取紧急联系人
    async getEmergencyContacts() {
        try {
            const data = await emergencyAPI.getEmergencyContacts()
            this.contacts = data.list || []
            return data
        } catch (error) {
            showToast('获取紧急联系人失败')
            throw error
        }
    }
    
    // 添加紧急联系人
    async addEmergencyContact(contact) {
        try {
            showLoading('添加中...')
            const result = await emergencyAPI.addEmergencyContact(contact)
            showToast('添加成功')
            await this.getEmergencyContacts() // 刷新列表
            return result
        } catch (error) {
            showToast('添加失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 发送紧急求助
    async sendSOS(additionalInfo = {}) {
        try {
            showLoading('发送紧急求助中...')
            
            // 获取当前位置
            const location = await getCurrentLocation()
            const address = await getAddressInfo(location.latitude, location.longitude)
            
            // 构建求助数据
            const sosData = {
                timestamp: new Date().toISOString(),
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: address.address,
                    accuracy: location.accuracy
                },
                userInfo: {
                    name: uni.getStorageSync('userName') || '未知用户',
                    phone: uni.getStorageSync('userPhone') || '',
                    age: uni.getStorageSync('userAge') || '',
                    medicalHistory: uni.getStorageSync('medicalHistory') || ''
                },
                ...additionalInfo
            }
            
            // 发送求助请求
            const result = await emergencyAPI.sendSOS(sosData)
            this.lastSOS = sosData
            this.isEmergencyMode = true
            
            showToast('紧急求助已发送')
            
            // 自动拨打紧急电话
            this.callEmergencyNumber()
            
            return result
        } catch (error) {
            showToast('发送失败，请检查网络连接')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 拨打紧急电话
    callEmergencyNumber() {
        // 获取用户设置的紧急联系人
        const primaryContact = this.contacts.find(contact => contact.isPrimary)
        
        if (primaryContact && primaryContact.phone) {
            uni.makePhoneCall({
                phoneNumber: primaryContact.phone,
                success: () => {
                    console.log('紧急电话拨打成功')
                },
                fail: (err) => {
                    console.error('紧急电话拨打失败:', err)
                    // 如果主要联系人无法接通，尝试拨打120
                    this.call120()
                }
            })
        } else {
            // 没有设置紧急联系人，直接拨打120
            this.call120()
        }
    }
    
    // 拨打120急救电话
    call120() {
        uni.makePhoneCall({
            phoneNumber: '120',
            success: () => {
                console.log('120急救电话拨打成功')
            },
            fail: (err) => {
                console.error('120急救电话拨打失败:', err)
            }
        })
    }
    
    // 取消紧急模式
    cancelEmergencyMode() {
        this.isEmergencyMode = false
        showToast('已取消紧急模式')
    }
    
    // 检查是否在紧急模式
    isInEmergencyMode() {
        return this.isEmergencyMode
    }
    
    // 获取最近的求助记录
    getLastSOS() {
        return this.lastSOS
    }
    
    // 发送位置信息给紧急联系人
    async sendLocationToContacts() {
        try {
            const location = await getCurrentLocation()
            const address = await getAddressInfo(location.latitude, location.longitude)
            
            // 这里可以集成短信或推送服务
            const message = `紧急求助：${uni.getStorageSync('userName')}需要帮助，当前位置：${address.address}`
            
            // 发送给所有紧急联系人
            for (const contact of this.contacts) {
                if (contact.phone) {
                    // 这里需要集成短信API
                    console.log(`发送短信到 ${contact.phone}: ${message}`)
                }
            }
            
            showToast('位置信息已发送给紧急联系人')
        } catch (error) {
            showToast('发送位置信息失败')
            throw error
        }
    }
    
    // 检查紧急联系人是否有效
    validateEmergencyContacts() {
        const validContacts = this.contacts.filter(contact => {
            return contact.phone && contact.name && contact.relationship
        })
        
        if (validContacts.length === 0) {
            showToast('请先添加紧急联系人')
            return false
        }
        
        return true
    }
    
    // 设置主要紧急联系人
    async setPrimaryContact(contactId) {
        try {
            // 更新所有联系人的主要状态
            this.contacts.forEach(contact => {
                contact.isPrimary = contact.id === contactId
            })
            
            // 这里需要调用API更新
            showToast('主要联系人设置成功')
        } catch (error) {
            showToast('设置失败')
            throw error
        }
    }
    
    // 获取紧急联系人数
    getContactCount() {
        return this.contacts.length
    }
    
    // 检查是否有主要联系人
    hasPrimaryContact() {
        return this.contacts.some(contact => contact.isPrimary)
    }
}

// 健康监测预警
export class HealthAlertService {
    constructor() {
        this.alertThresholds = {
            heartRate: { min: 60, max: 100 },
            bloodPressure: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } },
            bloodOxygen: { min: 95 },
            temperature: { min: 36, max: 37.5 }
        }
        this.isMonitoring = false
    }
    
    // 开始健康监测
    startHealthMonitoring() {
        this.isMonitoring = true
        console.log('健康监测已启动')
    }
    
    // 停止健康监测
    stopHealthMonitoring() {
        this.isMonitoring = false
        console.log('健康监测已停止')
    }
    
    // 检查健康数据是否异常
    checkHealthData(healthData) {
        if (!this.isMonitoring) return null
        
        const alerts = []
        
        // 检查心率
        if (healthData.heartRate) {
            const hr = parseInt(healthData.heartRate)
            if (hr < this.alertThresholds.heartRate.min || hr > this.alertThresholds.heartRate.max) {
                alerts.push({
                    type: 'heartRate',
                    level: 'warning',
                    message: `心率异常：${hr}次/分钟`,
                    value: hr
                })
            }
        }
        
        // 检查血压
        if (healthData.bloodPressure) {
            const [systolic, diastolic] = healthData.bloodPressure.split('/').map(Number)
            
            if (systolic < this.alertThresholds.bloodPressure.systolic.min || 
                systolic > this.alertThresholds.bloodPressure.systolic.max) {
                alerts.push({
                    type: 'bloodPressure',
                    level: 'warning',
                    message: `收缩压异常：${systolic}mmHg`,
                    value: systolic
                })
            }
            
            if (diastolic < this.alertThresholds.bloodPressure.diastolic.min || 
                diastolic > this.alertThresholds.bloodPressure.diastolic.max) {
                alerts.push({
                    type: 'bloodPressure',
                    level: 'warning',
                    message: `舒张压异常：${diastolic}mmHg`,
                    value: diastolic
                })
            }
        }
        
        // 检查血氧
        if (healthData.bloodOxygen) {
            const bo = parseInt(healthData.bloodOxygen)
            if (bo < this.alertThresholds.bloodOxygen.min) {
                alerts.push({
                    type: 'bloodOxygen',
                    level: 'critical',
                    message: `血氧饱和度过低：${bo}%`,
                    value: bo
                })
            }
        }
        
        // 检查体温
        if (healthData.temperature) {
            const temp = parseFloat(healthData.temperature)
            if (temp < this.alertThresholds.temperature.min || temp > this.alertThresholds.temperature.max) {
                alerts.push({
                    type: 'temperature',
                    level: 'warning',
                    message: `体温异常：${temp}°C`,
                    value: temp
                })
            }
        }
        
        return alerts
    }
    
    // 处理健康预警
    async handleHealthAlert(alerts) {
        for (const alert of alerts) {
            if (alert.level === 'critical') {
                // 严重异常，自动发送紧急求助
                await this.autoSendSOS(alert)
            } else {
                // 一般异常，显示提醒
                this.showHealthAlert(alert)
            }
        }
    }
    
    // 自动发送紧急求助
    async autoSendSOS(alert) {
        try {
            const emergencyService = new EmergencyService()
            await emergencyService.sendSOS({
                reason: '健康数据异常',
                alertType: alert.type,
                alertValue: alert.value,
                alertMessage: alert.message
            })
        } catch (error) {
            console.error('自动发送紧急求助失败:', error)
        }
    }
    
    // 显示健康预警
    showHealthAlert(alert) {
        uni.showModal({
            title: '健康预警',
            content: alert.message,
            confirmText: '我知道了',
            cancelText: '发送求助',
            success: (res) => {
                if (res.cancel) {
                    // 用户选择发送求助
                    this.autoSendSOS(alert)
                }
            }
        })
    }
    
    // 设置预警阈值
    setAlertThresholds(thresholds) {
        this.alertThresholds = { ...this.alertThresholds, ...thresholds }
    }
    
    // 获取当前预警阈值
    getAlertThresholds() {
        return this.alertThresholds
    }
}

// 导出实例
export const emergencyService = new EmergencyService()
export const healthAlertService = new HealthAlertService()

export default {
    EmergencyService,
    HealthAlertService,
    emergencyService,
    healthAlertService
}
