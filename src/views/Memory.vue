<template>
  <div class="photos-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1>CJNLP 2025 记忆</h1>
        <p class="conference-description">聚焦自然语言处理、大模型、智能体等前沿技术研究，探索中日双边科研合作新机遇。</p>
      </div>
      
      <div class="conference-info">
        <div class="info-card">
          <div class="info-item">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="info-label">会议时间</div>
              <div class="info-value">2025年9月13-15日</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">📍</div>
            <div class="info-content">
              <div class="info-label">会议地点</div>
              <div class="info-value">中国·宜昌 机场桃花岭饭店</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="photos-section">
        <div class="gallery-container">
          <div class="photo-grid" v-if="currentPhotos.length > 0">
            <div 
              v-for="(photo, index) in currentPhotos" 
              :key="index" 
              class="photo-item"
              @click="openFullScreen(photo)"
            >
              <div class="photo-wrapper">
                <img :src="photo.thumbnail" alt="CJNLP 2025">
                <div class="photo-overlay">
                  <span class="view-icon">🔍</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <div class="empty-icon">📷</div>
            <p>暂无照片</p>
            <p class="empty-suggestion">照片数据加载中...</p>
          </div>
          <!-- 分页组件 -->
          <el-pagination
            v-if="totalCount > pageSize"
            :current-page="pageNo"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            class="photo-pagination"
            style="margin: 2rem 0 0; text-align: center;"
          />
        </div>
      </div>
    </div>
  </div>
  
  <!-- 全屏照片查看 -->
  <div class="fullscreen-photo" v-if="fullscreenPhoto" @click="closeFullScreen">
    <div class="fullscreen-content">
      <img :src="fullscreenPhoto.fullsize" alt="CJNLP 2025">
      <button class="close-fullscreen" @click="closeFullScreen">×</button>
      
      <div class="fullscreen-nav">
        <button 
          class="nav-btn prev" 
          v-if="currentPhotoIndex > 0" 
          @click.stop="navigatePhoto(-1)"
        >
          ←
        </button>
        <div class="photo-counter">{{ currentPhotoIndex + 1 }} / {{ currentPhotos.length }}</div>
        <button 
          class="nav-btn next" 
          v-if="currentPhotoIndex < currentPhotos.length - 1" 
          @click.stop="navigatePhoto(1)"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElPagination } from 'element-plus'

const fullscreenPhoto = ref(null)
const currentPhotoIndex = ref(0)

