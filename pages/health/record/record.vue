<template>
	<view class="container">
		<view class="header">
			<text class="title">病历记录</text>
			<button class="add-btn" @tap="addRecord">添加记录</button>
		</view>
		
		<view class="filter-tabs">
			<view class="tab-item" :class="{ active: activeTab === 'all' }" @tap="switchTab" data-tab="all">
				<text>全部</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'visit' }" @tap="switchTab" data-tab="visit">
				<text>就诊记录</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'examination' }" @tap="switchTab" data-tab="examination">
				<text>检查报告</text>
			</view>
		</view>
		
		<view class="record-list">
			<view class="record-item" v-for="(record, index) in filteredRecords" :key="index" @tap="viewDetail" :data-id="record.id">
				<view class="record-header">
					<text class="record-type">{{ record.type }}</text>
					<text class="record-date">{{ record.date }}</text>
				</view>
				<view class="record-content">
					<text class="record-title">{{ record.title }}</text>
					<text class="record-description">{{ record.description }}</text>
				</view>
				<view class="record-footer">
					<text class="hospital">{{ record.hospital }}</text>
					<text class="doctor">{{ record.doctor }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeTab: 'all',
			records: [
				{
					id: 1,
					type: '就诊记录',
					date: '2024-01-15',
					title: '高血压复诊',
					description: '血压控制良好，继续服用降压药，定期监测',
					hospital: '康禾医院',
					doctor: '张医生'
				},
				{
					id: 2,
					type: '检查报告',
					date: '2024-01-10',
					title: '血常规检查',
					description: '各项指标正常，无异常发现',
					hospital: '康禾医院',
					doctor: '李医生'
				},
				{
					id: 3,
					type: '就诊记录',
					date: '2024-01-05',
					title: '感冒治疗',
					description: '上呼吸道感染，开具感冒药，多休息',
					hospital: '康禾医院',
					doctor: '王医生'
				}
			]
		}
	},
	computed: {
		filteredRecords() {
			if (this.activeTab === 'all') {
				return this.records;
			}
			return this.records.filter(record => {
				if (this.activeTab === 'visit') {
					return record.type === '就诊记录';
				} else if (this.activeTab === 'examination') {
					return record.type === '检查报告';
				}
				return true;
			});
		}
	},
	methods: {
		switchTab(e) {
			this.activeTab = e.currentTarget.dataset.tab;
		},
		addRecord() {
			uni.navigateTo({
				url: '/pages/health/record/add'
			});
		},
		viewDetail(e) {
			const id = e.currentTarget.dataset.id;
			uni.navigateTo({
				url: `/pages/health/record/detail?id=${id}`
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

.filter-tabs {
	display: flex;
	background-color: white;
	border-radius: 15rpx;
	padding: 10rpx;
	margin-bottom: 30rpx;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 20rpx;
	border-radius: 10rpx;
	transition: all 0.3s ease;
}

.tab-item.active {
	background-color: #19be6b;
	color: white;
}

.tab-item text {
	font-size: 28rpx;
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
	font-size: 24rpx;
	color: #19be6b;
	background-color: #e8f5e8;
	padding: 8rpx 20rpx;
	border-radius: 15rpx;
}

.record-date {
	font-size: 24rpx;
	color: #999;
}

.record-content {
	margin-bottom: 20rpx;
}

.record-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.record-description {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.record-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.hospital, .doctor {
	font-size: 24rpx;
	color: #999;
}
</style> 