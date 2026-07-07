<template>
    <view class="appointment-history">
        <view class="history-list">
            <view 
                v-for="(record, index) in historyRecords" 
                :key="index"
                class="history-item"
            >
                <view class="record-header">
                    <text class="doctor-name">{{ record.doctorName }}</text>
                    <text class="record-date">{{ record.date }}</text>
                </view>
                
                <view class="record-info">
                    <text class="department">{{ record.department }}</text>
                    <text class="time">{{ record.time }}</text>
                    <text class="status">{{ record.status }}</text>
                </view>
                
                <view class="record-summary">
                    <text class="summary-text">{{ record.summary }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            historyRecords: [
                {
                    doctorName: '张医生',
                    department: '心内科',
                    date: '2024-01-10',
                    time: '09:00',
                    status: '已完成',
                    summary: '血压控制良好，继续服用降压药'
                },
                {
                    doctorName: '李医生',
                    department: '内分泌科',
                    date: '2024-01-05',
                    time: '14:00',
                    status: '已完成',
                    summary: '血糖稳定，建议调整饮食结构'
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.appointment-history {
    padding: 16px;
    
    .history-list {
        .history-item {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            
            .record-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                
                .doctor-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                }
                
                .record-date {
                    font-size: 12px;
                    color: #999999;
                }
            }
            
            .record-info {
                margin-bottom: 8px;
                
                .department, .time, .status {
                    font-size: 14px;
                    color: #666666;
                    margin-right: 16px;
                }
                
                .status {
                    color: #19be6b;
                }
            }
            
            .record-summary {
                .summary-text {
                    font-size: 14px;
                    color: #333333;
                    line-height: 1.4;
                }
            }
        }
    }
}
</style> 