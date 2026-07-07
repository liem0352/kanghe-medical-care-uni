<template>
    <!-- pages/family/family.wxml -->
    <view class="elderly-container">
        <!-- 左侧内容区域 -->
        <view class="elderly-sidebar">
            <!-- 家庭概览 -->
            <view class="elderly-card">
                <view class="elderly-title">家庭健康</view>
                <text class="elderly-text-small">共 {{ familyMembers.length }} 位成员</text>
                
                <view class="family-overview">
                    <view class="overview-item">
                        <text class="overview-number">{{ familyMembers.length }}</text>
                        <text class="elderly-text-small">家庭成员</text>
                    </view>
                    <view class="overview-item">
                        <text class="overview-number">{{ todayReminders.length }}</text>
                        <text class="elderly-text-small">今日提醒</text>
                    </view>
                    <view class="overview-item">
                        <text class="overview-number">{{ healthAlerts.length }}</text>
                        <text class="elderly-text-small">健康预警</text>
                    </view>
                </view>
            </view>

            <!-- 今日提醒 -->
            <view class="elderly-card">
                <view class="services-header">
                    <text class="elderly-title">今日提醒</text>
                    <text class="elderly-text-small" @tap="viewAllReminders">查看全部</text>
                </view>
                
                <view class="elderly-list">
                    <view class="elderly-list-item" v-for="(reminder, index) in todayReminders" :key="index" @tap="toggleReminderStatus" :data-id="reminder.id">
                        <view class="elderly-list-icon">
                            <text v-if="reminder.type === 'medication'">💊</text>
                            <text v-else-if="reminder.type === 'appointment'">🏥</text>
                            <text v-else>⏰</text>
                        </view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">{{ reminder.title }}</text>
                            <text class="elderly-list-desc">{{ reminder.memberName }} · {{ reminder.time }}</text>
                        </view>
                        <view class="elderly-status" :class="reminder.completed ? 'elderly-status-normal' : 'elderly-status-warning'">
                            {{ reminder.completed ? '已完成' : '待处理' }}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 右侧内容区域 -->
        <view class="elderly-main-content">
            <!-- 家庭成员列表 -->
            <view class="elderly-card">
                <view class="services-header">
                    <text class="elderly-title">家庭成员</text>
                    <text class="elderly-text-small" @tap="addFamilyMember">+ 添加</text>
                </view>
                
                <view class="elderly-list">
                    <view class="elderly-list-item" v-for="(member, index) in familyMembers" :key="index" @tap="viewMemberDetail" :data-id="member.id">
                        <view class="elderly-list-icon">
                            <text>{{ member.avatar }}</text>
                        </view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">{{ member.name }}</text>
                            <text class="elderly-list-desc">{{ member.relation }} · {{ member.age }}岁</text>
                            <view class="member-status">
                                <view class="elderly-status" :class="member.healthStatus === 'normal' ? 'elderly-status-normal' : 'elderly-status-warning'">
                                    {{ member.healthStatus === 'normal' ? '健康' : '需关注' }}
                                </view>
                            </view>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>
                </view>
            </view>

            <!-- 健康预警 -->
            <view class="elderly-card" v-if="healthAlerts.length > 0">
                <view class="services-header">
                    <text class="elderly-title">健康预警</text>
                    <text class="elderly-text-small" @tap="viewAllAlerts">查看全部</text>
                </view>
                
                <view class="elderly-list">
                    <view class="elderly-list-item" v-for="(alert, index) in healthAlerts" :key="index" @tap="viewAlertDetail" :data-id="alert.id">
                        <view class="elderly-list-icon" style="background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);">
                            <text>⚠️</text>
                        </view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">{{ alert.title }}</text>
                            <text class="elderly-list-desc">{{ alert.memberName }} · {{ alert.time }}</text>
                        </view>
                        <view class="elderly-status elderly-status-danger">
                            {{ alert.level }}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 添加家庭成员对话框 -->
        <view class="add-member-modal" v-if="showAddMemberModal">
            <view class="modal-content elderly-card">
                <text class="elderly-title">添加家庭成员</text>

                <view class="form-group">
                    <text class="elderly-text">姓名</text>
                    <input type="text" placeholder="请输入姓名" :value="newMember.name" @input="bindMemberNameInput" class="elderly-input" />
                </view>

                <view class="form-group">
                    <text class="elderly-text">关系</text>
                    <picker @change="bindRelationChange" :value="relationIndex" :range="relations">
                        <view class="elderly-input">{{ relations[relationIndex] }}</view>
                    </picker>
                </view>

                <view class="form-group">
                    <text class="elderly-text">年龄</text>
                    <input type="number" placeholder="请输入年龄" :value="newMember.age" @input="bindAgeInput" class="elderly-input" />
                </view>

                <view class="form-group">
                    <text class="elderly-text">手机号</text>
                    <input type="number" placeholder="请输入手机号" :value="newMember.phone" @input="bindPhoneInput" class="elderly-input" />
                </view>

                <view class="form-buttons">
                    <button class="elderly-btn elderly-btn-secondary" @tap="cancelAddMember">取消</button>
                    <button class="elderly-btn" @tap="confirmAddMember">添加</button>
                </view>
            </view>
        </view>

        <!-- 成员详情对话框 -->
        <view class="member-detail-modal" v-if="showMemberDetail">
            <view class="modal-content elderly-card">
                <text class="elderly-title">{{ currentMember.name }}的健康状况</text>
                
                <view class="member-health-grid">
                    <view class="health-item">
                        <text class="health-label">心率</text>
                        <text class="health-value">{{ currentMember.heartRate }} bpm</text>
                    </view>
                    <view class="health-item">
                        <text class="health-label">血压</text>
                        <text class="health-value">{{ currentMember.bloodPressure }}</text>
                    </view>
                    <view class="health-item">
                        <text class="health-label">血氧</text>
                        <text class="health-value">{{ currentMember.bloodOxygen }}%</text>
                    </view>
                    <view class="health-item">
                        <text class="health-label">体温</text>
                        <text class="health-value">{{ currentMember.temperature }}°C</text>
                    </view>
                </view>
                
                <button class="elderly-btn" @tap="hideMemberDetail">确定</button>
            </view>
        </view>

        <!-- 自定义Emoji TabBar -->
        <emoji-tabbar></emoji-tabbar>
    </view>
