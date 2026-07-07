<template>
    <view class="elderly-container">
        <!-- 头部用户区域 -->
        <view class="header-section">
            <view class="header-background">
                <view class="bg-pattern"></view>
                <view class="bg-gradient"></view>
            </view>
            <view class="user-area">
                <view class="user-info">
                    <view class="avatar-container">
                        <view class="avatar-glass">
                            <image class="user-avatar" src="/static/images/logo.png"></image>
                        </view>
                    </view>
                    <view class="user-text">
                        <text class="user-greeting"><text class="greeting-text">您好，</text>\n{{ user.name.replace(/(.{6})/g, '$1\n') }}</text>
                        <view class="health-score-container">
                            <text class="score-label">健康指数</text>
                            <view class="score-display">
                                <text class="score-value">{{ healthScore }}</text>
                                <text class="score-unit">分</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="weather-info">
                    <view class="weather-icon">☀️</view>
                    <view class="weather-details">
                        <text class="weather-city">{{ city }}</text>
                        <text class="weather-temp">{{ weatherData.temperature }}°C</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 左侧内容区域 -->
        <view class="elderly-sidebar">
            <!-- 健康概览卡片 -->
            <view class="elderly-card">
                <view class="elderly-title">健康概览</view>
                <text class="elderly-text-small">最后更新: {{ healthData.lastUpdate }}</text>

                <view class="health-overview-grid">
                    <view class="health-item" @tap="showVitalDetail" data-type="heartRate">
                        <view class="health-icon">❤️</view>
                        <view class="health-info">
                            <text class="health-value">{{ healthData.heartRate[6] }}</text>
                            <text class="health-label">心率</text>
                        </view>
                    </view>
                    <view class="health-item" @tap="showVitalDetail" data-type="bloodPressure">
                        <view class="health-icon">🩸</view>
                        <view class="health-info">
                            <text class="health-value">{{ healthData.bloodPressure[6] }}</text>
                            <text class="health-label">血压</text>
                        </view>
                    </view>
                    <view class="health-item" @tap="showVitalDetail" data-type="bloodOxygen">
                        <view class="health-icon">🫁</view>
                        <view class="health-info">
                            <text class="health-value">98%</text>
                            <text class="health-label">血氧</text>
                        </view>
                    </view>
                    <view class="health-item" @tap="showVitalDetail" data-type="steps">
                        <view class="health-icon">👟</view>
                        <view class="health-info">
                            <text class="health-value">6,280</text>
                            <text class="health-label">步数</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 今日提醒卡片 -->
            <view class="elderly-card">
                <view class="services-header">
                    <text class="elderly-title">今日提醒</text>
                    <view class="reminder-actions">
                        <text class="elderly-text-small" @tap="showAddReminder">+ 添加</text>
                        <text class="elderly-text-small" @tap="viewAllReminders">查看全部</text>
                    </view>
                </view>

                <view class="elderly-list">
                    <view class="elderly-list-item" v-for="(item, index) in reminders" :key="index" @tap="toggleReminderStatus" :data-id="item.id">
                        <view class="elderly-list-icon">
                            <text v-if="item.type === 'medication'">💊</text>
                            <text v-else-if="item.type === 'appointment'">🏥</text>
                            <text v-else-if="item.type === 'exercise'">🏃</text>
                            <text v-else-if="item.type === 'measure'">📏</text>
                            <text v-else>⏰</text>
                        </view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">{{ item.title }}</text>
                            <text class="elderly-list-desc">{{ item.time }} · {{ item.desc }}</text>
                        </view>
                        <view class="elderly-status" :class="item.recorded ? 'elderly-status-normal' : 'elderly-status-warning'">
                            {{ item.recorded ? '已完成' : item.actionText }}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 右侧内容区域 -->
        <view class="elderly-main-content">
            <!-- 健康趋势图表 -->
            <view class="elderly-card">
                <view class="trend-section">
                    <view class="trend-header">
                        <text class="elderly-subtitle">健康趋势</text>
                        <text class="elderly-text-small" @tap="viewHealthTrend">查看详情</text>
                    </view>
                    <view class="chart-container">
                        <canvas canvas-id="healthChart" id="healthChart" class="health-chart"></canvas>
                    </view>
                    <view class="chart-legend">
                        <view class="legend-item">
                            <view class="legend-color" style="background: #19be6b;"></view>
                            <text class="legend-text">心率趋势</text>
                        </view>
                        <view class="legend-item">
                            <view class="legend-color" style="background: #ffc107;"></view>
                            <text class="legend-text">血压趋势</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 健康服务区域 -->
            <view class="elderly-card">
                <view class="services-header">
                    <text class="elderly-title">健康服务</text>
                    <text class="elderly-text-small" @tap="viewAllServices">全部服务</text>
                </view>
                
                <!-- 主要服务 -->
                <view class="main-services">
                    <view class="service-row">
                        <view class="service-item" @tap="navigateToService" data-service="online-consultation">
                            <view class="service-icon">🩺</view>
                            <text class="service-text">在线问诊</text>
                        </view>
                        <view class="service-item" @tap="navigateToService" data-service="medication-management">
                            <view class="service-icon">💊</view>
                            <text class="service-text">用药管理</text>
                        </view>
                        <view class="service-item" @tap="navigateToService" data-service="appointment">
                            <view class="service-icon">📅</view>
                            <text class="service-text">预约挂号</text>
                        </view>
                        <view class="service-item" @tap="navigateToService" data-service="health-record">
                            <view class="service-icon">📋</view>
                            <text class="service-text">健康档案</text>
                        </view>
                    </view>
                    
                    <view class="service-row">
                        <view class="service-item" @tap="navigateToService" data-service="family-account">
                            <view class="service-icon">👨‍👩‍👧</view>
                            <text class="service-text">家庭账户</text>
                        </view>
                        <view class="service-item" @tap="navigateToService" data-service="health-report">
                            <view class="service-icon">📊</view>
                            <text class="service-text">健康报告</text>
                        </view>
                        <view class="service-item" @tap="navigateToService" data-service="exercise-plan">
                            <view class="service-icon">🏃</view>
                            <text class="service-text">运动计划</text>
                        </view>
                        <view class="service-item" @tap="navigateToService" data-service="nutrition">
                            <view class="service-icon">🥗</view>
                            <text class="service-text">营养膳食</text>
                        </view>
                    </view>
                </view>
                
                <!-- 快速操作 -->
                <view class="quick-actions">
                    <view class="quick-action-item" @tap="navigateToService" data-service="emergency">
                        <view class="quick-action-icon emergency">🆘</view>
                        <text class="quick-action-text">紧急求助</text>
                    </view>
                    <view class="quick-action-item" @tap="navigateToService" data-service="measure">
                        <view class="quick-action-icon measure">📏</view>
                        <text class="quick-action-text">测量记录</text>
                    </view>
                    <view class="quick-action-item" @tap="navigateToService" data-service="medication">
                        <view class="quick-action-icon medication">💊</view>
                        <text class="quick-action-text">用药提醒</text>
                    </view>
                    <view class="quick-action-item" @tap="navigateToService" data-service="appointment">
                        <view class="quick-action-icon appointment">📅</view>
                        <text class="quick-action-text">预约管理</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 紧急求助按钮 -->
        <view class="emergency-btn" @tap="showEmergency">
            <view class="sos-icon">🆘</view>
            <text class="sos-text">紧急求助</text>
        </view>

        <!-- 紧急求助对话框 -->
        <view class="emergency-modal" v-if="showEmergencyModal">
            <view class="modal-content elderly-card">
                <view class="modal-emergency-icon">🆘</view>
                <text class="elderly-title">紧急求助</text>
                <text class="elderly-text">确认发送紧急求助？我们将立即通知您的紧急联系人和社区医疗中心</text>
                <view class="action-buttons">
                    <button class="elderly-btn elderly-btn-secondary" @tap="cancelEmergency">取消</button>
                    <button class="elderly-btn elderly-btn-danger" @tap="confirmEmergency">确认求助</button>
                </view>
            </view>
        </view>

        <!-- 添加提醒对话框 -->
        <view class="add-reminder-modal" v-if="showAddReminderModal">
            <view class="modal-content elderly-card">
                <text class="elderly-title">添加新提醒</text>

                <view class="form-group">
                    <text class="elderly-text">提醒类型</text>
                    <picker @change="bindReminderTypeChange" :value="reminderTypeIndex" :range="reminderTypes">
                        <view class="elderly-input">{{ reminderTypes[reminderTypeIndex] }}</view>
                    </picker>
                </view>

                <view class="form-group">
                    <text class="elderly-text">提醒内容</text>
                    <input type="text" placeholder="例如: 服用降压药" :value="newReminderContent" @input="bindReminderContentInput" class="elderly-input" />
                </view>

                <view class="form-group">
                    <text class="elderly-text">提醒时间</text>
                    <picker mode="time" :value="newReminderTime" @change="bindReminderTimeChange">
                        <view class="elderly-input">{{ newReminderTime || '选择时间' }}</view>
                    </picker>
                </view>

                <view class="form-buttons">
                    <button class="elderly-btn elderly-btn-secondary" @tap="cancelAddReminder">取消</button>
                    <button class="elderly-btn" @tap="addNewReminder">添加</button>
                </view>
            </view>
        </view>

        <!-- 健康指标详情 -->
        <view class="vital-detail-modal" v-if="showVitalDetail">
            <view class="modal-content elderly-card">
                <text class="elderly-title">{{ currentVital.name }}详情</text>
                <text class="elderly-health-value">{{ currentVital.value }}</text>
                <text class="elderly-text">{{ currentVital.desc }}</text>
                <button class="elderly-btn" @tap="hideVitalDetail">确定</button>
            </view>
        </view>

        <!-- 自定义Emoji TabBar -->
        <emoji-tabbar></emoji-tabbar>
    </view>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: '张明惠'
            },
            healthScore: this.generateHealthScore(), // 随机生成健康指数
            city: '肇庆',
            weatherData: {
                temperature: 28
            },
            healthData: {
                heartRate: [78, 82, 76, 79, 85, 80, 78],
                bloodPressure: [125, 118, 122, 115, 120, 116, 122],
                dates: ['一', '二', '三', '四', '五', '六', '日'],
                lastUpdate: '今天 09:30'
            },
            reminders: [
                {
                    id: 1,
                    title: '服用降压药',
                    time: '08:00',
                    type: 'medication',
                    desc: '每日一次，餐后服用',
                    recorded: true,
                    actionText: '记录'
                },
                {
                    id: 2,
                    title: '测量血压',
                    time: '10:00',
                    type: 'measure',
                    desc: '静坐5分钟后测量',
                    recorded: false,
                    actionText: '记录'
                },
                {
                    id: 3,
                    title: '复诊预约',
                    time: '14:30',
                    type: 'appointment',
                    desc: '心内科专家门诊',
                    recorded: false,
                    actionText: '查看'
                },
                {
                    id: 4,
                    title: '散步运动',
                    time: '16:00',
                    type: 'exercise',
                    desc: '户外散步30分钟',
                    recorded: false,
                    actionText: '记录'
                }
            ],
            showEmergencyModal: false,
            showAddReminderModal: false,
            showVitalDetail: false,
            currentVital: {
                name: '',
                value: '',
                desc: ''
            },
            reminderTypeIndex: 0,
            reminderTypes: ['用药提醒', '预约提醒', '测量提醒', '运动提醒', '其他'],
            newReminderContent: '',
            newReminderTime: ''
        }
    },
    onLoad() {
        this.initHealthChart()
        this.syncHealthScore() // 同步健康指数
    },
    onReady() {
        // 确保在页面渲染完成后初始化图表
        setTimeout(() => {
            this.initHealthChart()
        }, 100)
    },
    onShow() {
        this.syncHealthScore() // 每次显示页面时同步健康指数
    },
    methods: {
        // 初始化健康趋势图表
        initHealthChart() {
            const ctx = uni.createCanvasContext('healthChart', this)
            const width = 300
            const height = 200
            const padding = 20

            // 清空画布
            ctx.clearRect(0, 0, width, height)

            // 绘制背景
            ctx.setFillStyle('#f8f9fa')
            ctx.fillRect(0, 0, width, height)
            
            // 绘制网格线
            ctx.setStrokeStyle('#e9ecef')
            ctx.setLineWidth(1)
            for (let i = 0; i <= 4; i++) {
                const y = padding + (height - 2 * padding) * i / 4
                ctx.moveTo(padding, y)
                ctx.lineTo(width - padding, y)
            }
            ctx.stroke()
            
            // 绘制心率数据线
            const heartRateData = this.healthData.heartRate
            const maxHeartRate = Math.max(...heartRateData)
            const minHeartRate = Math.min(...heartRateData)
            const range = maxHeartRate - minHeartRate || 1
            
            ctx.setStrokeStyle('#19be6b')
            ctx.setLineWidth(3)
            ctx.beginPath()
            
            heartRateData.forEach((value, index) => {
                const x = padding + (width - 2 * padding) * index / (heartRateData.length - 1)
                const y = height - padding - (value - minHeartRate) / range * (height - 2 * padding)
                
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            ctx.stroke()

            // 绘制数据点
            ctx.setFillStyle('#19be6b')
            heartRateData.forEach((value, index) => {
                const x = padding + (width - 2 * padding) * index / (heartRateData.length - 1)
                const y = height - padding - (value - minHeartRate) / range * (height - 2 * padding)
                
                ctx.beginPath()
                ctx.arc(x, y, 4, 0, 2 * Math.PI)
                ctx.fill()
            })
            
            // 绘制标签
            ctx.setFillStyle('#666')
            ctx.setFontSize(12)
            this.healthData.dates.forEach((date, index) => {
                const x = padding + (width - 2 * padding) * index / (this.healthData.dates.length - 1)
                ctx.fillText(date, x - 10, height - 5)
            })
            
            ctx.draw()
        },
        
        // 显示健康指标详情
        showVitalDetail(e) {
            const type = e.currentTarget.dataset.type
            const vitalMap = {
                heartRate: { name: '心率', value: this.healthData.heartRate[6] + ' bpm', desc: '正常心率范围：60-100次/分钟' },
                bloodPressure: { name: '血压', value: this.healthData.bloodPressure[6] + ' mmHg', desc: '正常血压范围：90-140/60-90 mmHg' },
                bloodOxygen: { name: '血氧', value: '98%', desc: '正常血氧饱和度：95%-100%' },
                steps: { name: '步数', value: '6,280步', desc: '建议每日步数：6,000-10,000步' }
            }
            
            this.currentVital = vitalMap[type] || { name: '', value: '', desc: '' }
            this.showVitalDetail = true
        },
        
        // 隐藏健康指标详情
        hideVitalDetail() {
            this.showVitalDetail = false
        },
        
        // 查看健康趋势
        viewHealthTrend() {
            uni.navigateTo({
                url: '/pages/health/trend'
            })
        },
        
        // 导航到服务页面
        navigateToService(e) {
            const service = e.currentTarget.dataset.service
            const serviceMap = {
                'online-consultation': '/pages/service/consultation',
                'medication-management': '/pages/service/medication',
                'appointment': '/pages/service/appointment',
                'health-record': '/pages/service/record',
                'family-account': '/pages/family/family',
                'health-report': '/pages/service/report',
                'exercise-plan': '/pages/service/exercise',
                'nutrition': '/pages/service/nutrition',
                'emergency': '/pages/service/emergency',
                'measure': '/pages/health/measure',
                'medication': '/pages/medication/reminder'
            }
            
            if (serviceMap[service]) {
                uni.navigateTo({
                    url: serviceMap[service]
                })
            } else {
                uni.showToast({
                    title: '功能开发中',
                    icon: 'none'
                })
            }
        },
        
        // 查看所有服务
        viewAllServices() {
            uni.switchTab({
                url: '/pages/service/service'
            })
        },
        
        // 切换提醒状态
        toggleReminderStatus(e) {
            const id = e.currentTarget.dataset.id
            const reminder = this.reminders.find(item => item.id === id)
            if (reminder) {
                reminder.recorded = !reminder.recorded
                uni.showToast({
                    title: reminder.recorded ? '已记录' : '已取消',
                    icon: 'success'
                })
            }
        },
        
        // 显示添加提醒
        showAddReminder() {
            this.showAddReminderModal = true
        },

        // 取消添加提醒
        cancelAddReminder() {
            this.showAddReminderModal = false
            this.newReminderContent = ''
            this.newReminderTime = ''
        },

        // 添加新提醒
        addNewReminder() {
            if (this.newReminderContent && this.newReminderTime) {
                const newReminder = {
                    id: Date.now(),
                    title: this.newReminderContent,
                    time: this.newReminderTime,
                    type: this.reminderTypes[this.reminderTypeIndex].includes('用药') ? 'medication' : 'other',
                    desc: '新添加的提醒',
                    recorded: false,
                    actionText: '记录'
                }
                this.reminders.push(newReminder)
                this.cancelAddReminder()
                uni.showToast({
                    title: '提醒添加成功',
                    icon: 'success'
                })
            }
        },

        // 查看所有提醒
        viewAllReminders() {
            uni.navigateTo({
                url: '/pages/service/reminders'
            })
        },
        
        // 显示紧急求助
        showEmergency() {
            this.showEmergencyModal = true
        },
        
        // 取消紧急求助
        cancelEmergency() {
            this.showEmergencyModal = false
        },
        
        // 确认紧急求助
        confirmEmergency() {
            this.showEmergencyModal = false
            uni.showToast({
                title: '紧急求助已发送',
                icon: 'success'
            })
        },
        
        // 提醒类型改变
        bindReminderTypeChange(e) {
            this.reminderTypeIndex = e.detail.value
        },
        
        // 提醒内容输入
        bindReminderContentInput(e) {
            this.newReminderContent = e.detail.value
        },
        
        // 提醒时间改变
        bindReminderTimeChange(e) {
            this.newReminderTime = e.detail.value
        },
        generateHealthScore() {
            // 生成85-98之间的健康指数，更符合实际情况
            return Math.floor(Math.random() * 14) + 85;
        },
        syncHealthScore() {
            // 从全局数据获取健康指数，如果没有则生成新的
            const app = getApp();
            if (app.globalData.healthScore) {
                this.healthScore = app.globalData.healthScore;
            } else {
                this.healthScore = this.generateHealthScore();
                app.globalData.healthScore = this.healthScore;
            }
        }
    }
}
</script>

<style lang="scss">
@import '@/common/elderly-styles.scss';

/* 头部区域样式 */
.header-section {
  position: relative;
  margin-bottom: 20rpx;
  border-radius: $elderly-border-radius;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(25, 190, 107, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.05) 0%, transparent 50%);
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #19be6b 0%, #00d4aa 50%, #5bc0de 100%);
  opacity: 0.9;
}

