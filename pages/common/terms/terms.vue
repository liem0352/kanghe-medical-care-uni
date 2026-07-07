<template>
	<view class="container">
		<view class="content">
			<view class="title">用户协议</view>
			<view class="section">
				<view class="section-title">1. 服务说明</view>
				<view class="section-content">
					康禾智慧医养整合服务平台为您提供在线医疗咨询、健康管理、用药提醒等综合医疗服务。
				</view>
			</view>
			<view class="section">
				<view class="section-title">2. 用户责任</view>
				<view class="section-content">
					用户应提供真实、准确的个人信息和健康数据，遵守相关法律法规和平台规则。
				</view>
			</view>
			<view class="section">
				<view class="section-title">3. 服务限制</view>
				<view class="section-content">
					本平台提供的医疗建议仅供参考，不能替代专业医生的诊断和治疗。
				</view>
			</view>
			<view class="section">
				<view class="section-title">4. 免责声明</view>
				<view class="section-content">
					平台不对因网络故障、系统维护等原因造成的服务中断承担责任。
				</view>
			</view>
			<view class="section">
				<view class="section-title">5. 协议修改</view>
				<view class="section-content">
					平台有权根据业务发展需要修改本协议，修改后的协议将在平台公示。
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