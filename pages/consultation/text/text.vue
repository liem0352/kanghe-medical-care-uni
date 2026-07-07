<template>
    <view class="text-consultation">
        <view class="consultation-header">
            <view class="doctor-info">
                <image class="doctor-avatar" :src="doctor.avatar" mode="aspectFill"></image>
                <view class="doctor-details">
                    <text class="doctor-name">{{ doctor.name }}</text>
                    <text class="doctor-title">{{ doctor.title }}</text>
                    <text class="doctor-department">{{ doctor.department }}</text>
                </view>
            </view>
            <view class="consultation-status">
                <text class="status-text">{{ statusText }}</text>
            </view>
        </view>
        
        <view class="message-container">
            <scroll-view class="message-list" scroll-y="true" :scroll-top="scrollTop">
                <view 
                    v-for="(message, index) in messages" 
                    :key="index"
                    :class="'message-item ' + (message.isSelf ? 'self' : 'other')"
                >
                    <image 
                        v-if="!message.isSelf" 
                        class="avatar" 
                        :src="doctor.avatar" 
                        mode="aspectFill"
                    ></image>
                    <view class="message-content">
                        <view class="message-bubble">
                            <text v-if="message.type === 'text'" class="message-text">{{ message.content }}</text>
                            <image 
                                v-else-if="message.type === 'image'" 
                                class="message-image" 
                                :src="message.content" 
                                mode="widthFix"
                                @tap="previewImage(message.content)"
                            ></image>
                        </view>
                        <text class="message-time">{{ formatTime(message.time) }}</text>
                    </view>
                    <image 
                        v-if="message.isSelf" 
                        class="avatar" 
                        :src="userInfo.avatar" 
                        mode="aspectFill"
                    ></image>
                </view>
            </scroll-view>
        </view>
        
        <view class="input-container">
            <view class="input-toolbar">
                <text class="tool-btn" @tap="chooseImage">📷</text>
                <text class="tool-btn" @tap="chooseFile">📎</text>
            </view>
            <view class="input-area">
                <textarea 
                    class="message-input" 
                    v-model="inputMessage" 
                    placeholder="请输入您的问题..."
                    :maxlength="500"
                    auto-height
                ></textarea>
                <button 
                    class="send-btn" 
                    :disabled="!inputMessage.trim()"
                    @tap="sendMessage"
                >
                    发送
                </button>
            </view>
        </view>
    </view>
</template>

<script>
import { consultationAPI } from '@/utils/api.js'
import { showToast } from '@/utils/util.js'

