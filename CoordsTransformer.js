/**
 * @author zhoulujun.cn
 * @version 1.0
 * @description  坐标转换基础类
 *               转换方法，来之于：https://www.npmjs.com/package/coordinate-convert |use MIT License
 *               提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 *

 */
// 定义一些常量
const x_PI = 3.14159265358979324 * 3000.0 / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

class CoordsTransformer {
    constructor (decimal = 6) {
        this.decimal = decimal
    }

    /**
     * 设置小数点位数
     * @param num {Number} decimal places
     */
    setDecimal (num = 6) {
        this.decimal = num
    }

    /**
     * set the coordinates of decimal place
     * @param arr {Array} 经纬度
     * @returns {number[]}
     */
    toFixed (arr) {
        let lng = (arr[0] - 0).toFixed(this.decimal)
        let lat = (arr[1] - 0).toFixed(this.decimal)
        return [+lng, +lat]
    }

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    bd09togcj02 (bd_lon, bd_lat) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0
        let x = bd_lon - 0.0065
        let y = bd_lat - 0.006
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
        let gg_lng = z * Math.cos(theta)
        let gg_lat = z * Math.sin(theta)
        return this.toFixed([gg_lng, gg_lat])
    }


    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    gcj02tobd09 (lng, lat) {
        let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
        let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
        let bd_lng = z * Math.cos(theta) + 0.0065
        let bd_lat = z * Math.sin(theta) + 0.006
        return this.toFixed([bd_lng, bd_lat])
    }

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    wgs84togcj02 (lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return this.toFixed([lng, lat])
        } else {
            let dlat = this.transformlat(lng - 105.0, lat - 35.0)
            let dlng = this.transformlng(lng - 105.0, lat - 35.0)
            let radlat = lat / 180.0 * PI
            let magic = Math.sin(radlat)
            magic = 1 - ee * magic * magic
            let sqrtmagic = Math.sqrt(magic)
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
            let mglat = lat + dlat
            let mglng = lng + dlng
            return this.toFixed([mglng, mglat])
        }
    }

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    gcj02towgs84 (lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return this.toFixed([lng, lat])
        } else {
            let dlat = this.transformlat(lng - 105.0, lat - 35.0)
            let dlng = this.transformlng(lng - 105.0, lat - 35.0)
            let radlat = lat / 180.0 * PI
            let magic = Math.sin(radlat)
            magic = 1 - ee * magic * magic
            let sqrtmagic = Math.sqrt(magic)
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
            let mglat = lat + dlat
            let mglng = lng + dlng
            return this.toFixed([lng * 2 - mglng, lat * 2 - mglat])
        }
    }

    transformlat (lng, lat) {
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
        return ret
    }

    transformlng (lng, lat) {
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
        return ret
    }

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    out_of_china (lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
    }


}

module.exports = CoordsTransformer