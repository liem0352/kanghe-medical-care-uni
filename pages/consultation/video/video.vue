<template>
    <view class="video-consultation">
        <view class="video-container">
            <view class="remote-video">
                <text class="video-placeholder">医生视频画面</text>
            </view>
            <view class="local-video">
                <text class="video-placeholder">我的视频画面</text>
            </view>
        </view>
        
        <view class="control-panel">
            <view class="control-buttons">
                <button class="control-btn" @tap="toggleCamera">
                    {{ cameraOn ? '📹' : '🚫' }}
                </button>
                <button class="control-btn" @tap="toggleMicrophone">
                    {{ microphoneOn ? '🎤' : '🔇' }}
                </button>
                <button class="control-btn" @tap="switchCamera">🔄</button>
                <button class="control-btn end-call" @tap="endCall">📞</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            cameraOn: true,
            microphoneOn: true
        }
    },
    methods: {
        toggleCamera() {
            this.cameraOn = !this.cameraOn
        },
        toggleMicrophone() {
            this.microphoneOn = !this.microphoneOn
        },
        switchCamera() {
            // 切换前后摄像头
        },
        endCall() {
            uni.showModal({
                title: '结束通话',
                content: '确定要结束当前通话吗？',
                success: (res) => {
                    if (res.confirm) {
                        uni.navigateBack()
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.video-consultation {
    height: 100vh;
    background: #000000;
    display: flex;
    flex-direction: column;
    
    .video-container {
        flex: 1;
        position: relative;
        
        .remote-video {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .video-placeholder {
                color: #ffffff;
                font-size: 18px;
            }
        }
        
        .local-video {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 120px;
            height: 160px;
            background: #333333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .video-placeholder {
                color: #ffffff;
                font-size: 12px;
            }
        }
    }
    
    .control-panel {
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        
        .control-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            
            .control-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: none;
                font-size: 24px;
                background: #666666;
                color: #ffffff;
                
                &.end-call {
                    background: #ff6b35;
                }
            }
        }
    }
}
</style> 