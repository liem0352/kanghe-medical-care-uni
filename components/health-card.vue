<template>
    <view class="health-card" @tap="handleCardTap">
        <view class="card-header">
            <view class="header-left">
                <text class="card-title">{{ title }}</text>
                <text v-if="subtitle" class="card-subtitle">{{ subtitle }}</text>
            </view>
            <view class="header-right">
                <text v-if="trend" :class="'trend-indicator ' + trend.type">{{ trend.text }}</text>
                <text v-if="unit" class="unit">{{ unit }}</text>
            </view>
        </view>
        
        <view class="card-content">
            <view class="main-value">
                <text class="value">{{ value }}</text>
                <text v-if="secondaryValue" class="secondary-value">{{ secondaryValue }}</text>
            </view>
            
            <view v-if="chartData && chartData.length > 0" class="chart-container">
                <canvas canvas-id="healthChart" class="health-chart"></canvas>
            </view>
            
            <view v-if="details" class="details">
                <view v-for="(detail, index) in details" :key="index" class="detail-item">
                    <text class="detail-label">{{ detail.label }}</text>
                    <text class="detail-value">{{ detail.value }}</text>
                </view>
            </view>
        </view>
        
        <view v-if="actions && actions.length > 0" class="card-actions">
            <button 
                v-for="(action, index) in actions" 
                :key="index"
                :class="'action-btn ' + action.type"
                @tap.stop="handleAction(action)"
            >
                {{ action.text }}
            </button>
        </view>
    </view>
</template>

<script>
export default {
    name: 'HealthCard',
    props: {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Number],
            required: true
        },
        secondaryValue: {
            type: String,
            default: ''
        },
        unit: {
            type: String,
            default: ''
        },
        trend: {
            type: Object,
            default: null
        },
        chartData: {
            type: Array,
            default: () => []
        },
        details: {
            type: Array,
            default: () => []
        },
        actions: {
            type: Array,
            default: () => []
        }
    },
    mounted() {
        if (this.chartData && this.chartData.length > 0) {
            this.drawChart()
        }
    },
    methods: {
        handleCardTap() {
            this.$emit('card-tap', this)
        },
        
        handleAction(action) {
            this.$emit('action', action)
        },
        
        drawChart() {
            // 简单的图表绘制逻辑
            const ctx = uni.createCanvasContext('healthChart', this)
            const canvasWidth = 200
            const canvasHeight = 60
            const padding = 10
            
            // 清空画布
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            
            if (this.chartData.length < 2) return
            
            // 计算数据范围
            const values = this.chartData.map(item => item.value)
            const minValue = Math.min(...values)
            const maxValue = Math.max(...values)
            const range = maxValue - minValue || 1
            
            // 绘制折线图
            const stepX = (canvasWidth - padding * 2) / (this.chartData.length - 1)
            
            ctx.beginPath()
            ctx.setStrokeStyle('#19be6b')
            ctx.setLineWidth(2)
            
            this.chartData.forEach((item, index) => {
                const x = padding + index * stepX
                const y = canvasHeight - padding - ((item.value - minValue) / range) * (canvasHeight - padding * 2)
                
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
            
            ctx.stroke()
            ctx.draw()
        }
    }
}
</script>

<style lang="scss" scoped>
.health-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .header-left {
            .card-title {
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                display: block;
                margin-bottom: 2px;
            }
            
            .card-subtitle {
                font-size: 12px;
                color: #666666;
            }
        }
        
        .header-right {
            display: flex;
            align-items: center;
            
            .trend-indicator {
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 8px;
                
                &.up {
                    color: #19be6b;
                    background: rgba(25, 190, 107, 0.1);
                }
                
                &.down {
                    color: #ff6b35;
                    background: rgba(255, 107, 53, 0.1);
                }
                
                &.stable {
                    color: #666666;
                    background: rgba(102, 102, 102, 0.1);
                }
            }
            
            .unit {
                font-size: 12px;
                color: #999999;
            }
        }
    }
    
    .card-content {
        .main-value {
            display: flex;
            align-items: baseline;
            margin-bottom: 12px;
            
            .value {
                font-size: 24px;
                font-weight: 700;
                color: #333333;
                margin-right: 8px;
            }
            
            .secondary-value {
                font-size: 14px;
                color: #666666;
            }
        }
        
        .chart-container {
            margin-bottom: 12px;
            
            .health-chart {
                width: 100%;
                height: 60px;
            }
        }
        
        .details {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            
            .detail-item {
                display: flex;
                flex-direction: column;
                
                .detail-label {
                    font-size: 11px;
                    color: #999999;
                    margin-bottom: 2px;
                }
                
                .detail-value {
                    font-size: 14px;
                    color: #333333;
                    font-weight: 500;
                }
            }
        }
    }
    
    .card-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        
        .action-btn {
            flex: 1;
            padding: 8px 12px;
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
            
            &.danger {
                background: #ff6b35;
                color: #ffffff;
            }
        }
    }
}

// 健康指标卡片变体
.health-card {
    &.vital-sign {
        border-left: 4px solid #19be6b;
    }
    
    &.warning {
        border-left: 4px solid #ff6b35;
    }
    
    &.critical {
        border-left: 4px solid #dd524d;
    }
}
</style> 