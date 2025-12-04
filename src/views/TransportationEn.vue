<template>
  <div class="transportation-container">
    <div class="content-wrapper">
      <h1>Transportation Guide</h1>
      
      <!-- Venue Information -->
      <section class="venue-info">
        <h2>📍 Conference Venue</h2>
        <p>Airport Taohualing Hotel, 29 Airport Road, Yiling District, Yichang, Hubei Province</p>
      </section>

      <!-- Map Container -->
      <section class="map-container">
        <div id="map-container" style="height: 500px;"></div>
      </section>

      <!-- Transportation Guide -->
      <section class="transport-guide">
        <h2>🚗 How to Get Here</h2>
        <div class="transport-method" v-for="(method, index) in transportMethods" :key="index">
          <h3>{{ method.icon }} {{ method.title }}</h3>
          <p>{{ method.description }}</p>
        </div>
      </section>

      <!-- Accommodation Recommendations -->
      <section class="accommodation">
        <h2>🏨 Recommended Hotels</h2>
        <div class="hotel-list">
          <div class="hotel-item" v-for="(hotel, index) in hotelList" :key="index">
            <h3>🏢 {{ hotel.name }}</h3>
            <p>📍 Address: {{ hotel.address }}</p>
            <p>🚶 Distance: {{ hotel.distance }}</p>
            <p class="price">💰 Price: {{ hotel.price }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Transportation methods data
const transportMethods = [
  {
    icon: '✈️',
    title: 'By Air',
    description: 'You can fly to Yichang Three Gorges Airport. The venue is about 1.5 kilometers away, approximately 5 minutes by taxi.'
  },
  {
    icon: '🚂',
    title: 'By Train',
    description: 'You can take a train to Yichang East Railway Station. The venue is about 30 minutes away by taxi, costing approximately 50 CNY.'
  },
  {
    icon: '🚌',
    title: 'Public Transportation',
    description: 'You can take public buses to reach the venue. Please check local bus routes for specific information.'
  }
]

// Hotel data
const hotelList = [
  {
    name: 'Airport Taohualing Hotel',
    address: 'Airport Taohualing Hotel, Yiling District, Yichang',
    distance: 'Main Conference Venue',
    price: 'Please contact hotel'
  },
  {
    name: 'Lishe Boutique Business Hotel',
    address: 'Wanda Plaza, Xiling District, Yichang',
    distance: 'About 6 kilometers from the venue',
    price: 'Please contact hotel'
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
      name: 'Airport Taohualing Hotel',
      description: 'Main conference venue, providing accommodation and conference facilities'
    },
    airport: {
      point: new BMapGL.Point(111.49219554384426, 30.559083336552654),
      name: 'Yichang Three Gorges Airport',
      description: 'About 1.5km from the venue, 5 minutes by taxi'
    },
    station: {
      point: new BMapGL.Point(111.3771911487265, 30.664409805111823),
      name: 'Yichang East Railway Station',
      description: 'About 30 minutes by taxi to the venue, fare around 50 CNY'
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