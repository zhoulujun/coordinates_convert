/**
 *
 * @author zhoulujun.cn
 * @version 1.0
 * @description 经纬度坐标转换韩式
 */
const CoordsTransformer = require('./CoordsTransformer')
// 经纬度数组匹配，无法验证经纬度是否合规，待改善
const coordinatesStrReg = /((-*1*[0-9]{0,2}|0)(\.[0-9]{1,6})*),\s{0,2}((-*[1-9][0-9]{0,1}|0)(\.[0-9]{1,6})*)/g
// const lngReg = /^[\-\+]?(0?\d{1,2}\.\d{1,9}|1[0-7]?\d{1}\.\d{1,9}|180\.0{1,6})$/\
// const latReg = /^[\-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,6})$/
const lngReg = /^[\-\+]?(0(\.\d{1,6})?|([1-9](\d)?)(\.\d{1,6})?|1[0-7]\d{1}(\.\d{1,6})?|180\.0{1,6})$/
const latReg = /^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/
const coordsTransformer = new CoordsTransformer()

/**
 * @description 判读数据里面是否含有不合规坐标,如果某个坐标数组不合规，返回false
 * @param param {String|Object|Array}
 * @return {Boolean}
 */
function verifyCoordinatesLegitimate (param) {
    if (!param) {
        return false
    }
    debugger
    let paramIsObject = typeof param === 'object'
    let coordinatesStr = paramIsObject ? JSON.stringify(param) : param
    let purity = true
    coordinatesStr.replace(coordinatesStrReg, (str, $1, $2, $3, $4, $5) => {
        if (!lngReg.test($1) || !latReg.test($4)) {
            purity = false
        }
    })
    return purity
}

/**
 * 坐标转换
 * @param param {String|Object|Array}
 * @param orginSystem {'bd09'|'gcj02'|'wgs84'} 数据原始坐标系统
 * @param targetSystem {'bd09'|'gcj02'|'wgs84'} 转换的目标坐标系统
 * @param decimal {Number} 转换精度，默认六位
 * @return {*}
 */
function convertCoords (param, orginSystem = 'gcj02', targetSystem = 'wgs84', decimal) {
    if (!param) {
        return false
    }
    // 百度转天地图，需要先转火星坐标，再转天地图
    if (orginSystem === 'bd09' && targetSystem === 'wgs84') {
        return convertCoords(convertCoords(param, 'bd09', 'gcj02', decimal), 'gcj02', 'wgs84', decimal)
    }
    let paramIsObject = typeof param === 'object'
    let coordinatesStr = paramIsObject ? JSON.stringify(param) : param
    decimal && coordsTransformer.setDecimal(decimal)
    coordinatesStr.replace(coordinatesStrReg, (str, $1, $2, $3, $4, $5) => {
        // lat=$1 lng lat=$4
        // console.log($1, $4)
        let convetFun = coordsTransformer[orginSystem + 'to' + targetSystem].bind(coordsTransformer)
        let coordinates = convetFun($1, $4)
        return coordinates.join(',')
    })
    return paramIsObject ? JSON.parse(coordinatesStr) : coordinatesStr
}

module.exports = {convertCoords, coordinatesStrReg, verifyCoordinatesLegitimate}
