<template>
    <view class="auth-container" v-if="showAuth">
        <view class="auth-modal">
            <view class="auth-header">
                <text class="auth-title">{{ title }}</text>
                <text class="auth-subtitle">{{ subtitle }}</text>
            </view>
            
            <view class="auth-content">
                <view class="permission-list">
                    <view 
                        v-for="(permission, index) in permissions" 
                        :key="index"
                        class="permission-item"
                    >
                        <view class="permission-icon">
                            <text class="icon">{{ permission.icon }}</text>
                        </view>
                        <view class="permission-info">
                            <text class="permission-name">{{ permission.name }}</text>
                            <text class="permission-desc">{{ permission.description }}</text>
                        </view>
                        <view class="permission-status">
                            <text :class="'status ' + permission.status">{{ permission.statusText }}</text>
                        </view>
                    </view>
                </view>
                
                <view class="auth-tips">
                    <text class="tips-text">{{ tips }}</text>
                </view>
            </view>
            
            <view class="auth-actions">
                <button 
                    v-if="showCancel"
                    class="auth-btn cancel" 
                    @tap="handleCancel"
                >
                    {{ cancelText }}
                </button>
                <button 
                    class="auth-btn confirm" 
                    @tap="handleConfirm"
                    :loading="loading"
                >
                    {{ confirmText }}
                </button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'Auth',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '需要权限授权'
        },
        subtitle: {
            type: String,
            default: '为了提供更好的服务，需要获取以下权限'
        },
        permissions: {
            type: Array,
            default: () => []
        },
        tips: {
            type: String,
            default: '您可以在设置中手动开启这些权限'
        },
        showCancel: {
            type: Boolean,
            default: true
        },
        cancelText: {
            type: String,
            default: '暂不开启'
        },
        confirmText: {
            type: String,
            default: '立即开启'
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        showAuth() {
            return this.show
        }
    },
    methods: {
        async handleConfirm() {
            this.loading = true
            
            try {
                // 检查并请求权限
                const results = await this.requestPermissions()
                
                // 检查权限状态
                const allGranted = results.every(result => result.granted)
                
                if (allGranted) {
                    this.$emit('success', results)
                    this.$emit('update:show', false)
                } else {
                    // 部分权限被拒绝
                    const deniedPermissions = results.filter(result => !result.granted)
                    this.$emit('partial', deniedPermissions)
                    
                    // 显示设置引导
                    this.showSettingsGuide()
                }
            } catch (error) {
                console.error('权限请求失败:', error)
                this.$emit('error', error)
            } finally {
                this.loading = false
            }
        },
        
        handleCancel() {
            this.$emit('cancel')
            this.$emit('update:show', false)
        },
        
        async requestPermissions() {
            const results = []
            
            for (const permission of this.permissions) {
                try {
                    const result = await this.requestSinglePermission(permission)
                    results.push(result)
                } catch (error) {
                    results.push({
                        permission: permission.key,
                        granted: false,
                        error: error.message
                    })
                }
            }
            
            return results
        },
        
        async requestSinglePermission(permission) {
            return new Promise((resolve) => {
                switch (permission.key) {
                    case 'location':
                        this.requestLocationPermission(resolve)
                        break
                    case 'camera':
                        this.requestCameraPermission(resolve)
                        break
                    case 'microphone':
                        this.requestMicrophonePermission(resolve)
                        break
                    case 'notification':
                        this.requestNotificationPermission(resolve)
                        break
                    case 'storage':
                        this.requestStoragePermission(resolve)
                        break
                    default:
                        resolve({
                            permission: permission.key,
                            granted: false,
                            error: '不支持的权限类型'
                        })
                }
            })
        },
        
        requestLocationPermission(resolve) {
            uni.authorize({
                scope: 'scope.userLocation',
                success: () => {
                    resolve({
                        permission: 'location',
                        granted: true
                    })
                },
                fail: () => {
                    resolve({
                        permission: 'location',
                        granted: false
                    })
                }
            })
        },
        
        requestCameraPermission(resolve) {
            uni.authorize({
                scope: 'scope.camera',
                success: () => {
                    resolve({
                        permission: 'camera',
                        granted: true
                    })
                },
                fail: () => {
                    resolve({
                        permission: 'camera',
                        granted: false
                    })
                }
            })
        },
        
        requestMicrophonePermission(resolve) {
            uni.authorize({
                scope: 'scope.record',
                success: () => {
                    resolve({
                        permission: 'microphone',
                        granted: true
                    })
                },
                fail: () => {
                    resolve({
                        permission: 'microphone',
                        granted: false
                    })
                }
            })
        },
        
        requestNotificationPermission(resolve) {
            // 小程序不支持通知权限，直接返回成功
            resolve({
                permission: 'notification',
                granted: true
            })
        },
        
        requestStoragePermission(resolve) {
            // 小程序不支持存储权限，直接返回成功
            resolve({
                permission: 'storage',
                granted: true
            })
        },
        
        showSettingsGuide() {
            uni.showModal({
                title: '权限设置',
                content: '部分权限被拒绝，请在设置中手动开启',
                confirmText: '去设置',
                cancelText: '取消',
                success: (res) => {
                    if (res.confirm) {
                        this.openAppSettings()
                    }
                }
            })
        },
        
        openAppSettings() {
            // #ifdef APP-PLUS
            if (plus.os.name.toLowerCase() === 'android') {
                const main = plus.android.runtimeMainActivity()
                const Intent = plus.android.importClass('android.content.Intent')
                const Settings = plus.android.importClass('android.provider.Settings')
                const Uri = plus.android.importClass('android.net.Uri')
                const mainActivity = plus.android.runtimeMainActivity()
                
                const intent = new Intent()
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                const uri = Uri.fromParts('package', mainActivity.getPackageName(), null)
                intent.setData(uri)
                mainActivity.startActivity(intent)
            } else {
                // iOS
                const UIApplication = plus.ios.import('UIApplication')
                const NSURL = plus.ios.import('NSURL')
                const application = UIApplication.sharedApplication()
                const setting_url = NSURL.URLWithString('app-settings:')
                application.openURL(setting_url)
                plus.ios.deleteObject(setting_url)
                plus.ios.deleteObject(NSURL)
                plus.ios.deleteObject(application)
                plus.ios.deleteObject(UIApplication)
            }
            // #endif
            
            // #ifdef MP
            uni.showToast({
                title: '请在微信设置中开启权限',
                icon: 'none'
            })
            // #endif
        }
    }
}
</script>

