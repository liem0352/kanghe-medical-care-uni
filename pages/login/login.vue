<template>
    <view class="login-container">
        <!-- 背景装饰 -->
        <view class="bg-decoration">
            <view class="circle circle-1"></view>
            <view class="circle circle-2"></view>
            <view class="circle circle-3"></view>
        </view>
        
        <!-- 头部区域 -->
        <view class="header">
            <image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
            <text class="app-name">康禾·智慧医养</text>
            <text class="app-slogan">让健康管理更简单</text>
        </view>
        
        <!-- 登录表单 -->
        <view class="login-form">
            <view class="form-group">
                <view class="input-wrapper">
                    <text class="input-icon">📱</text>
                    <input 
                        class="form-input" 
                        type="text" 
                        placeholder="请输入手机号"
                        v-model="formData.phone"
                    />
                </view>
            </view>
            
            <view class="form-group">
                <view class="input-wrapper">
                    <text class="input-icon">🔒</text>
                    <input 
                        class="form-input" 
                        :type="showPassword ? 'text' : 'password'" 
                        placeholder="请输入密码"
                        v-model="formData.password"
                    />
                    <text class="password-toggle" @tap="togglePassword">
                        {{ showPassword ? '👁️' : '🙈' }}
                    </text>
                </view>
            </view>
            
            <view class="form-options">
                <label class="remember-me">
                    <checkbox :checked="rememberMe" @tap="toggleRememberMe" />
                    <text>记住我</text>
                </label>
                <text class="forgot-password" @tap="forgotPassword">忘记密码？</text>
            </view>
            
            <button 
                class="login-btn" 
                @tap="handleLogin"
                :loading="loading"
            >
                {{ loading ? '登录中...' : '登录' }}
            </button>
            
            <view class="divider">
                <text class="divider-text">或</text>
            </view>
            
            <view class="social-login">
                <button class="social-btn wechat" @tap="wechatLogin">
                    <text class="social-icon">💬</text>
                    <text>微信登录</text>
                </button>
                <button class="social-btn phone" @tap="phoneLogin">
                    <text class="social-icon">📞</text>
                    <text>手机验证码</text>
                </button>
            </view>
        </view>
        
        <!-- 底部区域 -->
        <view class="footer">
            <text class="register-link" @tap="goToRegister">还没有账号？立即注册</text>
            <text class="terms-link" @tap="showTerms">用户协议和隐私政策</text>
        </view>
        
        <!-- 验证码登录弹窗 -->
        <view class="verification-modal" v-if="showVerification">
            <view class="modal-content">
                <view class="modal-header">
                    <text class="modal-title">手机验证码登录</text>
                    <text class="close-btn" @tap="closeVerification">✕</text>
                </view>
                
                <view class="verification-form">
                    <view class="form-group">
                        <input 
                            class="form-input" 
                            type="number" 
                            placeholder="请输入验证码"
                            v-model="verificationCode"
                            maxlength="6"
                        />
                        <button 
                            class="send-code-btn" 
                            :disabled="countdown > 0"
                            @tap="sendVerificationCode"
                        >
                            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
                        </button>
                    </view>
                    
                    <button class="verify-btn" @tap="verifyCode">验证并登录</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                phone: '',
                password: ''
            },
            showPassword: false,
            rememberMe: false,
            loading: false,
            showVerification: false,
            verificationCode: '',
            countdown: 0,
            timer: null
        }
    },
    onLoad() {
        // 检查是否有保存的登录信息
        this.checkSavedLogin()
    },
    onUnload() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword
        },
        
        toggleRememberMe() {
            this.rememberMe = !this.rememberMe
        },
        
        async handleLogin() {
            this.loading = true
            
            try {
                // 模拟登录延迟
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                // 保存登录信息
                this.saveLoginInfo({
                    token: 'demo-token-' + Date.now(),
                    userInfo: {
                        id: 1,
                        name: '演示用户',
                        phone: this.formData.phone || '13800138000',
                        avatar: '/static/images/logo.png'
                    }
                })
                
                uni.showToast({
                    title: '登录成功',
                    icon: 'success'
                })
                
                // 跳转到首页
                setTimeout(() => {
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                }, 1500)
                
            } catch (error) {
                console.error('登录失败:', error)
                uni.showToast({
                    title: '登录失败，请重试',
                    icon: 'none'
                })
            } finally {
                this.loading = false
            }
        },
        
        saveLoginInfo(loginData) {
            // 保存token
            uni.setStorageSync('token', loginData.token)
            
            // 保存用户信息
            uni.setStorageSync('userInfo', loginData.userInfo)
            
            // 如果选择记住我，保存登录凭证
            if (this.rememberMe) {
                uni.setStorageSync('rememberedPhone', this.formData.phone)
                uni.setStorageSync('rememberedPassword', this.formData.password)
            } else {
                uni.removeStorageSync('rememberedPhone')
                uni.removeStorageSync('rememberedPassword')
            }
        },
        
        checkSavedLogin() {
            const rememberedPhone = uni.getStorageSync('rememberedPhone')
            const rememberedPassword = uni.getStorageSync('rememberedPassword')
            
            if (rememberedPhone && rememberedPassword) {
                this.formData.phone = rememberedPhone
                this.formData.password = rememberedPassword
                this.rememberMe = true
            }
        },
        
        wechatLogin() {
            // #ifdef MP-WEIXIN
            uni.login({
                provider: 'weixin',
                success: async (loginRes) => {
                    try {
                        uni.showLoading({
                            title: '微信登录中...'
                        })
                        
                        // 模拟微信登录
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        
                        const result = {
                            token: 'wechat-token-' + Date.now(),
                            userInfo: {
                                id: 1,
                                name: '微信用户',
                                phone: '13800138000',
                                avatar: '/static/images/logo.png'
                            }
                        }
                        
                        this.saveLoginInfo(result)
                        uni.showToast({
                            title: '登录成功',
                            icon: 'success'
                        })
                        
                        setTimeout(() => {
                            uni.reLaunch({
                                url: '/pages/index/index'
                            })
                        }, 1500)
                        
                    } catch (error) {
                        uni.showToast({
                            title: '微信登录失败',
                            icon: 'none'
                        })
                    } finally {
                        uni.hideLoading()
                    }
                },
                fail: () => {
                    uni.showToast({
                        title: '微信登录失败',
                        icon: 'none'
                    })
                }
            })
            // #endif
            
            // #ifndef MP-WEIXIN
            uni.showToast({
                title: '请在微信小程序中使用微信登录',
                icon: 'none'
            })
            // #endif
        },
        
        phoneLogin() {
            this.showVerification = true
        },
        
        closeVerification() {
            this.showVerification = false
            this.verificationCode = ''
        },
        
        async sendVerificationCode() {
            try {
                uni.showLoading({
                    title: '发送中...'
                })
                
                // 模拟发送验证码
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                uni.showToast({
                    title: '验证码已发送',
                    icon: 'success'
                })
                this.startCountdown()
                
            } catch (error) {
                uni.showToast({
                    title: '发送失败，请重试',
                    icon: 'none'
                })
            } finally {
                uni.hideLoading()
            }
        },
        
        startCountdown() {
            this.countdown = 60
            this.timer = setInterval(() => {
                this.countdown--
                if (this.countdown <= 0) {
                    clearInterval(this.timer)
                }
            }, 1000)
        },
        
        async verifyCode() {
            if (!this.verificationCode) {
                uni.showToast({
                    title: '请输入验证码',
                    icon: 'none'
                })
                return
            }
            
            try {
                uni.showLoading({
                    title: '验证中...'
                })
                
                // 模拟验证码验证
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                const result = {
                    token: 'sms-token-' + Date.now(),
                    userInfo: {
                        id: 1,
                        name: '验证码用户',
                        phone: this.formData.phone || '13800138000',
                        avatar: '/static/images/logo.png'
                    }
                }
                
                this.saveLoginInfo(result)
                uni.showToast({
                    title: '登录成功',
                    icon: 'success'
                })
                this.closeVerification()
                
                setTimeout(() => {
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                }, 1500)
                
            } catch (error) {
                uni.showToast({
                    title: '验证码错误',
                    icon: 'none'
                })
            } finally {
                uni.hideLoading()
            }
        },
        
        forgotPassword() {
            uni.navigateTo({
                url: '/pages/login/forgot-password'
            })
        },
        
        goToRegister() {
            uni.navigateTo({
                url: '/pages/login/register'
            })
        },
        
        showTerms() {
            uni.navigateTo({
                url: '/pages/common/terms/terms'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
    
    .bg-decoration {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        
        .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            
            &.circle-1 {
                width: 200px;
                height: 200px;
                top: -100px;
                right: -100px;
            }
            
            &.circle-2 {
                width: 150px;
                height: 150px;
                bottom: 100px;
                left: -75px;
            }
            
            &.circle-3 {
                width: 100px;
                height: 100px;
                top: 50%;
                right: 50px;
            }
        }
    }
    
    .header {
        padding: 80px 40px 40px;
        text-align: center;
        
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        
        .app-name {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            display: block;
            margin-bottom: 8px;
        }
        
        .app-slogan {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
        }
    }
    
    .login-form {
        background: #ffffff;
        margin: 0 20px;
        border-radius: 20px;
        padding: 40px 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        
        .form-group {
            margin-bottom: 20px;
            
            .input-wrapper {
                display: flex;
                align-items: center;
                background: #f8f9fa;
                border-radius: 12px;
                padding: 0 16px;
                border: 2px solid transparent;
                transition: all 0.3s;
                
                &:focus-within {
                    border-color: #19be6b;
                    background: #ffffff;
                }
                
                .input-icon {
                    font-size: 20px;
                    margin-right: 12px;
                }
                
                .form-input {
                    flex: 1;
                    height: 50px;
                    font-size: 16px;
                    background: transparent;
                    border: none;
                    outline: none;
                }
                
                .password-toggle {
                    font-size: 20px;
                    padding: 8px;
                    cursor: pointer;
                }
            }
        }
        
        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            
            .remember-me {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #666666;
                
                checkbox {
                    margin-right: 8px;
                }
            }
            
            .forgot-password {
                font-size: 14px;
                color: #19be6b;
                cursor: pointer;
            }
        }
        
        .login-btn {
            width: 100%;
            height: 50px;
            background: #19be6b;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            transition: all 0.3s;
        }
        
        .divider {
            position: relative;
            text-align: center;
            margin: 20px 0;
            
            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #e0e0e0;
            }
            
            .divider-text {
                background: #ffffff;
                padding: 0 16px;
                font-size: 14px;
                color: #999999;
            }
        }
        
        .social-login {
            display: flex;
            gap: 12px;
            
            .social-btn {
                flex: 1;
                height: 44px;
                border: 1px solid #e0e0e0;
                background: #ffffff;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: #333333;
                
                .social-icon {
                    margin-right: 6px;
                }
                
                &.wechat {
                    border-color: #07c160;
                    color: #07c160;
                }
                
                &.phone {
                    border-color: #19be6b;
                    color: #19be6b;
                }
            }
        }
    }
    
    .footer {
        padding: 30px 40px;
        text-align: center;
        
        .register-link {
            font-size: 16px;
            color: #ffffff;
            display: block;
            margin-bottom: 12px;
            cursor: pointer;
        }
        
        .terms-link {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
        }
    }
    
    .verification-modal {
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
            border-radius: 16px;
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
                    padding: 4px;
                }
            }
            
            .verification-form {
                padding: 20px;
                
                .form-group {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 20px;
                    
                    .form-input {
                        flex: 1;
                        height: 44px;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 0 12px;
                        font-size: 16px;
                    }
                    
                    .send-code-btn {
                        width: 100px;
                        height: 44px;
                        background: #19be6b;
                        color: #ffffff;
                        border: none;
                        border-radius: 8px;
                        font-size: 12px;
                        
                        &:disabled {
                            background: #cccccc;
                        }
                    }
                }
                
                .verify-btn {
                    width: 100%;
                    height: 44px;
                    background: #19be6b;
                    color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>
