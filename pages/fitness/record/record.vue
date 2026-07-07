<template>
	<view class="container">
		<view class="header">
			<text class="title">运动记录</text>
			<button class="add-btn" @tap="addRecord">记录运动</button>
		</view>
		
		<view class="stats-cards">
			<view class="stat-card">
				<text class="stat-value">{{ todayStats.steps }}</text>
				<text class="stat-label">今日步数</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ todayStats.distance }}</text>
				<text class="stat-label">距离(km)</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ todayStats.calories }}</text>
				<text class="stat-label">消耗卡路里</text>
			</view>
		</view>
		
		<view class="record-list">
			<view class="record-item" v-for="(record, index) in records" :key="index">
				<view class="record-header">
					<text class="record-type">{{ record.type }}</text>
					<text class="record-date">{{ record.date }}</text>
				</view>
				<view class="record-details">
					<view class="detail-row">
						<text class="detail-label">时长:</text>
						<text class="detail-value">{{ record.duration }}分钟</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">距离:</text>
						<text class="detail-value">{{ record.distance }}km</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">消耗:</text>
						<text class="detail-value">{{ record.calories }}卡路里</text>
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
			todayStats: {
				steps: 8500,
				distance: 6.2,
				calories: 320
			},
			records: [
				{
					type: '晨跑',
					date: '2024-01-15',
					duration: 30,
					distance: 3.5,
					calories: 180
				},
				{
					type: '步行',
					date: '2024-01-14',
					duration: 45,
					distance: 2.8,
					calories: 140
				},
				{
					type: '力量训练',
					date: '2024-01-13',
					duration: 60,
					distance: 0,
					calories: 250
				}
			]
		}
	},
	methods: {
		addRecord() {
			uni.navigateTo({
				url: '/pages/fitness/record/add'
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

.stats-cards {
	display: flex;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.stat-card {
	flex: 1;
	background-color: white;
	border-radius: 15rpx;
	padding: 30rpx;
	text-align: center;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #19be6b;
	display: block;
	margin-bottom: 10rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #666;
}

.record-list {
	background-color: white;
	border-radius: 20rpx;
	padding: 20rpx;
}

.record-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;
}

.record-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
}

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.record-type {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.record-date {
	font-size: 24rpx;
	color: #999;
}

.record-details {
	
}

.detail-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.detail-label {
	font-size: 26rpx;
	color: #666;
}

.detail-value {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
}
</style> 