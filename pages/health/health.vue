<template>
    <!-- pages/health/health.wxml -->
    <view class="elderly-container">
        <!-- 健康概览卡片 -->
        <view class="elderly-card">
            <view class="health-header">
                <text class="elderly-title">健康监测</text>
                <text class="elderly-text-small">更新于 {{ updateTime }}</text>
            </view>
            
            <view class="health-grid">
                <view class="health-item" @tap="showHealthDetail" data-type="heartRate">
                    <view class="health-icon">❤️</view>
                    <view class="health-info">
                        <text class="health-value">{{ healthData.heartRate }}</text>
                        <text class="health-label">心率 bpm</text>
                        <view class="elderly-status" :class="heartStatusClass">
                            {{ getHeartStatus(healthData.heartRate) }}
                        </view>
                    </view>
                </view>
                <view class="health-item" @tap="showHealthDetail" data-type="bloodPressure">
                    <view class="health-icon">🩸</view>
                    <view class="health-info">
                        <text class="health-value">{{ healthData.bloodPressure }}</text>
                        <text class="health-label">血压 mmHg</text>
                        <view class="elderly-status" :class="bloodStatusClass">
                            {{ getBloodStatus(healthData.bloodPressure) }}
                        </view>
                    </view>
                </view>
                <view class="health-item" @tap="showHealthDetail" data-type="bloodOxygen">
                    <view class="health-icon">🫁</view>
                    <view class="health-info">
                        <text class="health-value">{{ healthData.bloodOxygen }}%</text>
                        <text class="health-label">血氧饱和度</text>
                        <view class="elderly-status" :class="oxygenStatusClass">
                            {{ getOxygenStatus(healthData.bloodOxygen) }}
                        </view>
                    </view>
                </view>
                <view class="health-item" @tap="showHealthDetail" data-type="temperature">
                    <view class="health-icon">🌡️</view>
                    <view class="health-info">
                        <text class="health-value">{{ healthData.temperature }}°C</text>
                        <text class="health-label">体温</text>
                        <view class="elderly-status" :class="temperatureStatusClass">
                            {{ getTemperatureStatus(healthData.temperature) }}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 健康趋势图表 -->
        <view class="elderly-card">
            <view class="chart-header">
                <text class="elderly-title">心率趋势</text>
                <text class="elderly-text-small">实时数据</text>
            </view>
            <view class="chart-container">
                <canvas canvas-id="heartRateChart" class="health-chart"></canvas>
            </view>
        </view>

        <!-- 血压趋势图表 -->
        <view class="elderly-card">
            <view class="chart-header">
                <text class="elderly-title">血压趋势</text>
                <text class="elderly-text-small">实时数据</text>
            </view>
            <view class="chart-container">
                <canvas canvas-id="bloodPressureChart" class="health-chart"></canvas>
            </view>
        </view>

        <!-- 血氧趋势图表 -->
        <view class="elderly-card">
            <view class="chart-header">
                <text class="elderly-title">血氧趋势</text>
                <text class="elderly-text-small">实时数据</text>
            </view>
            <view class="chart-container">
                <canvas canvas-id="bloodOxygenChart" class="health-chart"></canvas>
            </view>
        </view>

        <!-- 体温趋势图表 -->
        <view class="elderly-card">
            <view class="chart-header">
                <text class="elderly-title">体温趋势</text>
                <text class="elderly-text-small">实时数据</text>
            </view>
            <view class="chart-container">
                <canvas canvas-id="temperatureChart" class="health-chart"></canvas>
            </view>
        </view>

        <!-- 健康预警和建议 -->
        <view class="content-row">
            <!-- 健康预警 -->
            <view class="elderly-card alert-section">
                <view class="section-header">
                    <text class="elderly-title">健康预警</text>
                    <text class="elderly-text-small" @tap="viewAllAlerts">查看全部</text>
                </view>
                <view class="alert-list">
                    <view 
                        class="alert-item" 
                        v-for="(alert, index) in alerts.slice(0, 2)" 
                        :key="index"
                        @tap="viewAlertDetail"
                        :data-id="alert.id"
                    >
                        <view class="alert-icon" :style="alert.iconStyle">
                            <text>{{ alert.icon }}</text>
                        </view>
                        <view class="alert-content">
                            <text class="alert-title">{{ alert.title }}</text>
                            <text class="alert-desc">{{ alert.details }}</text>
                        </view>
                        <view class="elderly-status" :class="alert.statusClass">
                            {{ alert.level }}
                        </view>
                    </view>
                </view>
            </view>

            <!-- 健康建议 -->
            <view class="elderly-card advice-section">
                <view class="section-header">
                    <text class="elderly-title">健康建议</text>
                    <text class="elderly-text-small" @tap="viewAllAdvice">更多</text>
                </view>
                <view class="advice-list">
                    <view 
                        class="advice-item" 
                        v-for="(advice, index) in healthAdvice.slice(0, 2)" 
                        :key="index"
                        @tap="viewAdviceDetail"
                        :data-id="advice.id"
                    >
                        <view class="advice-icon">💡</view>
                        <view class="advice-content">
                            <text class="advice-title">{{ advice.title }}</text>
                            <text class="advice-desc">{{ advice.desc }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 预警详情对话框 -->
        <view class="alert-detail-modal" v-if="showAlertDetail">
            <view class="modal-content elderly-card">
                <text class="elderly-title">{{ currentAlert.title }}</text>
                <text class="elderly-text">{{ currentAlert.details }}</text>
                <text class="elderly-text-small">{{ currentAlert.time }}</text>
                <view class="advice-content">
                    <text class="elderly-subtitle">建议措施：</text>
                    <text class="elderly-text">{{ currentAlert.advice }}</text>
                </view>
                <button class="elderly-btn" @tap="hideAlertDetail">确定</button>
            </view>
        </view>

        <!-- 自定义Emoji TabBar -->
        <emoji-tabbar></emoji-tabbar>
    </view>
</template>

<script>
// pages/health/health.js
const app = getApp();
export default {
    data() {
        return {
            healthData: {
                heartRate: 72,
                bloodPressure: '118/75',
                bloodOxygen: 98,
                temperature: 36.5
            },
            alerts: [
                {
                    id: 1,
                    icon: '🩸',
                    iconStyle: 'background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);',
                    title: '血压偏高',
                    details: '您的血压偏高（142/85mmHg），请注意休息',
                    time: '今天 10:25',
                    level: '中等',
                    statusClass: 'elderly-status-warning',
                    advice: '建议减少盐分摄入，保持规律作息，适当运动。如持续偏高请及时就医。'
                },
                {
                    id: 2,
                    icon: '🫁',
                    iconStyle: 'background: linear-gradient(135deg, #ffc107 0%, #ffb74d 100%);',
                    title: '血氧不足',
                    details: '您的血氧饱和度低于阈值（89%），请注意深呼吸',
                    time: '昨天 15:32',
                    level: '轻微',
                    statusClass: 'elderly-status-warning',
                    advice: '建议进行深呼吸练习，保持室内通风，避免剧烈运动。'
                },
                {
                    id: 3,
                    icon: '💓',
                    iconStyle: 'background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);',
                    title: '心率异常',
                    details: '检测到突发性心动过速（110次/分钟），请检查',
                    time: '前天 08:15',
                    level: '中等',
                    statusClass: 'elderly-status-warning',
                    advice: '建议保持冷静，避免剧烈运动，如症状持续请及时就医。'
                }
            ],
            healthAdvice: [
                {
                    id: 1,
                    title: '血压管理',
                    desc: '定期监测血压，保持健康生活方式'
                },
                {
                    id: 2,
                    title: '运动建议',
                    desc: '适合老年人的安全运动方式'
                },
                {
                    id: 3,
                    title: '饮食指导',
                    desc: '营养均衡的膳食搭配建议'
                }
            ],
            updateTime: '刚刚',
            showAlertDetail: false,
            currentAlert: {},
            heartRateHistory: null,
            bloodPressureHistory: null,
            bloodOxygenHistory: null,
            temperatureHistory: null,
            simulationInterval: null
        };
    },
    computed: {
        heartStatusClass() {
            const status = this.getHeartStatus(this.healthData.heartRate)
            return status === '正常' ? 'elderly-status-normal' : 'elderly-status-warning'
        },
        bloodStatusClass() {
            const status = this.getBloodStatus(this.healthData.bloodPressure)
            return status === '正常' ? 'elderly-status-normal' : 'elderly-status-warning'
        },
        oxygenStatusClass() {
            const status = this.getOxygenStatus(this.healthData.bloodOxygen)
            return status === '正常' ? 'elderly-status-normal' : 'elderly-status-warning'
        },
        temperatureStatusClass() {
            const status = this.getTemperatureStatus(this.healthData.temperature)
            return status === '正常' ? 'elderly-status-normal' : 'elderly-status-warning'
        }
    },
    onLoad() {
        this.syncHealthData()
        this.startSimulation()
        
        // 延迟初始化图表，确保DOM已渲染
        setTimeout(() => {
            this.initHealthChart()
        }, 500)
    },
    onShow() {
        this.syncHealthData()
        
        // 重新初始化图表
        setTimeout(() => {
            this.initHealthChart()
        }, 300)
    },
    onUnload() {
        // 清除定时器
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval)
            this.simulationInterval = null
        }
    },
    methods: {
        // 初始化健康图表
        initHealthChart() {
            this.initHeartRateChart()
            this.initBloodPressureChart()
            this.initBloodOxygenChart()
            this.initTemperatureChart()
        },
        
        // 初始化心率图表
        initHeartRateChart() {
            try {
                const ctx = uni.createCanvasContext('heartRateChart', this)
                if (!ctx) {
                    console.log('心率图表 Canvas context 创建失败')
                    return
                }
                
                // 获取容器实际尺寸
                const query = uni.createSelectorQuery().in(this)
                query.select('.chart-container').boundingClientRect((rect) => {
                    if (!rect) {
                        console.log('无法获取心率图表容器尺寸')
                        return
                    }
                    
                    const width = rect.width
                    const height = rect.height
                    const minDimension = Math.min(width, height)
                    const adaptivePadding = Math.max(40, minDimension * 0.12)
                    const fontSize = Math.max(16, minDimension * 0.04)
                    const smallFontSize = Math.max(14, minDimension * 0.035)
                    
                    // 清空画布
                    ctx.clearRect(0, 0, width, height)
                    
                    // 绘制背景
                    ctx.setFillStyle('#f8f9fa')
                    ctx.fillRect(0, 0, width, height)
                    
                    // 初始化或更新心率历史数据
                    if (!this.heartRateHistory) {
                        this.heartRateHistory = this.generateInitialHeartRateData()
                    } else {
                        this.heartRateHistory.push(this.healthData.heartRate)
                        if (this.heartRateHistory.length > 30) {
                            this.heartRateHistory.shift()
                        }
                    }
                    
                    this.drawChart(ctx, width, height, adaptivePadding, this.heartRateHistory, '心率', 'bpm', '#19be6b')
                }).exec()
                
            } catch (error) {
                console.error('心率图表初始化失败:', error)
            }
        },
        
        // 初始化血压图表
        initBloodPressureChart() {
            try {
                const ctx = uni.createCanvasContext('bloodPressureChart', this)
                if (!ctx) {
                    console.log('血压图表 Canvas context 创建失败')
                    return
                }
                
                const query = uni.createSelectorQuery().in(this)
                query.select('.chart-container').boundingClientRect((rect) => {
                    if (!rect) {
                        console.log('无法获取血压图表容器尺寸')
                        return
                    }
                    
                    const width = rect.width
                    const height = rect.height
                    const minDimension = Math.min(width, height)
                    const adaptivePadding = Math.max(40, minDimension * 0.12)
                    const fontSize = Math.max(16, minDimension * 0.04)
                    const smallFontSize = Math.max(14, minDimension * 0.035)
                    
                    ctx.clearRect(0, 0, width, height)
                    ctx.setFillStyle('#f8f9fa')
                    ctx.fillRect(0, 0, width, height)
                    
                    // 初始化或更新血压历史数据
                    if (!this.bloodPressureHistory) {
                        this.bloodPressureHistory = this.generateInitialBloodPressureData()
                    } else {
                        const [systolic, diastolic] = this.healthData.bloodPressure.split('/').map(Number)
                        this.bloodPressureHistory.push({ systolic, diastolic })
                        if (this.bloodPressureHistory.length > 30) {
                            this.bloodPressureHistory.shift()
                        }
                    }
                    
                    this.drawBloodPressureChart(ctx, width, height, adaptivePadding, this.bloodPressureHistory)
                }).exec()
                
            } catch (error) {
                console.error('血压图表初始化失败:', error)
            }
        },
        
        // 初始化血氧图表
        initBloodOxygenChart() {
            try {
                const ctx = uni.createCanvasContext('bloodOxygenChart', this)
                if (!ctx) {
                    console.log('血氧图表 Canvas context 创建失败')
                    return
                }
                
                const query = uni.createSelectorQuery().in(this)
                query.select('.chart-container').boundingClientRect((rect) => {
                    if (!rect) {
                        console.log('无法获取血氧图表容器尺寸')
                        return
                    }
                    
                    const width = rect.width
                    const height = rect.height
                    const minDimension = Math.min(width, height)
                    const adaptivePadding = Math.max(40, minDimension * 0.12)
                    const fontSize = Math.max(16, minDimension * 0.04)
                    const smallFontSize = Math.max(14, minDimension * 0.035)
                    
                    ctx.clearRect(0, 0, width, height)
                    ctx.setFillStyle('#f8f9fa')
                    ctx.fillRect(0, 0, width, height)
                    
                    // 初始化或更新血氧历史数据
                    if (!this.bloodOxygenHistory) {
                        this.bloodOxygenHistory = this.generateInitialBloodOxygenData()
                    } else {
                        this.bloodOxygenHistory.push(this.healthData.bloodOxygen)
                        if (this.bloodOxygenHistory.length > 30) {
                            this.bloodOxygenHistory.shift()
                        }
                    }
                    
                    this.drawChart(ctx, width, height, adaptivePadding, this.bloodOxygenHistory, '血氧', '%', '#ff6b6b')
                }).exec()
                
            } catch (error) {
                console.error('血氧图表初始化失败:', error)
            }
        },
        
        // 初始化体温图表
        initTemperatureChart() {
            try {
                const ctx = uni.createCanvasContext('temperatureChart', this)
                if (!ctx) {
                    console.log('体温图表 Canvas context 创建失败')
                    return
                }
                
                const query = uni.createSelectorQuery().in(this)
                query.select('.chart-container').boundingClientRect((rect) => {
                    if (!rect) {
                        console.log('无法获取体温图表容器尺寸')
                        return
                    }
                    
                    const width = rect.width
                    const height = rect.height
                    const minDimension = Math.min(width, height)
                    const adaptivePadding = Math.max(40, minDimension * 0.12)
                    const fontSize = Math.max(16, minDimension * 0.04)
                    const smallFontSize = Math.max(14, minDimension * 0.035)
                    
                    ctx.clearRect(0, 0, width, height)
                    ctx.setFillStyle('#f8f9fa')
                    ctx.fillRect(0, 0, width, height)
                    
                    // 初始化或更新体温历史数据
                    if (!this.temperatureHistory) {
                        this.temperatureHistory = this.generateInitialTemperatureData()
                    } else {
                        this.temperatureHistory.push(this.healthData.temperature)
                        if (this.temperatureHistory.length > 30) {
                            this.temperatureHistory.shift()
                        }
                    }
                    
                    this.drawChart(ctx, width, height, adaptivePadding, this.temperatureHistory, '体温', '°C', '#ffa500')
                }).exec()
                
            } catch (error) {
                console.error('体温图表初始化失败:', error)
            }
        },
        
        // 生成初始的心率历史数据
        generateInitialHeartRateData() {
            const data = []
            const baseRate = this.healthData.heartRate || 75
            
            // 生成更平滑的数据
            let currentRate = baseRate
            for (let i = 0; i < 30; i++) {
                // 添加小幅度的随机变化，模拟真实心率变化
                const variation = (Math.random() - 0.5) * 8 // ±4的变化
                currentRate = Math.max(60, Math.min(100, currentRate + variation))
                data.push(Math.round(currentRate))
            }
            
            return data
        },
        
        // 生成初始血压数据
        generateInitialBloodPressureData() {
            const data = []
            let currentSystolic = 120
            let currentDiastolic = 80
            
            for (let i = 0; i < 30; i++) {
                // 添加小幅度的随机变化
                const systolicVariation = (Math.random() - 0.5) * 10 // ±5的变化
                const diastolicVariation = (Math.random() - 0.5) * 8 // ±4的变化
                
                currentSystolic = Math.max(110, Math.min(140, currentSystolic + systolicVariation))
                currentDiastolic = Math.max(70, Math.min(90, currentDiastolic + diastolicVariation))
                
                data.push({ 
                    systolic: Math.round(currentSystolic), 
                    diastolic: Math.round(currentDiastolic) 
                })
            }
            return data
        },
        
        // 生成初始血氧数据
        generateInitialBloodOxygenData() {
            const data = []
            let currentOxygen = 98
            
            for (let i = 0; i < 30; i++) {
                // 添加小幅度的随机变化
                const variation = (Math.random() - 0.5) * 4 // ±2的变化
                currentOxygen = Math.max(95, Math.min(100, currentOxygen + variation))
                data.push(Math.round(currentOxygen))
            }
            return data
        },
        
        // 生成初始体温数据
        generateInitialTemperatureData() {
            const data = []
            let currentTemp = 36.5
            
            for (let i = 0; i < 30; i++) {
                // 添加小幅度的随机变化
                const variation = (Math.random() - 0.5) * 0.6 // ±0.3的变化
                currentTemp = Math.max(36.0, Math.min(37.2, currentTemp + variation))
                data.push(Math.round(currentTemp * 10) / 10) // 保留一位小数
            }
            return data
        },
        
        // 开始模拟数据更新
        startSimulation() {
            // 清除之前的定时器
            if (this.simulationInterval) {
                clearInterval(this.simulationInterval)
            }
            
            // 每5秒更新一次数据
            this.simulationInterval = setInterval(() => {
                // 更新心率数据（整数）
                this.healthData.heartRate = Math.round(60 + Math.random() * 40) // 60-100
                
                // 更新血压数据（整数）
                const systolic = Math.round(110 + Math.random() * 30) // 110-140
                const diastolic = Math.round(70 + Math.random() * 20) // 70-90
                this.healthData.bloodPressure = `${systolic}/${diastolic}`
                
                // 更新血氧数据（整数）
                this.healthData.bloodOxygen = Math.round(95 + Math.random() * 5) // 95-100
                
                // 更新体温数据（保留一位小数）
                this.healthData.temperature = Math.round((36.0 + Math.random() * 1.2) * 10) / 10 // 36.0-37.2
                
                // 更新所有图表
                this.updateAllCharts()
                
                // 更新全局数据
                if (getApp().globalData) {
                    getApp().globalData.healthData = { ...this.healthData }
                }
                
                console.log('健康数据已更新:', this.healthData)
            }, 5000)
        },
        
        // 更新所有图表
        updateAllCharts() {
            this.initHeartRateChart()
            this.initBloodPressureChart()
            this.initBloodOxygenChart()
            this.initTemperatureChart()
        },
        
        // 获取当前时间
        getCurrentTime() {
            const now = new Date()
            const hours = now.getHours().toString().padStart(2, '0')
            const minutes = now.getMinutes().toString().padStart(2, '0')
            return `${hours}:${minutes}`
        },
        
        // 获取心率状态
        getHeartStatus(heartRate) {
            if (heartRate < 60) return '偏低'
            if (heartRate > 100) return '偏高'
            return '正常'
        },
        
        // 获取血压状态
        getBloodStatus(bloodPressure) {
            const [systolic, diastolic] = bloodPressure.split('/').map(Number)
            if (systolic > 140 || diastolic > 90) return '偏高'
            if (systolic < 90 || diastolic < 60) return '偏低'
            return '正常'
        },
        
        // 获取血氧状态
        getOxygenStatus(oxygen) {
            if (oxygen < 95) return '偏低'
            return '正常'
        },
        
        // 获取体温状态
        getTemperatureStatus(temperature) {
            if (temperature > 37.2) return '偏高'
            if (temperature < 36.0) return '偏低'
            return '正常'
        },
        
        // 查看所有预警
        viewAllAlerts() {
            uni.navigateTo({
                url: '/pages/health/alerts'
            })
        },
        
        // 查看预警详情
        viewAlertDetail(e) {
            const id = e.currentTarget.dataset.id
            this.currentAlert = this.alerts.find(alert => alert.id === id) || {}
            this.showAlertDetail = true
        },
        
        // 隐藏预警详情
        hideAlertDetail() {
            this.showAlertDetail = false
        },
        
        // 查看建议详情
        viewAdviceDetail(e) {
            const id = e.currentTarget.dataset.id
            uni.navigateTo({
                url: `/pages/health/advice?id=${id}`
            })
        },
        
        // 查看所有建议
        viewAllAdvice() {
            uni.navigateTo({
                url: '/pages/health/advice'
            })
        },
        
        // 显示健康指标详情
        showHealthDetail(e) {
            const type = e.currentTarget.dataset.type
            const detailMap = {
                heartRate: { name: '心率', value: this.healthData.heartRate + ' bpm', desc: '正常心率范围：60-100次/分钟' },
                bloodPressure: { name: '血压', value: this.healthData.bloodPressure + ' mmHg', desc: '正常血压范围：90-140/60-90 mmHg' },
                bloodOxygen: { name: '血氧', value: this.healthData.bloodOxygen + '%', desc: '正常血氧饱和度：95%-100%' },
                temperature: { name: '体温', value: this.healthData.temperature + '°C', desc: '正常体温范围：36.0-37.2°C' }
            }
            
            const detail = detailMap[type]
            if (detail) {
                uni.showModal({
                    title: detail.name + '详情',
                    content: detail.value + '\n' + detail.desc,
                    showCancel: false
                })
            }
        },
        
        // 同步健康数据
        syncHealthData() {
            const app = getApp();
            if (app.globalData.healthData) {
                // 从全局数据获取健康数据，并确保为整数
                this.healthData = {
                    heartRate: Math.round(app.globalData.healthData.heartRate),
                    bloodPressure: app.globalData.healthData.bloodPressure,
                    bloodOxygen: Math.round(app.globalData.healthData.bloodOxygen),
                    temperature: Math.round(app.globalData.healthData.temperature * 10) / 10 // 保留一位小数
                };
            }
        },
        
        // 通用图表绘制方法
        drawChart(ctx, width, height, padding, data, title, unit, color) {
            if (!data || data.length === 0) return
            
            // 计算数据范围
            const maxValue = Math.max(...data)
            const minValue = Math.min(...data)
            const range = maxValue - minValue || 1
            
            // 自适应计算padding和字体大小
            const minDimension = Math.min(width, height)
            const adaptivePadding = Math.max(40, minDimension * 0.12)
            const fontSize = Math.max(16, minDimension * 0.04)
            const smallFontSize = Math.max(14, minDimension * 0.035)
            
            // 绘制Y轴
            ctx.setStrokeStyle('#e9ecef')
            ctx.setLineWidth(1)
            ctx.setFontSize(smallFontSize)
            ctx.setFillStyle('#666')
            
            // Y轴刻度
            const ySteps = 3
            const chartHeight = height - 2 * adaptivePadding - 40 // 与数据线使用相同的图表高度
            
            for (let i = 0; i <= ySteps; i++) {
                const y = adaptivePadding + chartHeight * i / ySteps
                const value = Math.round(maxValue - (range * i / ySteps))
                
                // 绘制水平网格线
                ctx.setStrokeStyle('#e9ecef')
                ctx.beginPath()
                ctx.moveTo(adaptivePadding, y)
                ctx.lineTo(width - adaptivePadding, y)
                ctx.stroke()
                
                // 绘制Y轴标签
                ctx.setFillStyle('#666')
                ctx.fillText(value.toString(), adaptivePadding - 40, y + 5)
            }
            
            // 绘制X轴
            ctx.setStrokeStyle('#e9ecef')
            ctx.setLineWidth(2)
            ctx.beginPath()
            ctx.moveTo(adaptivePadding, height - adaptivePadding - 20) // 向上移动X轴，给标签留空间
            ctx.lineTo(width - adaptivePadding, height - adaptivePadding - 20)
            ctx.stroke()
            
            // X轴刻度
            const xSteps = 4
            for (let i = 0; i <= xSteps; i++) {
                const x = adaptivePadding + (width - 2 * adaptivePadding) * i / xSteps
                const minutes = Math.round(30 * i / xSteps)
                
                // 绘制垂直网格线
                ctx.setStrokeStyle('#e9ecef')
                ctx.beginPath()
                ctx.moveTo(x, adaptivePadding)
                ctx.lineTo(x, height - adaptivePadding - 20) // 调整终点，与X轴对齐
                ctx.stroke()
                
                // 绘制X轴标签
                ctx.setFillStyle('#666')
                ctx.setFontSize(smallFontSize)
                const labelText = minutes + '分'
                const labelWidth = ctx.measureText(labelText).width || 20
                ctx.fillText(labelText, x - labelWidth / 2, height - adaptivePadding + 20) // 调整Y位置，适应新的padding
            }
            
            // 绘制数据线
            ctx.setStrokeStyle(color)
            ctx.setLineWidth(Math.max(2.5, minDimension / 150)) // 自适应线条宽度
            ctx.beginPath()
            
            data.forEach((value, index) => {
                const x = adaptivePadding + (width - 2 * adaptivePadding) * index / (data.length - 1)
                const y = adaptivePadding + chartHeight - (value - minValue) / range * chartHeight
                
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.stroke()
            
            // 绘制数据点（只显示最新点）
            ctx.setFillStyle(color)
            const pointRadius = Math.max(4, minDimension / 100) // 自适应点半径
            
            const lastIndex = data.length - 1
            const lastValue = data[lastIndex]
            const x = adaptivePadding + (width - 2 * adaptivePadding) * lastIndex / (data.length - 1)
            const y = adaptivePadding + chartHeight - (lastValue - minValue) / range * chartHeight
            
            ctx.beginPath()
            ctx.arc(x, y, pointRadius, 0, 2 * Math.PI)
            ctx.fill()
            
            // 绘制标题
            ctx.setFillStyle('#333')
            ctx.setFontSize(fontSize)
            ctx.fillText(title, adaptivePadding, adaptivePadding - 15)
            
            // 绘制单位
            ctx.setFillStyle('#666')
            ctx.setFontSize(smallFontSize)
            ctx.fillText(unit, adaptivePadding + 60, adaptivePadding - 15)
            
            ctx.draw(false)
        },
        
        // 血压图表专用绘制方法
        drawBloodPressureChart(ctx, width, height, padding, data) {
            if (!data || data.length === 0) return
            
            // 计算数据范围
            const allValues = data.flatMap(item => [item.systolic, item.diastolic])
            const maxValue = Math.max(...allValues)
            const minValue = Math.min(...allValues)
            const range = maxValue - minValue || 1
            
            // 自适应计算padding和字体大小
            const minDimension = Math.min(width, height)
            const adaptivePadding = Math.max(40, minDimension * 0.12)
            const fontSize = Math.max(16, minDimension * 0.04)
            const smallFontSize = Math.max(14, minDimension * 0.035)
            
            // 绘制Y轴
            ctx.setStrokeStyle('#e9ecef')
            ctx.setLineWidth(1)
            ctx.setFontSize(smallFontSize)
            ctx.setFillStyle('#666')
            
            // Y轴刻度
            const ySteps = 3
            const chartHeight = height - 2 * adaptivePadding - 40 // 与数据线使用相同的图表高度
            
            for (let i = 0; i <= ySteps; i++) {
                const y = adaptivePadding + chartHeight * i / ySteps
                const value = Math.round(maxValue - (range * i / ySteps))
                
                // 绘制水平网格线
                ctx.setStrokeStyle('#e9ecef')
                ctx.beginPath()
                ctx.moveTo(adaptivePadding, y)
                ctx.lineTo(width - adaptivePadding, y)
                ctx.stroke()
                
                // 绘制Y轴标签
                ctx.setFillStyle('#666')
                ctx.fillText(value.toString(), adaptivePadding - 40, y + 5)
            }
            
            // 绘制X轴
            ctx.setStrokeStyle('#e9ecef')
            ctx.setLineWidth(2)
            ctx.beginPath()
            ctx.moveTo(adaptivePadding, height - adaptivePadding - 20) // 向上移动X轴，给标签留空间
            ctx.lineTo(width - adaptivePadding, height - adaptivePadding - 20)
            ctx.stroke()
            
            // X轴刻度
            const xSteps = 4
            for (let i = 0; i <= xSteps; i++) {
                const x = adaptivePadding + (width - 2 * adaptivePadding) * i / xSteps
                const minutes = Math.round(30 * i / xSteps)
                
                // 绘制垂直网格线
                ctx.setStrokeStyle('#e9ecef')
                ctx.beginPath()
                ctx.moveTo(x, adaptivePadding)
                ctx.lineTo(x, height - adaptivePadding - 20) // 调整终点，与X轴对齐
                ctx.stroke()
                
                // 绘制X轴标签
                ctx.setFillStyle('#666')
                ctx.setFontSize(smallFontSize)
                const labelText = minutes + '分'
                const labelWidth = ctx.measureText(labelText).width || 20
                ctx.fillText(labelText, x - labelWidth / 2, height - adaptivePadding + 20) // 调整Y位置，适应新的padding
            }
            
            // 绘制收缩压数据线
            ctx.setStrokeStyle('#ff4757')
            ctx.setLineWidth(Math.max(2.5, minDimension / 150))
            ctx.beginPath()
            
            data.forEach((item, index) => {
                const x = adaptivePadding + (width - 2 * adaptivePadding) * index / (data.length - 1)
                const y = adaptivePadding + chartHeight - (item.systolic - minValue) / range * chartHeight
                
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.stroke()
            
            // 绘制舒张压数据线
            ctx.setStrokeStyle('#3742fa')
            ctx.setLineWidth(Math.max(2.5, minDimension / 150))
            ctx.beginPath()
            
            data.forEach((item, index) => {
                const x = adaptivePadding + (width - 2 * adaptivePadding) * index / (data.length - 1)
                const y = adaptivePadding + chartHeight - (item.diastolic - minValue) / range * chartHeight
                
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.stroke()
            
            // 绘制数据点（只显示最新点）
            const pointRadius = Math.max(4, minDimension / 100)
            
            const lastIndex = data.length - 1
            const lastItem = data[lastIndex]
            
            // 收缩压点
            const systolicX = adaptivePadding + (width - 2 * adaptivePadding) * lastIndex / (data.length - 1)
            const systolicY = adaptivePadding + chartHeight - (lastItem.systolic - minValue) / range * chartHeight
            ctx.setFillStyle('#ff4757')
            ctx.beginPath()
            ctx.arc(systolicX, systolicY, pointRadius, 0, 2 * Math.PI)
            ctx.fill()
            
            // 舒张压点
            const diastolicX = adaptivePadding + (width - 2 * adaptivePadding) * lastIndex / (data.length - 1)
            const diastolicY = adaptivePadding + chartHeight - (lastItem.diastolic - minValue) / range * chartHeight
            ctx.setFillStyle('#3742fa')
            ctx.beginPath()
            ctx.arc(diastolicX, diastolicY, pointRadius, 0, 2 * Math.PI)
            ctx.fill()
            
            // 绘制标题和图例
            ctx.setFillStyle('#333')
            ctx.setFontSize(fontSize)
            ctx.fillText('血压', adaptivePadding, adaptivePadding - 15)
            
            // 图例
            ctx.setFillStyle('#ff4757')
            ctx.setFontSize(smallFontSize)
            ctx.fillText('收缩压', adaptivePadding + 60, adaptivePadding - 15)
            
            ctx.setFillStyle('#3742fa')
            ctx.fillText('舒张压', adaptivePadding + 130, adaptivePadding - 15)
            
            ctx.draw(false)
        }
    }
};
</script>

<style lang="scss">
@import '@/common/elderly-styles.scss';

/* 健康概览样式 */
.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.health-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #e9ecef;
  }
}

.health-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: $zhaoqing-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-right: 15rpx;
}

.health-info {
  flex: 1;
}

.health-value {
  display: block;
  font-size: 42rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
}

.health-label {
  display: block;
  font-size: $elderly-font-size-sm;
  color: #666;
  margin-bottom: 8rpx;
}

/* 图表样式 */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.chart-container {
  height: 350rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 0;
  margin-bottom: 25rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.health-chart {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* 内容行布局 */
.content-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25rpx;
  
  @media (max-width: 768rpx) {
    grid-template-columns: 1fr;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

/* 预警列表样式 */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.alert-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.alert-content {
  flex: 1;
}

.alert-title {
  display: block;
  font-size: $elderly-font-size-base;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.alert-desc {
  display: block;
  font-size: $elderly-font-size-sm;
  color: #666;
  line-height: 1.5;
}

/* 建议列表样式 */
.advice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.advice-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.advice-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: $zhaoqing-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.advice-content {
  flex: 1;
}

.advice-title {
  display: block;
  font-size: $elderly-font-size-base;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.advice-desc {
  display: block;
  font-size: $elderly-font-size-sm;
  color: #666;
  line-height: 1.5;
}

/* 弹窗样式 */
.alert-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  width: 85%;
  max-width: 650rpx;
  padding: 50rpx;
  text-align: center;
  border-radius: 16rpx;
}

.advice-content {
  margin: 35rpx 0;
  text-align: left;
  
  .elderly-subtitle {
    display: block;
    margin-bottom: 15rpx;
    font-weight: bold;
  }
}

.chart-section {
  margin-bottom: 35rpx;
}

.chart-section:last-child {
  margin-bottom: 0;
}

/* 整体容器优化 */
.elderly-container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.elderly-card {
  margin-bottom: 25rpx;
  padding: 25rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
