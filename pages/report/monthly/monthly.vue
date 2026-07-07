<template>
	<view class="container">
		<view class="header">
			<text class="title">健康月报</text>
			<view class="date-range">{{ dateRange }}</view>
		</view>
		
		<view class="overview-section">
			<text class="section-title">月度概览</text>
			<view class="overview-grid">
				<view class="overview-item">
					<text class="item-label">总步数</text>
					<text class="item-value">{{ monthlyStats.totalSteps }}</text>
					<text class="item-unit">步</text>
				</view>
				<view class="overview-item">
					<text class="item-label">平均心率</text>
					<text class="item-value">{{ monthlyStats.avgHeartRate }}</text>
					<text class="item-unit">bpm</text>
				</view>
				<view class="overview-item">
					<text class="item-label">睡眠时长</text>
					<text class="item-value">{{ monthlyStats.avgSleep }}</text>
					<text class="item-unit">小时</text>
				</view>
				<view class="overview-item">
					<text class="item-label">健康天数</text>
					<text class="item-value">{{ monthlyStats.healthyDays }}</text>
					<text class="item-unit">天</text>
				</view>
			</view>
		</view>
		
		<view class="achievement-section">
			<text class="section-title">月度成就</text>
			<view class="achievement-list">
				<view class="achievement-item" v-for="(achievement, index) in achievements" :key="index">
					<view class="achievement-icon">🏆</view>
					<view class="achievement-content">
						<text class="achievement-title">{{ achievement.title }}</text>
						<text class="achievement-desc">{{ achievement.description }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="analysis-section">
			<text class="section-title">健康分析</text>
			<view class="analysis-content">
				<text class="analysis-text">{{ monthlyStats.analysis }}</text>
			</view>
		</view>
		
		<view class="goals-section">
			<text class="section-title">下月目标</text>
			<view class="goals-list">
				<view class="goal-item" v-for="(goal, index) in nextMonthGoals" :key="index">
					<text class="goal-icon">🎯</text>
					<text class="goal-text">{{ goal }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dateRange: '2024年1月',
			monthlyStats: {
				totalSteps: 156800,
				avgHeartRate: 73,
				avgSleep: 7.5,
				healthyDays: 28,
				analysis: '本月整体健康状况良好，运动量达标，睡眠质量稳定。建议继续保持规律作息，适当增加有氧运动强度。'
			},
			achievements: [
				{
					title: '运动达人',
					description: '连续30天完成每日步数目标'
				},
				{
					title: '睡眠专家',
					description: '本月平均睡眠时长达到7.5小时'
				},
				{
					title: '健康卫士',
					description: '血压、心率等指标保持稳定'
				}
			],
			nextMonthGoals: [
				'增加力量训练，每周至少2次',
				'改善睡眠质量，提高深度睡眠时间',
				'增加蔬菜水果摄入，改善饮食习惯',
				'定期进行健康检查，预防疾病'
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

.overview-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	display: block;
}

.overview-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30rpx;
}

.overview-item {
	text-align: center;
	padding: 30rpx;
	background-color: #f8f9fa;
	border-radius: 15rpx;
}

.item-label {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 15rpx;
}

.item-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #19be6b;
	display: block;
	margin-bottom: 5rpx;
}

.item-unit {
	font-size: 20rpx;
	color: #999;
}

.achievement-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.achievement-list {
	
}

.achievement-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.achievement-item:last-child {
	border-bottom: none;
}

.achievement-icon {
	font-size: 40rpx;
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
	margin-bottom: 5rpx;
}

.achievement-desc {
	font-size: 24rpx;
	color: #666;
}

.analysis-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.analysis-content {
	
}

.analysis-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.goals-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
}

.goals-list {
	
}

.goal-item {
	display: flex;
	align-items: flex-start;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.goal-item:last-child {
	border-bottom: none;
}

.goal-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
	margin-top: 5rpx;
}

.goal-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	flex: 1;
}
</style> 