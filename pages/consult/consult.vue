<template>
    <!-- pages/consult/consult.wxml -->
    <view>
        <view class="header">
            <view class="logo-container">
                <view class="logo">
                    <image src="/static/images/consult.png" mode="aspectFit" class="header-icon"></image>
                </view>
                <view class="app-name">在线问诊</view>
            </view>
        </view>

        <view class="consult-banner">
            <button class="video-consult-btn" @tap="startVideoConsult">
                <image src="/static/images/video.png" mode="aspectFit" class="consult-icon"></image>
                立即视频问诊
            </button>
        </view>

        <view class="card">
            <view class="section-title">推荐医生</view>
            <view class="doctor-list">
                <block v-for="(item, index) in doctors" :key="index">
                    <view class="doctor-item">
                        <view class="doctor-avatar">
                            <image :src="item.avatar" mode="aspectFill" class="avatar-img"></image>
                        </view>
                        <view class="doctor-info">
                            <text class="doctor-name">{{ item.name }} {{ item.title }}</text>
                            <text class="doctor-details">{{ item.department }} | {{ item.experience }}</text>
                            <view class="consult-buttons">
                                <button class="consult-btn" @tap="startTextConsult" :data-id="item.id">图文咨询</button>
                                <button class="consult-btn video-btn" @tap="startVideoConsult" :data-id="item.id">视频问诊</button>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
        </view>

        <view class="card">
            <view class="section-title">问诊记录</view>
            <view class="consult-history">
                <block v-for="(item, index) in history" :key="index">
                    <view class="history-item">
                        <view class="history-date">{{ item.date }}</view>
                        <view class="history-detail">
                            <text class="doctor-name">{{ item.doctor }}</text>
                            <text class="history-type">{{ item.type }}咨询</text>
                        </view>
                        <view class="history-status">{{ item.status }}</view>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            doctors: [
                {
                    id: 1,
                    name: '张明华',
                    title: '主任医师',
                    department: '心血管内科',
                    experience: '三甲医院20年经验',
                    avatar: '/images/doctor1.jpg'
                },
                {
                    id: 2,
                    name: '李秋萍',
                    title: '副主任医师',
                    department: '内分泌科',
                    experience: '糖尿病专家',
                    avatar: '/images/doctor2.jpg'
                }
            ],
            history: [
                {
                    date: '2023-07-17',
                    doctor: '张明华主任医师',
                    type: '视频',
                    status: '已完成'
                },
                {
                    date: '2023-07-10',
                    doctor: '王建伟主治医师',
                    type: '图文',
                    status: '已完成'
                }
            ]
        };
    },
    methods: {
        startVideoConsult(e) {
            const doctorId = e.currentTarget.dataset.id;
            if (doctorId) {
                uni.navigateTo({
                    url: `/pages/video-consult/video-consult?doctorId=${doctorId}`
                });
            } else {
                uni.showModal({
                    title: '选择医生',
                    content: '请选择一位医生进行视频咨询',
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            }
        },

        startTextConsult(e) {
            const doctorId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/text-consult/text-consult?doctorId=${doctorId}`
            });
        }
    }
};
</script>
<style>
.consult-banner {
    padding: 20px;
    text-align: center;
}

.video-consult-btn {
    background: linear-gradient(135deg, #19be6b, #00aa6c);
    color: white;
    font-size: 18px;
    padding: 15px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.consult-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.doctor-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.doctor-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
}

.avatar-img {
    width: 100%;
    height: 100%;
}

.doctor-name {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}

.doctor-details {
    font-size: 13px;
    color: #666;
    display: block;
    margin-bottom: 10px;
}

.consult-buttons {
    display: flex;
}

.consult-btn {
    padding: 5px 12px;
    font-size: 13px;
    border-radius: 15px;
    background: #f0f0f0;
    color: #333;
}

.video-btn {
    background: #19be6b;
    color: white;
    margin-left: 10px;
}

.consult-history {
    margin-top: 10px;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.history-date {
    font-size: 12px;
    color: #999;
    width: 25%;
}

.history-detail {
    width: 50%;
}

.history-type {
    display: block;
    font-size: 13px;
    color: #666;
}

.history-status {
    color: #19be6b;
    font-size: 13px;
}
</style>