</template>

<script>
// pages/family/family.js
export default {
    data() {
        return {
            familyMembers: [
                {
                    id: 1,
                    name: '张明惠',
                    relation: '本人',
                    age: 68,
                    avatar: '👵',
                    healthStatus: 'normal',
                    heartRate: 78,
                    bloodPressure: '125/80',
                    bloodOxygen: 98,
                    temperature: 36.5
                },
                {
                    id: 2,
                    name: '李建国',
                    relation: '配偶',
                    age: 70,
                    avatar: '👴',
                    healthStatus: 'warning',
                    heartRate: 85,
                    bloodPressure: '140/90',
                    bloodOxygen: 96,
                    temperature: 36.8
                },
                {
                    id: 3,
                    name: '张小明',
                    relation: '儿子',
                    age: 35,
                    avatar: '👨',
                    healthStatus: 'normal',
                    heartRate: 72,
                    bloodPressure: '120/75',
                    bloodOxygen: 99,
                    temperature: 36.3
                }
            ],
            todayReminders: [
                {
                    id: 1,
                    title: '服用降压药',
                    memberName: '李建国',
                    time: '08:00',
                    type: 'medication',
                    completed: true
                },
                {
                    id: 2,
                    title: '测量血压',
                    memberName: '张明惠',
                    time: '10:00',
                    type: 'medication',
                    completed: false
                },
                {
                    id: 3,
                    title: '复诊预约',
                    memberName: '李建国',
                    time: '14:30',
                    type: 'appointment',
                    completed: false
                }
            ],
            healthAlerts: [
                {
                    id: 1,
                    title: '血压偏高',
                    memberName: '李建国',
                    time: '今天 08:30',
                    level: '中等'
                }
            ],
            showAddMemberModal: false,
            showMemberDetail: false,
            currentMember: {},
            newMember: {
                name: '',
                relation: '',
                age: '',
                phone: ''
            },
            relationIndex: 0,
            relations: ['配偶', '父亲', '母亲', '儿子', '女儿', '其他']
        };
    },
    methods: {
        // 添加家庭成员
        addFamilyMember() {
            this.showAddMemberModal = true
        },
        
        // 取消添加成员
        cancelAddMember() {
            this.showAddMemberModal = false
            this.newMember = {
                name: '',
                relation: '',
                age: '',
                phone: ''
            }
        },
        
        // 确认添加成员
        confirmAddMember() {
            if (this.newMember.name && this.newMember.age) {
                const newMember = {
                    id: Date.now(),
                    name: this.newMember.name,
                    relation: this.relations[this.relationIndex],
                    age: parseInt(this.newMember.age),
                    avatar: '👤',
                    healthStatus: 'normal',
                    heartRate: 75,
                    bloodPressure: '120/80',
                    bloodOxygen: 98,
                    temperature: 36.5
                }
                this.familyMembers.push(newMember)
                this.cancelAddMember()
                uni.showToast({
                    title: '成员添加成功',
                    icon: 'success'
                })
            }
        },
        
        // 查看成员详情
        viewMemberDetail(e) {
            const id = e.currentTarget.dataset.id
            this.currentMember = this.familyMembers.find(member => member.id === id) || {}
            this.showMemberDetail = true
        },
        
        // 隐藏成员详情
        hideMemberDetail() {
            this.showMemberDetail = false
        },
        
        // 切换提醒状态
        toggleReminderStatus(e) {
            const id = e.currentTarget.dataset.id
            const reminder = this.todayReminders.find(item => item.id === id)
            if (reminder) {
                reminder.completed = !reminder.completed
            }
        },
        
        // 查看所有提醒
        viewAllReminders() {
            uni.navigateTo({
                url: '/pages/service/reminders'
            })
        },
        
        // 查看预警详情
        viewAlertDetail(e) {
            const id = e.currentTarget.dataset.id
            const alert = this.healthAlerts.find(item => item.id === id)
            if (alert) {
                uni.showModal({
                    title: '健康预警',
                    content: `${alert.memberName}的${alert.title}，建议及时就医检查。`,
                    showCancel: false
                })
            }
        },
        
        // 查看所有预警
        viewAllAlerts() {
            uni.navigateTo({
                url: '/pages/health/alerts'
            })
        },
        
        // 成员姓名输入
        bindMemberNameInput(e) {
            this.newMember.name = e.detail.value
        },
        
        // 关系选择
        bindRelationChange(e) {
            this.relationIndex = e.detail.value
        },
        
        // 年龄输入
        bindAgeInput(e) {
            this.newMember.age = e.detail.value
        },
        
        // 手机号输入
        bindPhoneInput(e) {
            this.newMember.phone = e.detail.value
        }
    }
};
</script>
<style lang="scss">
@import '@/common/elderly-styles.scss';

