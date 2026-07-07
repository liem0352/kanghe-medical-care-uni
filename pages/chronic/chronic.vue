<template>
    <view>
        <view class="header">
            <view class="logo-container">
                <view class="logo">
                    <image src="/static/images/chronic.png" mode="aspectFit" class="header-icon"></image>
                </view>
                <view class="app-name">慢病管理</view>
            </view>
        </view>

        <view class="card">
            <view class="disease-card">
                <view class="disease-header">
                    <view class="disease-icon">
                        <image src="/static/images/blood-pressure.png" mode="aspectFit" class="icon-img"></image>
                    </view>
                    <view class="disease-info">
                        <text class="disease-name">高血压管理</text>
                        <text class="disease-days">已记录 120 天</text>
                    </view>
                </view>
                <view class="disease-content">
                    <text class="last-record">上次记录: 142/85 mmHg (2023-07-18)</text>
                    <view class="disease-chart"></view>
                    <view class="disease-stats">
                        <text>最高记录: 158/92</text>
                        <text>平均血压: 138/80</text>
                    </view>
                </view>
            </view>

            <view class="disease-card">
                <view class="disease-header">
                    <view class="disease-icon" style="background: #19be6b">
                        <image src="/static/images/diabetes.png" mode="aspectFit" class="icon-img"></image>
                    </view>
                    <view class="disease-info">
                        <text class="disease-name">2型糖尿病管理</text>
                        <text class="disease-days">已记录 180 天</text>
                    </view>
                </view>
                <view class="disease-content">
                    <text class="last-record">上次空腹血糖: 6.8 mmol/L (2023-07-18)</text>
                    <view class="disease-chart"></view>
                    <view class="disease-stats">
                        <text>最高血糖: 8.2</text>
                        <text>平均血糖: 6.3</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="card">
            <view class="section-title">用药提醒</view>
            <view class="medicine-list">
                <block v-for="(item, index) in medicines" :key="index">
                    <view class="medicine-item">
                        <view class="medicine-info">
                            <text class="medicine-name">{{ item.name }}</text>
                            <text class="medicine-dosage">{{ item.dosage }}</text>
                        </view>
                        <text class="medicine-time">{{ item.nextTime }}</text>
                    </view>
                </block>
            </view>
            <button class="add-btn">添加用药提醒</button>
        </view>
    </view>
</template>

