<template>
	<view class="container">
		<view class="status-list">
			<view class="status-item" v-for="(status, index) in statusList" :key="index">
				<view class="member-avatar">
					<text class="avatar-text">{{ status.memberName.charAt(0) }}</text>
				</view>
				<view class="status-content">
					<view class="status-header">
						<text class="member-name">{{ status.memberName }}</text>
						<text class="status-time">{{ status.time }}</text>
					</view>
					<view class="status-message">{{ status.message }}</view>
					<view class="status-data" v-if="status.data">
						<text class="data-label">{{ status.data.label }}:</text>
						<text class="data-value" :class="status.data.status">{{ status.data.value }}</text>
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
			statusList: [
				{
					memberName: '父亲',
					time: '10分钟前',
					message: '已按时服用降压药',
					data: {
						label: '血压',
						value: '120/80 mmHg',
						status: 'normal'
					}
				},
				{
					memberName: '母亲',
					time: '30分钟前',
					message: '血糖检测完成',
					data: {
						label: '血糖',
						value: '6.2 mmol/L',
						status: 'warning'
					}
				},
				{
					memberName: '小明',
					time: '1小时前',
					message: '完成今日运动计划',
					data: {
						label: '步数',
						value: '8000步',
						status: 'normal'
					}
				}
			]
		}
	},
	methods: {
		
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.status-list {
	background-color: white;
	border-radius: 20rpx;
	padding: 20rpx;
}

.status-item {
	display: flex;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.status-item:last-child {
	border-bottom: none;
}

.member-avatar {
	width: 80rpx;
	height: 80rpx;
	background-color: #19be6b;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
}

.avatar-text {
	color: white;
	font-size: 32rpx;
	font-weight: bold;
}

.status-content {
	flex: 1;
}

.status-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.member-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.status-time {
	font-size: 24rpx;
	color: #999;
}

.status-message {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 15rpx;
	line-height: 1.5;
}

.status-data {
	display: flex;
	align-items: center;
}

.data-label {
	font-size: 26rpx;
	color: #666;
	margin-right: 10rpx;
}

.data-value {
	font-size: 26rpx;
	font-weight: bold;
}

.data-value.normal {
	color: #19be6b;
}

.data-value.warning {
	color: #ffc107;
}

.data-value.danger {
	color: #ff4757;
}
</style> 