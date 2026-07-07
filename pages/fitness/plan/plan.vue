<template>
	<view class="container">
		<view class="header">
			<text class="title">运动计划</text>
			<button class="add-btn" @tap="addPlan">制定计划</button>
		</view>
		
		<view class="plan-list">
			<view class="plan-item" v-for="(plan, index) in plans" :key="index">
				<view class="plan-header">
					<text class="plan-name">{{ plan.name }}</text>
					<text class="plan-status" :class="plan.status">{{ plan.statusText }}</text>
				</view>
				<view class="plan-details">
					<view class="detail-item">
						<text class="detail-label">运动类型:</text>
						<text class="detail-value">{{ plan.type }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">时长:</text>
						<text class="detail-value">{{ plan.duration }}分钟</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">频率:</text>
						<text class="detail-value">{{ plan.frequency }}</text>
					</view>
				</view>
				<view class="plan-progress">
					<text class="progress-text">完成进度: {{ plan.progress }}%</text>
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: plan.progress + '%' }"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			plans: [
				{
					name: '每日步行计划',
					type: '步行',
					duration: 30,
					frequency: '每天',
					status: 'active',
					statusText: '进行中',
					progress: 75
				},
				{
					name: '力量训练计划',
					type: '力量训练',
					duration: 45,
					frequency: '每周3次',
					status: 'active',
					statusText: '进行中',
					progress: 60
				},
				{
					name: '瑜伽放松计划',
					type: '瑜伽',
					duration: 20,
					frequency: '每周2次',
					status: 'completed',
					statusText: '已完成',
					progress: 100
				}
			]
		}
	},
	methods: {
		addPlan() {
			uni.navigateTo({
				url: '/pages/fitness/plan/create'
			});
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.add-btn {
	background-color: #19be6b;
	color: white;
	border: none;
	border-radius: 10rpx;
	padding: 15rpx 30rpx;
	font-size: 28rpx;
}

.plan-list {
	background-color: white;
	border-radius: 20rpx;
	padding: 20rpx;
}

.plan-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;
}

.plan-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
}

.plan-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.plan-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.plan-status {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
}

.plan-status.active {
	background-color: #e8f5e8;
	color: #19be6b;
}

.plan-status.completed {
	background-color: #f8f9fa;
	color: #6c757d;
}

.plan-details {
	margin-bottom: 20rpx;
}

.detail-item {
	display: flex;
	margin-bottom: 10rpx;
}

.detail-label {
	font-size: 26rpx;
	color: #666;
	width: 120rpx;
}

.detail-value {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
}

.plan-progress {
	margin-top: 20rpx;
}

.progress-text {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	display: block;
}

.progress-bar {
	height: 10rpx;
	background-color: #f0f0f0;
	border-radius: 5rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: #19be6b;
	border-radius: 5rpx;
	transition: width 0.3s ease;
}
</style> 