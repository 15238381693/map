<template>
  <div class="fileMaps">
    <div id="container"></div>
    <div class="indexContent" v-if="indexContent">
      <h3>郑州市建设工程规划许可证查询</h3>
      <p class="tip">郑州市城市建设档案馆提供服务</p>
      <p class="line"></p>
      <p>1、服务内容：查询郑州市(除经开区、高新区、航空港区、郑东新区)经审批批准的建设项目的建设工程规划许可证信息;</p>
      <p>2、查询方式：地图模式点击各项目图标即可查看</p>
    </div>
    <div class="detailContent" v-if="detailContent">
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
    <div class="imgContent" v-if="imgContent">
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
import { areaData, storeData } from '../data/mapData'
import { ImagePreview } from 'vant'
export default {
  name: 'FileMaps',
  data() {
    return {
      marker,
      map,
      infoWindow,
      markers,
      mapLevel,
      provinces,
      citys,
      areas,
      shop,





      map: '',
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
    this.mapList = mapData
  },
  mounted() {
    this.map = new AMap.Map('container', {
      resizeEnable: true,
        zoom: 12, //郑州
        zooms: [5, 18],
        center: [113.716546,34.763674],
    })
    //创建信息窗体
    infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -30)
    });

    //map绑定滚动结束事件  
    this.map.on('zoomend', mapZoomend);

    //map拖拽结束事件
    this.map.on('moveend', mapMoveEnd);

    this.getMarketList()
    this.initMap()
    this.map.on('zoomchange', this.change)
  },
  methods: {
    /**
     * 清除marker标记
    */
    clearMarker() {
      map.clearMap()
    },
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
        getStreetMap().then(res => {
          if (res.code === 200) {
            this.clearMarker()
            creatShopMarker(res.data)
          }
        })
      } else if (level >= 15) {
        //  这里是加载具体街道信息
        getCurrentStoreMap().then(res => {
          if (res.code == 200) {
            this.clearMarker()
            creatShopMarker(res.data)
          }
        })
      }
    },
    /**
     * @param 数据
     * 自定义省市区的marker且添加marker
    */
    creatMarker(data) {
      this.clearMarker()
      for (let i = 0; i < data.length; i++) {
        const div = `<div class="circle" center=${data[i].baseAreaCenter}>
                    <div>
                        <div>${data[i].baseAreaName} </div><div>${data[i].count}</div>
                    </div>
                </div>`
        if (logMapBounds(data[i].baseAreaCenter)) {
          this.markers = new AMap.Marker({
            content: div,
            areaCode: data[i].baseAreaCode,
            position: data[i].baseAreaCenter.split(","),
            offset: new AMap.Pixel(-24, 5),
            zIndex: data[i].count,
            map: map
          });
          this.markers.on('click', showInfoM);
        }
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
        areas = areaData
        resolve(res)
      })
    },




























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
      console.log('err')
    },
    // 经纬度转换 获得点标记
    getMarketList() {
      const that = this
      this.mapList.forEach((item, index) => {
        AMap.convertFrom([item['经度'], item['纬度']], 'gps', function (status, result) {
          if (result.info === 'ok') {
            var resLnglat = result.locations[0]
            // console.log(resLnglat)
            let marker = new AMap.Marker({
              icon: that.icon,
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
    // 点击点标记物
    markerClick(e) {
      container.style.height = 'calc(100% - 400px)'
      // 首页内容隐藏
      this.indexContent = false
      // 详情页内容显示
      this.detailContent = true
      // 设置中心点
      this.map.setZoomAndCenter(16, e.target.getPosition())
      // 先把所有的标记物都设置成icon
      this.markerList.forEach((item) => {
        item.setIcon(this.icon)
      })
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

    // 详情叉号按钮
    closeBtn() {
      // 地图高度
      container.style.height = 'calc(100% - 200px)'
      // 详情内容隐藏
      this.detailContent = false
      // 首页内容显示
      this.indexContent = true
      //设置首页中心点以及缩放比例
      if (this.positionData) {
        this.map.setZoomAndCenter(13, [this.positionData.position.getLng(), this.positionData.position.getLat()])
      } else {
        this.map.setZoomAndCenter(13, [113.658717, 34.745246])
      }
      // 更换icon大小
      this.markerList.forEach((item) => {
        item.setIcon(this.icon)
      })
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
.fileMaps {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  #container {
    display: block;
    width: 100%;
    height: calc(100% - 200px);
  }
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
    height: 400px;
    position: relative;
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
