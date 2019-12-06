let {convertCoords} = require('./index')
let coordinates0 = '[-0.131049, 51.498568]'
let coordinates1 = '-0.131049, 51.498568'
let coordinates2 = '[-0.131049, 51.498568],[-0.131049, 51.498568]'
let coordinates3 = [-0.131049, 51.498568]
let coordinates4 = [[-0.131049, 51.498568], [-0.131049, 51.498568]]
let coordinates5 = '{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.113049,51.498568]},"properties":{"name":"point marker"}}'
let coordinates6 = {
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [-0.113049, 51.498568]},
    "properties": {"name": "point marker"}
}
debugger
let m0 = convertCoords(coordinates0, 'bd09', 'wgs84')
let m1 = convertCoords(coordinates1, 'gcj02', 'wgs84')
let m2 = convertCoords(coordinates2, 'gcj02', 'wgs84')
let m3 = convertCoords(coordinates3, 'gcj02', 'wgs84')
let m4 = convertCoords(coordinates4, 'gcj02', 'wgs84')
let m5 = convertCoords(coordinates5, 'gcj02', 'wgs84')
let m6 = convertCoords(coordinates6, 'gcj02', 'wgs84')
console.log(m0)
console.log(m1)
console.log(m2)
console.log(m3)
console.log(m4)
console.log(m5)
console.log(m6)