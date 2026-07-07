<template>
    <view class="elderly-container">
        <!-- 左侧内容区域 -->
        <view class="elderly-sidebar">
            <!-- 服务分类导航 -->
            <view class="elderly-card">
                <view class="elderly-title">服务分类</view>
                <view class="category-nav">
                    <view 
                        v-for="category in categories" 
                        :key="category.id"
                        :class="'category-item ' + (currentCategory === category.id ? 'active' : '')" 
                        @tap="changeCategory" 
                        :data-category="category.id"
                    >
                        {{ category.name }}
                    </view>
                </view>
            </view>

            <!-- 服务资源地图 -->
            <view class="elderly-card">
                <view class="elderly-title">附近医疗资源</view>
                <view class="map-container">
                    <view class="map-content">
                        <view 
                            class="resource-item" 
                            v-for="(item, index) in resources" 
                            :key="index"
                            :style="'top: ' + item.top + '%; left: ' + item.left + '%'"
                        >
                            <text class="resource-dot">{{ item.emoji }}</text>
                            <text class="resource-label">{{ item.name }}</text>
                        </view>
                        <view class="location-marker">
                            <text class="location-dot">📍</text>
                            <text class="location-label">我的位置</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 右侧内容区域 -->
        <view class="elderly-main-content">
            <!-- 服务网格 -->
            <view class="elderly-card">
                <view class="elderly-title">服务项目</view>
                <view class="elderly-grid">
                    <view 
                        class="elderly-grid-item" 
                        v-for="(item, index) in filteredServices" 
                        :key="index"
                        @tap="requestService" 
                        :data-type="item.type"
                    >
                        <view class="elderly-grid-icon">{{ item.emoji }}</view>
                        <text class="elderly-grid-text">{{ item.title }}</text>
                    </view>
                </view>
            </view>

            <!-- 健康资讯 -->
            <view class="elderly-card">
                <view class="services-header">
                    <text class="elderly-title">健康资讯</text>
                    <text class="elderly-text-small" @tap="viewMoreNews">更多</text>
                </view>
                <view class="elderly-list">
                    <view 
                        class="elderly-list-item" 
                        v-for="(item, index) in healthNews" 
                        :key="index"
                        @tap="viewNewsDetail"
                        :data-id="item.id"
                    >
                        <view class="elderly-list-icon">{{ item.emoji }}</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">{{ item.title }}</text>
                            <text class="elderly-list-desc">{{ item.desc }}</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>
                </view>
            </view>

            <!-- 服务记录 -->
            <view class="elderly-card">
                <view class="services-header">
                    <text class="elderly-title">服务记录</text>
                    <picker @change="filterHistory" :value="historyFilter" :range="historyFilters">
                        <view class="filter-btn">{{ historyFilters[historyFilter] }}</view>
                    </picker>
                </view>
                <view class="elderly-list">
                    <view 
                        class="elderly-list-item" 
                        v-for="(item, index) in filteredHistory" 
                        :key="index"
                        @tap="viewHistoryDetail"
                        :data-id="item.id"
                    >
                        <view class="elderly-list-icon">{{ item.emoji }}</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">{{ item.type }}</text>
                            <text class="elderly-list-desc">{{ item.provider }} · {{ item.date }}</text>
                            <view class="service-info">
                                <text class="elderly-text-small">费用: {{ item.cost }}</text>
                            </view>
                        </view>
                        <view class="elderly-status" :class="item.statusClass">
                            {{ item.status }}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 服务请求模态框 -->
        <view class="service-modal" v-if="showServiceModal">
            <view class="modal-content elderly-card">
                <text class="elderly-title">{{ currentService.title }}服务</text>
                
                <view class="service-details">
                    <view class="detail-item">
                        <text class="elderly-text">服务地址</text>
                        <text class="detail-value">肇庆市端州区星湖大道78号</text>
                    </view>
                    <view class="detail-item">
                        <text class="elderly-text">预计费用</text>
                        <text class="detail-value">{{ currentService.price }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="elderly-text">预计时间</text>
                        <text class="detail-value">{{ currentService.time }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="elderly-text">服务说明</text>
                        <text class="detail-value">{{ currentService.desc }}</text>
                    </view>
                </view>
                
                <view class="form-buttons">
                    <button class="elderly-btn elderly-btn-secondary" @tap="closeServiceModal">取消</button>
                    <button class="elderly-btn" @tap="confirmService">确认预约</button>
                </view>
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
            currentCategory: 'all',
            showServiceModal: false,
            historyFilter: 0,
            historyFilters: ['全部', '进行中', '已完成'],
            
            categories: [
                { id: 'all', name: '全部' },
                { id: 'emergency', name: '紧急' },
                { id: 'daily', name: '日常' },
                { id: 'health', name: '健康' },
                { id: 'special', name: '特色' }
            ],
            
            currentService: {
                title: '',
                price: '',
                time: '',
                desc: ''
            },

            services: [
                {
                    type: 'homeCare',
                    emoji: '💉',
                    title: '上门护理',
                    category: 'daily',
                    price: '¥120/次',
                    time: '明天 上午 9:00-12:00',
                    desc: '专业护士上门提供基础医疗服务'
                },
                {
                    type: 'delivery',
                    emoji: '📦',
                    title: '送药上门',
                    category: 'daily',
                    price: '免费',
                    time: '2小时内送达',
                    desc: '处方药品快速配送服务'
                },
                {
                    type: 'consultation',
                    emoji: '👨‍⚕️',
                    title: '专家咨询',
                    category: 'health',
                    price: '¥80/次',
                    time: '随时可约',
                    desc: '三甲医院专家在线问诊'
                },
                {
                    type: 'ambulance',
                    emoji: '🚑',
                    title: '一键急救',
                    category: 'emergency',
                    price: '免费',
                    time: '立即响应',
                    desc: '紧急情况快速响应服务'
                },
                {
                    type: 'rehabilitation',
                    emoji: '🛠️',
                    title: '康复理疗',
                    category: 'health',
                    price: '¥150/次',
                    time: '明天 10:00-17:00',
                    desc: '专业康复师上门服务'
                },
                {
                    type: 'psychological',
                    emoji: '😊',
                    title: '心理关怀',
                    category: 'special',
                    price: '¥100/次',
                    time: '预约后1小时内',
                    desc: '专业心理咨询师服务'
                },
                {
                    type: 'massage',
                    emoji: '💆‍♂️',
                    title: '中医推拿',
                    category: 'special',
                    price: '¥120/次',
                    time: '明天 14:00-20:00',
                    desc: '传统中医理疗按摩'
                },
                {
                    type: 'meal',
                    emoji: '🍱',
                    title: '助餐服务',
                    category: 'daily',
                    price: '¥25/餐',
                    time: '每日11:30-12:30',
                    desc: '营养师搭配的健康餐食'
                }
            ],

            resources: [
                {
                    name: '肇庆市第一人民医院',
                    emoji: '🏥',
                    type: 'hospital',
                    top: 20,
                    left: 30
                },
                {
                    name: '端州区社区卫生服务中心',
                    emoji: '🏥',
                    type: 'clinic',
                    top: 40,
                    left: 60
                },
                {
                    name: '康禾医养服务中心',
                    emoji: '🏥',
                    type: 'service',
                    top: 60,
                    left: 20
                },
                {
                    name: '星湖药店',
                    emoji: '💊',
                    type: 'pharmacy',
                    top: 80,
                    left: 70
                }
            ],

            healthNews: [
                {
                    id: 1,
                    emoji: '📰',
                    title: '老年人高血压管理指南',
                    desc: '科学管理血压，预防并发症'
                },
                {
                    id: 2,
                    emoji: '🥗',
                    title: '适合老年人的营养搭配',
                    desc: '合理膳食，健康生活'
                },
                {
                    id: 3,
                    emoji: '🏃',
                    title: '老年人运动注意事项',
                    desc: '适度运动，增强体质'
                }
            ],

            serviceHistory: [
                {
                    id: 1,
                    type: '上门护理',
                    emoji: '💉',
                    provider: '李护士',
                    date: '2024-01-15',
                    cost: '¥120',
                    status: '已完成',
                    statusClass: 'elderly-status-normal'
                },
                {
                    id: 2,
                    type: '专家咨询',
                    emoji: '👨‍⚕️',
                    provider: '王医生',
                    date: '2024-01-14',
                    cost: '¥80',
                    status: '进行中',
                    statusClass: 'elderly-status-warning'
                },
                {
                    id: 3,
                    type: '送药上门',
                    emoji: '📦',
                    provider: '张药师',
                    date: '2024-01-13',
                    cost: '免费',
                    status: '已完成',
                    statusClass: 'elderly-status-normal'
                }
            ]
        }
    },
    computed: {
        filteredServices() {
            if (this.currentCategory === 'all') {
                return this.services
            }
            return this.services.filter(service => service.category === this.currentCategory)
        },
        filteredHistory() {
            if (this.historyFilter === 0) {
                return this.serviceHistory
            }
            const statusMap = ['', '进行中', '已完成']
            return this.serviceHistory.filter(item => item.status === statusMap[this.historyFilter])
        }
    },
    methods: {
        // 切换服务分类
        changeCategory(e) {
            this.currentCategory = e.currentTarget.dataset.category
        },
        
        // 请求服务
        requestService(e) {
            const type = e.currentTarget.dataset.type
            const service = this.services.find(s => s.type === type)
            if (service) {
                this.currentService = service
                this.showServiceModal = true
            }
        },
        
        // 关闭服务模态框
        closeServiceModal() {
            this.showServiceModal = false
        },
        
        // 确认服务
        confirmService() {
            this.showServiceModal = false
            uni.showToast({
                title: '服务预约成功',
                icon: 'success'
            })
        },
        
        // 查看更多新闻
        viewMoreNews() {
            uni.navigateTo({
                url: '/pages/news/list'
            })
        },
        
        // 查看新闻详情
        viewNewsDetail(e) {
            const id = e.currentTarget.dataset.id
            uni.navigateTo({
                url: `/pages/news/detail?id=${id}`
            })
        },
        
        // 筛选历史记录
        filterHistory(e) {
            this.historyFilter = e.detail.value
        },
        
        // 查看历史详情
        viewHistoryDetail(e) {
            const id = e.currentTarget.dataset.id
            uni.navigateTo({
                url: `/pages/service/detail?id=${id}`
            })
        }
    }
}
</script>

