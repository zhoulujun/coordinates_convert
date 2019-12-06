
let {convertCoords, verifyCoordinatesLegitimate} = require('./index')
const coordinatesStrReg = /((-*[1][0-9]{0,2}|0)(\.[0-9]{1,6})*),\s{0,2}((-*[1-9][0-9]{0,1}|0)(\.[0-9]{1,6})*)/g
const coordinatesStrReg1 = /(-*180(\.[0-9]{1,6})*|17\d(\.[0-9]{1,6})*|[1-9]{1,2}(\.[0-9]{1,6})),\s{0,2}((-*[1-9][0-9]{0,1}|0)(\.[0-9]{1,6})*)/g

const coordinatesStrReg2 = /([\-\+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})),\s([\-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5}))/g

let coordinates1 = '116.411137, 39.911389 '
let coordinates2 = '[116.411137, 39.911389 ],[116.411137, 39.911389 ]'
let coordinates3 = [116.411137, 39.911389 ]
let coordinates4 = [[116.411137, 39.911389 ], [116.411137, 39.911389 ]]
let coordinates5 = '{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.113049,51.498568]},"properties":{"name":"point marker"}}'
let coordinates6 = {
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [116.411137, 39.911389 ]},
    "properties": {"name": "point marker"}
}
console.info('convertCoords_______')
debugger
let m1 = convertCoords(coordinates1, 'gcj02', 'wgs84')
let m2 = convertCoords(coordinates2, 'bd09', 'gcj02')
let m3 = convertCoords(coordinates3, 'bd09', 'wgs84')
let m4 = convertCoords(coordinates4, 'gcj02', 'wgs84')
let m5 = convertCoords(coordinates5, 'gcj02', 'wgs84')
let m6 = convertCoords(coordinates6, 'gcj02', 'wgs84')
console.log(m1)
console.log(m2)
console.log(m3)
console.log(m4)
console.log(m5)
console.log(m6)

let x1 = '[-197.131049, 51.498568]'
let x2 = '[-127.131049, 51.498568]'
console.info('verifyCoordinatesLegitimate_______')
console.log(verifyCoordinatesLegitimate(x1))
console.log(verifyCoordinatesLegitimate(x2))
console.log(verifyCoordinatesLegitimate(coordinates4))
console.log(verifyCoordinatesLegitimate(coordinates6))