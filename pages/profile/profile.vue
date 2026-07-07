<template>
    <!-- pages/profile/profile.wxml -->
    <view class="elderly-container">
        <!-- 左侧内容区域 -->
        <view class="elderly-sidebar">
            <!-- 用户信息卡片 -->
            <view class="elderly-card">
                <view class="user-header">
                    <image :src="user.avatar" class="user-avatar"></image>
                    <view class="user-info">
                        <text class="elderly-title">{{ user.name }} ({{ user.age }}岁)</text>
                        <text class="elderly-text">{{ user.membership }}</text>
                        <view class="health-score">
                            <text class="score-value">{{ user.healthScore }}</text>
                            <text class="score-label">健康指数</text>
                        </view>
                    </view>
                </view>

                <view class="stats-grid">
                    <view class="stat-item">
                        <text class="stat-value">{{ user.serviceCount }}</text>
                        <text class="elderly-text-small">服务次数</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-value">{{ user.points }}</text>
                        <text class="elderly-text-small">服务积分</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-value">{{ user.unreadMessages }}</text>
                        <text class="elderly-text-small">未读消息</text>
                    </view>
                </view>
            </view>

            <!-- 系统设置 -->
            <view class="elderly-card">
                <view class="elderly-title">系统设置</view>
                <view class="elderly-list">
                    <view class="elderly-list-item" @tap="showFontSettings">
                        <view class="elderly-list-icon">🔠</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">字体大小</text>
                            <text class="elderly-list-desc">调整界面字体大小</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>

                    <view class="elderly-list-item" @tap="navigateToPage" data-page="settings">
                        <view class="elderly-list-icon">⚙️</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">系统设置</text>
                            <text class="elderly-list-desc">账户和通知设置</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>

                    <view class="elderly-list-item" @tap="navigateToPage" data-page="support">
                        <view class="elderly-list-icon">❓</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">帮助与客服</text>
                            <text class="elderly-list-desc">常见问题和联系客服</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>

                    <view class="elderly-list-item" @tap="logout">
                        <view class="elderly-list-icon">🚪</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">退出登录</text>
                            <text class="elderly-list-desc">安全退出当前账户</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 右侧内容区域 -->
        <view class="elderly-main-content">
            <!-- 功能菜单 -->
            <view class="elderly-card">
                <view class="elderly-title">账户设置</view>
                <view class="elderly-list">
                    <view class="elderly-list-item" @tap="navigateToPage" data-page="family">
                        <view class="elderly-list-icon">👨‍👩‍👧</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">家庭账号</text>
                            <text class="elderly-list-desc">管理家庭成员和权限</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>

                    <view class="elderly-list-item" @tap="navigateToPage" data-page="privacy">
                        <view class="elderly-list-icon">🔒</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">隐私设置</text>
                            <text class="elderly-list-desc">管理个人信息可见性</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>

                    <view class="elderly-list-item" @tap="navigateToPage" data-page="message">
                        <view class="elderly-list-icon">📨</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">消息中心</text>
                            <text class="elderly-list-desc">查看系统通知和提醒</text>
                        </view>
                        <view class="elderly-status elderly-status-warning" v-if="user.unreadMessages > 0">
                            {{ user.unreadMessages }}
                        </view>
                        <view class="elderly-list-arrow" v-else>></view>
                    </view>

                    <view class="elderly-list-item" @tap="navigateToPage" data-page="device">
                        <view class="elderly-list-icon">📱</view>
                        <view class="elderly-list-content">
                            <text class="elderly-list-title">设备管理</text>
                            <text class="elderly-list-desc">管理健康监测设备</text>
                        </view>
                        <view class="elderly-list-arrow">></view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 字体设置模态框 -->
        <view class="font-modal" v-if="showFontModal">
            <view class="modal-content elderly-card">
                <text class="elderly-title">字体大小设置</text>
                
                <view class="font-options">
                    <view 
                        class="font-option" 
                        v-for="(item, index) in fontSizes" 
                        :key="index"
                        @tap="selectFontSize"
                        :data-size="item.size"
                    >
                        <view class="font-radio" :class="currentFontSize === item.size ? 'active' : ''">
                            <text v-if="currentFontSize === item.size">✓</text>
                        </view>
                        <view class="font-info">
                            <text class="font-label">{{ item.label }}</text>
                            <text :class="'font-preview ' + item.size">示例文本：康禾医养让健康管理更简单</text>
                        </view>
                    </view>
                </view>
                
                <view class="form-buttons">
                    <button class="elderly-btn elderly-btn-secondary" @tap="closeFontModal">取消</button>
                    <button class="elderly-btn" @tap="confirmFontSize">确认</button>
                </view>
            </view>
        </view>

        <!-- 自定义Emoji TabBar -->
        <emoji-tabbar></emoji-tabbar>
    </view>
