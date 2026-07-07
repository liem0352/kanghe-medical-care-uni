<template>
    <view class="phone-consultation">
        <view class="call-info">
            <image class="doctor-avatar" :src="doctor.avatar" mode="aspectFill"></image>
            <text class="doctor-name">{{ doctor.name }}</text>
            <text class="call-status">{{ callStatus }}</text>
            <text class="call-duration" v-if="callDuration">{{ callDuration }}</text>
        </view>
        
        <view class="call-controls">
            <button class="control-btn mute" @tap="toggleMute">
                {{ isMuted ? '🔇' : '🎤' }}
            </button>
            <button class="control-btn speaker" @tap="toggleSpeaker">
                {{ isSpeakerOn ? '🔊' : '🔈' }}
            </button>
            <button class="control-btn end-call" @tap="endCall">📞</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            doctor: {
                name: '张医生',
                avatar: '/static/images/default-avatar.png'
            },
            callStatus: '正在连接...',
            callDuration: '',
            isMuted: false,
            isSpeakerOn: false,
            startTime: null,
            timer: null
        }
    },
    onLoad() {
        this.startCall()
    },
    onUnload() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods: {
        startCall() {
            this.startTime = new Date()
            this.callStatus = '通话中'
            this.startTimer()
        },
        
        startTimer() {
            this.timer = setInterval(() => {
                const now = new Date()
                const diff = now - this.startTime
                const minutes = Math.floor(diff / 60000)
                const seconds = Math.floor((diff % 60000) / 1000)
                this.callDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            }, 1000)
        },
        
        toggleMute() {
            this.isMuted = !this.isMuted
        },
        
        toggleSpeaker() {
            this.isSpeakerOn = !this.isSpeakerOn
        },
        
        endCall() {
            uni.showModal({
                title: '结束通话',
                content: '确定要结束当前通话吗？',
                success: (res) => {
                    if (res.confirm) {
                        if (this.timer) {
                            clearInterval(this.timer)
                        }
                        uni.navigateBack()
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.phone-consultation {
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .call-info {
        text-align: center;
        margin-bottom: 100px;
        
        .doctor-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 20px;
            border: 4px solid rgba(255, 255, 255, 0.3);
        }
        
        .doctor-name {
            font-size: 24px;
            color: #ffffff;
            font-weight: 600;
            display: block;
            margin-bottom: 10px;
        }
        
        .call-status {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            display: block;
            margin-bottom: 10px;
        }
        
        .call-duration {
            font-size: 18px;
            color: #ffffff;
            font-weight: 600;
        }
    }
    
    .call-controls {
        display: flex;
        gap: 30px;
        
        .control-btn {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: none;
            font-size: 28px;
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            
            &.mute {
                background: rgba(255, 255, 255, 0.2);
            }
            
            &.speaker {
                background: rgba(255, 255, 255, 0.2);
            }
            
            &.end-call {
                background: #ff6b35;
            }
        }
    }
}
</style> 