.user-area {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar-container {
  position: relative;
  margin-right: 25rpx;
}

.avatar-glass {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8rpx 32rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  z-index: 1;
  position: relative;
}

.user-text {
  flex: 1;
  min-width: 0;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
}

.user-greeting {
  font-size: 44rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 15rpx;
  display: block;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
  max-width: 100%;
  overflow-wrap: break-word;
  
  .greeting-text {
    font-size: 32rpx;
    opacity: 0.8;
  }
}

.health-score-container {
  display: flex;
  align-items: flex-end;
  gap: 15rpx;
}

.score-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 5rpx;
  line-height: 1;
}

.score-value {
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  margin-bottom: -10rpx;
}

.score-unit {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.weather-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  padding: 20rpx 25rpx;
  border-radius: $elderly-border-radius;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.weather-icon {
  font-size: 56rpx;
  margin-right: 15rpx;
}

.weather-details {
  display: flex;
  flex-direction: column;
}

.weather-city {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5rpx;
}

.weather-temp {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
}

/* 健康概览样式 */
.health-overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-top: 20rpx;
}

.health-item {
  display: flex;
  align-items: center;
  padding: 25rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #e9ecef;
  }
}

.health-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: $zhaoqing-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.health-info {
  flex: 1;
}

.health-value {
  display: block;
  font-size: $elderly-font-size-xl;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.health-label {
  display: block;
  font-size: $elderly-font-size-base;
  color: #666;
}

/* 服务按钮样式 */
.service-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 15rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #e9ecef;
  }
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: $zhaoqing-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 15rpx;
}

