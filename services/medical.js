/**
 * 医疗服务相关业务逻辑
 */

import { healthAPI, medicationAPI, consultationAPI } from '@/utils/api.js'
import { showToast, showLoading, hideLoading } from '@/utils/util.js'

// 健康数据管理
export class HealthDataManager {
    constructor() {
        this.healthData = null
        this.lastUpdate = null
    }
    
    // 获取健康概览
    async getHealthOverview() {
        try {
            showLoading('加载健康数据...')
            const data = await healthAPI.getHealthOverview()
            this.healthData = data
            this.lastUpdate = new Date()
            return data
        } catch (error) {
            showToast('获取健康数据失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 上传健康数据
    async uploadHealthData(data) {
        try {
            showLoading('上传中...')
            const result = await healthAPI.uploadHealthData(data)
            showToast('上传成功')
            return result
        } catch (error) {
            showToast('上传失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 获取健康报告
    async getHealthReport(params = {}) {
        try {
            showLoading('生成报告中...')
            const report = await healthAPI.getHealthReport(params)
            return report
        } catch (error) {
            showToast('获取报告失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 分析健康趋势
    analyzeHealthTrend(data, type) {
        if (!data || data.length < 2) return null
        
        const values = data.map(item => item.value)
        const trend = {
            current: values[values.length - 1],
            average: values.reduce((sum, val) => sum + val, 0) / values.length,
            trend: 'stable',
            change: 0
        }
        
        if (values.length >= 2) {
            const change = values[values.length - 1] - values[values.length - 2]
            trend.change = change
            trend.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        }
        
        return trend
    }
}

// 用药管理
export class MedicationManager {
    constructor() {
        this.medications = []
        this.reminders = []
    }
    
    // 获取用药记录
    async getMedicationList(params = {}) {
        try {
            const data = await medicationAPI.getMedicationList(params)
            this.medications = data.list || []
            return data
        } catch (error) {
            showToast('获取用药记录失败')
            throw error
        }
    }
    
    // 添加用药记录
    async addMedication(medication) {
        try {
            showLoading('添加中...')
            const result = await medicationAPI.addMedication(medication)
            showToast('添加成功')
            await this.getMedicationList() // 刷新列表
            return result
        } catch (error) {
            showToast('添加失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 更新用药记录
    async updateMedication(medication) {
        try {
            showLoading('更新中...')
            const result = await medicationAPI.updateMedication(medication)
            showToast('更新成功')
            await this.getMedicationList() // 刷新列表
            return result
        } catch (error) {
            showToast('更新失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 删除用药记录
    async deleteMedication(id) {
        try {
            const confirmed = await uni.showModal({
                title: '确认删除',
                content: '确定要删除这条用药记录吗？'
            })
            
            if (confirmed.confirm) {
                showLoading('删除中...')
                await medicationAPI.deleteMedication(id)
                showToast('删除成功')
                await this.getMedicationList() // 刷新列表
            }
        } catch (error) {
            showToast('删除失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 获取用药提醒
    async getMedicationReminders() {
        try {
            const data = await medicationAPI.getMedicationReminders()
            this.reminders = data.list || []
            return data
        } catch (error) {
            showToast('获取用药提醒失败')
            throw error
        }
    }
    
    // 设置用药提醒
    async setMedicationReminder(reminder) {
        try {
            showLoading('设置中...')
            const result = await medicationAPI.setMedicationReminder(reminder)
            showToast('设置成功')
            await this.getMedicationReminders() // 刷新列表
            return result
        } catch (error) {
            showToast('设置失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 检查今日用药
    checkTodayMedications() {
        const today = new Date().toDateString()
        return this.medications.filter(med => {
            const medDate = new Date(med.date).toDateString()
            return medDate === today && !med.taken
        })
    }
    
    // 标记用药完成
    async markMedicationTaken(id) {
        try {
            const medication = this.medications.find(med => med.id === id)
            if (medication) {
                medication.taken = true
                medication.takenTime = new Date().toISOString()
                await this.updateMedication(medication)
            }
        } catch (error) {
            showToast('操作失败')
            throw error
        }
    }
}

// 在线咨询管理
export class ConsultationManager {
    constructor() {
        this.doctors = []
        this.consultations = []
        this.currentConsultation = null
    }
    
    // 获取医生列表
    async getDoctorList(params = {}) {
        try {
            const data = await consultationAPI.getDoctorList(params)
            this.doctors = data.list || []
            return data
        } catch (error) {
            showToast('获取医生列表失败')
            throw error
        }
    }
    
    // 发起咨询
    async startConsultation(consultationData) {
        try {
            showLoading('发起咨询中...')
            const result = await consultationAPI.startConsultation(consultationData)
            this.currentConsultation = result
            showToast('咨询已发起')
            return result
        } catch (error) {
            showToast('发起咨询失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 获取咨询记录
    async getConsultationHistory(params = {}) {
        try {
            const data = await consultationAPI.getConsultationHistory(params)
            this.consultations = data.list || []
            return data
        } catch (error) {
            showToast('获取咨询记录失败')
            throw error
        }
    }
    
    // 发送消息
    async sendMessage(messageData) {
        try {
            const result = await consultationAPI.sendMessage(messageData)
            return result
        } catch (error) {
            showToast('发送消息失败')
            throw error
        }
    }
    
    // 结束咨询
    async endConsultation(consultationId) {
        try {
            const confirmed = await uni.showModal({
                title: '确认结束',
                content: '确定要结束当前咨询吗？'
            })
            
            if (confirmed.confirm) {
                showLoading('结束咨询中...')
                // 这里需要调用结束咨询的API
                this.currentConsultation = null
                showToast('咨询已结束')
            }
        } catch (error) {
            showToast('操作失败')
            throw error
        } finally {
            hideLoading()
        }
    }
    
    // 评价医生
    async rateDoctor(doctorId, rating, comment) {
        try {
            showLoading('提交评价中...')
            // 这里需要调用评价API
            showToast('评价提交成功')
        } catch (error) {
            showToast('评价提交失败')
            throw error
        } finally {
            hideLoading()
        }
    }
}

// 健康评估
export class HealthAssessment {
    // BMI计算
    static calculateBMI(weight, height) {
        const heightInMeters = height / 100
        const bmi = weight / (heightInMeters * heightInMeters)
        return {
            value: bmi.toFixed(1),
            category: this.getBMICategory(bmi)
        }
    }
    
    // BMI分类
    static getBMICategory(bmi) {
        if (bmi < 18.5) return '偏瘦'
        if (bmi < 24) return '正常'
        if (bmi < 28) return '偏胖'
        return '肥胖'
    }
    
    // 血压评估
    static assessBloodPressure(systolic, diastolic) {
        let category = '正常'
        let risk = '低'
        
        if (systolic < 90 || diastolic < 60) {
            category = '偏低'
            risk = '中'
        } else if (systolic >= 140 || diastolic >= 90) {
            category = '偏高'
            risk = '高'
        } else if (systolic >= 120 || diastolic >= 80) {
            category = '正常偏高'
            risk = '中'
        }
        
        return { category, risk }
    }
    
    // 心率评估
    static assessHeartRate(heartRate) {
        let category = '正常'
        let risk = '低'
        
        if (heartRate < 60) {
            category = '偏慢'
            risk = '中'
        } else if (heartRate > 100) {
            category = '偏快'
            risk = '中'
        } else if (heartRate > 120) {
            category = '过快'
            risk = '高'
        }
        
        return { category, risk }
    }
    
    // 血氧评估
    static assessBloodOxygen(bloodOxygen) {
        let category = '正常'
        let risk = '低'
        
        if (bloodOxygen < 95) {
            category = '偏低'
            risk = '中'
        } else if (bloodOxygen < 90) {
            category = '过低'
            risk = '高'
        }
        
        return { category, risk }
    }
    
    // 综合健康评分
    static calculateHealthScore(healthData) {
        let score = 100
        let deductions = []
        
        // BMI评分
        if (healthData.bmi) {
            const bmi = parseFloat(healthData.bmi)
            if (bmi < 18.5 || bmi >= 28) {
                score -= 10
                deductions.push('BMI异常')
            }
        }
        
        // 血压评分
        if (healthData.bloodPressure) {
            const [systolic, diastolic] = healthData.bloodPressure.split('/').map(Number)
            const assessment = this.assessBloodPressure(systolic, diastolic)
            if (assessment.risk === '高') {
                score -= 15
                deductions.push('血压异常')
            } else if (assessment.risk === '中') {
                score -= 8
                deductions.push('血压偏高')
            }
        }
        
        // 心率评分
        if (healthData.heartRate) {
            const assessment = this.assessHeartRate(healthData.heartRate)
            if (assessment.risk === '高') {
                score -= 10
                deductions.push('心率异常')
            } else if (assessment.risk === '中') {
                score -= 5
                deductions.push('心率异常')
            }
        }
        
        // 血氧评分
        if (healthData.bloodOxygen) {
            const assessment = this.assessBloodOxygen(healthData.bloodOxygen)
            if (assessment.risk === '高') {
                score -= 12
                deductions.push('血氧异常')
            } else if (assessment.risk === '中') {
                score -= 6
                deductions.push('血氧偏低')
            }
        }
        
        return {
            score: Math.max(0, score),
            deductions,
            level: score >= 90 ? '优秀' : score >= 80 ? '良好' : score >= 70 ? '一般' : '需要关注'
        }
    }
}

// 导出实例
export const healthDataManager = new HealthDataManager()
export const medicationManager = new MedicationManager()
export const consultationManager = new ConsultationManager()

export default {
    HealthDataManager,
    MedicationManager,
    ConsultationManager,
    HealthAssessment,
    healthDataManager,
    medicationManager,
    consultationManager
}
