<template>
	<view class="container">
		<view class="header">
			<text class="title">体检报告</text>
			<button class="add-btn" @tap="addReport">上传报告</button>
		</view>
		
		<view class="report-list">
			<view class="report-item" v-for="(report, index) in reports" :key="index" @tap="viewReport" :data-id="report.id">
				<view class="report-header">
					<view class="report-info">
						<text class="report-title">{{ report.title }}</text>
						<text class="report-date">{{ report.date }}</text>
					</view>
					<view class="report-status" :class="report.status">
						<text class="status-text">{{ report.statusText }}</text>
					</view>
				</view>
				<view class="report-summary">
					<text class="summary-text">{{ report.summary }}</text>
				</view>
				<view class="report-footer">
					<text class="hospital">{{ report.hospital }}</text>
					<text class="doctor">{{ report.doctor }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			reports: [
				{
					id: 1,
					title: '年度体检报告',
					date: '2024-01-15',
					summary: '各项指标基本正常，建议继续保持健康生活方式',
					hospital: '康禾医院',
					doctor: '张医生',
					status: 'normal',
					statusText: '正常'
				},
				{
					id: 2,
					title: '血常规检查',
					date: '2024-01-10',
					summary: '白细胞计数略高，建议复查',
					hospital: '康禾医院',
					doctor: '李医生',
					status: 'warning',
					statusText: '需关注'
				},
				{
					id: 3,
					title: '心电图检查',
					date: '2024-01-05',
					summary: '窦性心律，心率正常',
					hospital: '康禾医院',
					doctor: '王医生',
					status: 'normal',
					statusText: '正常'
				}
			]
		}
	},
	methods: {
		addReport() {
			uni.navigateTo({
				url: '/pages/health/report/add'
			});
		},
		viewReport(e) {
			const id = e.currentTarget.dataset.id;
			uni.navigateTo({
				url: `/pages/health/report/detail?id=${id}`
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

.report-list {
	background-color: white;
	border-radius: 20rpx;
	padding: 20rpx;
}

.report-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;
}

.report-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
}

.report-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.report-info {
	flex: 1;
}

.report-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.report-date {
	font-size: 24rpx;
	color: #999;
}

.report-status {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	margin-left: 20rpx;
}

.report-status.normal {
	background-color: #e8f5e8;
	color: #19be6b;
}

.report-status.warning {
	background-color: #fff3cd;
	color: #ffc107;
}

.report-status.danger {
	background-color: #f8d7da;
	color: #dc3545;
}

.status-text {
	font-size: 24rpx;
}

.report-summary {
	margin-bottom: 20rpx;
}

.summary-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.report-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.hospital, .doctor {
	font-size: 24rpx;
	color: #999;
}
</style> 