<style lang="scss" scoped>
.auth-container {
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
    
    .auth-modal {
        background: #ffffff;
        border-radius: 12px;
        margin: 20px;
        max-width: 320px;
        width: 100%;
        
        .auth-header {
            padding: 20px 20px 16px;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
            
            .auth-title {
                font-size: 18px;
                font-weight: 600;
                color: #333333;
                display: block;
                margin-bottom: 8px;
            }
            
            .auth-subtitle {
                font-size: 14px;
                color: #666666;
                line-height: 1.4;
            }
        }
        
        .auth-content {
            padding: 16px 20px;
            
            .permission-list {
                margin-bottom: 16px;
                
                .permission-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #f5f5f5;
                    
                    &:last-child {
                        border-bottom: none;
                    }
                    
                    .permission-icon {
                        margin-right: 12px;
                        
                        .icon {
                            font-size: 20px;
                            color: #19be6b;
                        }
                    }
                    
                    .permission-info {
                        flex: 1;
                        
                        .permission-name {
                            font-size: 14px;
                            color: #333333;
                            font-weight: 500;
                            display: block;
                            margin-bottom: 2px;
                        }
                        
                        .permission-desc {
                            font-size: 12px;
                            color: #666666;
                            line-height: 1.3;
                        }
                    }
                    
                    .permission-status {
                        .status {
                            font-size: 12px;
                            padding: 2px 6px;
                            border-radius: 4px;
                            
                            &.granted {
                                color: #19be6b;
                                background: rgba(25, 190, 107, 0.1);
                            }
                            
                            &.denied {
                                color: #ff6b35;
                                background: rgba(255, 107, 53, 0.1);
                            }
                            
                            &.pending {
                                color: #666666;
                                background: rgba(102, 102, 102, 0.1);
                            }
                        }
                    }
                }
            }
            
            .auth-tips {
                background: #f8f9fa;
                padding: 12px;
                border-radius: 6px;
                
                .tips-text {
                    font-size: 12px;
                    color: #666666;
                    line-height: 1.4;
                }
            }
        }
        
        .auth-actions {
            display: flex;
            padding: 16px 20px 20px;
            gap: 12px;
            
            .auth-btn {
                flex: 1;
                padding: 12px;
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
</style> 