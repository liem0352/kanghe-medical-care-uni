<template>
    <!-- pages/prescription/prescription.wxml -->
    <view class="prescription-page">
        <view class="header">
            <view class="header-left" @tap="goBack">
                <image src="/static/images/back.png" class="back-icon"></image>
            </view>
            <view class="header-title">处方与医保</view>
            <view class="header-right"></view>
        </view>

        <scroll-view :scroll-y="true" class="prescription-container">
            <view class="insurance-card">
                <view class="insurance-header">
                    <text class="insurance-title">医保凭证</text>
                    <text class="insurance-subtitle">肇庆市基本医疗保险</text>
                </view>
                <view class="insurance-body">
                    <text class="insurance-name">张三 · 医保电子凭证</text>
                    <view class="insurance-info">
                        <text class="info-item">个人编号: GDZQ1234567890</text>
                        <view class="insurance-status">
                            <text>状态: 正常</text>
                            <text>余额: ¥2536.50</text>
                        </view>
                    </view>
                    <button class="insurance-btn" @tap="showInsuranceDetail">查看详情</button>
                </view>
            </view>

            <view class="section-title">当前处方</view>
            <view class="prescription-card">
                <view class="prescription-header">
                    <text class="prescription-id">处方编号: RX20230718001</text>
                    <text class="prescription-status">待配送</text>
                </view>
                <view class="prescription-info">
                    <text class="info-label">开具医师:</text>
                    <text class="info-value">张明华医生</text>
                </view>
                <view class="prescription-info">
                    <text class="info-label">诊断结果:</text>
                    <text class="info-value">原发性高血压 II级</text>
                </view>
                <view class="prescription-divider"></view>

                <view class="medication-list">
                    <view class="medication-item">
                        <view class="medication-info">
                            <text class="medication-name">硝苯地平缓释片</text>
                            <text class="medication-id">国药准字 H20056999</text>
                        </view>
                        <text class="medication-quantity">10mg × 30片</text>
                    </view>
                    <view class="medication-item">
                        <view class="medication-info">
                            <text class="medication-name">阿托伐他汀钙片</text>
                            <text class="medication-id">国药准字 H20051408</text>
                        </view>
                        <text class="medication-quantity">20mg × 14片</text>
                    </view>
                    <view class="medication-item">
                        <view class="medication-info">
                            <text class="medication-name">麝香保心丸</text>
                            <text class="medication-id">国药准字 Z31020268</text>
                        </view>
                        <text class="medication-quantity">22.5mg × 42丸</text>
                    </view>
                </view>

                <view class="prescription-footer">
                    <view class="prescription-cost">
                        <text>医保支付: ¥68.50</text>
                        <text>自付金额: ¥22.30</text>
                    </view>
                    <button class="delivery-btn" @tap="requestDelivery">配送上门</button>
                </view>
            </view>

            <view class="section-title">历史处方</view>
            <view class="history-list">
                <view class="history-item">
                    <view class="history-info">
                        <text class="history-date">2023-06-20</text>
                        <text class="history-doctor">李秋萍医生</text>
                    </view>
                    <text class="history-diagnosis">2型糖尿病</text>
                    <view class="history-cost">医保支付: ¥52.80</view>
                </view>

                <view class="history-item">
                    <view class="history-info">
                        <text class="history-date">2023-05-15</text>
                        <text class="history-doctor">王建伟医生</text>
                    </view>
                    <text class="history-diagnosis">腰椎间盘突出</text>
                    <view class="history-cost">医保支付: ¥78.20</view>
                </view>
            </view>
        </scroll-view>

        <!-- 药品配送模态框 -->
        <modal class="delivery-modal" v-if="showDeliveryModal">
            <view slot="title">药品配送</view>
            <view slot="content">
                <view class="modal-content">
                    <view class="address-section">
                        <text class="section-title">配送地址</text>
                        <view class="address-info">
                            <text class="address-text">肇庆市端州区星湖大道78号 张三 13800138000</text>
                            <text class="change-address">修改</text>
                        </view>
                    </view>

                    <view class="delivery-time">
                        <text class="section-title">送达时间</text>
                        <picker mode="selector" :range="timeOptions" :value="selectedTime" @change="timeChange">
                            <view class="picker">
                                <text>{{ timeOptions[selectedTime] }}</text>
                                <image src="/static/images/arrow-down.png" class="arrow-down"></image>
                            </view>
                        </picker>
                    </view>
                </view>
            </view>
            <view slot="footer">
                <button class="btn-cancel" @tap="closeDeliveryModal">取消</button>
                <button class="btn-confirm" @tap="confirmDelivery">确认配送</button>
            </view>
        </modal>
    </view>
