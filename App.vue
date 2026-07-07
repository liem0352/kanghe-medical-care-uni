<script>
// app.js
export default {
    data() {
        return {};
    },
    onLaunch() {
        // 初始化全局数据
        this.globalData = {
            userInfo: null,
            token: null,
            fontSize: 'normal',
            healthScore: Math.floor(Math.random() * 14) + 85, // 初始化健康指数
            healthData: {
                heartRate: Math.floor(Math.random() * 20) + 70,
                bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 60}`,
                bloodOxygen: Math.floor(Math.random() * 10) + 90,
                temperature: Math.round((36.0 + Math.random() * 1.2) * 10) / 10 // 36.0-37.2之间，保留一位小数
            }
        };

        // 健康数据更新定时器
        this.globalData.updateHealthTimer();
    },
    onShow() {
        // 应用显示时刷新健康数据
        this.globalData.updateHealthData();
    },
    globalData: {
        updateHealthTimer() {
            if (this.healthTimer) {
                clearInterval(this.healthTimer);
            }

            // 每3分钟更新一次健康数据
            this.healthTimer = setInterval(() => {
                this.updateHealthData();
            }, 180000);
        },

        updateHealthData() {
            const newData = {
                heartRate: Math.floor(Math.random() * 20) + 70,
                bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 60}`,
                bloodOxygen: Math.floor(Math.random() * 10) + 90,
                temperature: Math.round((36.0 + Math.random() * 1.2) * 10) / 10 // 36.0-37.2之间，保留一位小数
            };
            this.healthData = newData;
            
            // 同时更新健康指数（每天变化一次）
            if (!this.lastHealthScoreUpdate || Date.now() - this.lastHealthScoreUpdate > 86400000) {
                this.healthScore = Math.floor(Math.random() * 14) + 85;
                this.lastHealthScoreUpdate = Date.now();
            }

            // 通知页面健康数据已更新
            this.notifyHealthDataChange();
            return newData;
        },

        notifyHealthDataChange() {
            const pages = getCurrentPages();
            if (pages.length > 0) {
                const currentPage = pages[pages.length - 1];
                if (currentPage.updateHealthData) {
                    currentPage.updateHealthData();
                }
            }
        },

        healthData: ''
    }
};
</script>
<style>
/* app.wxss */
page {
    background-color: #f5f7fa;
    font-family: PingFang SC, Microsoft YaHei, sans-serif;
    color: #333;
}

/* 卡片样式 */
.card {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 15px;
}

/* 按钮样式 */
.btn-primary {
    background: linear-gradient(135deg, #2d8cf0, #19be6b);
    color: white;
    border-radius: 50px;
    padding: 12px 0;
    text-align: center;
    margin: 20px auto;
    width: 80%;
}

.btn-danger {
    background: linear-gradient(135deg, #ff6b6b, #ff4545);
    color: white;
    border-radius: 50px;
    padding: 12px 0;
    text-align: center;
    margin: 20px auto;
    width: 80%;
}

/* 头部样式 */
.header {
    background: linear-gradient(135deg, #2d8cf0, #19be6b);
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 功能网格 */
.function-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 20px;
    background: #fff;
}

.grid-item {
    text-align: center;
}

.grid-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #2d8cf0, #19be6b);
    border-radius: 50%;
    margin: 0 auto 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.grid-title {
    font-size: 12px;
    color: #555;
}
</style>
