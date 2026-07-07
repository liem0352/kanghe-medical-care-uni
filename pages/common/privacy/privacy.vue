<template>
	<view class="container">
		<view class="content">
			<view class="title">隐私政策</view>
			<view class="section">
				<view class="section-title">1. 信息收集</view>
				<view class="section-content">
					我们收集您提供的个人信息，包括但不限于姓名、联系方式、健康数据等，用于提供医疗健康服务。
				</view>
			</view>
			<view class="section">
				<view class="section-title">2. 信息使用</view>
				<view class="section-content">
					我们使用收集的信息来提供个性化医疗服务、健康管理建议和紧急救助服务。
				</view>
			</view>
			<view class="section">
				<view class="section-title">3. 信息保护</view>
				<view class="section-content">
					我们采用行业标准的安全措施保护您的个人信息，防止未经授权的访问、使用或泄露。
				</view>
			</view>
			<view class="section">
				<view class="section-title">4. 信息共享</view>
				<view class="section-content">
					除法律要求或获得您的明确同意外，我们不会与第三方共享您的个人信息。
				</view>
			</view>
			<view class="section">
				<view class="section-title">5. 您的权利</view>
				<view class="section-content">
					您有权访问、更正或删除您的个人信息，也可以随时撤回同意。
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
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

.content {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 60rpx;
}

.section {
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #19be6b;
	margin-bottom: 20rpx;
}

.section-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}
</style> 