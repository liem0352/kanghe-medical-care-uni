<template>
    <view class="modal" v-if="showClone">
        <view class="modal-mask" @tap.stop.prevent="onClose"></view>
        <view class="modal-content">
            <view class="modal-header" v-if="title">
                {{ title }}
                <view class="close-btn" @tap.stop.prevent="onClose">
                    <text>×</text>
                </view>
            </view>
            <view class="modal-body">
                <slot name="body"></slot>
            </view>
            <view class="modal-footer">
                <button class="btn-cancel" @tap="onCancel" v-if="showCancel">{{ cancelText }}</button>
                <button class="btn-confirm" @tap="onConfirm" :open-type="confirmType">{{ confirmText }}</button>
            </view>
        </view>
    </view>
</template>

<script>
// components/modal/modal.js
export default {
    data() {
        return {
            showClone: false
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        confirmText: {
            type: String,
            default: '确定'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        showCancel: {
            type: Boolean,
            default: true
        },
        confirmType: {
            type: String,
            default: '' // 可选值：submit, reset等
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onClose() {
            this.$emit('close');
            this.setData({
                showClone: false
            });
        },
        onCancel() {
            this.$emit('cancel');
            this.setData({
                showClone: false
            });
        },
        onConfirm() {
            this.$emit('confirm');
        }
    },
    created: function () {},
    watch: {
        show: {
            handler: function (newVal, oldVal) {
                this.showClone = newVal;
            },

            immediate: true
        }
    }
};
</script>
<style>
/* components/modal/modal.wxss */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
}

.modal.show {
    visibility: visible;
    opacity: 1;
}

.modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    width: 80%;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
}

.modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn text {
    font-size: 20px;
    color: #999;
}

.modal-body {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}

.modal-footer button {
    margin-left: 15px;
    font-size: 16px;
    line-height: 1.5;
}

.btn-cancel {
    background-color: #fff;
    color: #999;
    border: 1px solid #d9d9d9;
}

.btn-confirm {
    background-color: #19be6b;
    color: #fff;
}
</style>