const pageNo = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 静态照片数据 - 2025年CJNLP照片
// 这里存储所有照片，直接使用数组
const allPhotos = ref([
  { image: '/images/memory/P1084341(1).min.jpg' },
  { image: '/images/memory/P1084341.min.jpg' },
  { image: '/images/memory/P1084342(1).min.jpg' },
  { image: '/images/memory/P1084342.min.jpg' },
  { image: '/images/memory/P1084346(1).min.jpg' },
  { image: '/images/memory/P1084346.min.jpg' },
  { image: '/images/memory/P1084347(1).min.jpg' },
  { image: '/images/memory/P1084347.min.jpg' },
  { image: '/images/memory/P1084348(1).min.jpg' },
  { image: '/images/memory/P1084348.min.jpg' },
  { image: '/images/memory/P1084350(1).min.jpg' },
  { image: '/images/memory/P1084350.min.jpg' },
  { image: '/images/memory/P1084357(1).min.jpg' },
  { image: '/images/memory/P1084357.min.jpg' },
  { image: '/images/memory/P1084367(1).min.jpg' },
  { image: '/images/memory/P1084367.min.jpg' },
  { image: '/images/memory/P1084371(1).min.jpg' },
  { image: '/images/memory/P1084371.min.jpg' },
  { image: '/images/memory/P1084377(1).min.jpg' },
  { image: '/images/memory/P1084377.min.jpg' },
  { image: '/images/memory/P1084378(1).min.jpg' },
  { image: '/images/memory/P1084378.min.jpg' },
  { image: '/images/memory/P1084382(1).min.jpg' },
  { image: '/images/memory/P1084382.min.jpg' },
  { image: '/images/memory/P1084385(1).min.jpg' },
  { image: '/images/memory/P1084385.min.jpg' },
  { image: '/images/memory/P1084417(1).min.jpg' },
  { image: '/images/memory/P1084417.min.jpg' },
  { image: '/images/memory/P1084418(1).min.jpg' },
  { image: '/images/memory/P1084418.min.jpg' },
  { image: '/images/memory/P1084420(1).min.jpg' },
  { image: '/images/memory/P1084420.min.jpg' },
  { image: '/images/memory/P1084421(1).min.jpg' },
  { image: '/images/memory/P1084421.min.jpg' },
  { image: '/images/memory/P1084425(1).min.jpg' },
  { image: '/images/memory/P1084425.min.jpg' },
  { image: '/images/memory/P1084426(1).min.jpg' },
  { image: '/images/memory/P1084426.min.jpg' },
  { image: '/images/memory/P1084428(1).min.jpg' },
  { image: '/images/memory/P1084428.min.jpg' },
  { image: '/images/memory/P1084432(1).min.jpg' },
  { image: '/images/memory/P1084432.min.jpg' },
  { image: '/images/memory/P1084442(1).min.jpg' },
  { image: '/images/memory/P1084442.min.jpg' },
  { image: '/images/memory/P1084444(1).min.jpg' },
  { image: '/images/memory/P1084444.min.jpg' },
  { image: '/images/memory/P1084446(1).min.jpg' },
  { image: '/images/memory/P1084446.min.jpg' },
  { image: '/images/memory/P1084451(1).min.jpg' },
  { image: '/images/memory/P1084451.min.jpg' },
  { image: '/images/memory/P1084452(1).min.jpg' },
  { image: '/images/memory/P1084452.min.jpg' },
  { image: '/images/memory/P1084453(1).min.jpg' },
  { image: '/images/memory/P1084453.min.jpg' },
  { image: '/images/memory/P1084457(1).min.jpg' },
  { image: '/images/memory/P1084457.min.jpg' },
  { image: '/images/memory/P1084458(1).min.jpg' },
  { image: '/images/memory/P1084458.min.jpg' },
  { image: '/images/memory/P1084460(1).min.jpg' },
  { image: '/images/memory/P1084460.min.jpg' },
  { image: '/images/memory/P1084462(1).min.jpg' },
  { image: '/images/memory/P1084462.min.jpg' },
  { image: '/images/memory/P1084463(1).min.jpg' },
  { image: '/images/memory/P1084463.min.jpg' },
  { image: '/images/memory/P1084467(1).min.jpg' },
  { image: '/images/memory/P1084467.min.jpg' },
  { image: '/images/memory/P1084468(1).min.jpg' },
  { image: '/images/memory/P1084468.min.jpg' },
  { image: '/images/memory/P1084470(1).min.jpg' },
  { image: '/images/memory/P1084470.min.jpg' },
  { image: '/images/memory/P1084471(1).min.jpg' },
  { image: '/images/memory/P1084471.min.jpg' },
  { image: '/images/memory/P1084474(1).min.jpg' },
  { image: '/images/memory/P1084474.min.jpg' },
  { image: '/images/memory/P1084478(1).min.jpg' },
  { image: '/images/memory/P1084478.min.jpg' },
  { image: '/images/memory/P1084480(1).min.jpg' },
  { image: '/images/memory/P1084480.min.jpg' },
  { image: '/images/memory/P1084484(1).min.jpg' },
  { image: '/images/memory/P1084484.min.jpg' },
  { image: '/images/memory/P1084485(1).min.jpg' },
  { image: '/images/memory/P1084485.min.jpg' },
  { image: '/images/memory/P1084487(1).min.jpg' },
  { image: '/images/memory/P1084487.min.jpg' },
  { image: '/images/memory/P1084491(1).min.jpg' },
  { image: '/images/memory/P1084491.min.jpg' },
  { image: '/images/memory/P1084498(1).min.jpg' },
  { image: '/images/memory/P1084498.min.jpg' },
  { image: '/images/memory/P1084505(1).min.jpg' },
  { image: '/images/memory/P1084505.min.jpg' },
  { image: '/images/memory/P1084507(1).min.jpg' },
  { image: '/images/memory/P1084507.min.jpg' },
  { image: '/images/memory/P1084508(1).min.jpg' },
  { image: '/images/memory/P1084508.min.jpg' },
  { image: '/images/memory/P1084510(1).min.jpg' },
  { image: '/images/memory/P1084510.min.jpg' },
  { image: '/images/memory/P1084516(1).min.jpg' },
  { image: '/images/memory/P1084516.min.jpg' },
  { image: '/images/memory/P1084518.min.jpg' },
  { image: '/images/memory/P1084519.min.jpg' },
  { image: '/images/memory/P1084521.min.jpg' },
  { image: '/images/memory/P1084523.min.jpg' },
  { image: '/images/memory/P1084525.min.jpg' },
  { image: '/images/memory/P1084531.min.jpg' },
  { image: '/images/memory/P1084532.min.jpg' },
  { image: '/images/memory/P1084534.min.jpg' },
  { image: '/images/memory/P1084535.min.jpg' },
  { image: '/images/memory/P1084537.min.jpg' },
  { image: '/images/memory/P1084540.min.jpg' },
  { image: '/images/memory/P1084552.min.jpg' },
  { image: '/images/memory/P1084555.min.jpg' },
  { image: '/images/memory/P1084560.min.jpg' },
  { image: '/images/memory/P1084562.min.jpg' },
  { image: '/images/memory/P1084563.min.jpg' },
  { image: '/images/memory/P1084565.min.jpg' },
  { image: '/images/memory/P1084566.min.jpg' },
  { image: '/images/memory/P1084567.min.jpg' },
  { image: '/images/memory/P1084569.min.jpg' },
  { image: '/images/memory/P1084570.min.jpg' },
  { image: '/images/memory/P1084572.min.jpg' },
  { image: '/images/memory/P1084574.min.jpg' },
  { image: '/images/memory/P1084580.min.jpg' },
  { image: '/images/memory/P1084581.min.jpg' },
  { image: '/images/memory/P1084582.min.jpg' },
  { image: '/images/memory/P1084586.min.jpg' },
  { image: '/images/memory/P1084588.min.jpg' },
  { image: '/images/memory/P1084592.min.jpg' },
  { image: '/images/memory/P1084596.min.jpg' },
  { image: '/images/memory/P1084598.min.jpg' },
  { image: '/images/memory/P1084600.min.jpg' },
  { image: '/images/memory/P1084606.min.jpg' },
  { image: '/images/memory/P1084608.min.jpg' },
  { image: '/images/memory/P1084617.min.jpg' },
  { image: '/images/memory/P1084622.min.jpg' },
  { image: '/images/memory/P1084629.min.jpg' },
  { image: '/images/memory/P1084632.min.jpg' },
  { image: '/images/memory/P1084635.min.jpg' },
  { image: '/images/memory/P1084637.min.jpg' },
  { image: '/images/memory/P1084638.min.jpg' },
  { image: '/images/memory/P1084640.min.jpg' },
  { image: '/images/memory/P1084642.min.jpg' },
  { image: '/images/memory/P1084644.min.jpg' },
  { image: '/images/memory/P1084645.min.jpg' },
  { image: '/images/memory/P1084646.min.jpg' },
  { image: '/images/memory/P1084649.min.jpg' },
  { image: '/images/memory/P1084653.min.jpg' },
  { image: '/images/memory/P1084655.min.jpg' },
  { image: '/images/memory/P1084656.min.jpg' },
  { image: '/images/memory/P1084661.min.jpg' },
  { image: '/images/memory/P1084662.min.jpg' },
  { image: '/images/memory/P1084669.min.jpg' },
  { image: '/images/memory/P1084671.min.jpg' },
  { image: '/images/memory/P1084673.min.jpg' },
  { image: '/images/memory/P1084675.min.jpg' },
  { image: '/images/memory/P1084676.min.jpg' },
  { image: '/images/memory/P1084678.min.jpg' },
  { image: '/images/memory/P1084683.min.jpg' },
  { image: '/images/memory/P1084686.min.jpg' },
  { image: '/images/memory/P1084687.min.jpg' },
  { image: '/images/memory/P1084690.min.jpg' },
  { image: '/images/memory/P1084698.min.jpg' },
  { image: '/images/memory/P1084704.min.jpg' },
  { image: '/images/memory/P1084706.min.jpg' },
  { image: '/images/memory/P1084708.min.jpg' },
  { image: '/images/memory/P1084713.min.jpg' },
  { image: '/images/memory/P1084715.min.jpg' },
  { image: '/images/memory/P1084717.min.jpg' },
  { image: '/images/memory/P1084718.min.jpg' },
  { image: '/images/memory/P1084719.min.jpg' },
  { image: '/images/memory/P1084720.min.jpg' },
  { image: '/images/memory/P1084727.min.jpg' },
  { image: '/images/memory/P1084734.min.jpg' },
  { image: '/images/memory/P1084737.min.jpg' },
  { image: '/images/memory/P1084738.min.jpg' },
  { image: '/images/memory/P1084740.min.jpg' },
  { image: '/images/memory/P1084741.min.jpg' },
  { image: '/images/memory/P1084742.min.jpg' },
  { image: '/images/memory/P1084744.min.jpg' },
  { image: '/images/memory/P1084745.min.jpg' },
  { image: '/images/memory/P1084757.min.jpg' },
  { image: '/images/memory/P1084763.min.jpg' },
  { image: '/images/memory/P1084767.min.jpg' },
  { image: '/images/memory/P1084768.min.jpg' },
  { image: '/images/memory/P1084772.min.jpg' },
  { image: '/images/memory/P1084778.min.jpg' },
  { image: '/images/memory/P1084790.min.jpg' },
  { image: '/images/memory/P1084791.min.jpg' },
  { image: '/images/memory/P1084796.min.jpg' },
  { image: '/images/memory/P1084803.min.jpg' },
  { image: '/images/memory/P1084804.min.jpg' },
  { image: '/images/memory/P1084805.min.jpg' },
  { image: '/images/memory/P1084807.min.jpg' },
  { image: '/images/memory/P1084808.min.jpg' },
  { image: '/images/memory/P1084810.min.jpg' },
  { image: '/images/memory/P1084811.min.jpg' },
  { image: '/images/memory/P1084812.min.jpg' },
  { image: '/images/memory/P1084813.min.jpg' },
  { image: '/images/memory/P1084814.min.jpg' },
  { image: '/images/memory/P1084815.min.jpg' },
  { image: '/images/memory/P1084816.min.jpg' },
  { image: '/images/memory/P1084817.min.jpg' },
  { image: '/images/memory/P1084828.min.jpg' },
  { image: '/images/memory/P1084829.min.jpg' },
  { image: '/images/memory/P1084830.min.jpg' },
  { image: '/images/memory/P1084833.min.jpg' },
  { image: '/images/memory/P1084834.min.jpg' },
  { image: '/images/memory/P1084838.min.jpg' },
  { image: '/images/memory/P1084841.min.jpg' },
  { image: '/images/memory/P1084845.min.jpg' },
  { image: '/images/memory/P1084847.min.jpg' },
  { image: '/images/memory/P1084848.min.jpg' },
  { image: '/images/memory/P1084850.min.jpg' },
  { image: '/images/memory/P1084853.min.jpg' },
  { image: '/images/memory/P1084857.min.jpg' },
  { image: '/images/memory/P1084872.min.jpg' },
  { image: '/images/memory/P1084876.min.jpg' },
  { image: '/images/memory/P1084880.min.jpg' },
  { image: '/images/memory/P1084883.min.jpg' },
  { image: '/images/memory/P1084885.min.jpg' },
  { image: '/images/memory/P1084888.min.jpg' },
  { image: '/images/memory/P1084890.min.jpg' },
  { image: '/images/memory/P1084892.min.jpg' },
  { image: '/images/memory/P1084894.min.jpg' },
  { image: '/images/memory/P1084895.min.jpg' },
  { image: '/images/memory/P1084900.min.jpg' },
  { image: '/images/memory/P1084901.min.jpg' },
  { image: '/images/memory/P1084902.min.jpg' },
  { image: '/images/memory/P1084906.min.jpg' },
  { image: '/images/memory/P1084910.min.jpg' },
  { image: '/images/memory/P1084916.min.jpg' },
  { image: '/images/memory/P1084918.min.jpg' },
  { image: '/images/memory/P1084919.min.jpg' },
  { image: '/images/memory/P1084921.min.jpg' },
  { image: '/images/memory/P1084926.min.jpg' },
  { image: '/images/memory/P1084933.min.jpg' },
  { image: '/images/memory/P1084938.min.jpg' },
  { image: '/images/memory/P1084940.min.jpg' },
  { image: '/images/memory/P1084944.min.jpg' },
  { image: '/images/memory/P1084952.min.jpg' },
  { image: '/images/memory/P1084953.min.jpg' },
  { image: '/images/memory/P1084958.min.jpg' },
  { image: '/images/memory/P1084965.min.jpg' },
  { image: '/images/memory/P1084966.min.jpg' },
  { image: '/images/memory/P1084967.min.jpg' },
  { image: '/images/memory/P1084978.min.jpg' },
  { image: '/images/memory/P1084984.min.jpg' },
  { image: '/images/memory/P1084985.min.jpg' },
  { image: '/images/memory/P1084987.min.jpg' },
  { image: '/images/memory/P1084988.min.jpg' },
  { image: '/images/memory/P1084992.min.jpg' },
  { image: '/images/memory/P1084995.min.jpg' },
  { image: '/images/memory/P1084998.min.jpg' },
  { image: '/images/memory/P1085000.min.jpg' },
  { image: '/images/memory/P1085001.min.jpg' },
  { image: '/images/memory/P1085008.min.jpg' },
  { image: '/images/memory/P1085014.min.jpg' },
  { image: '/images/memory/P1085021.min.jpg' },
  { image: '/images/memory/P1085022.min.jpg' },
  { image: '/images/memory/P1085026.min.jpg' },
  { image: '/images/memory/P1085040.min.jpg' },
  { image: '/images/memory/P1085051.min.jpg' },
  { image: '/images/memory/P1085055.min.jpg' },
  { image: '/images/memory/P1085060.min.jpg' },
  { image: '/images/memory/P1085065.min.jpg' },
  { image: '/images/memory/P1085073.min.jpg' },
  { image: '/images/memory/P1085079.min.jpg' },
  { image: '/images/memory/P1085098.min.jpg' },
  { image: '/images/memory/P1085109.min.jpg' },
  { image: '/images/memory/P1085114.min.jpg' },
  { image: '/images/memory/P1085119.min.jpg' },
  { image: '/images/memory/P1085130.min.jpg' },
  { image: '/images/memory/P1085135.min.jpg' },
  { image: '/images/memory/P1085137.min.jpg' },
  { image: '/images/memory/P1085139.min.jpg' },
  { image: '/images/memory/P1085141.min.jpg' },
  { image: '/images/memory/P1085147.min.jpg' },
  { image: '/images/memory/P1085148.min.jpg' },
  { image: '/images/memory/P1085152.min.jpg' },
  { image: '/images/memory/P1085153.min.jpg' },
  { image: '/images/memory/P1085156.min.jpg' },
  { image: '/images/memory/P1085161.min.jpg' },
  { image: '/images/memory/P1085165.min.jpg' },
  { image: '/images/memory/P1085169.min.jpg' },
  { image: '/images/memory/P1085172.min.jpg' },
  { image: '/images/memory/P1085178.min.jpg' },
  { image: '/images/memory/P1085181.min.jpg' },
  { image: '/images/memory/P1085184.min.jpg' },
  { image: '/images/memory/P1085185.min.jpg' },
  { image: '/images/memory/P1085186.min.jpg' },
  { image: '/images/memory/P1085195.min.jpg' },
  { image: '/images/memory/P1085197.min.jpg' },
  { image: '/images/memory/P1085205.min.jpg' },
  { image: '/images/memory/P1085209.min.jpg' },
  { image: '/images/memory/P1085214.min.jpg' },
  { image: '/images/memory/P1085219.min.jpg' },
  { image: '/images/memory/P1085231.min.jpg' },
  { image: '/images/memory/P1085232.min.jpg' },
  { image: '/images/memory/P1085237.min.jpg' },
  { image: '/images/memory/P1085239.min.jpg' },
  { image: '/images/memory/P1085240.min.jpg' },
  { image: '/images/memory/P1085242.min.jpg' },
  { image: '/images/memory/P1085249.min.jpg' },
  { image: '/images/memory/P1085259.min.jpg' },
  { image: '/images/memory/P1085260.min.jpg' },
  { image: '/images/memory/P1085270.min.jpg' },
  { image: '/images/memory/P1085272-2.min.jpg' },
  { image: '/images/memory/P1085280.min.jpg' },
  { image: '/images/memory/P1085286.min.jpg' },
  { image: '/images/memory/P1085293.min.jpg' },
  { image: '/images/memory/P1085299.min.jpg' },
  { image: '/images/memory/P1085302.min.jpg' },
  { image: '/images/memory/P1085305.min.jpg' },
  { image: '/images/memory/P1085310.min.jpg' },
  { image: '/images/memory/P1085312.min.jpg' },
  { image: '/images/memory/P1085313.min.jpg' },
  { image: '/images/memory/P1085322.min.jpg' }
])


