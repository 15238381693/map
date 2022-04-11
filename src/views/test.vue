<template>
  <div class="fileMaps">
    <!-- <div id="container"></div> -->
    <div class="mapCanvas">
      <div id="container" class="w h" tabindex="0"></div>
    </div>
    <div class="indexContent" v-show="indexContent">
      <h3>郑州市建设工程规划许可证查询</h3>
      <p class="tip">郑州市城市建设档案馆提供服务</p>
      <p class="line"></p>
      <p>1、服务内容：查询郑州市(除经开区、高新区、航空港区、郑东新区)经审批批准的建设项目的建设工程规划许可证信息;</p>
      <p>2、查询方式：地图模式点击各项目图标即可查看</p>
    </div>
    <div class="detailContent" v-show="detailContent">
      <img src="../assets/close1.png" alt="" @click="closeBtn()" />
      <h3>{{ this.detailData.name }}</h3>
      <p class="tip">{{ this.detailData.address }}</p>
      <p class="line"></p>
      <p>建设单位：{{ this.detailData.unit }}</p>
      <p>项目名称：{{ this.detailData.name }}</p>
      <p>发证时间：{{ this.detailData.time }}年</p>
      <p>建设工程规划许可证：{{ this.detailData.license }}</p>
      <button id="btn" @click="checkCertificate()">查看证书</button>
    </div>
    <div class="imgContent" v-show="imgContent">
      <van-popup v-model="show" position="bottom">
        <div class="wrapper">
          <img src="../assets/close1.png" alt="" class="delImg" @click="delBtn()" />
          <div class="imgimg" v-for="(item, index) in certificate" :key="index" @click="handlePreview(item)">
            <img :src="require(`../static/${detailData.searchNum}/${item}`)" alt="" />
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { areaData, streetData, storeData } from '../data/mapData'
import { ImagePreview } from 'vant'
import qs from 'qs'
export default {
  name: 'FileMaps',
  data() {
    return {
      marker: '',
      map: '',
      infoWindow: '',
      markers: '',
      mapLevel: '',
      provinces: '',
      street: '',
      areas: '',
      shop: '',
      map: '',
      district: null,
      polygons: [],
      mapList: [],
      markerList: [],
      indexContent: true,
      detailContent: false,
      imgContent: false,
      show: true,
      positionData: '',
      certificate: [],
      detailData: {
        name: '',
        address: '',
        unit: '',
        time: '',
        license: '',
        searchNum: ''
      },
      // 设置icon大小
      icon: new AMap.Icon({
        image: require('../assets/icon.png'),
        imageSize: new AMap.Size(30, 30)
      }),
      iconbig: new AMap.Icon({
        image: require('../assets/iconbig.png'),
        imageSize: new AMap.Size(50, 50)
      })
    }
  },
  created() {
    this.mapList = storeData
    this.mapList.map(item=>{
      return this.markerList.push(item)
    })
    this.$axios({
      method: 'POST',
      url: `/zzscjdagl/rest/zzsrestcontroller/findGhxkGisByPage`,
      data: {
        index: 0,
        pagesize: 1000
      },
    })
    .then((res) => {
      console.log('res',res);
      
    })
    .catch((err) => {
      console.log(err)
    })
  },
  mounted() {
    this.getStreetMap()
    this.getCurrentStoreMap()
    this.getCurrentAreaMap()
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11, //郑州
      zooms: [5, 18],
      center: [113.69546,34.753674],
    })
    //创建信息窗体
    this.infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -30)
    });

    //map绑定滚动结束事件  
    this.map.on('zoomend', this.mapZoomend);

    //map拖拽结束事件
    this.map.on('moveend', this.mapMoveEnd);
    
    //首次加载郑州市的marker
    this.creatMarker(this.areas)
  },
  methods: {
    //加载划插件
    /**
     * 绘画出行政区范围函数
     * @param name 行政区
     */
    // drawBounds(name) {
    //   if (!this.district) {
    //       //实例化DistrictSearch
    //       const opts = {
    //           subdistrict: 0,   //获取边界不需要返回下级行政区
    //           extensions: 'all',  //返回行政区边界坐标组等具体信息
    //           level: 'district'  //查询行政级别为 市
    //       };
    //       this.district = new AMap.DistrictSearch(opts);
    //     }
    //     this.district.search('金水区', (status,result) => {
    //         this.map.remove(this.polygons)//清除上次结果
    //         this.polygons = []
    //         const bounds = result.districtList[0].boundaries;
    //         if (bounds) {
    //             for (let i = 0, l = bounds.length; i < l; i++) {
    //                 //生成行政区划polygon
    //                 let polygon = new AMap.Polygon({
    //                     strokeWeight: 1,
    //                     path: bounds[i],
    //                     fillOpacity: 0.4,
    //                     fillColor: '#80d8ff',
    //                     strokeColor: '#0091ea'
    //                 });
    //                 this.polygons.push(polygon);
    //             }
    //         }
    //         this.map.add(this.polygons)
    //         this.map.setFitView(this.polygons);//视口自适应
    //     });
    // },
    /**
     * 点击省市区marker时的事件
    */
    showInfoM(e) {
      let zooms, centers;
      zooms = 13
      centers = [e.target.De.position.lng, e.target.De.position.lat]
      this.map.setCenter(centers)
      this.map.setZoom(zooms)
      this.map.setZoomAndCenter(zooms, e.lnglat);
      this.getStreetMap(e.target.De.areaCode).then(async (res) => {
        setTimeout(()=>{
          for (let i = 0; i < res.data.length; i++) {
            if (this.logMapBounds(res.data[i].baseAreaCenter)) return false
          }
          this.map.setCenter(res.data[0].baseAreaCenter.split(','))
        }, 300)
      }).catch()
    },
    /**
     * 点击街道marker时的事件,点击展示对应街道内的数据
     * @param e 地图点击事件参数
    */
    showStreetInfoM(e) {
      let zooms, centers;
      // TODO
      // 移动过去
      // map.setZoomAndCenter(curZoom, e.lnglat);
      zooms = 15
      centers = [e.target.De.position.lng, e.target.De.position.lat]
      this.map.setCenter(centers)
      this.map.setZoom(zooms)
      this.map.setZoomAndCenter(zooms, e.lnglat);
      this.getCurrentStoreMap(e.target.De.areaCode).then(async (res) => {
        setTimeout(()=>{
          for (let i = 0; i < res.data.length; i++) {
            if (this.logMapBounds(res.data[i]['经度']+','+res.data[i]['纬度'])) return false
          }
          this.map.setCenter(res.data[0].baseAreaCenter.split(','))
        }, 300)
      }).catch()
    },
    /**
     * 点击门店信息
     * @param e 地图点击事件参数
    */
    markerClick(e) {
      container.style.height = 'calc(100% - 200px)'
      // 首页内容隐藏
      this.indexContent = false
      // 详情页内容显示
      this.detailContent = true
      // 设置中心点
      this.map.setZoomAndCenter(16, e.target.getPosition())
      e.target.setIcon(this.iconbig)
      // 点击后item的内容
      let content = e.target.getExtData()
      // 给标签赋值
      this.detailData.name = content['项目名称']
      this.detailData.address = content['项目地址']
      this.detailData.unit = content['建设单位']
      this.detailData.time = content['年度']
      this.detailData.license = content['建设工程规划许可证号']
      this.detailData.searchNum = content['检索号']
    },
    /**
     * 清除marker标记
    */
    clearMarker() {
      this.map.clearMap()
    },
    /**
     * 滑动zoom范围
    */
    mapZoomend() {
      // 10看到区域 13可以看到街道 15看到店铺
      let level = this.map.getZoom()
      this.mapLevel = level
      if (level >= 10 && level < 13) {
        //  这里是加载区域信息
        this.getCurrentAreaMap().then(res => {
          if (res.code == 200) {
            this.clearMarker()
            this.creatMarker(res.data)
          }
        })
      } else if (level >= 13 && level < 15) {
        // 这里去加载社区街道信息
        this.getStreetMap().then(res => {
          if (res.code === 200) {
            this.clearMarker()
            this.creatStreetMarker(res.data)
          }
        })
      } else if (level >= 15) {
        //  这里是加载具体街道信息
        this.getCurrentStoreMap().then(res => {
          if (res.code == 200) {
            this.clearMarker()
            this.creatShopMarker(res.data)
          }
        })
      }
    },
    /**
     * 地图拖动结束时的事件
    */
    mapMoveEnd() {
      let level = this.map.getZoom()
      this.mapLevel = level
      this.clearMarker()
      if (level <= 12) {
        this.creatMarker(this.areas)
      } else if (level >= 13 && level < 15) {
        this.creatStreetMarker(this.street)
      } else if (level >= 15) {
        this.creatShopMarker(this.shop)
      }
    },
    /**
     * 获取区的数据
     * 
     * */
    getCurrentAreaMap () {
      return new Promise((resolve, reject) => {
        const res = {
          code: 200,
          data: areaData
        }
        this.areas = areaData
        resolve(res)
      })
    },
    //获取街道办事处的数据
    getStreetMap () {
      return new Promise((resolve, reject) => {
        let res = {
          code: 200,
          data: streetData
        }
        this.street = streetData
        resolve(res)
      })
    },
    /**
     * 获取品牌门店数据
     * */
    getCurrentStoreMap () {
      return new Promise((resolve, reject) => {
        let res = {
          code: 200,
          data: storeData
        }
        this.shop = storeData
        resolve(res)
      })
    },
    /**
     * @param 数据
     * 自定义省市区的marker且添加marker
    */
    creatMarker(data) {
      // this.clearMarker()
      for (let i = 0; i < data.length; i++) {
        const div = `<div class="circle" center=${data[i].baseAreaCenter}>
                    <div>
                        <div>${data[i].baseAreaName} </div><div>${data[i].count}</div>
                    </div>
                </div>`
        if (this.logMapBounds(data[i].baseAreaCenter)) {
          this.markers = new AMap.Marker({
            content: div,
            areaCode: data[i].baseAreaCode,
            position: data[i].baseAreaCenter.split(","),
            offset: new AMap.Pixel(-24, 5),
            zIndex: data[i].count,
            map: this.map,
            name: data[i].baseAreaName
          });
          this.markers.on('click', this.showInfoM);
        }
      }
    },
    // 创建街道marker
    creatStreetMarker(data) {
      for (let i = 0; i < data.length; i++) {
        const div = `<div class="circle" center=${data[i].baseAreaCenter}>
                    <div>
                        <div>${data[i].baseAreaName} </div><div>${data[i].count}</div>
                    </div>
                </div>`
        if (this.logMapBounds(data[i].baseAreaCenter)) {
          this.markers = new AMap.Marker({
            content: div,
            areaCode: data[i].baseAreaCode,
            position: data[i].baseAreaCenter.split(","),
            offset: new AMap.Pixel(-24, 5),
            zIndex: data[i].count,
            map: this.map
          });
          this.markers.on('click', this.showStreetInfoM);
        }
      }
    },
    //创建门店marker
    creatShopMarker(data) {
      for (var i = 0; i < data.length; i++) {
        if (true) {
          let div = `<div style="background-color: rgba(48,114,246,0.8);height:100%;width:200px;padding: 8px 12px;line-height:24px;color:white;text-align: center;letter-spacing: 0;font-size: 12px;border-radius: 20px;">
            ${data[i]['项目名称']}
          </div>`
          var marker = new AMap.Marker({
            position: (data[i]['经度'] + ',' + data[i]['纬度']).split(','),
            content: div,
            size: [32, 43],
            imageSize: new AMap.Size(32, 43),
            map: this.map
          });
          marker.setExtData(data[i])
          this.markerList.push(marker)
          marker.content =
            `<div><span style="color:#31C0FD">${data[i]['项目名称']}</span> ${data[i]['建设单位']}</div>`;
          marker.on('click', this.markerClick);
        }
      }
    },
    //规划处地图的可视范围  
    logMapBounds(center) {
      let point = center.split(',')
      let bounds = this.map.getBounds();
      const NorthEast = bounds.getNorthEast();
      const SouthWest = bounds.getSouthWest();
      const SouthEast = [NorthEast.lng, SouthWest.lat];
      const NorthWest = [SouthWest.lng, NorthEast.lat];
      const path = [
        [NorthEast.lng, NorthEast.lat], SouthEast, [SouthWest.lng, SouthWest.lat], NorthWest
      ]
      return new AMap.GeometryUtil.isPointInRing(point, path);
    },


    // -------------------------------------------------------------------------------------------------
    // 从这以上是二期优化
    // -------------------------------------------------------------------------------------------------














    // 获得当前定位
    initMap() {
      let that = this
      let geolocation
      this.map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000 //超过10秒后停止定位，默认：无穷大
          // zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        // this.map.addControl(geolocation)
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', that.onComplete)
        //返回定位信息
        AMap.event.addListener(geolocation, 'error', that.onError)
        // 返回定位出错信息
      })
    },
    // 定位成功的信息
    onComplete(data) {
      this.positionData = data
      // 定位成功以当前左边为中心点
      this.map.setZoomAndCenter(13, [data.position.getLng(), data.position.getLat()])
      var marker = new AMap.Marker({
        position: [data.position.getLng(), data.position.getLat()]
      })
      this.map.add(marker)
    },
    // 定位失败的信息
    onError() {
      this.map.setZoomAndCenter(13, [113.658717, 34.745246])
    },
    // 经纬度转换 获得点标记
    getMarketList() {
      const that = this
      this.mapList.forEach((item, index) => {
        AMap.convertFrom([item['经度'], item['纬度']], 'gps', function (status, result) {
          if (result.info === 'ok') {
            var resLnglat = result.locations[0]
            let marker = new AMap.Marker({
              raiseOnDrag: false,
              position: resLnglat
            })
            marker.setExtData(item)
            that.markerList.push(marker)
            // 绑定点击事件
            marker.on('click', that.markerClick)
            that.map.add(that.markerList)
          }
        })
        this.map.setFitView()
        this.map.add(this.markerList)
      })
    },
    // 缩放层级
    change(e) {
      if (this.map.getZoom() <= 10) {
        this.markerList.forEach((item) => {
          this.map.remove(item)
        })
      } else {
        this.markerList.forEach((item) => {
          this.map.add(item)
        })
      }
    },
    

    // 详情叉号按钮
    closeBtn() {
      // 地图高度
      container.style.height = ''
      // 详情内容隐藏
      this.detailContent = false
      // 首页内容显示
      this.indexContent = true
      //设置首页中心点以及缩放比例
      // if (this.positionData) {
      //   this.map.setZoomAndCenter(13, [this.positionData.position.getLng(), this.positionData.position.getLat()])
      // } else {
      //   this.map.setZoomAndCenter(13, [113.658717, 34.745246])
      // }
      // 更换icon大小
      // this.markerList.forEach((item) => {
      //   item.setIcon(this.icon)
      // })
      // 将图片清除
      this.certificate = ''
    },

    // 查看证书按钮
    checkCertificate() {
      this.imgContent = true
      this.show = true
      const JSONData = require(`../static/${this.detailData.searchNum}/img.json`)
      this.certificate = JSONData.imgArr
    },

    //遮罩叉号
    delBtn() {
      this.imgContent = false
      this.certificate = ''
    },
    // 图片预览
    handlePreview(url) {
      ImagePreview([require(`../static/${this.detailData.searchNum}/${url}`)])
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.css');
.fileMaps {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  /deep/.amap-icon {
    width: 50px !important;
    height: 50px !important;
  }
  /deep/.amap-copyright {
    display: none !important;
  }
  /deep/.amap-logo {
    display: none !important;
  }
  /deep/.van-popup {
    position: absolute;
    width: 80%;
    height: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .indexContent {
    width: 100%;
    height: 200px;
    position: absolute;
    z-index: 10;
    left: 0;
    bottom: 0;
    padding: 20px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .detailContent {
    width: 100%;
    // height: 350px;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 20px 30px 20px 20px;
    background-color: #fff;
    box-sizing: border-box;
  }

  .indexContent h3,
  .detailContent h3 {
    font-size: 18px;
    font-weight: 400;
    color: rgba(16, 16, 16, 100);
    font-family: PingFangSC-regular;
  }
  .detailContent img {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 20px;
  }

  .indexContent h3 {
    font-weight: 500;
  }
  .detailContent h3 {
    width: 300px;
  }

  .indexContent .tip,
  .detailContent .tip {
    height: 20px;
    margin-top: 3px;
    color: rgba(136, 136, 136, 100);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-regular;
  }
  .indexContent p,
  .detailContent p {
    margin-bottom: 10px;
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-regular;
  }
  .line {
    height: NaNpx;
    margin: 12px 0;
    opacity: 0.2;
    border: 1px solid rgba(187, 187, 187, 100);
  }
  button {
    display: block;
    width: 160px;
    height: 32px;
    margin: 0 auto;
    margin-top: 90px;
    border: none;
    outline: none;
    line-height: 23px;
    border-radius: 100px;
    color: rgba(24, 144, 255, 100);
    font-size: 16px;
    text-align: center;
    font-family: Arial;
    border: 1px solid rgba(24, 144, 255, 100);
    background-color: #fff;
  }
  .wrapper {
    .delImg {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 20px;
    }
    .imgimg {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
}
</style>