</template>

<script>
// pages/prescription/prescription.js
export default {
    data() {
        return {
            showDeliveryModal: false,
            selectedTime: 0,
            timeOptions: ['今天 18:00前送达', '明天 10:00前送达', '明天 14:00前送达', '明天 18:00前送达']
        };
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },

        showInsuranceDetail() {
            uni.showModal({
                title: '医保详情',
                content: '参保单位: 肇庆市基本医疗保险\n参保状态: 正常\n累计支出: ¥4,256.30\n账户余额: ¥2,536.50',
                showCancel: false
            });
        },

        requestDelivery() {
            this.setData({
                showDeliveryModal: true
            });
        },

        timeChange(e) {
            this.setData({
                selectedTime: e.detail.value
            });
        },

        closeDeliveryModal() {
            this.setData({
                showDeliveryModal: false
            });
        },

        confirmDelivery() {
            this.closeDeliveryModal();
            uni.showLoading({
                title: '处理中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '药品配送已安排!',
                    icon: 'success',
                    duration: 2000
                });
            }, 1500);
        }
    }
};
</script>
<style>
/* pages/prescription/prescription.wxss */
.prescription-page {
    background-color: #f5f7fa;
    min-height: 100vh;
    padding-bottom: 100rpx;
}

.prescription-container {
    height: calc(100vh - 60px);
    padding: 15px;
}

.insurance-card {
    background: linear-gradient(135deg, #19be6b, #00aa6c);
    border-radius: 12px;
    padding: 15px;
    color: white;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.insurance-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.insurance-title {
    font-size: 18px;
    font-weight: bold;
}

.insurance-subtitle {
    font-size: 12px;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
}

.insurance-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
}

.insurance-info {
    margin-bottom: 15px;
}

.info-item {
    font-size: 12px;
    display: block;
    opacity: 0.9;
    margin-bottom: 5px;
}

.insurance-status {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-top: 10px;
}

.insurance-btn {
    background: white;
    color: #19be6b;
    border: none;
    font-size: 14px;
    padding: 8px 20px;
    border-radius: 20px;
    margin-top: 10px;
}

.prescription-card {
    background: white;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.prescription-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.prescription-id {
    color: #666;
    font-size: 12px;
}

.prescription-status {
    color: #19be6b;
    font-weight: bold;
}

.prescription-info {
    display: flex;
    margin-bottom: 8px;
}

.info-label {
    color: #999;
    width: 70px;
}

.info-value {
    flex: 1;
}

.prescription-divider {
    height: 1px;
    background: #eee;
    margin: 15px -15px;
}

.medication-list {
    margin-bottom: 15px;
}

.medication-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.medication-item:last-child {
    border-bottom: none;
}

.medication-info {
    flex: 1;
}

.medication-name {
    font-weight: bold;
    display: block;
    margin-bottom: 3px;
}

.medication-id {
    font-size: 12px;
    color: #999;
}

.medication-quantity {
    font-size: 14px;
    align-self: center;
}

.prescription-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.prescription-cost {
    font-size: 13px;
}

.prescription-cost text {
    display: block;
    margin-bottom: 3px;
}

.delivery-btn {
    background: #19be6b;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
}

.history-list {
    background: white;
    border-radius: 12px;
    padding: 15px;
}

.history-item {
    border-bottom: 1px solid #eee;
    padding: 12px 0;
}

.history-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.history-date {
    font-size: 14px;
    color: #333;
}

.history-doctor {
    font-size: 13px;
    color: #19be6b;
}

.history-diagnosis {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.history-cost {
    font-size: 13px;
    color: #19be6b;
}

.delivery-modal .modal-content {
    padding: 15px;
}

.address-section {
    margin-bottom: 20px;
}

.section-title {
    font-weight: bold;
    margin-bottom: 8px;
    display: block;
}

.address-info {
    display: flex;
    justify-content: space-between;
    background: #f5f7fa;
    border-radius: 8px;
    padding: 10px;
}

.address-text {
    flex: 1;
    font-size: 14px;
}

.change-address {
    color: #19be6b;
    font-size: 13px;
    margin-left: 10px;
}

.delivery-time .picker {
    display: flex;
    justify-content: space-between;
    background: #f5f7fa;
    border-radius: 8px;
    padding: 10px;
}

.arrow-down {
    width: 16px;
    height: 16px;
}

.btn-cancel {
    background-color: #f0f0f0;
    color: #333;
    border-radius: 20px;
    margin-right: 10px;
    width: 120px;
}

.btn-confirm {
    background-color: #19be6b;
    color: white;
    border-radius: 20px;
    width: 120px;
}
</style>
