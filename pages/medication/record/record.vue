<template>
    <view class="medication-record">
        <view class="header">
            <view class="stats">
                <view class="stat-item">
                    <text class="stat-value">{{ todayCount }}</text>
                    <text class="stat-label">今日用药</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ totalCount }}</text>
                    <text class="stat-label">总记录</text>
                </view>
            </view>
            <button class="add-btn" @tap="addRecord">添加记录</button>
        </view>
        
        <view class="record-list">
            <view 
                v-for="(record, index) in records" 
                :key="index"
                class="record-item"
                @tap="viewRecord(record)"
            >
                <view class="record-info">
                    <text class="medication-name">{{ record.medicationName }}</text>
                    <text class="dosage">{{ record.dosage }}</text>
                    <text class="time">{{ formatTime(record.time) }}</text>
                </view>
                <view class="record-status">
                    <text :class="'status ' + record.status">{{ getStatusText(record.status) }}</text>
                </view>
            </view>
        </view>
        
        <!-- 添加记录弹窗 -->
        <view class="modal" v-if="showModal">
            <view class="modal-content">
                <view class="modal-header">
                    <text class="modal-title">添加用药记录</text>
                    <text class="close-btn" @tap="closeModal">✕</text>
                </view>
                
                <view class="form">
                    <view class="form-group">
                        <text class="label">药品名称</text>
                        <input class="input" v-model="formData.medicationName" placeholder="请输入药品名称" />
                    </view>
                    
                    <view class="form-group">
                        <text class="label">用药剂量</text>
                        <input class="input" v-model="formData.dosage" placeholder="如：1片" />
                    </view>
                    
                    <view class="form-group">
                        <text class="label">用药时间</text>
                        <picker mode="time" @change="onTimeChange">
                            <view class="picker">{{ formData.time || '请选择时间' }}</view>
                        </picker>
                    </view>
                    
                    <view class="form-group">
                        <text class="label">备注</text>
                        <textarea class="textarea" v-model="formData.note" placeholder="请输入备注信息"></textarea>
                    </view>
                </view>
                
                <view class="modal-actions">
                    <button class="btn cancel" @tap="closeModal">取消</button>
                    <button class="btn confirm" @tap="saveRecord">保存</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { medicationManager } from '@/services/medical.js'
import { showToast } from '@/utils/util.js'

export default {
    data() {
        return {
            records: [],
            todayCount: 0,
            totalCount: 0,
            showModal: false,
            formData: {
                medicationName: '',
                dosage: '',
                time: '',
                note: ''
            }
        }
    },
    onLoad() {
        this.loadRecords()
    },
    methods: {
        async loadRecords() {
            try {
                const data = await medicationManager.getMedicationList()
                this.records = data.list || []
                this.totalCount = this.records.length
                this.todayCount = this.records.filter(record => {
                    const today = new Date().toDateString()
                    const recordDate = new Date(record.time).toDateString()
                    return today === recordDate
                }).length
            } catch (error) {
                showToast('加载记录失败')
            }
        },
        
        addRecord() {
            this.showModal = true
            this.formData = {
                medicationName: '',
                dosage: '',
                time: '',
                note: ''
            }
        },
        
        closeModal() {
            this.showModal = false
        },
        
        onTimeChange(e) {
            this.formData.time = e.detail.value
        },
        
        async saveRecord() {
            if (!this.formData.medicationName || !this.formData.dosage) {
                showToast('请填写完整信息')
                return
            }
            
            try {
                const record = {
                    ...this.formData,
                    time: new Date().toISOString(),
                    status: 'taken'
                }
                
                await medicationManager.addMedication(record)
                this.closeModal()
                this.loadRecords()
            } catch (error) {
                showToast('保存失败')
            }
        },
        
        viewRecord(record) {
            // 查看记录详情
            console.log('查看记录:', record)
        },
        
        formatTime(time) {
            const date = new Date(time)
            return date.toLocaleString()
        },
        
        getStatusText(status) {
            const statusMap = {
                'taken': '已服用',
                'missed': '已错过',
                'scheduled': '待服用'
            }
            return statusMap[status] || '未知'
        }
    }
}
</script>

<style lang="scss" scoped>
.medication-record {
    padding: 16px;
    
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        .stats {
            display: flex;
            gap: 20px;
            
            .stat-item {
                text-align: center;
                
                .stat-value {
                    font-size: 24px;
                    font-weight: 600;
                    color: #19be6b;
                    display: block;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #666666;
                }
            }
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
    
    .record-list {
        .record-item {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .record-info {
                .medication-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .dosage {
                    font-size: 14px;
                    color: #666666;
                    margin-right: 12px;
                }
                
                .time {
                    font-size: 12px;
                    color: #999999;
                }
            }
            
            .record-status {
                .status {
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    
                    &.taken {
                        color: #19be6b;
                        background: rgba(25, 190, 107, 0.1);
                    }
                    
                    &.missed {
                        color: #ff6b35;
                        background: rgba(255, 107, 53, 0.1);
                    }
                    
                    &.scheduled {
                        color: #666666;
                        background: rgba(102, 102, 102, 0.1);
                    }
                }
            }
        }
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        
        .modal-content {
            background: #ffffff;
            border-radius: 12px;
            margin: 20px;
            width: 100%;
            max-width: 320px;
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 20px 16px;
                border-bottom: 1px solid #f0f0f0;
                
                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333333;
                }
                
                .close-btn {
                    font-size: 20px;
                    color: #999999;
                    cursor: pointer;
                }
            }
            
            .form {
                padding: 20px;
                
                .form-group {
                    margin-bottom: 16px;
                    
                    .label {
                        font-size: 14px;
                        color: #333333;
                        display: block;
                        margin-bottom: 8px;
                    }
                    
                    .input, .picker {
                        width: 100%;
                        height: 40px;
                        border: 1px solid #e0e0e0;
                        border-radius: 6px;
                        padding: 0 12px;
                        font-size: 14px;
                        background: #ffffff;
                    }
                    
                    .textarea {
                        width: 100%;
                        height: 80px;
                        border: 1px solid #e0e0e0;
                        border-radius: 6px;
                        padding: 8px 12px;
                        font-size: 14px;
                        resize: none;
                    }
                }
            }
            
            .modal-actions {
                display: flex;
                padding: 16px 20px 20px;
                gap: 12px;
                
                .btn {
                    flex: 1;
                    height: 40px;
                    border-radius: 6px;
                    font-size: 14px;
                    border: none;
                    
                    &.cancel {
                        background: #f5f5f5;
                        color: #666666;
                    }
                    
                    &.confirm {
                        background: #19be6b;
                        color: #ffffff;
                    }
                }
            }
        }
    }
}
</style> 