<script>
// pages/chronic/chronic.js
const app = getApp();
export default {
    data() {
        return {
            recordTypes: ['血压', '血糖', '心率', '体重', '步数', '其他'],
            recordTypeIndex: 0,
            recordValue: '',
            recordNote: '',
            showRecordModal: false,
            medicines: []
        };
    },
    onLoad() {
        // 初始化图表
        this.$nextTick(() => {
            this.createPressureChart();
            this.createSugarChart();
        });
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },

        addNewRecord() {
            this.setData({
                showRecordModal: true,
                recordTypeIndex: 0,
                recordValue: '',
                recordNote: ''
            });
        },

        closeRecordModal() {
            this.setData({
                showRecordModal: false
            });
        },

        recordTypeChange(e) {
            this.setData({
                recordTypeIndex: e.detail.value
            });
        },

        inputRecordValue(e) {
            this.setData({
                recordValue: e.detail.value
            });
        },

        inputRecordNote(e) {
            this.setData({
                recordNote: e.detail.value
            });
        },

        saveHealthRecord() {
            const { recordTypes, recordTypeIndex, recordValue, recordNote } = this;
            const recordType = recordTypes[recordTypeIndex];
            if (!recordValue) {
                uni.showToast({
                    title: '请输入测量数值',
                    icon: 'none'
                });
                return;
            }
            uni.showLoading({
                title: '保存中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                this.closeRecordModal();
                uni.showToast({
                    title: '记录添加成功',
                    icon: 'success'
                });

                // 在实际应用中，这里应该发送数据到后端
                console.log('保存健康记录:', {
                    type: recordType,
                    value: recordValue,
                    note: recordNote
                });
            }, 1500);
        },

        markTaken(e) {
            const medicationId = e.currentTarget.dataset.id;
            uni.showLoading({
                title: '记录中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '已记录用药情况',
                    icon: 'success'
                });

                // 在实际应用中，这里应该发送数据到后端
                console.log('记录用药:', medicationId);
            }, 1000);
        },

        createPressureChart() {
            const ctx = uni.createCanvasContext('pressureChart');
            const width = uni.getSystemInfoSync().windowWidth - 30;

            // 血压数据
            const sysData = [142, 138, 136, 145, 140, 135, 132]; // 收缩压
            const diaData = [85, 82, 80, 92, 85, 80, 78]; // 舒张压

            const points = this.generateChartPoints(sysData, diaData, width);

            // 绘制背景网格
            this.drawChartGrid(ctx, width, 150);

            // 绘制收缩压曲线
            this.drawChartLine(ctx, points.sysPoints, '#ff6b6b');

            // 绘制舒张压曲线
            this.drawChartLine(ctx, points.diaPoints, '#5cadff');

            // 添加图表标签
            this.addChartLabels(ctx, points.labels, width);
            ctx.draw();
        },

        createSugarChart() {
            const ctx = uni.createCanvasContext('sugarChart');
            const width = uni.getSystemInfoSync().windowWidth - 30;

            // 血糖数据
            const sugarData = [6.8, 7.2, 6.5, 7.8, 6.2, 5.9, 6.1];
            const points = this.generateSingleChartPoints(sugarData, width);

            // 绘制背景网格
            this.drawChartGrid(ctx, width, 150);

            // 绘制血糖曲线
            this.drawChartLine(ctx, points.dataPoints, '#19be6b');

            // 添加图表标签
            this.addChartLabels(ctx, points.labels, width);
            ctx.draw();
        },

        generateChartPoints(sysData, diaData, width) {
            const height = 150;
            const padding = 20;
            const labelHeight = 30;

            // 计算最大值最小值
            const maxSys = Math.max(...sysData);
            const minSys = Math.min(...sysData);
            const maxDia = Math.max(...diaData);
            const minDia = Math.min(...diaData);
            const sysPoints = [];
            const diaPoints = [];
            const labels = [];

            // X轴步长
            const stepX = (width - 2 * padding) / (sysData.length - 1);

            // 生成坐标点
            sysData.forEach((value, i) => {
                const x = padding + i * stepX;
                const y = padding + (height - padding - labelHeight) * (1 - (value - minSys) / (maxSys - minSys || 1));
                sysPoints.push({
                    x,
                    y,
                    value
                });

                // 日期标签
                if (i % 2 === 0) {
                    labels.push({
                        x,
                        y: height - 5,
                        text: `7/${15 + i}`
                    });
                }
            });
            diaData.forEach((value, i) => {
                const x = padding + i * stepX;
                const y = padding + (height - padding - labelHeight) * (1 - (value - minDia) / (maxDia - minDia || 1));
                diaPoints.push({
                    x,
                    y,
                    value
                });
            });
            return {
                sysPoints,
                diaPoints,
                labels
            };
        },

        generateSingleChartPoints(data, width) {
            const height = 150;
            const padding = 20;
            const labelHeight = 30;

            // 计算最大值最小值
            const maxValue = Math.max(...data);
            const minValue = Math.min(...data);
            const dataPoints = [];
            const labels = [];

            // X轴步长
            const stepX = (width - 2 * padding) / (data.length - 1);

            // 生成坐标点
            data.forEach((value, i) => {
                const x = padding + i * stepX;
                const y = padding + (height - padding - labelHeight) * (1 - (value - minValue) / (maxValue - minValue || 1));
                dataPoints.push({
                    x,
                    y,
                    value
                });

                // 日期标签
                if (i % 2 === 0) {
                    labels.push({
                        x,
                        y: height - 5,
                        text: `7/${15 + i}`
                    });
                }
            });
            return {
                dataPoints,
                labels
            };
        },

        drawChartGrid(ctx, width, height) {
            const padding = 20;
            const labelHeight = 30;

            // 绘制网格
            ctx.setStrokeStyle('#f0f0f0');
            ctx.setLineWidth(1);

            // 水平线
            for (let i = 0; i <= 4; i++) {
                const y = padding + (i * (height - padding - labelHeight)) / 4;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(width - padding, y);
                ctx.stroke();
            }

            // 垂直线（只绘制部分）
            for (let i = 2; i < 7; i += 2) {
                const x = padding + (i * (width - 2 * padding)) / 6;
                ctx.beginPath();
                ctx.moveTo(x, padding);
                ctx.lineTo(x, height - labelHeight);
                ctx.stroke();
            }
        },

        drawChartLine(ctx, points, color) {
            ctx.setStrokeStyle(color);
            ctx.setLineWidth(2);

            // 绘制连线
            ctx.beginPath();
            points.forEach((point, i) => {
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();

            // 绘制数据点
            points.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // 绘制数值标签
                ctx.setFillStyle('#333');
                ctx.setFontSize(10);
                ctx.fillText(point.value, point.x - 10, point.y - 10);
            });
        },

        addChartLabels(ctx, labels, width) {
            const padding = 20;
            ctx.setFillStyle('#999');
            ctx.setFontSize(10);
            labels.forEach((label) => {
                ctx.fillText(label.text, label.x - 10, label.y);
            });

            // 绘制坐标轴
            ctx.setStrokeStyle('#999');
            ctx.setLineWidth(1);

            // Y轴
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, 120);
            ctx.stroke();

            // X轴
            ctx.beginPath();
            ctx.moveTo(padding, 120);
            ctx.lineTo(width - padding, 120);
            ctx.stroke();
        }
    }
};
</script>
<style>
/* pages/chronic/chronic.wxss */
.chronic-page {
    background-color: #f5f7fa;
    min-height: 100vh;
    padding-bottom: 100rpx;
}

