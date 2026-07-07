<template>
  <view class="emoji-tabbar">
    <view 
      class="tab-item" 
      v-for="(item, index) in tabList" 
      :key="index"
      @tap="switchTab(item.pagePath)"
      :class="{ active: currentPath === item.pagePath }"
    >
      <view class="tab-icon">{{ item.icon }}</view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EmojiTabbar',
  data() {
    return {
      currentPath: '/pages/index/index',
      tabList: [
        {
          pagePath: '/pages/index/index',
          text: '首页',
          icon: '🏠'
        },
        {
          pagePath: '/pages/service/service',
          text: '服务',
          icon: '🩺'
        },
        {
          pagePath: '/pages/health/health',
          text: '健康',
          icon: '❤️'
        },
        {
          pagePath: '/pages/family/family',
          text: '家庭',
          icon: '👨‍👩‍👧'
        },
        {
          pagePath: '/pages/profile/profile',
          text: '我的',
          icon: '👤'
        }
      ]
    }
  },
  mounted() {
    this.updateCurrentPath()
  },
  onLoad() {
    this.updateCurrentPath()
  },
  onShow() {
    this.updateCurrentPath()
  },
  methods: {
    updateCurrentPath() {
      // 获取当前页面路径
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1]
        const route = '/' + currentPage.route
        this.currentPath = route
        console.log('当前页面路径:', route)
      }
    },
    switchTab(path) {
      if (this.currentPath !== path) {
        console.log('切换到页面:', path)
        uni.switchTab({
          url: path,
          success: () => {
            this.currentPath = path
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #ffffff;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.tab-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
  transition: all 0.3s ease;
}

.tab-text {
  font-size: 24rpx;
  color: #999999;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-item.active {
  .tab-icon {
    transform: scale(1.1);
  }
  
  .tab-text {
    color: #19be6b;
    font-weight: bold;
  }
}

/* 响应式设计 */
@media (min-width: 768rpx) {
  .emoji-tabbar {
    height: 140rpx;
  }
  
  .tab-icon {
    font-size: 56rpx;
    margin-bottom: 12rpx;
  }
  
  .tab-text {
    font-size: 28rpx;
  }
}

/* 为底部内容添加安全距离 */
.elderly-container {
  padding-bottom: 140rpx;
  
  @media (min-width: 768rpx) {
    padding-bottom: 160rpx;
  }
}
</style> 