<style lang="scss">
@import '@/common/elderly-styles.scss';

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.category-item {
  padding: 25rpx 20rpx;
  font-size: $elderly-font-size-base;
  color: #666;
  border-radius: $elderly-border-radius;
  transition: all 0.3s ease;
  text-align: center;
  background: #f8f9fa;
  
  &.active {
    background: $zhaoqing-gradient;
    color: white;
    font-weight: bold;
  }
}

.map-container {
  position: relative;
  height: 400rpx;
  background: #f8f9fa;
  border-radius: $elderly-border-radius;
  margin-top: 20rpx;
}

.map-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.resource-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .resource-dot {
    font-size: 40rpx;
    margin-bottom: 10rpx;
  }
  
  .resource-label {
    font-size: $elderly-font-size-sm;
    color: #666;
    text-align: center;
    max-width: 120rpx;
  }
}

.location-marker {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .location-dot {
    font-size: 40rpx;
    margin-bottom: 10rpx;
  }
  
  .location-label {
    font-size: $elderly-font-size-sm;
    color: #666;
  }
}

.filter-btn {
  background: rgba(25, 190, 107, 0.1);
  color: $elderly-color-primary;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: $elderly-font-size-sm;
}

.service-info {
  margin-top: 10rpx;
}

.service-modal {
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

.service-details {
  margin: 30rpx 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .elderly-text {
    color: #666;
  }
  
  .detail-value {
    font-size: $elderly-font-size-base;
    color: #333;
    font-weight: bold;
  }
}

.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
</style>
