<template>
	<view class="container">
		<view class="header">
			<text class="title">年度健康报告</text>
			<view class="year">{{ year }}</view>
		</view>
		
		<view class="summary-section">
			<text class="section-title">年度总结</text>
			<view class="summary-content">
				<text class="summary-text">{{ annualSummary }}</text>
			</view>
		</view>
		
		<view class="stats-section">
			<text class="section-title">年度数据</text>
			<view class="stats-grid">
				<view class="stat-item">
					<text class="stat-value">{{ annualStats.totalSteps }}</text>
					<text class="stat-label">总步数</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ annualStats.totalDistance }}</text>
					<text class="stat-label">总距离(km)</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ annualStats.totalCalories }}</text>
					<text class="stat-label">消耗卡路里</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ annualStats.healthyDays }}</text>
					<text class="stat-label">健康天数</text>
				</view>
			</view>
		</view>
		
		<view class="achievements-section">
			<text class="section-title">年度成就</text>
			<view class="achievements-list">
				<view class="achievement-item" v-for="(achievement, index) in achievements" :key="index">
					<view class="achievement-badge">🏅</view>
					<view class="achievement-content">
						<text class="achievement-title">{{ achievement.title }}</text>
						<text class="achievement-desc">{{ achievement.description }}</text>
						<text class="achievement-date">{{ achievement.date }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="trends-section">
			<text class="section-title">健康趋势</text>
			<view class="trend-chart">
				<canvas canvas-id="annualChart" class="chart"></canvas>
			</view>
		</view>
		
		<view class="recommendations-section">
			<text class="section-title">来年建议</text>
			<view class="recommendations-list">
				<view class="recommendation-item" v-for="(rec, index) in recommendations" :key="index">
					<text class="rec-icon">📋</text>
					<text class="rec-text">{{ rec }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			year: '2024',
			annualSummary: '2024年整体健康状况良好，运动习惯稳定，各项指标保持正常范围。通过持续的健康管理，生活质量得到显著提升。',
			annualStats: {
				totalSteps: 1876500,
				totalDistance: 1250,
				totalCalories: 85000,
				healthyDays: 340
			},
			achievements: [
				{
					title: '运动达人',
					description: '全年累计步数超过180万步',
					date: '2024年12月'
				},
				{
					title: '健康卫士',
					description: '连续12个月血压、心率保持稳定',
					date: '2024年12月'
				},
				{
					title: '睡眠专家',
					description: '平均睡眠时长达到7.5小时',
					date: '2024年11月'
				},
				{
					title: '营养达人',
					description: '坚持健康饮食，体重管理良好',
					date: '2024年10月'
				}
			],
			recommendations: [
				'继续保持规律运动，适当增加力量训练',
				'关注心理健康，保持积极乐观的心态',
				'定期体检，预防慢性疾病',
				'改善睡眠质量，建立更好的作息习惯',
				'增加社交活动，保持身心健康'
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
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.year {
	font-size: 28rpx;
	color: #19be6b;
	font-weight: bold;
}

.summary-section {
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

.summary-content {
	
}

.summary-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.stats-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30rpx;
}

.stat-item {
	text-align: center;
	padding: 30rpx;
	background-color: #f8f9fa;
	border-radius: 15rpx;
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

.achievements-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.achievements-list {
	
}

.achievement-item {
	display: flex;
	align-items: flex-start;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.achievement-item:last-child {
	border-bottom: none;
}

.achievement-badge {
	font-size: 48rpx;
	margin-right: 20rpx;
}

.achievement-content {
	flex: 1;
}

.achievement-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.achievement-desc {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 8rpx;
}

.achievement-date {
	font-size: 22rpx;
	color: #999;
}

.trends-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.trend-chart {
	height: 400rpx;
}

.chart {
	width: 100%;
	height: 100%;
}

.recommendations-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
}

.recommendations-list {
	
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