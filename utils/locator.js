/**
 * 定位和地图相关工具
 */

// 获取当前位置
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        uni.getLocation({
            type: 'gcj02',
            success: (res) => {
                resolve({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    accuracy: res.accuracy,
                    speed: res.speed,
                    altitude: res.altitude,
                    verticalAccuracy: res.verticalAccuracy,
                    horizontalAccuracy: res.horizontalAccuracy
                })
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 打开地图
export function openLocation(latitude, longitude, name = '', address = '') {
    uni.openLocation({
        latitude,
        longitude,
        name,
        address,
        scale: 18
    })
}

// 选择位置
export function chooseLocation() {
    return new Promise((resolve, reject) => {
        uni.chooseLocation({
            success: (res) => {
                resolve({
                    name: res.name,
                    address: res.address,
                    latitude: res.latitude,
                    longitude: res.longitude
                })
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 计算两点间距离（米）
export function calculateDistance(lat1, lng1, lat2, lng2) {
    const radLat1 = lat1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137 // 地球半径
    s = Math.round(s * 10000) / 10
    return s
}

// 格式化距离显示
export function formatDistance(distance) {
    if (distance < 1000) {
        return `${Math.round(distance)}m`
    } else {
        return `${(distance / 1000).toFixed(1)}km`
    }
}

// 获取地址信息（逆地理编码）
export function getAddressInfo(latitude, longitude) {
    return new Promise((resolve, reject) => {
        // 这里需要调用地图API服务，如腾讯地图、高德地图等
        // 示例使用腾讯地图API
        const key = 'YOUR_MAP_KEY' // 需要替换为实际的地图API密钥
        const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`
        
        uni.request({
            url,
            success: (res) => {
                if (res.data.status === 0) {
                    const result = res.data.result
                    resolve({
                        address: result.formatted_addresses.recommend,
                        province: result.address_components.province,
                        city: result.address_components.city,
                        district: result.address_components.district,
                        street: result.address_components.street,
                        street_number: result.address_components.street_number
                    })
                } else {
                    reject(new Error('获取地址信息失败'))
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 搜索周边地点
export function searchNearby(keyword, latitude, longitude, radius = 5000) {
    return new Promise((resolve, reject) => {
        const key = 'YOUR_MAP_KEY' // 需要替换为实际的地图API密钥
        const url = `https://apis.map.qq.com/ws/place/v1/search?keyword=${encodeURIComponent(keyword)}&boundary=nearby(${latitude},${longitude},${radius})&key=${key}`
        
        uni.request({
            url,
            success: (res) => {
                if (res.data.status === 0) {
                    resolve(res.data.data)
                } else {
                    reject(new Error('搜索失败'))
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 搜索医院
export function searchHospitals(latitude, longitude, radius = 5000) {
    return searchNearby('医院', latitude, longitude, radius)
}

// 搜索药店
export function searchPharmacies(latitude, longitude, radius = 5000) {
    return searchNearby('药店', latitude, longitude, radius)
}

// 搜索诊所
export function searchClinics(latitude, longitude, radius = 5000) {
    return searchNearby('诊所', latitude, longitude, radius)
}

// 获取路线规划
export function getRoute(fromLat, fromLng, toLat, toLng, mode = 'driving') {
    return new Promise((resolve, reject) => {
        const key = 'YOUR_MAP_KEY' // 需要替换为实际的地图API密钥
        const url = `https://apis.map.qq.com/ws/direction/v1/${mode}/?from=${fromLat},${fromLng}&to=${toLat},${toLng}&key=${key}`
        
        uni.request({
            url,
            success: (res) => {
                if (res.data.status === 0) {
                    resolve(res.data.result)
                } else {
                    reject(new Error('路线规划失败'))
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 检查定位权限
export function checkLocationPermission() {
    return new Promise((resolve) => {
        // #ifdef APP-PLUS
        const permission = plus.android.requestPermissions(['android.permission.ACCESS_FINE_LOCATION'])
        resolve(permission)
        // #endif
        
        // #ifdef H5
        if (navigator.geolocation) {
            resolve(true)
        } else {
            resolve(false)
        }
        // #endif
        
        // #ifdef MP
        resolve(true)
        // #endif
    })
}

// 请求定位权限
export function requestLocationPermission() {
    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        plus.android.requestPermissions(['android.permission.ACCESS_FINE_LOCATION'], (result) => {
            resolve(result)
        }, (error) => {
            reject(error)
        })
        // #endif
        
        // #ifdef H5
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => {
                resolve(true)
            }, () => {
                reject(new Error('定位权限被拒绝'))
            })
        } else {
            reject(new Error('浏览器不支持定位'))
        }
        // #endif
        
        // #ifdef MP
        uni.authorize({
            scope: 'scope.userLocation',
            success: () => {
                resolve(true)
            },
            fail: () => {
                reject(new Error('定位权限被拒绝'))
            }
        })
        // #endif
    })
}

// 监听位置变化
export function watchLocation(callback) {
    // #ifdef APP-PLUS
    const watchId = plus.geolocation.watchPosition(
        (position) => {
            callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                speed: position.coords.speed,
                altitude: position.coords.altitude
            })
        },
        (error) => {
            console.error('位置监听失败:', error)
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    )
    return watchId
    // #endif
    
    // #ifdef H5
    if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    speed: position.coords.speed,
                    altitude: position.coords.altitude
                })
            },
            (error) => {
                console.error('位置监听失败:', error)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        )
        return watchId
    }
    // #endif
}

// 停止位置监听
export function clearLocationWatch(watchId) {
    // #ifdef APP-PLUS
    plus.geolocation.clearWatch(watchId)
    // #endif
    
    // #ifdef H5
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId)
    }
    // #endif
}

// 获取当前位置并返回地址信息
export function getCurrentLocationWithAddress() {
    return new Promise(async (resolve, reject) => {
        try {
            const location = await getCurrentLocation()
            const address = await getAddressInfo(location.latitude, location.longitude)
            resolve({
                ...location,
                ...address
            })
        } catch (error) {
            reject(error)
        }
    })
}

export default {
    getCurrentLocation,
    openLocation,
    chooseLocation,
    calculateDistance,
    formatDistance,
    getAddressInfo,
    searchNearby,
    searchHospitals,
    searchPharmacies,
    searchClinics,
    getRoute,
    checkLocationPermission,
    requestLocationPermission,
    watchLocation,
    clearLocationWatch,
    getCurrentLocationWithAddress
}
