<template>
	<view class="container">
		<view class="header">
			<text class="title">健康周报</text>
			<view class="date-range">{{ dateRange }}</view>
		</view>
		
		<view class="summary-cards">
			<view class="summary-card">
				<text class="card-title">本周步数</text>
				<text class="card-value">{{ weeklyStats.steps }}</text>
				<text class="card-unit">步</text>
			</view>
			<view class="summary-card">
				<text class="card-title">平均心率</text>
				<text class="card-value">{{ weeklyStats.heartRate }}</text>
				<text class="card-unit">bpm</text>
			</view>
			<view class="summary-card">
				<text class="card-title">睡眠时长</text>
				<text class="card-value">{{ weeklyStats.sleep }}</text>
				<text class="card-unit">小时</text>
			</view>
		</view>
		
		<view class="health-score">
			<text class="score-title">本周健康评分</text>
			<view class="score-circle">
				<text class="score-value">{{ weeklyStats.healthScore }}</text>
				<text class="score-unit">分</text>
			</view>
			<text class="score-comment">{{ weeklyStats.comment }}</text>
		</view>
		
		<view class="trend-section">
			<text class="section-title">健康趋势</text>
			<view class="trend-chart">
				<canvas canvas-id="weeklyChart" class="chart"></canvas>
			</view>
		</view>
		
		<view class="recommendations">
			<text class="section-title">健康建议</text>
			<view class="recommendation-list">
				<view class="recommendation-item" v-for="(item, index) in recommendations" :key="index">
					<text class="rec-icon">💡</text>
					<text class="rec-text">{{ item }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dateRange: '2024年1月8日 - 1月14日',
			weeklyStats: {
				steps: 45680,
				heartRate: 72,
				sleep: 7.2,
				healthScore: 85,
				comment: '本周健康状况良好，继续保持！'
			},
			recommendations: [
				'建议增加有氧运动时间，每周至少150分钟',
				'注意保持规律作息，确保充足睡眠',
				'多摄入蔬菜水果，保持营养均衡',
				'定期监测血压，保持健康生活方式'
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

.header {
	text-align: center;
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.date-range {
	font-size: 24rpx;
	color: #666;
}

.summary-cards {
	display: flex;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.summary-card {
	flex: 1;
	background-color: white;
	border-radius: 15rpx;
	padding: 30rpx;
	text-align: center;
}

.card-title {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 15rpx;
}

.card-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #19be6b;
	display: block;
	margin-bottom: 5rpx;
}

.card-unit {
	font-size: 20rpx;
	color: #999;
}

.health-score {
	background-color: white;
	border-radius: 20rpx;
	padding: 40rpx;
	text-align: center;
	margin-bottom: 30rpx;
}

.score-title {
	font-size: 28rpx;
	color: #333;
	display: block;
	margin-bottom: 30rpx;
}

.score-circle {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #19be6b, #00d4aa);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 auto 30rpx;
}

.score-value {
	font-size: 48rpx;
	font-weight: bold;
	color: white;
}

.score-unit {
	font-size: 24rpx;
	color: white;
}

.score-comment {
	font-size: 26rpx;
	color: #666;
}

.trend-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.trend-chart {
	height: 300rpx;
}

.chart {
	width: 100%;
	height: 100%;
}

.recommendations {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
}

.recommendation-list {
	
}

.recommendation-item {
	display: flex;
	align-items: flex-start;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.recommendation-item:last-child {
	border-bottom: none;
}

.rec-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
	margin-top: 5rpx;
}

.rec-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	flex: 1;
}
</style> 