export default {
    data() {
        return {
            doctor: {
                id: '',
                name: '张医生',
                title: '主任医师',
                department: '心内科',
                avatar: '/static/images/default-avatar.png'
            },
            userInfo: {
                avatar: '/static/images/default-avatar.png'
            },
            messages: [],
            inputMessage: '',
            scrollTop: 0,
            consultationId: '',
            status: 'active' // active, ended
        }
    },
    computed: {
        statusText() {
            return this.status === 'active' ? '咨询中' : '已结束'
        }
    },
    onLoad(options) {
        if (options.doctorId) {
            this.doctor.id = options.doctorId
            this.loadDoctorInfo()
        }
        if (options.consultationId) {
            this.consultationId = options.consultationId
            this.loadConsultationHistory()
        }
        this.loadUserInfo()
    },
    methods: {
        async loadDoctorInfo() {
            try {
                // 这里应该调用API获取医生信息
                console.log('加载医生信息')
            } catch (error) {
                showToast('加载医生信息失败')
            }
        },
        
        async loadConsultationHistory() {
            try {
                // 这里应该调用API获取咨询历史
                this.messages = [
                    {
                        id: 1,
                        type: 'text',
                        content: '您好，我是张医生，请问有什么可以帮助您的吗？',
                        time: new Date(Date.now() - 60000),
                        isSelf: false
                    }
                ]
            } catch (error) {
                showToast('加载咨询记录失败')
            }
        },
        
        loadUserInfo() {
            const userInfo = uni.getStorageSync('userInfo')
            if (userInfo) {
                this.userInfo = userInfo
            }
        },
        
        async sendMessage() {
            if (!this.inputMessage.trim()) return
            
            const message = {
                id: Date.now(),
                type: 'text',
                content: this.inputMessage,
                time: new Date(),
                isSelf: true
            }
            
            this.messages.push(message)
            this.inputMessage = ''
            this.scrollToBottom()
            
            try {
                // 这里应该调用API发送消息
                await consultationAPI.sendMessage({
                    consultationId: this.consultationId,
                    content: message.content,
                    type: 'text'
                })
            } catch (error) {
                showToast('发送失败')
            }
        },
        
        chooseImage() {
            uni.chooseImage({
                count: 1,
                success: (res) => {
                    const message = {
                        id: Date.now(),
                        type: 'image',
                        content: res.tempFilePaths[0],
                        time: new Date(),
                        isSelf: true
                    }
                    this.messages.push(message)
                    this.scrollToBottom()
                }
            })
        },
        
        chooseFile() {
            // 小程序不支持文件选择，这里可以添加其他功能
            showToast('暂不支持文件上传')
        },
        
        previewImage(url) {
            uni.previewImage({
                urls: [url]
            })
        },
        
        scrollToBottom() {
            this.$nextTick(() => {
                this.scrollTop = 999999
            })
        },
        
        formatTime(time) {
            const date = new Date(time)
            const now = new Date()
            const diff = now - date
            
            if (diff < 60000) {
                return '刚刚'
            } else if (diff < 3600000) {
                return Math.floor(diff / 60000) + '分钟前'
            } else if (diff < 86400000) {
                return Math.floor(diff / 3600000) + '小时前'
            } else {
                return date.toLocaleDateString()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.text-consultation {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    
    .consultation-header {
        background: #ffffff;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .doctor-info {
            display: flex;
            align-items: center;
            
            .doctor-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 12px;
            }
            
            .doctor-details {
                .doctor-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                    display: block;
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
            }
        }
        
        .consultation-status {
            .status-text {
                font-size: 14px;
                color: #19be6b;
                background: rgba(25, 190, 107, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
            }
        }
    }
    
    .message-container {
        flex: 1;
        overflow: hidden;
        
        .message-list {
            height: 100%;
            padding: 16px;
            
            .message-item {
                display: flex;
                margin-bottom: 16px;
                
                &.self {
                    flex-direction: row-reverse;
                    
                    .message-content {
                        align-items: flex-end;
                        
                        .message-bubble {
                            background: #19be6b;
                            color: #ffffff;
                        }
                    }
                }
                
                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin: 0 8px;
                }
                
                .message-content {
                    display: flex;
                    flex-direction: column;
                    max-width: 70%;
                    
                    .message-bubble {
                        background: #ffffff;
                        padding: 12px;
                        border-radius: 12px;
                        margin-bottom: 4px;
                        
                        .message-text {
                            font-size: 14px;
                            line-height: 1.4;
                            word-break: break-all;
                        }
                        
                        .message-image {
                            max-width: 200px;
                            border-radius: 8px;
                        }
                    }
                    
                    .message-time {
                        font-size: 11px;
                        color: #999999;
                    }
                }
            }
        }
    }
    
    .input-container {
        background: #ffffff;
        border-top: 1px solid #e0e0e0;
        padding: 12px;
        
        .input-toolbar {
            display: flex;
            margin-bottom: 8px;
            
            .tool-btn {
                font-size: 20px;
                margin-right: 16px;
                cursor: pointer;
            }
        }
        
        .input-area {
            display: flex;
            align-items: flex-end;
            
            .message-input {
                flex: 1;
                background: #f8f9fa;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
                max-height: 100px;
                margin-right: 8px;
            }
            
            .send-btn {
                background: #19be6b;
                color: #ffffff;
                border: none;
                border-radius: 8px;
                padding: 8px 16px;
                font-size: 14px;
                
                &:disabled {
                    background: #cccccc;
                }
            }
        }
    }
}
</style> 