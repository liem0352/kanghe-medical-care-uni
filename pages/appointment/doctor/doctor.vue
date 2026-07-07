<template>
    <view class="appointment-doctor">
        <view class="search-section">
            <input class="search-input" v-model="searchKeyword" placeholder="搜索医生姓名或科室" />
        </view>
        
        <view class="filter-section">
            <picker mode="selector" :range="departments" @change="onDepartmentChange">
                <view class="filter-item">
                    <text class="filter-label">科室：</text>
                    <text class="filter-value">{{ selectedDepartment }}</text>
                </view>
            </picker>
            
            <picker mode="selector" :range="timeSlots" @change="onTimeSlotChange">
                <view class="filter-item">
                    <text class="filter-label">时间：</text>
                    <text class="filter-value">{{ selectedTimeSlot }}</text>
                </view>
            </picker>
        </view>
        
        <view class="doctor-list">
            <view 
                v-for="(doctor, index) in filteredDoctors" 
                :key="index"
                class="doctor-item"
                @tap="selectDoctor(doctor)"
            >
                <image class="doctor-avatar" :src="doctor.avatar" mode="aspectFill"></image>
                <view class="doctor-info">
                    <text class="doctor-name">{{ doctor.name }}</text>
                    <text class="doctor-title">{{ doctor.title }}</text>
                    <text class="doctor-department">{{ doctor.department }}</text>
                    <text class="doctor-specialty">{{ doctor.specialty }}</text>
                </view>
                <view class="doctor-actions">
                    <text class="consultation-fee">¥{{ doctor.fee }}</text>
                    <button class="appointment-btn" @tap.stop="makeAppointment(doctor)">预约</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            searchKeyword: '',
            selectedDepartment: '全部科室',
            selectedTimeSlot: '全部时间',
            departments: ['全部科室', '心内科', '内分泌科', '神经内科', '消化内科'],
            timeSlots: ['全部时间', '上午', '下午', '晚上'],
            doctors: [
                {
                    id: 1,
                    name: '张医生',
                    title: '主任医师',
                    department: '心内科',
                    specialty: '冠心病、高血压',
                    avatar: '/static/images/default-avatar.png',
                    fee: 50
                },
                {
                    id: 2,
                    name: '李医生',
                    title: '副主任医师',
                    department: '内分泌科',
                    specialty: '糖尿病、甲状腺疾病',
                    avatar: '/static/images/default-avatar.png',
                    fee: 40
                }
            ]
        }
    },
    computed: {
        filteredDoctors() {
            return this.doctors.filter(doctor => {
                const matchKeyword = !this.searchKeyword || 
                    doctor.name.includes(this.searchKeyword) || 
                    doctor.department.includes(this.searchKeyword)
                const matchDepartment = this.selectedDepartment === '全部科室' || 
                    doctor.department === this.selectedDepartment
                return matchKeyword && matchDepartment
            })
        }
    },
    methods: {
        onDepartmentChange(e) {
            this.selectedDepartment = this.departments[e.detail.value]
        },
        onTimeSlotChange(e) {
            this.selectedTimeSlot = this.timeSlots[e.detail.value]
        },
        selectDoctor(doctor) {
            // 查看医生详情
        },
        makeAppointment(doctor) {
            uni.navigateTo({
                url: `/pages/appointment/list/list?doctorId=${doctor.id}`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.appointment-doctor {
    padding: 16px;
    
    .search-section {
        margin-bottom: 16px;
        
        .search-input {
            width: 100%;
            height: 40px;
            background: #f5f5f5;
            border-radius: 20px;
            padding: 0 16px;
            font-size: 14px;
        }
    }
    
    .filter-section {
        display: flex;
        margin-bottom: 16px;
        gap: 16px;
        
        .filter-item {
            flex: 1;
            background: #f5f5f5;
            border-radius: 8px;
            padding: 8px 12px;
            
            .filter-label {
                font-size: 12px;
                color: #666666;
            }
            
            .filter-value {
                font-size: 14px;
                color: #333333;
                margin-left: 4px;
            }
        }
    }
    
    .doctor-list {
        .doctor-item {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            
            .doctor-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-right: 12px;
            }
            
            .doctor-info {
                flex: 1;
                
                .doctor-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .doctor-title {
                    font-size: 12px;
                    color: #666666;
                    margin-right: 8px;
                }
                
                .doctor-department {
                    font-size: 12px;
                    color: #999999;
                }
                
                .doctor-specialty {
                    font-size: 12px;
                    color: #19be6b;
                    display: block;
                    margin-top: 4px;
                }
            }
            
            .doctor-actions {
                text-align: right;
                
                .consultation-fee {
                    font-size: 16px;
                    color: #ff6b35;
                    font-weight: 600;
                    display: block;
                    margin-bottom: 8px;
                }
                
                .appointment-btn {
                    background: #19be6b;
                    color: #ffffff;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style> 