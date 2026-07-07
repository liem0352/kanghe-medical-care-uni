<template>
    <view class="medication-reminder">
        <view class="header">
            <text class="title">用药提醒</text>
            <button class="add-btn" @tap="addReminder">添加提醒</button>
        </view>
        
        <view class="reminder-list">
            <view 
                v-for="(reminder, index) in reminders" 
                :key="index"
                class="reminder-item"
            >
                <view class="reminder-info">
                    <text class="medication-name">{{ reminder.medicationName }}</text>
                    <text class="time">{{ reminder.time }}</text>
                    <text class="frequency">{{ reminder.frequency }}</text>
                </view>
                <view class="reminder-actions">
                    <switch :checked="reminder.enabled" @change="toggleReminder(index)" />
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
                    medicationName: '阿司匹林',
                    time: '08:00',
                    frequency: '每日一次',
                    enabled: true
                },
                {
                    medicationName: '降压药',
                    time: '20:00',
                    frequency: '每日一次',
                    enabled: true
                }
            ]
        }
    },
    methods: {
        addReminder() {
            // 添加提醒功能
        },
        toggleReminder(index) {
            this.reminders[index].enabled = !this.reminders[index].enabled
        }
    }
}
</script>

<style lang="scss" scoped>
.medication-reminder {
    padding: 16px;
    
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        .title {
            font-size: 18px;
            font-weight: 600;
            color: #333333;
        }
        
        .add-btn {
            background: #19be6b;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 14px;
        }
    }
    
    .reminder-list {
        .reminder-item {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .reminder-info {
                .medication-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .time {
                    font-size: 14px;
                    color: #666666;
                    margin-right: 12px;
                }
                
                .frequency {
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
    }
}
</style> 