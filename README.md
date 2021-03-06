# coordinates_convert
## 说明
+ 一个转换坐标的处理工具(百度、火星、wg84任意互转)，支持任意类型数据（坐标数据必须是经纬度数组）。
+ 支持任意格式的经纬度坐标对数据，经纬度坐标转换
  - GeoJSON对象序列化GeoJSON字符串，如：；
  - 逗号分隔的单点经纬度坐标值，如：11.22,44,22
  - 一维（单点）、二维（多点或线）、三维（多线或面）和四维（多面）坐标经纬度数组和其序列化字符串，如：[112，133]、[[112，133],…]、[[[11,33],[22,44]]] ……'
  - 其他格式，只要经纬成成对出现即可
+ A utility library for helping convert coordinates from string like GeoJSON Array.Use regular expression patter coordinates

    经纬度转换，单个坐标转换，不是啥事。百度、高德、maptalks、mapbox都自带相关函数。但是，对于GeoJSON，或者任意格式的经纬度转换。就比较麻烦

    你不知道用户给的是几位数组，GeoJSON给的是面坐标数据但是确实二维数组。也不一定是GeoJSON格。如果去判断数据类型，一层层判读下来，……
    
    平时我们去url的search params ，用的就是正则，同理，经纬度坐标转换，用相同方法岂不是更省事。
    ```javascript
    function getUrlParams (url) {
        url || (url = window ? window.location.search : '')
        if (!url) {
            return {}
        }
        let params = {}
        url.replace(/([^=?&]+)=([^=?&]*)/g, (str, $1, $2) => {
            params[$1] = $2
        })
        return params
    }
    ```
    正则万岁！
## 源于coordtransform
经纬度数据转换方法，源自于coordtransform
+ coordtransform npm地址：https://www.npmjs.com/package/coordtransform2，官网：http://wandergis.com/coordtransform/
+ 提供了百度、火星坐标(国测局gcj02坐标)、wgs84(天地图坐标)之间转换。
```javascript
//百度经纬度坐标转国测局坐标
var bd09togcj02=coordtransform.bd09togcj02(116.404, 39.915);
//国测局坐标转百度经纬度坐标
var gcj02tobd09=coordtransform.gcj02tobd09(116.404, 39.915);
//wgs84转国测局坐标
var wgs84togcj02=coordtransform.wgs84togcj02(116.404, 39.915);
//国测局坐标转wgs84坐标
var gcj02towgs84=coordtransform.gcj02towgs84(116.404, 39.915);
```
*注意*：百度坐标转wg84没有提供直接方法，需要先百度经纬度坐标转国测局坐标吗，再国测局坐标转wgs84坐标

但是，遇到GeoJSON字符串转换，或者数组转换，去循环替换，方法可靠，但是代码量太多。

个人觉得用正则表达式转换，代码上，最简洁。所以，就有了此包
## 测试
测试实例：
```javascript
let {convertCoords} = require('./index')
let coordinates0 = '[-0.131049, 51.498568]'
let coordinates1 = '-0.131049, 51.498568'
let coordinates2 = '[-0.131049, 51.498568],[-0.131049, 51.498568]'
let coordinates3 = [-0.131049, 51.498568]
let coordinates4 = [[-0.131049, 51.498568], [-0.131049, 51.498568]]
let coordinates5 = {
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [-0.113049, 51.498568]},
    "properties": {"name": "point marker"}
}
let coordinates6 = '{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.113049,51.498568]},"properties":{"name":"point marker"}}'
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
```
## 为什么经纬度默认取6位

| 赤道周长（米）|	度数（度）|
|  ----  | ----  |
40076000 | 360
111322.2222 | 1
11132.22222 | 0.1
1113.222222 | 0.01
111.3222222 | .0001
11.13222222 | .00001
1.113222222 | .000001
0.111322222 | .0000001
0.011132222 | .00000001

+ 首先参考一个标准：维度是平行的，相邻的1度距离约等于111km。
+ 经纬度相差0.000001度时候，距离相差位0.111米

对于在线地图，经纬度的读数，精确到小数点之后第六位，已经足够当前gps精度下的使用。
## 经纬度不是坐标数组，怎么转换
那就先转换为GeoJSON咯，传送门：https://www.npmjs.com/package/geojson
```javascript
var data = [
  { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },
  { name: 'Location B', category: 'House', street: 'Broad', lat: 39.284, lng: -75.833 },
  { name: 'Location C', category: 'Office', street: 'South', lat: 39.123, lng: -74.534 }
];
GeoJSON.parse(data, {Point: ['lat', 'lng'], include: ['name']});
```
转换结果
```json
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-75.343, 39.984]},
      "properties": {
        "name": "Location A"
      }
    },
    { "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [ -75.534, 39.123]},
      "properties": {
        "name": "Location C"
      }
    }
  ]
}
```