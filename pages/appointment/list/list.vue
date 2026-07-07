<template>
    <view class="appointment-list">
        <view class="status-tabs">
            <text 
                v-for="(status, index) in statusList" 
                :key="index"
                :class="'tab ' + (activeStatus === status.value ? 'active' : '')"
                @tap="selectStatus(status.value)"
            >
                {{ status.label }}
            </text>
        </view>
        
        <view class="appointment-items">
            <view 
                v-for="(appointment, index) in filteredAppointments" 
                :key="index"
                class="appointment-item"
            >
                <view class="appointment-header">
                    <text class="doctor-name">{{ appointment.doctorName }}</text>
                    <text :class="'status ' + appointment.status">{{ getStatusText(appointment.status) }}</text>
                </view>
                
                <view class="appointment-info">
                    <text class="department">{{ appointment.department }}</text>
                    <text class="time">{{ appointment.appointmentTime }}</text>
                    <text class="fee">¥{{ appointment.fee }}</text>
                </view>
                
                <view class="appointment-actions">
                    <button 
                        v-if="appointment.status === 'confirmed'" 
                        class="action-btn primary"
                        @tap="startConsultation(appointment)"
                    >
                        开始咨询
                    </button>
                    <button 
                        v-if="appointment.status === 'pending'" 
                        class="action-btn secondary"
                        @tap="cancelAppointment(appointment)"
                    >
                        取消预约
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            activeStatus: 'all',
            statusList: [
                { label: '全部', value: 'all' },
                { label: '待确认', value: 'pending' },
                { label: '已确认', value: 'confirmed' },
                { label: '已完成', value: 'completed' },
                { label: '已取消', value: 'cancelled' }
            ],
            appointments: [
                {
                    id: 1,
                    doctorName: '张医生',
                    department: '心内科',
                    appointmentTime: '2024-01-15 09:00',
                    fee: 50,
                    status: 'confirmed'
                },
                {
                    id: 2,
                    doctorName: '李医生',
                    department: '内分泌科',
                    appointmentTime: '2024-01-16 14:00',
                    fee: 40,
                    status: 'pending'
                }
            ]
        }
    },
    computed: {
        filteredAppointments() {
            if (this.activeStatus === 'all') {
                return this.appointments
            }
            return this.appointments.filter(app => app.status === this.activeStatus)
        }
    },
    methods: {
        selectStatus(status) {
            this.activeStatus = status
        },
        getStatusText(status) {
            const statusMap = {
                'pending': '待确认',
                'confirmed': '已确认',
                'completed': '已完成',
                'cancelled': '已取消'
            }
            return statusMap[status] || '未知'
        },
        startConsultation(appointment) {
            uni.navigateTo({
                url: `/pages/consultation/text/text?appointmentId=${appointment.id}`
            })
        },
        cancelAppointment(appointment) {
            uni.showModal({
                title: '取消预约',
                content: '确定要取消这个预约吗？',
                success: (res) => {
                    if (res.confirm) {
                        // 取消预约逻辑
                        appointment.status = 'cancelled'
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.appointment-list {
    padding: 16px;
    
    .status-tabs {
        display: flex;
        margin-bottom: 16px;
        
        .tab {
            flex: 1;
            text-align: center;
            padding: 8px;
            font-size: 14px;
            color: #666666;
            border-bottom: 2px solid transparent;
            
            &.active {
                color: #19be6b;
                border-bottom-color: #19be6b;
            }
        }
    }
    
    .appointment-items {
        .appointment-item {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            
            .appointment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                
                .doctor-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                }
                
                .status {
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    
                    &.pending {
                        color: #ff6b35;
                        background: rgba(255, 107, 53, 0.1);
                    }
                    
                    &.confirmed {
                        color: #19be6b;
                        background: rgba(25, 190, 107, 0.1);
                    }
                    
                    &.completed {
                        color: #666666;
                        background: rgba(102, 102, 102, 0.1);
                    }
                    
                    &.cancelled {
                        color: #999999;
                        background: rgba(153, 153, 153, 0.1);
                    }
                }
            }
            
            .appointment-info {
                margin-bottom: 12px;
                
                .department, .time, .fee {
                    font-size: 14px;
                    color: #666666;
                    margin-right: 16px;
                }
                
                .fee {
                    color: #ff6b35;
                    font-weight: 600;
                }
            }
            
            .appointment-actions {
                .action-btn {
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    border: none;
                    
                    &.primary {
                        background: #19be6b;
                        color: #ffffff;
                    }
                    
                    &.secondary {
                        background: #f5f5f5;
                        color: #666666;
                    }
                }
            }
        }
    }
}
</style> 