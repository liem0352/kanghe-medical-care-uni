/**
 * 数据验证工具
 */

// 验证规则
export const rules = {
    // 手机号验证
    phone: {
        pattern: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号'
    },
    
    // 邮箱验证
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入正确的邮箱地址'
    },
    
    // 身份证号验证
    idCard: {
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '请输入正确的身份证号'
    },
    
    // 密码验证（至少8位，包含字母和数字）
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: '密码至少8位，必须包含字母和数字'
    },
    
    // 姓名验证
    name: {
        pattern: /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/,
        message: '姓名长度为2-20个字符'
    },
    
    // 年龄验证
    age: {
        pattern: /^(?:1[0-9]|[2-9][0-9]|100)$/,
        message: '年龄必须在10-100岁之间'
    },
    
    // 身高验证（cm）
    height: {
        pattern: /^(?:1[0-9][0-9]|[2-9][0-9]|100)$/,
        message: '身高必须在100-199cm之间'
    },
    
    // 体重验证（kg）
    weight: {
        pattern: /^(?:[1-9][0-9]|[1-9]|200)$/,
        message: '体重必须在1-200kg之间'
    },
    
    // 血压验证（收缩压/舒张压）
    bloodPressure: {
        pattern: /^(?:[1-9][0-9]|1[0-9][0-9]|200)\/(?:[1-9][0-9]|1[0-9][0-9]|200)$/,
        message: '请输入正确的血压格式，如：120/80'
    },
    
    // 心率验证
    heartRate: {
        pattern: /^(?:[1-9][0-9]|[1-9]|200)$/,
        message: '心率必须在1-200次/分钟之间'
    },
    
    // 血氧验证
    bloodOxygen: {
        pattern: /^(?:[1-9][0-9]|100)$/,
        message: '血氧饱和度必须在10-100%之间'
    }
}

// 验证单个字段
export function validateField(value, rule) {
    if (!value && rule.required) {
        return rule.message || '此字段为必填项'
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
        return rule.message || '格式不正确'
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
        return `最少${rule.minLength}个字符`
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
        return `最多${rule.maxLength}个字符`
    }
    
    if (value && rule.min && Number(value) < rule.min) {
        return `不能小于${rule.min}`
    }
    
    if (value && rule.max && Number(value) > rule.max) {
        return `不能大于${rule.max}`
    }
    
    return null
}

// 验证表单
export function validateForm(formData, formRules) {
    const errors = {}
    
    for (const field in formRules) {
        const value = formData[field]
        const rule = formRules[field]
        const error = validateField(value, rule)
        
        if (error) {
            errors[field] = error
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// 验证手机号
export function validatePhone(phone) {
    return rules.phone.pattern.test(phone)
}

// 验证邮箱
export function validateEmail(email) {
    return rules.email.pattern.test(email)
}

// 验证身份证号
export function validateIdCard(idCard) {
    return rules.idCard.pattern.test(idCard)
}

// 验证密码强度
export function validatePassword(password) {
    const result = {
        isValid: false,
        strength: 0,
        message: ''
    }
    
    if (!password) {
        result.message = '密码不能为空'
        return result
    }
    
    let strength = 0
    
    // 长度检查
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    
    // 包含数字
    if (/\d/.test(password)) strength += 1
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 1
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 1
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
    
    result.strength = strength
    result.isValid = strength >= 3
    
    if (strength < 2) {
        result.message = '密码强度太弱'
    } else if (strength < 4) {
        result.message = '密码强度中等'
    } else {
        result.message = '密码强度强'
    }
    
    return result
}

// 验证血压格式
export function validateBloodPressure(bloodPressure) {
    if (!bloodPressure) return false
    
    const parts = bloodPressure.split('/')
    if (parts.length !== 2) return false
    
    const systolic = parseInt(parts[0])
    const diastolic = parseInt(parts[1])
    
    if (isNaN(systolic) || isNaN(diastolic)) return false
    
    return systolic >= 60 && systolic <= 200 && 
           diastolic >= 40 && diastolic <= 150 &&
           systolic > diastolic
}

// 验证健康数据范围
export function validateHealthData(type, value) {
    const ranges = {
        heartRate: { min: 40, max: 200 },
        bloodPressure: { min: 60, max: 200 },
        bloodOxygen: { min: 70, max: 100 },
        temperature: { min: 35, max: 42 },
        weight: { min: 1, max: 300 },
        height: { min: 50, max: 250 }
    }
    
    const range = ranges[type]
    if (!range) return true
    
    const numValue = Number(value)
    return !isNaN(numValue) && numValue >= range.min && numValue <= range.max
}

// 验证日期格式
export function validateDate(dateString) {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
}

// 验证时间格式
export function validateTime(timeString) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(timeString)
}

// 验证文件大小
export function validateFileSize(fileSize, maxSize) {
    return fileSize <= maxSize
}

// 验证文件类型
export function validateFileType(fileName, allowedTypes) {
    const extension = fileName.split('.').pop().toLowerCase()
    return allowedTypes.includes(extension)
}

// 验证URL格式
export function validateURL(url) {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

// 验证数字范围
export function validateNumberRange(value, min, max) {
    const num = Number(value)
    return !isNaN(num) && num >= min && num <= max
}

// 验证字符串长度
export function validateStringLength(value, min, max) {
    const length = String(value).length
    return length >= min && length <= max
}

// 验证是否为空
export function validateRequired(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0
    }
    return value !== null && value !== undefined
}

// 验证数组长度
export function validateArrayLength(array, min, max) {
    if (!Array.isArray(array)) return false
    return array.length >= min && array.length <= max
}

export default {
    rules,
    validateField,
    validateForm,
    validatePhone,
    validateEmail,
    validateIdCard,
    validatePassword,
    validateBloodPressure,
    validateHealthData,
    validateDate,
    validateTime,
    validateFileSize,
    validateFileType,
    validateURL,
    validateNumberRange,
    validateStringLength,
    validateRequired,
    validateArrayLength
}
