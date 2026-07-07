<template>
	<view class="container">
		<view class="header">
			<text class="title">家庭成员</text>
			<button class="add-btn" @tap="addMember">添加成员</button>
		</view>
		
		<view class="member-list">
			<view class="member-item" v-for="(member, index) in members" :key="index" @tap="editMember" :data-id="member.id">
				<view class="member-avatar">
					<text class="avatar-text">{{ member.name.charAt(0) }}</text>
				</view>
				<view class="member-info">
					<text class="member-name">{{ member.name }}</text>
					<text class="member-relation">{{ member.relation }}</text>
					<text class="member-age">{{ member.age }}岁</text>
				</view>
				<view class="member-status">
					<text class="status-text" :class="member.status">{{ member.statusText }}</text>
				</view>
			</view>
		</view>
		
		<!-- 添加/编辑成员弹窗 -->
		<view class="modal" v-if="showModal">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{ isEdit ? '编辑成员' : '添加成员' }}</text>
					<text class="close-btn" @tap="closeModal">×</text>
				</view>
				<view class="form">
					<view class="form-item">
						<text class="label">姓名</text>
						<input class="input" v-model="formData.name" placeholder="请输入姓名" />
					</view>
					<view class="form-item">
						<text class="label">关系</text>
						<picker @change="bindRelationChange" :value="relationIndex" :range="relations">
							<view class="picker">{{ relations[relationIndex] }}</view>
						</picker>
					</view>
					<view class="form-item">
						<text class="label">年龄</text>
						<input class="input" type="number" v-model="formData.age" placeholder="请输入年龄" />
					</view>
				</view>
				<view class="modal-actions">
					<button class="btn-cancel" @tap="closeModal">取消</button>
					<button class="btn-confirm" @tap="saveMember">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			members: [
				{ id: 1, name: '张三', relation: '父亲', age: 65, status: 'normal', statusText: '健康' },
				{ id: 2, name: '李四', relation: '母亲', age: 62, status: 'warning', statusText: '需关注' },
				{ id: 3, name: '小明', relation: '儿子', age: 8, status: 'normal', statusText: '健康' }
			],
			showModal: false,
			isEdit: false,
			formData: {
				name: '',
				relation: '',
				age: ''
			},
			relations: ['父亲', '母亲', '儿子', '女儿', '配偶', '其他'],
			relationIndex: 0
		}
	},
	methods: {
		addMember() {
			this.isEdit = false;
			this.formData = { name: '', relation: '', age: '' };
			this.showModal = true;
		},
		editMember(e) {
			const id = e.currentTarget.dataset.id;
			const member = this.members.find(m => m.id === id);
			if (member) {
				this.isEdit = true;
				this.formData = { ...member };
				this.relationIndex = this.relations.indexOf(member.relation);
				this.showModal = true;
			}
		},
		closeModal() {
			this.showModal = false;
		},
		bindRelationChange(e) {
			this.relationIndex = e.detail.value;
		},
		saveMember() {
			if (!this.formData.name || !this.formData.age) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' });
				return;
			}
			
			if (this.isEdit) {
				// 编辑现有成员
				const index = this.members.findIndex(m => m.id === this.formData.id);
				if (index !== -1) {
					this.members[index] = { ...this.formData, relation: this.relations[this.relationIndex] };
				}
			} else {
				// 添加新成员
				const newMember = {
					id: Date.now(),
					name: this.formData.name,
					relation: this.relations[this.relationIndex],
					age: this.formData.age,
					status: 'normal',
					statusText: '健康'
				};
				this.members.push(newMember);
			}
			
			this.closeModal();
			uni.showToast({ title: '保存成功', icon: 'success' });
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

.member-list {
	background-color: white;
	border-radius: 20rpx;
	padding: 20rpx;
}

.member-item {
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.member-item:last-child {
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

.member-info {
	flex: 1;
}

.member-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
}

.member-relation {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-top: 5rpx;
}

.member-age {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-top: 5rpx;
}

.member-status {
	margin-left: 20rpx;
}

.status-text {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
}

.status-text.normal {
	background-color: #e8f5e8;
	color: #19be6b;
}

.status-text.warning {
	background-color: #fff3cd;
	color: #ffc107;
}

.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal-content {
	background-color: white;
	border-radius: 20rpx;
	width: 80%;
	max-width: 600rpx;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	font-size: 40rpx;
	color: #999;
	padding: 10rpx;
}

.form {
	padding: 30rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
	display: block;
}

.input, .picker {
	border: 1rpx solid #ddd;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
	width: 100%;
	box-sizing: border-box;
}

.modal-actions {
	display: flex;
	padding: 30rpx;
	border-top: 1rpx solid #f0f0f0;
}

.btn-cancel, .btn-confirm {
	flex: 1;
	margin: 0 10rpx;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	border: none;
}

.btn-cancel {
	background-color: #f5f5f5;
	color: #666;
}

.btn-confirm {
	background-color: #19be6b;
	color: white;
}
</style> 