.chronic-container {
    height: calc(100vh - 60px);
    padding: 15px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #19be6b;
    color: white;
    padding: 0 15px;
}

.header-title {
    font-size: 18px;
    font-weight: bold;
}

.back-icon {
    width: 24px;
    height: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 15px;
    color: #333;
}

.condition-card {
    background-color: white;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.condition-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.condition-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
}

.condition-img {
    width: 24px;
    height: 24px;
}

.condition-info {
    flex: 1;
}

.condition-name {
    font-weight: bold;
    font-size: 16px;
}

.condition-days {
    font-size: 13px;
    color: #999;
}

.condition-status {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
}

.condition-chart {
    position: relative;
    height: 150px;
    margin: 20px 0;
}

.chart {
    width: 100%;
    height: 150px;
}

.condition-data {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
}

.data-item {
    text-align: center;
}

.data-label {
    font-size: 12px;
    color: #999;
    display: block;
    margin-bottom: 5px;
}

.data-value {
    font-size: 18px;
    font-weight: bold;
}

.data-item:nth-child(1) .data-value {
    color: #ff6b6b;
}

.data-item:nth-child(2) .data-value {
    color: #19be6b;
}

.medication-management {
    background-color: white;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;
}

.medication-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.medication-img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
}

.medication-info {
    flex: 1;
}

.medication-name {
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 5px;
}

.medication-dose {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
}

.medication-next {
    font-size: 12px;
    color: #19be6b;
    background: #e7f7f0;
    padding: 2px 8px;
    border-radius: 10px;
    display: inline-block;
}

.medication-actions {
    align-self: center;
}

.medication-btn {
    background: none;
    border: 1px solid #19be6b;
    color: #19be6b;
    padding: 5px 12px;
    font-size: 13px;
    border-radius: 15px;
}

.health-goals {
    background-color: white;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;
}

.goal-card {
    margin-bottom: 20px;
}

.goal-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.goal-title {
    font-weight: bold;
}

.goal-progress {
    color: #19be6b;
    font-weight: bold;
}

.goal-desc {
    font-size: 12px;
    color: #999;
    display: block;
    margin-top: 5px;
}

.doctor-advice {
    background-color: white;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 20px;
}

.advice-card {
    padding: 15px;
    background: #e8f4fe;
    border-radius: 8px;
}

.advice-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.doctor-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.doctor-name {
    font-weight: bold;
    font-size: 14px;
    margin-right: 10px;
}

.advice-date {
    font-size: 12px;
    color: #999;
}

.advice-content {
    font-size: 14px;
    color: #333;
    line-height: 1.6;
}

/* 添加记录模态框样式 */
.record-modal .modal-content {
    padding: 15px;
}

.input-group {
    margin-bottom: 15px;
}

.input-label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
}

.input-group input,
.input-group textarea {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    font-size: 15px;
}

.input-group textarea {
    min-height: 80px;
}

.picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.picker-value {
    color: #333;
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