.family-overview {
  display: flex;
  justify-content: space-around;
  margin-top: 30rpx;
  padding: 20rpx 0;
  background: rgba(25, 190, 107, 0.05);
  border-radius: $elderly-border-radius;
}

.overview-item {
  text-align: center;
  
  .overview-number {
    display: block;
    font-size: $elderly-font-size-xxl;
    font-weight: bold;
    color: $elderly-color-primary;
    margin-bottom: 10rpx;
  }
}

.member-status {
  margin-top: 10rpx;
}

.member-health-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin: 30rpx 0;
}

.health-item {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: $elderly-border-radius;
  text-align: center;
  
  .health-label {
    display: block;
    font-size: $elderly-font-size-sm;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .health-value {
    display: block;
    font-size: $elderly-font-size-lg;
    font-weight: bold;
    color: #333;
  }
}

.add-member-modal,
.member-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  
  /* 确保picker等组件不被遮挡 */
  picker {
    position: relative;
    z-index: 9999;
  }
  
  .elderly-input {
    position: relative;
    z-index: 3001;
  }
}

.modal-content {
  width: 80%;
  max-width: 600rpx;
  padding: 40rpx;
  text-align: center;
  max-height: calc(100vh - 180rpx);
  overflow-y: auto;
  position: relative;
  z-index: 3001;
}

.form-group {
  margin-bottom: 30rpx;
  text-align: left;
  
  .elderly-text {
    display: block;
    margin-bottom: 10rpx;
  }
}

.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
</style>