// 当前页显示的照片（分页后）
const currentPhotos = computed(() => {
  const start = (pageNo.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allPhotos.value.slice(start, end).map(photo => ({
    thumbnail: photo.image,
    fullsize: photo.image
  }))
})

// 更新总数
const updateTotalCount = () => {
  totalCount.value = allPhotos.value.length
}

// 分页切换
const handlePageChange = (newPage) => {
  pageNo.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  pageNo.value = 1
  updateTotalCount()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 锁定/解锁页面滚动
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = '15px'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// 打开全屏照片
const openFullScreen = (photo) => {
  fullscreenPhoto.value = photo
  currentPhotoIndex.value = currentPhotos.value.findIndex(p => p === photo)
  lockBodyScroll()
}

// 关闭全屏照片
const closeFullScreen = () => {
  fullscreenPhoto.value = null
  nextTick(() => {
    unlockBodyScroll()
  })
}

// 照片导航
const navigatePhoto = (direction) => {
  const newIndex = currentPhotoIndex.value + direction
  if (newIndex >= 0 && newIndex < currentPhotos.value.length) {
    currentPhotoIndex.value = newIndex
    fullscreenPhoto.value = currentPhotos.value[newIndex]
  }
}

// 重置所有组件状态
const resetComponentState = () => {
  fullscreenPhoto.value = null
  currentPhotoIndex.value = 0
  pageNo.value = 1
  
  // 重置滚动位置
  window.scrollTo(0, 0)
  
  // 确保滚动已解锁
  unlockBodyScroll()
}

onMounted(() => {
  document.title = 'CJNLP 2025 记忆'
  
  // 更新总数
  updateTotalCount()
  
  // 确保页面滚动正常
  unlockBodyScroll()
  window.scrollTo(0, 0)
})

// 组件卸载前确保解锁滚动并重置状态
onBeforeUnmount(() => {
  resetComponentState()
})
</script>

<style scoped>
.photos-container {
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

.page-header {
  margin-bottom: 2rem;
  position: relative;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

h2 {
  font-size: 1.4rem;
  color: #444;
  margin: 2rem 0 1rem;
}

.conference-info {
  margin: 2rem 0;
}

.info-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  font-size: 1.8rem;
  color: #1890ff;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 0.2rem;
}

.info-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.photos-section {
  margin: 2rem 0;
}

.gallery-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 5px;
}

.tab-btn {
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn.active {
  color: #1890ff;
  background-color: #e6f7ff;
  border-bottom: 2px solid #1890ff;
}

.gallery-container {
  position: relative;
  min-height: 300px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.photo-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
}

.photo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.photo-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.view-icon {
  font-size: 2rem;
  color: white;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
}


.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-suggestion {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #aaa;
}

.conference-description {
  color: #666;
  font-size: 1.1rem;
  margin: 1rem 0 2rem;
  line-height: 1.6;
}

.photo-pagination {
  margin-top: 2rem;
}

/* 全屏照片查看 */
.fullscreen-photo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.fullscreen-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
}

.fullscreen-content img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}


.close-fullscreen {
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-nav {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.photo-counter {
  color: #ccc;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .photos-container, 
  .content-wrapper {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .info-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .photo-grid {
    grid-template-columns: 1fr;
  }
  
  .fullscreen-content img {
    max-height: 70vh;
  }
  
  .close-fullscreen {
    top: -30px;
    right: 0;
  }
  
  .fullscreen-nav {
    bottom: -30px;
  }
}

@media (max-width: 480px) {
  .photos-container {
    padding: 0.8rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.3rem;
  }

  .conference-description {
    font-size: 0.9rem;
    margin: 0.8rem 0 1.5rem;
  }

  .info-card {
    padding: 1rem;
  }

  .info-item {
    gap: 0.8rem;
  }

  .info-icon {
    font-size: 1.5rem;
  }

  .info-label {
    font-size: 0.8rem;
  }

  .info-value {
    font-size: 1rem;
  }

  .gallery-tabs {
    margin-bottom: 1.5rem;
  }

  .tab-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .photo-grid {
    gap: 1rem;
  }

  .photo-wrapper {
    height: 180px;
  }


  .empty-state {
    padding: 3rem 0;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-suggestion {
    font-size: 0.8rem;
  }

  .fullscreen-content {
    max-width: 95%;
  }


  .nav-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .photo-counter {
    font-size: 0.8rem;
  }
}
</style>

