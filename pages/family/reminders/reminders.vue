<template>
	<view class="container">
		<view class="header">
			<text class="title">用药提醒</text>
			<button class="add-btn" @tap="addReminder">添加提醒</button>
		</view>
		
		<view class="reminder-list">
			<view class="reminder-item" v-for="(reminder, index) in reminders" :key="index">
				<view class="reminder-header">
					<view class="member-info">
						<text class="member-name">{{ reminder.memberName }}</text>
						<text class="medicine-name">{{ reminder.medicineName }}</text>
					</view>
					<view class="reminder-status" :class="reminder.status">
						<text class="status-text">{{ reminder.statusText }}</text>
					</view>
				</view>
				<view class="reminder-details">
					<text class="time">{{ reminder.time }}</text>
					<text class="dosage">{{ reminder.dosage }}</text>
				</view>
				<view class="reminder-actions">
					<button class="action-btn" @tap="markTaken" :data-id="reminder.id">已服用</button>
					<button class="action-btn skip" @tap="skipReminder" :data-id="reminder.id">跳过</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			reminders: [
				{
					id: 1,
					memberName: '父亲',
					medicineName: '降压药',
					time: '08:00',
					dosage: '1片',
					status: 'pending',
					statusText: '待服用'
				},
				{
					id: 2,
					memberName: '母亲',
					medicineName: '降糖药',
					time: '12:00',
					dosage: '1片',
					status: 'taken',
					statusText: '已服用'
				}
			]
		}
	},
	methods: {
		addReminder() {
			uni.navigateTo({
				url: '/pages/medication/reminder/reminder'
			});
		},
		markTaken(e) {
			const id = e.currentTarget.dataset.id;
			const reminder = this.reminders.find(r => r.id === id);
			if (reminder) {
				reminder.status = 'taken';
				reminder.statusText = '已服用';
			}
		},
		skipReminder(e) {
			const id = e.currentTarget.dataset.id;
			const reminder = this.reminders.find(r => r.id === id);
			if (reminder) {
				reminder.status = 'skipped';
				reminder.statusText = '已跳过';
			}
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

.reminder-list {
	background-color: white;
	border-radius: 20rpx;
	padding: 20rpx;
}

.reminder-item {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;
}

.reminder-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
}

.reminder-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.member-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
}

.medicine-name {
	font-size: 28rpx;
	color: #666;
	display: block;
	margin-top: 5rpx;
}

.reminder-status {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

.reminder-status.pending {
	background-color: #fff3cd;
	color: #ffc107;
}

.reminder-status.taken {
	background-color: #e8f5e8;
	color: #19be6b;
}

.reminder-status.skipped {
	background-color: #f8f9fa;
	color: #6c757d;
}

.status-text {
	font-size: 24rpx;
}

.reminder-details {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.time, .dosage {
	font-size: 26rpx;
	color: #666;
}

.reminder-actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	padding: 15rpx;
	border-radius: 10rpx;
	font-size: 26rpx;
	border: none;
	background-color: #19be6b;
	color: white;
}

.action-btn.skip {
	background-color: #f5f5f5;
	color: #666;
}
</style> 