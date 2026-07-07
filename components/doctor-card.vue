<template>
    <view class="doctor-card" @tap="handleCardTap">
        <view class="doctor-avatar">
            <image :src="doctor.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
            <view v-if="doctor.isOnline" class="online-status"></view>
        </view>
        
        <view class="doctor-info">
            <view class="doctor-name">
                <text class="name">{{ doctor.name }}</text>
                <text v-if="doctor.title" class="title">{{ doctor.title }}</text>
            </view>
            
            <view class="doctor-department">
                <text class="department">{{ doctor.department }}</text>
                <text v-if="doctor.hospital" class="hospital">{{ doctor.hospital }}</text>
            </view>
            
            <view class="doctor-stats">
                <view class="stat-item">
                    <text class="stat-label">评分</text>
                    <text class="stat-value">{{ doctor.rating || '暂无' }}</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">咨询</text>
                    <text class="stat-value">{{ doctor.consultationCount || 0 }}次</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">经验</text>
                    <text class="stat-value">{{ doctor.experience || 0 }}年</text>
                </view>
            </view>
            
            <view class="doctor-tags">
                <text v-for="(tag, index) in doctor.tags" :key="index" class="tag">{{ tag }}</text>
            </view>
            
            <view class="doctor-price">
                <text class="price-label">咨询费</text>
                <text class="price-value">¥{{ doctor.price || 0 }}</text>
            </view>
        </view>
        
        <view class="doctor-actions">
            <button class="action-btn primary" @tap.stop="handleConsult">立即咨询</button>
            <button class="action-btn secondary" @tap.stop="handleAppointment">预约挂号</button>
        </view>
    </view>
</template>

<script>
export default {
    name: 'DoctorCard',
    props: {
        doctor: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleCardTap() {
            this.$emit('card-tap', this.doctor)
        },
        
        handleConsult() {
            this.$emit('consult', this.doctor)
        },
        
        handleAppointment() {
            this.$emit('appointment', this.doctor)
        }
    }
}
</script>

<style lang="scss" scoped>
.doctor-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-start;
    
    .doctor-avatar {
        position: relative;
        margin-right: 12px;
        
        image {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #f0f0f0;
        }
        
        .online-status {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            background: #19be6b;
            border-radius: 50%;
            border: 2px solid #ffffff;
        }
    }
    
    .doctor-info {
        flex: 1;
        
        .doctor-name {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            
            .name {
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                margin-right: 8px;
            }
            
            .title {
                font-size: 12px;
                color: #666666;
                background: #f5f5f5;
                padding: 2px 6px;
                border-radius: 4px;
            }
        }
        
        .doctor-department {
            margin-bottom: 8px;
            
            .department {
                font-size: 14px;
                color: #333333;
                margin-right: 8px;
            }
            
            .hospital {
                font-size: 12px;
                color: #666666;
            }
        }
        
        .doctor-stats {
            display: flex;
            margin-bottom: 8px;
            
            .stat-item {
                margin-right: 16px;
                
                .stat-label {
                    font-size: 12px;
                    color: #999999;
                    display: block;
                }
                
                .stat-value {
                    font-size: 14px;
                    color: #333333;
                    font-weight: 500;
                }
            }
        }
        
        .doctor-tags {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 8px;
            
            .tag {
                font-size: 11px;
                color: #19be6b;
                background: rgba(25, 190, 107, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 6px;
                margin-bottom: 4px;
            }
        }
        
        .doctor-price {
            display: flex;
            align-items: center;
            
            .price-label {
                font-size: 12px;
                color: #999999;
                margin-right: 4px;
            }
            
            .price-value {
                font-size: 16px;
                color: #ff6b35;
                font-weight: 600;
            }
        }
    }
    
    .doctor-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .action-btn {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            border: none;
            min-width: 60px;
            
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
</style> 