</template>

<script>
// pages/profile/profile.js
const app = getApp();
export default {
    data() {
        return {
            user: {
                avatar: '/static/images/logo.png',
                name: '张明惠',
                age: 68,
                membership: '金卡会员',
                healthScore: 98,
                serviceCount: 36,
                points: 128,
                unreadMessages: 3
            },
            fontSizes: [
                {
                    size: 'normal',
                    label: '标准'
                },
                {
                    size: 'large',
                    label: '大号'
                },
                {
                    size: 'xlarge',
                    label: '加大'
                },
                {
                    size: 'xxlarge',
                    label: '特大'
                }
            ],
            currentFontSize: 'normal',
            showFontModal: false
        };
    },
    onLoad() {
        const savedFontSize = app.globalData.fontSize || 'normal';
        this.setData({
            currentFontSize: savedFontSize
        });
        this.syncHealthScore(); // 同步健康指数
    },
    onShow() {
        this.syncHealthScore(); // 每次显示页面时同步健康指数
    },
    methods: {
        logout() {
            uni.showModal({
                title: '确定退出登录？',
                content: '退出后仍可查看公共内容',
                success: (res) => {
                    if (res.confirm) {
                        app.globalData.userInfo = null;
                        app.globalData.token = null;
                        uni.redirectTo({
                            url: '/pages/login/login'
                        });
                    }
                }
            });
        },

        showFontSettings() {
            this.setData({
                showFontModal: true
            });
        },

        closeFontModal() {
            this.setData({
                showFontModal: false
            });
        },

        selectFontSize(e) {
            const size = e.currentTarget.dataset.size;
            this.setData({
                currentFontSize: size
            });
        },

        confirmFontSize() {
            const { currentFontSize } = this;
            app.globalData.setFontSize(currentFontSize);
            this.closeFontModal();
            uni.showToast({
                title: '字体设置已更新',
                icon: 'success'
            });
        },

        navigateToPage(e) {
            const page = e.currentTarget.dataset.page;
            const pageMap = {
                family: '/pages/family/family',
                privacy: '/pages/privacy/settings',
                message: '/pages/message/center',
                device: '/pages/device/list',
                settings: '/pages/settings/index',
                support: '/pages/support/index'
            };
            
            if (pageMap[page]) {
                uni.navigateTo({
                    url: pageMap[page]
                });
            }
        },

        syncHealthScore() {
            // 从全局数据获取健康指数，如果没有则生成新的
            const app = getApp();
            if (app.globalData.healthScore) {
                this.user.healthScore = app.globalData.healthScore;
            } else {
                // 生成85-98之间的健康指数
                this.user.healthScore = Math.floor(Math.random() * 14) + 85;
                app.globalData.healthScore = this.user.healthScore;
            }
        }
    }
};
</script>
<style lang="scss">
@import '@/common/elderly-styles.scss';

/* 用户卡片 */
.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 3rpx solid #f1f9f4;
  margin-right: 20rpx;
}

.user-info {
  flex: 1;
}

.health-score {
  margin-top: 15rpx;
  display: flex;
  align-items: center;
}

.score-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #19be6b;
  margin-right: 10rpx;
}

.score-label {
  font-size: 24rpx;
  color: #666;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.stat-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
  text-align: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #19be6b;
  margin-bottom: 8rpx;
  display: block;
}

/* 字体设置模态框 */
.font-modal {
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
  
  /* 确保所有交互元素不被遮挡 */
  .elderly-btn {
    position: relative;
    z-index: 3001;
  }
  
  .font-option {
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

.font-options {
  margin: 30rpx 0;
}

.font-option {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.font-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  
  &.active {
    background: #19be6b;
    border-color: #19be6b;
    color: white;
  }
}

.font-info {
  flex: 1;
  text-align: left;
}

.font-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.font-preview {
  display: block;
  color: #666;
  
  &.normal {
    font-size: 28rpx;
  }
  
  &.large {
    font-size: 32rpx;
  }
  
  &.xlarge {
    font-size: 36rpx;
  }
  
  &.xxlarge {
    font-size: 40rpx;
  }
}

.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
</style>
