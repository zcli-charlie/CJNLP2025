<template>
  <div class="photos-container">
    <div class="content-wrapper">
      <div class="page-header">
        <router-link to="/ja/historical" class="back-link">
          <span class="back-icon">←</span>
          <span>歴史に戻る</span>
        </router-link>
        <h1>{{ conferenceData.title }}</h1>
        <p class="conference-description">{{ conferenceData.description }}</p>
      </div>
      
      <div class="conference-info">
        <div class="info-card">
          <div class="info-item">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="info-label">会議日程</div>
              <div class="info-value">{{ conferenceData.time }}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">📍</div>
            <div class="info-content">
              <div class="info-label">会議場所</div>
              <div class="info-value">{{ conferenceData.venue }}</div>
            </div>
          </div>
          
          <div class="info-item" v-if="conferenceData.chair">
            <div class="info-icon">👥</div>
            <div class="info-content">
              <div class="info-label">会議議長</div>
              <div class="info-value">{{ conferenceData.chair }}</div>
            </div>
          </div>
          
          <div class="info-item" v-if="conferenceData.attendees && parseInt(conferenceData.attendees) > 0">
            <div class="info-icon">🧑‍🤝‍🧑</div>
            <div class="info-content">
              <div class="info-label">参加人数</div>
              <div class="info-value">{{ conferenceData.attendees }}</div>
            </div>
          </div>

          <div class="info-item" v-if="conferenceData.link">
            <div class="info-icon">🌐</div>
            <div class="info-content">
              <div class="info-label">公式サイト</div>
              <div class="info-value">
                <a :href="conferenceData.link" target="_blank" rel="noopener noreferrer" class="website-link">
                  サイトへ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="photos-section">
        <div class="gallery-tabs">
          <button 
            v-for="(tab, index) in photoTabs" 
            :key="index"
            :class="['tab-btn', { active: activeTab === index }]"
            @click="activeTab = index"
          >
            {{ tab }}
          </button>
        </div>
        
        <div class="gallery-container">
          <div class="photo-grid" v-if="currentPhotos.length > 0">
            <div 
              v-for="(photo, index) in currentPhotos" 
              :key="index" 
              class="photo-item"
              @click="openFullScreen(photo)"
            >
              <div class="photo-wrapper">
                <img :src="photo.thumbnail" :alt="photo.caption">
                <div class="photo-overlay">
                  <span class="view-icon">🔍</span>
                </div>
              </div>
              <div class="photo-caption">{{ photo.caption }}</div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <div class="empty-icon">📷</div>
            <p>{{ photoTabs[activeTab] }}の写真はまだありません</p>
            <p class="empty-suggestion">他のカテゴリに切り替えて関連写真をご覧ください</p>
          </div>
          <!-- ページネーション -->
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
      
      <div class="photo-submission-form">
        <h2>個人写真の提出</h2>
        <p class="form-description">この会議の素晴らしい瞬間を撮影されましたか？あなたの写真をみんなと共有してください！</p>
        
        <form @submit.prevent="submitPhotoForm">
          <div class="form-group">
            <label for="submitter-name">お名前</label>
            <input 
              type="text" 
              id="submitter-name" 
              v-model="photoForm.name" 
              placeholder="お名前を入力してください"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="submitter-email">メールアドレス</label>
            <input 
              type="text" 
              id="submitter-email" 
              v-model="photoForm.email" 
              placeholder="連絡先のメールアドレスを入力してください"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="photo-category">写真カテゴリ</label>
            <select 
              id="photo-category" 
              v-model="photoForm.category"
              required
            >
              <option value="">写真カテゴリを選択してください</option>
              <option v-for="tab in photoTabs" :key="tab" :value="tab">{{ tab }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="photo-caption">写真の説明</label>
            <input 
              type="text" 
              id="photo-caption" 
              v-model="photoForm.description" 
              placeholder="写真の内容を簡単に説明してください"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="photo-file">写真を選択</label>
            <input 
              type="file" 
              id="photo-file" 
              @change="handleFileChange" 
              accept="image/*"
              required
            >
            <div class="file-preview" v-if="photoPreview">
              <img :src="photoPreview" alt="プレビュー">
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="photoForm.agreement" required>
              <span>私はCJNLP会議主催者に提出した写真の使用を許可します</span>
            </label>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '送信中...' : '写真を送信' }}
            </button>
          </div>
          
          <div class="form-message" v-if="formMessage">
            {{ formMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- 全画面写真表示 -->
  <div class="fullscreen-photo" v-if="fullscreenPhoto" @click="closeFullScreen">
    <div class="fullscreen-content">
      <img :src="fullscreenPhoto.fullsize" :alt="fullscreenPhoto.caption">
      <div class="fullscreen-caption">{{ fullscreenPhoto.caption }}</div>
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
  <SliderCaptcha ref="captchaRef" lang="ja"/>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPicturesListApi, postUploadApi, postAddPicturesApi, getConferenceByYearApi } from '../api/index'
import { ElMessage } from 'element-plus'
import {compressImage} from '../utils/util'
import SliderCaptcha from '../components/SliderCaptcha.vue'
import { getRequest } from '../utils/request'


const captchaRef = ref(null)

const route = useRoute()
const year = parseInt(route.params.year)
const location = route.params.location

const activeTab = ref(0)
const fullscreenPhoto = ref(null)
const currentPhotoIndex = ref(0)
const photosList = ref([])
const conferenceData = ref({
  id: 0,
  time: '',
  venue: '',
  chair: '',
  attendees: '',
  title: '',
  description: ''
})

const photoTabs = ['開会式', '発表', '集合写真', 'イベント']

// カテゴリマッピング
const categoryMap = {
  '開会式': 1,
  '発表': 2,
  '集合写真': 3,
  'イベント': 4
}

// 写真提出フォームデータ
const photoForm = ref({
  name: '',
  email: '',
  category: '',
  description: '',
  picture: '',
  agreement: false
})
const photoPreview = ref(null)
const isSubmitting = ref(false)
const formMessage = ref('')

const pageNo = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 写真データの取得
const fetchPhotos = async () => {
  photosList.value = []
  try {
    const response = await getPicturesListApi({ 
      year,
      category: categoryMap[photoTabs[activeTab.value]],
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (response) {
      photosList.value = response.lists || []
      totalCount.value = response.count || 0
      pageNo.value = response.pageNo || 1
      pageSize.value = response.pageSize || 12
    }
  } catch (error) {
    console.error('写真の取得に失敗しました:', error)
  }
}

// 現在選択されているカテゴリの写真
const currentPhotos = computed(() => {
  return photosList.value.map(photo => ({
    thumbnail: photo.picture,
    fullsize: photo.picture,
    caption: photo.description || '説明なし'
  }))
})

// タブの変更を監視し、写真を再取得しページをリセット
watch(activeTab, async (newTab) => {
  pageNo.value = 1
  await fetchPhotos()
})
// ページネーションのハンドラ
const handlePageChange = async (newPage) => {
  pageNo.value = newPage
  await fetchPhotos()
}
const handleSizeChange = async (newSize) => {
  pageSize.value = newSize
  pageNo.value = 1
  await fetchPhotos()
}

// ファイル選択の処理
const handleFileChange = async (event) => {
  let file = event.target.files[0]
  if (file) {
    
    try {
        // 先检查邮箱是否存在
        // let res = await getRequest("/registration/check_email", {
        //   email: photoForm.value.email,
        // });
        // if (!res.email) {
        //   const ok = await captchaRef.value?.show();
        //   if (!ok) return;
        // }

        if (file.size > 5 * 1024 * 1024) {
            // 图片压缩
            file = await compressImage(file)
        }
        const params = new FormData()
        params.append('file', file)
        params.append('type', '2')
      const response = await postUploadApi(params)
      photoForm.value.picture = response // 返された画像URLを保存
      const reader = new FileReader()
      reader.onload = (e) => {
        photoPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
      ElMessage.success('画像のアップロードに成功しました')
    } catch (error) {
      console.error('画像のアップロードに失敗しました:', error)
      ElMessage.error('画像のアップロードに失敗しました。もう一度お試しください')
    }
  }
}

// 写真フォームの送信
const submitPhotoForm = async () => {
  if (!photoForm.value.picture) {
    ElMessage.error('先に画像をアップロードしてください')
    return
  }
  
  isSubmitting.value = true
  formMessage.value = ''
  
  try {
    await postAddPicturesApi({
      graduates_id: conferenceData.value.id,
      name: photoForm.value.name,
      email: photoForm.value.email,
      category: categoryMap[photoForm.value.category],
      description: photoForm.value.description,
      picture: photoForm.value.picture,
      year: year
    })
    
    formMessage.value = 'ご提出ありがとうございます！写真は審査後に表示されます。'
    
    // フォームのリセット
    photoForm.value = {
      name: photoForm.value.name,
      email: photoForm.value.email,
      category: '',
      description: '',
      picture: '',
      agreement: false
    }
    photoPreview.value = null
    
    // ファイル選択をクリア
    const fileInput = document.getElementById('photo-file')
    if (fileInput) fileInput.value = ''
    
    // 写真リストを更新
    await fetchPhotos()
    
  } catch (error) {
    formMessage.value = '送信に失敗しました。後でもう一度お試しください。'
    console.error('写真の送信に失敗しました:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 会議データの取得
const fetchConferenceData = async () => {
  try {
    const response = await getConferenceByYearApi(year)
    if (response) {
      conferenceData.value = {
        id: response.id,
        time: `${response.year}年`,
        venue: response.location_jp || '',
        chair: response.chairman || '',
        attendees: `${response.attendees}名`,
        title: response.title_jp || '',
        description: response.description_jp || '',
        link: response.link || ''
      }
    }
  } catch (error) {
    console.error('会議データの取得に失敗しました:', error)
    ElMessage.error('会議データの取得に失敗しました')
  }
}

// 関連会議データ
const allConferences = [
  { year: 2023, location: '西双版納' },
  { year: 2018, location: '桂林' },
  { year: 2012, location: 'ハルビン' },
  { year: 2008, location: '北京' },
  { year: 2006, location: '上海' },
  { year: 2002, location: '北京' }
]

// 関連会議（現在の会議を除く）
const relatedConferences = computed(() => {
  return allConferences.filter(conf => conf.year !== year).slice(0, 4)
})

// ページスクロールのロック/解除
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = '15px' // スクロールバーの消失によるページのズレを防止
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// 全画面写真を開く
const openFullScreen = (photo) => {
  fullscreenPhoto.value = photo
  currentPhotoIndex.value = currentPhotos.value.findIndex(p => p === photo)
  lockBodyScroll()
}

// 全画面写真を閉じる
const closeFullScreen = () => {
  fullscreenPhoto.value = null
  nextTick(() => {
    unlockBodyScroll()
  })
}

// 写真のナビゲーション
const navigatePhoto = (direction) => {
  const newIndex = currentPhotoIndex.value + direction
  if (newIndex >= 0 && newIndex < currentPhotos.value.length) {
    currentPhotoIndex.value = newIndex
    fullscreenPhoto.value = currentPhotos.value[newIndex]
  }
}

// コンポーネントの状態をリセット
const resetComponentState = () => {
  activeTab.value = 0
  fullscreenPhoto.value = null
  currentPhotoIndex.value = 0
  photoForm.value = {
    name: '',
    email: '',
    category: '',
    caption: '',
    picture: '',
    agreement: false
  }
  photoPreview.value = null
  isSubmitting.value = false
  formMessage.value = ''
  
  // スクロール位置のリセット
  window.scrollTo(0, 0)
  
  // スクロールが解除されていることを確認
  unlockBodyScroll()
}

onMounted(async () => {
  document.title = `${year}年CJNLP会議写真`
  
  // 会議データの取得
  await fetchConferenceData()
  
  // 写真データの取得
  await fetchPhotos()
  
  // ページスクロールが正常であることを確認
  unlockBodyScroll()
  window.scrollTo(0, 0)
})

// コンポーネントのアンマウント前にスクロールを解除し状態をリセット
onBeforeUnmount(() => {
  resetComponentState()
})

// keep-aliveサポートを追加、現在は使用していないが将来必要になる場合に備えて保持
onActivated(() => {
  resetComponentState()
})

onDeactivated(() => {
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

.back-link {
  display: inline-flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #1890ff;
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
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

.website-link {
  color: #1890ff;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.2s;
}

.website-link:hover {
  color: #40a9ff;
  text-decoration: underline;
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

.photo-caption {
  padding: 1rem;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.4;
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

.photo-submission-form {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.form-description {
  color: #666;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input[type="text"]:focus,
.form-group input[type="email"]:focus,
.form-group select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.form-group input[type="file"] {
  display: block;
  padding: 0.8rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 0.9rem;
  color: #666;
}

.file-preview {
  margin-top: 1rem;
  max-width: 300px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.file-preview img {
  width: 100%;
  display: block;
}

.form-actions {
  margin-top: 2rem;
}

.submit-btn {
  padding: 0.8rem 2rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #40a9ff;
}

.submit-btn:disabled {
  background: #b7b7b7;
  cursor: not-allowed;
}

.form-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  color: #52c41a;
  font-size: 0.9rem;
}

/* 全画面写真表示 */
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

.fullscreen-caption {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  padding: 10px;
  font-size: 1rem;
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
  bottom: -80px;
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

.photo-pagination {
  margin-top: 2rem;
  text-align: center;
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
    bottom: -70px;
  }
  
  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group select {
    padding: 0.7rem;
  }
  
  .submit-btn {
    width: 100%;
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

  .photo-caption {
    padding: 0.8rem;
    font-size: 0.9rem;
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

  .photo-submission-form {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }

  h2 {
    font-size: 1.2rem;
    margin: 1.5rem 0 0.8rem;
  }

  .form-description {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .form-group {
    margin-bottom: 1.2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group select,
  .form-group input[type="file"] {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.9rem;
    box-sizing: border-box;
  }

  .file-preview {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .checkbox-label {
    width: 100%;
    box-sizing: border-box;
  }

  .checkbox-label span {
    font-size: 0.8rem;
    word-break: break-word;
  }

  .submit-btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }

  .form-message {
    font-size: 0.8rem;
    padding: 0.8rem;
  }

  .fullscreen-content {
    max-width: 95%;
  }

  .fullscreen-caption {
    font-size: 0.9rem;
    bottom: -35px;
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