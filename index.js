const CoordsTransformer = require('./CoordsTransformer')
const coordinatesStrReg = /((-*[1][0-9]{0,2}|0)(\.[0-9]{1,6})*),\s{0,2}((-*[1-9][0-9]{0,1}|0)(\.[0-9]{1,6})*)/g

const coordsTransformer = new CoordsTransformer()

/**
 * 坐标转换
 * @param param
 * @param orginSystem {'bd09'|'gcj02'|'wgs84'} 数据原始坐标系统
 * @param targetSystem {'bd09'|'gcj02'|'wgs84'} 转换的目标坐标系统
 * @param decimal {Number} 转换精度，默认六位
 * @return {*}
 */
function convertCoords (param, orginSystem = 'gcj02', targetSystem = 'wgs84', decimal) {
    // 百度转天地图，需要先转火星坐标，再转天地图
    if(!param){
        return  false
    }
    if (orginSystem === 'bd09' && targetSystem === 'wgs84') {
        return convertCoords(convertCoords(param, 'bd09', 'gcj02', decimal), 'gcj02', 'wgs84', decimal)
    }
    let paramIsObject = typeof param === 'object'
    let str = paramIsObject ? JSON.stringify(param) : param
    decimal && coordsTransformer.setDecimal(decimal)
    str.replace(coordinatesStrReg, (str, $1, $2, $3, $4, $5) => {
        // lat=$1 lng lat=$4
        // console.log($1, $4)
        let convetFun = coordsTransformer[orginSystem + 'to' + targetSystem].bind(coordsTransformer)
        let coordinates = convetFun($1, $4)
        return coordinates.join(',')
    })
    return paramIsObject ? JSON.parse(str) : str
}

module.exports = {convertCoords, coordinatesStrReg}