.service-text {
  font-size: $elderly-font-size-base;
  color: #333;
  text-align: center;
  font-weight: bold;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #e9ecef;
  }
}

.quick-action-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 15rpx;
  
  &.emergency {
    background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);
    color: white;
  }
  
  &.measure {
    background: linear-gradient(135deg, #19be6b 0%, #00d4aa 100%);
    color: white;
  }
  
  &.medication {
    background: linear-gradient(135deg, #ffc107 0%, #ffb74d 100%);
    color: white;
  }
  
  &.appointment {
    background: linear-gradient(135deg, #5bc0de 0%, #4fc3f7 100%);
    color: white;
  }
}

.quick-action-text {
  font-size: $elderly-font-size-base;
  color: #333;
  font-weight: bold;
  text-align: center;
}

/* 紧急求助按钮 */
.emergency-btn {
  position: fixed;
  bottom: 120rpx;
  right: 30rpx;
  width: 160rpx;
  height: 160rpx;
  background: $elderly-color-danger;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(255, 71, 87, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.sos-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.sos-text {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}

/* 图表样式 */
.trend-section {
  margin-top: 30rpx;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.chart-container {
  height: 200rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.health-chart {
  width: 100%;
  height: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 30rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.legend-color {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.legend-text {
  font-size: $elderly-font-size-sm;
  color: #666;
}

/* 其他样式 */
.services-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.reminder-actions {
  display: flex;
  gap: 20rpx;
}

.main-services {
  margin-bottom: 30rpx;
}

.emergency-modal,
.add-reminder-modal,
.vital-detail-modal {
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
  width: 80%;
  max-width: 600rpx;
  padding: 40rpx;
  text-align: center;
}

.modal-emergency-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.action-buttons,
.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.form-group {
  margin-bottom: 30rpx;
  text-align: left;
  position: relative;
  z-index: 3001;

  .elderly-text {
    display: block;
    margin-bottom: 10rpx;
  }
  
  .elderly-input {
    position: relative;
    z-index: 3002;
  }
}

.add-reminder-modal {
  z-index: 3000;
  overflow-y: auto;
  
  /* 确保picker的二级菜单不被遮挡 */
  .elderly-input {
    position: relative;
    z-index: 3001;
  }
  
  /* picker组件需要更高的层级 */
  picker {
    position: relative;
    z-index: 3002;
  }
  
  /* 确保picker的选项菜单在最顶层 */
  .uni-picker-container {
    z-index: 9999 !important;
  }
}

/* 全局picker样式优化 */
picker {
  position: relative;
  z-index: 9999;
}

/* 确保picker选项菜单在最顶层 */
.uni-picker-view {
  z-index: 9999 !important;
}

.uni-picker-mask {
  z-index: 9998 !important;
}

.modal-content {
  max-height: calc(100vh - 180rpx);
  overflow-y: auto;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
  position: relative;
  z-index: 3001;
}

/* 确保所有弹窗的层级正确 */
.emergency-modal,
.vital-detail-modal {
  z-index: 2000;
}
</style>
