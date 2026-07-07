<template>
	<view class="container">
		<view class="data-overview">
			<view class="overview-title">健康数据概览</view>
			<view class="data-grid">
				<view class="data-item" @tap="showDetail" data-type="heartRate">
					<view class="data-icon">❤️</view>
					<text class="data-value">{{ healthData.heartRate }}</text>
					<text class="data-label">心率(bpm)</text>
					<text class="data-status" :class="healthData.heartRateStatus">{{ healthData.heartRateText }}</text>
				</view>
				<view class="data-item" @tap="showDetail" data-type="bloodPressure">
					<view class="data-icon">🩸</view>
					<text class="data-value">{{ healthData.bloodPressure }}</text>
					<text class="data-label">血压(mmHg)</text>
					<text class="data-status" :class="healthData.bloodPressureStatus">{{ healthData.bloodPressureText }}</text>
				</view>
				<view class="data-item" @tap="showDetail" data-type="bloodOxygen">
					<view class="data-icon">🫁</view>
					<text class="data-value">{{ healthData.bloodOxygen }}%</text>
					<text class="data-label">血氧饱和度</text>
					<text class="data-status" :class="healthData.bloodOxygenStatus">{{ healthData.bloodOxygenText }}</text>
				</view>
				<view class="data-item" @tap="showDetail" data-type="temperature">
					<view class="data-icon">🌡️</view>
					<text class="data-value">{{ healthData.temperature }}°C</text>
					<text class="data-label">体温</text>
					<text class="data-status" :class="healthData.temperatureStatus">{{ healthData.temperatureText }}</text>
				</view>
			</view>
		</view>
		
		<view class="trend-section">
			<view class="section-title">数据趋势</view>
			<view class="trend-chart">
				<canvas canvas-id="trendChart" class="chart"></canvas>
			</view>
		</view>
		
		<view class="history-section">
			<view class="section-title">历史记录</view>
			<view class="history-list">
				<view class="history-item" v-for="(record, index) in historyRecords" :key="index">
					<view class="record-date">{{ record.date }}</view>
					<view class="record-data">
						<text class="record-type">{{ record.type }}</text>
						<text class="record-value">{{ record.value }}</text>
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
			healthData: {
				heartRate: 72,
				heartRateStatus: 'normal',
				heartRateText: '正常',
				bloodPressure: '120/80',
				bloodPressureStatus: 'normal',
				bloodPressureText: '正常',
				bloodOxygen: 98,
				bloodOxygenStatus: 'normal',
				bloodOxygenText: '正常',
				temperature: 36.5,
				temperatureStatus: 'normal',
				temperatureText: '正常'
			},
			historyRecords: [
				{ date: '2024-01-15', type: '心率', value: '72 bpm' },
				{ date: '2024-01-15', type: '血压', value: '120/80 mmHg' },
				{ date: '2024-01-14', type: '血氧', value: '98%' },
				{ date: '2024-01-14', type: '体温', value: '36.5°C' }
			]
		}
	},
	methods: {
		showDetail(e) {
			const type = e.currentTarget.dataset.type;
			uni.navigateTo({
				url: `/pages/health/data/detail?type=${type}`
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

.data-overview {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.overview-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
}

.data-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30rpx;
}

.data-item {
	text-align: center;
	padding: 30rpx;
	background-color: #f8f9fa;
	border-radius: 15rpx;
}

.data-icon {
	font-size: 40rpx;
	margin-bottom: 15rpx;
}

.data-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.data-label {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 10rpx;
}

.data-status {
	font-size: 22rpx;
	padding: 5rpx 15rpx;
	border-radius: 15rpx;
}

.data-status.normal {
	background-color: #e8f5e8;
	color: #19be6b;
}

.data-status.warning {
	background-color: #fff3cd;
	color: #ffc107;
}

.data-status.danger {
	background-color: #f8d7da;
	color: #dc3545;
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
}

.trend-chart {
	height: 300rpx;
}

.chart {
	width: 100%;
	height: 100%;
}

.history-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
}

.history-list {
	
}

.history-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.history-item:last-child {
	border-bottom: none;
}

.record-date {
	font-size: 26rpx;
	color: #666;
}

.record-data {
	text-align: right;
}

.record-type {
	font-size: 26rpx;
	color: #333;
	display: block;
}

.record-value {
	font-size: 24rpx;
	color: #666;
}
</style> 