<template>
    <view class="medication-library">
        <view class="search-bar">
            <input class="search-input" v-model="searchKeyword" placeholder="搜索药品" />
        </view>
        
        <view class="category-tabs">
            <text 
                v-for="(category, index) in categories" 
                :key="index"
                :class="'tab ' + (activeCategory === category.id ? 'active' : '')"
                @tap="selectCategory(category.id)"
            >
                {{ category.name }}
            </text>
        </view>
        
        <view class="medication-list">
            <view 
                v-for="(medication, index) in filteredMedications" 
                :key="index"
                class="medication-item"
                @tap="viewMedication(medication)"
            >
                <image class="medication-image" :src="medication.image" mode="aspectFill"></image>
                <view class="medication-info">
                    <text class="medication-name">{{ medication.name }}</text>
                    <text class="medication-desc">{{ medication.description }}</text>
                    <text class="medication-category">{{ medication.category }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            searchKeyword: '',
            activeCategory: 'all',
            categories: [
                { id: 'all', name: '全部' },
                { id: 'cardio', name: '心血管' },
                { id: 'diabetes', name: '糖尿病' },
                { id: 'hypertension', name: '高血压' }
            ],
            medications: [
                {
                    name: '阿司匹林',
                    description: '抗血小板聚集药物',
                    category: '心血管',
                    image: '/static/images/medication1.png'
                },
                {
                    name: '二甲双胍',
                    description: '降血糖药物',
                    category: '糖尿病',
                    image: '/static/images/medication2.png'
                }
            ]
        }
    },
    computed: {
        filteredMedications() {
            return this.medications.filter(med => {
                const matchKeyword = !this.searchKeyword || 
                    med.name.includes(this.searchKeyword) || 
                    med.description.includes(this.searchKeyword)
                const matchCategory = this.activeCategory === 'all' || 
                    med.category === this.categories.find(c => c.id === this.activeCategory)?.name
                return matchKeyword && matchCategory
            })
        }
    },
    methods: {
        selectCategory(categoryId) {
            this.activeCategory = categoryId
        },
        viewMedication(medication) {
            // 查看药品详情
        }
    }
}
</script>

<style lang="scss" scoped>
.medication-library {
    padding: 16px;
    
    .search-bar {
        margin-bottom: 16px;
        
        .search-input {
            width: 100%;
            height: 40px;
            background: #f5f5f5;
            border-radius: 20px;
            padding: 0 16px;
            font-size: 14px;
        }
    }
    
    .category-tabs {
        display: flex;
        margin-bottom: 16px;
        
        .tab {
            padding: 8px 16px;
            margin-right: 8px;
            background: #f5f5f5;
            border-radius: 16px;
            font-size: 14px;
            color: #666666;
            
            &.active {
                background: #19be6b;
                color: #ffffff;
            }
        }
    }
    
    .medication-list {
        .medication-item {
            background: #ffffff;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            
            .medication-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                margin-right: 12px;
            }
            
            .medication-info {
                flex: 1;
                
                .medication-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333333;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .medication-desc {
                    font-size: 14px;
                    color: #666666;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .medication-category {
                    font-size: 12px;
                    color: #19be6b;
                    background: rgba(25, 190, 107, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style> 