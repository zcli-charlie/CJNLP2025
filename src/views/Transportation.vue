<template>
  <div class="transportation-container">
    <div class="content-wrapper">
      <h1>交通指南</h1>
      
      <!-- 会场信息 -->
      <section class="venue-info">
        <h2>📍 会议地点</h2>
        <p>湖北省宜昌市猇亭区机场桃花岭饭店（湖北省宜昌市猇亭区机场路29号）</p>
      </section>

      <!-- 地图容器 -->
      <section class="map-container">
        <div id="map-container" style="height: 500px;"></div>
      </section>

      <!-- 交通指南 -->
      <section class="transport-guide">
        <h2>🚗 如何到达</h2>
        <div class="transport-method" v-for="(method, index) in transportMethods" :key="index">
          <h3>{{ method.icon }} {{ method.title }}</h3>
          <p>{{ method.description }}</p>
        </div>
      </section>

      <!-- 住宿推荐 -->
      <section class="accommodation">
        <h2>🏨 住宿推荐</h2>
        <div class="hotel-list">
          <div class="hotel-item" v-for="(hotel, index) in hotelList" :key="index">
            <h3>🏢 {{ hotel.name }}</h3>
            <p>📍 地址：{{ hotel.address }}</p>
            <p>🚶 距离：{{ hotel.distance }}</p>
            <p class="price">💰 价格：{{ hotel.price }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// 交通方式数据
const transportMethods = [
  {
    icon: '✈️',
    title: '乘坐飞机',
    description: '可乘坐飞机到达宜昌三峡机场，距离会场约1.5公里，乘坐出租车约5分钟可达。'
  },
  {
    icon: '🚂',
    title: '乘坐火车',
    description: '可乘坐火车到达宜昌东站，乘坐出租车约30分钟到达会场，费用约50元。'
  },
  {
    icon: '🚌',
    title: '公共交通',
    description: '可乘坐公交车到达会场，具体路线请查询当地公交线路。'
  }
]

// 酒店数据
const hotelList = [
  {
    name: '机场桃花岭饭店',
    address: '湖北省宜昌市猇亭区机场桃花岭饭店',
    distance: '会议主会场',
    price: '请咨询酒店'
  },
  {
    name: '丽舍轻奢商旅酒店',
    address: '宜昌市西陵区万达广场',
    distance: '距离会场约6公里',
    price: '请咨询酒店'
  }
]

// 初始化地图
const initMap = () => {
  // 创建地图实例
  const map = new BMapGL.Map('map-container')
  
  // 创建地理编码实例
  const geocoder = new BMapGL.Geocoder()
  
  // 定义地点信息
  const locations = {
    hotel: {
      point: new BMapGL.Point(111.485998, 30.558451),
      name: '机场桃花岭饭店',
      description: '会议主会场，提供住宿和会议设施'
    },
    airport: {
      point: new BMapGL.Point(111.49219554384426, 30.559083336552654),
      name: '宜昌三峡机场',
      description: '距离会场约1.5公里，乘坐出租车约5分钟可达'
    },
    station: {
      point: new BMapGL.Point(111.3771911487265, 30.664409805111823),
      name: '宜昌东站',
      description: '可乘坐出租车约30分钟到达会场，费用约50元'
    }
  }
  
  // 设置地图中心点和缩放级别
  map.centerAndZoom(locations.hotel.point, 16)
  
  // 开启鼠标滚轮缩放
  map.enableScrollWheelZoom(true)
  
  // 创建信息窗口
  const createInfoWindow = (location) => {
    let content = `
      <div style="padding: 8px;">
        <h4 style="margin: 0 0 5px 0;">${location.name}</h4>
        <p style="margin: 0;">${location.description}</p>
    `
    
    // 如果是会议地点，添加图片
    if (location === locations.hotel) {
      content += `
        <img src="/images/hotel/hotel-1.jpg" style="width: 100%; margin-top: 8px; border-radius: 4px;">
      `
    }
    
    content += '</div>'
    
    return new BMapGL.InfoWindow(content, {
      width: 300,
      height: location === locations.hotel ? 200 : 80,
      title: location.name
    })
  }
  
  // 添加标记点和信息窗口
  Object.values(locations).forEach(location => {
    // 创建标记
    const marker = new BMapGL.Marker(location.point)
    map.addOverlay(marker)
    
    // 创建信息窗口
    const infoWindow = createInfoWindow(location)
    
    // 点击标记显示信息窗口
    marker.addEventListener('click', () => {
      map.openInfoWindow(infoWindow, location.point)
    })
    
    // 如果是会议地点，默认打开信息窗口
    if (location === locations.hotel) {
      map.openInfoWindow(infoWindow, location.point)
    }
  })
}

// 动态加载百度地图脚本
const loadBaiduMapScript = () => {
  if (window.BMapGL) {
    initMap()
    return
  }

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=OOUfumsjplxNNDQU69XEa87ADanWlvJd`
  script.onload = initMap
  document.head.appendChild(script)
}

onMounted(() => {
  // 给地图容器设置初始高度
  const mapContainer = document.getElementById('map-container')
  if (mapContainer) {
    mapContainer.style.height = '500px'
  }
  
  // 延迟加载地图，确保容器已经渲染
  setTimeout(() => {
    loadBaiduMapScript()
  }, 100)
})
</script>

<style scoped>
.transportation-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  color: #444;
  margin: 2rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.venue-info {
  margin-bottom: 2rem;
}

.map-container {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  min-height: 500px;
}

#map-container {
  width: 100%;
  height: 500px;
  position: relative;
  z-index: 1;
}

.transport-method {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.transport-method p {
  margin-left: 1.8rem;
}

.hotel-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.hotel-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  transition: transform 0.2s;
}

.hotel-item:hover {
  transform: translateY(-2px);
}

.hotel-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.hotel-item p {
  color: #666;
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hotel-item .price {
  color: #e74c3c;
  font-weight: bold;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .transportation-container {
    padding: 0.8rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
  }

  h2 {
    font-size: 1.3rem;
    margin: 1.5rem 0 0.8rem;
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  .venue-info {
    margin-bottom: 1.5rem;
  }

  .map-container {
    margin: 1.5rem 0;
    min-height: 300px;
  }

  #map-container {
    height: 300px;
  }

  .transport-method {
    margin: 1rem 0;
    padding: 0.8rem;
  }

  .transport-method p {
    margin-left: 1.5rem;
    font-size: 0.9rem;
  }

  .hotel-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .hotel-item {
    padding: 1rem;
  }

  .hotel-item h3 {
    font-size: 1.1rem;
  }

  .hotel-item p {
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }
}
</style> 