<template>
  <div class="transportation-container">
    <div class="content-wrapper">
      <h1>交通案内</h1>
      
      <!-- 会場情報 -->
      <section class="venue-info">
        <h2>📍 会場</h2>
        <p>湖北省宜昌市猇亭区空港桃花嶺ホテル（湖北省宜昌市猇亭区機場路29号）</p>
      </section>

      <!-- 地図コンテナ -->
      <section class="map-container">
        <div id="map-container" style="height: 500px;"></div>
      </section>

      <!-- 交通案内 -->
      <section class="transport-guide">
        <h2>🚗 アクセス</h2>
        <div class="transport-method" v-for="(method, index) in transportMethods" :key="index">
          <h3>{{ method.icon }} {{ method.title }}</h3>
          <p>{{ method.description }}</p>
        </div>
      </section>

      <!-- 宿泊施設 -->
      <section class="accommodation">
        <h2>🏨 宿泊施設のご案内</h2>
        <div class="hotel-list">
          <div class="hotel-item" v-for="(hotel, index) in hotelList" :key="index">
            <h3>🏢 {{ hotel.name }}</h3>
            <p>📍 住所：{{ hotel.address }}</p>
            <p>🚶 アクセス：{{ hotel.distance }}</p>
            <p class="price">💰 料金：{{ hotel.price }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// 交通手段データ
const transportMethods = [
  {
    icon: '✈️',
    title: '飛行機でお越しの場合',
    description: '宜昌三峡空港までお越しください。会場まで約1.5km、タクシーで約5分です。'
  },
  {
    icon: '🚂',
    title: '列車でお越しの場合',
    description: '宜昌東駅までお越しください。会場までタクシーで約30分、料金は約50元です。'
  },
  {
    icon: '🚌',
    title: '公共交通機関',
    description: 'バスをご利用の場合は、現地の路線図をご確認ください。'
  }
]

// ホテルデータ
const hotelList = [
  {
    name: '空港桃花嶺ホテル',
    address: '湖北省宜昌市猇亭区空港桃花嶺ホテル',
    distance: '会議メイン会場',
    price: 'ホテルにお問い合わせください'
  },
  {
    name: 'リーシェ・ラグジュアリービジネスホテル',
    address: '宜昌市西陵区万達広場',
    distance: '会場まで約6km',
    price: 'ホテルにお問い合わせください'
  }
]

// 地図の初期化
const initMap = () => {
  // 地図インスタンスの作成
  const map = new BMapGL.Map('map-container')
  
  // ジオコーダーインスタンスの作成
  const geocoder = new BMapGL.Geocoder()
  
  // 場所情報の定義
  const locations = {
    hotel: {
      point: new BMapGL.Point(111.485998, 30.558451),
      name: '空港桃花嶺ホテル',
      description: '会議メイン会場、宿泊・会議施設完備'
    },
    airport: {
      point: new BMapGL.Point(111.49219554384426, 30.559083336552654),
      name: '宜昌三峡空港',
      description: '会場まで約1.5km、タクシーで約5分'
    },
    station: {
      point: new BMapGL.Point(111.3771911487265, 30.664409805111823),
      name: '宜昌東駅',
      description: '会場までタクシーで約30分、料金は約50元'
    }
  }
  
  // 地図の中心点とズームレベルの設定
  map.centerAndZoom(locations.hotel.point, 16)
  
  // マウスホイールによるズームを有効化
  map.enableScrollWheelZoom(true)
  
  // 情報ウィンドウの作成
  const createInfoWindow = (location) => {
    let content = `
      <div style="padding: 8px;">
        <h4 style="margin: 0 0 5px 0;">${location.name}</h4>
        <p style="margin: 0;">${location.description}</p>
    `
    
    // 会場の場合、画像を追加
    if (location === locations.hotel) {
      content += `
        <img src="/cjnlp2025/images/hotel/hotel-1.jpg" style="width: 100%; margin-top: 8px; border-radius: 4px;">
      `
    }
    
    content += '</div>'
    
    return new BMapGL.InfoWindow(content, {
      width: 300,
      height: location === locations.hotel ? 200 : 80,
      title: location.name
    })
  }
  
  // マーカーと情報ウィンドウの追加
  Object.values(locations).forEach(location => {
    // マーカーの作成
    const marker = new BMapGL.Marker(location.point)
    map.addOverlay(marker)
    
    // 情報ウィンドウの作成
    const infoWindow = createInfoWindow(location)
    
    // マーカークリックで情報ウィンドウを表示
    marker.addEventListener('click', () => {
      map.openInfoWindow(infoWindow, location.point)
    })
    
    // 会場の場合、デフォルトで情報ウィンドウを表示
    if (location === locations.hotel) {
      map.openInfoWindow(infoWindow, location.point)
    }
  })
}

// 百度地図スクリプトの動的読み込み
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
  // 地図コンテナの初期高さを設定
  const mapContainer = document.getElementById('map-container')
  if (mapContainer) {
    mapContainer.style.height = '500px'
  }
  
  // 地図の遅延読み込み（コンテナのレンダリング確認用）
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