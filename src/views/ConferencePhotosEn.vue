<template>
  <div class="photos-container">
    <div class="content-wrapper">
      <div class="page-header">
        <router-link to="/en/historical" class="back-link">
          <span class="back-icon">←</span>
          <span>Back to History</span>
        </router-link>
        <h1>{{ conferenceData.title }}</h1>
        <p class="conference-description">{{ conferenceData.description }}</p>
      </div>
      
      <div class="conference-info">
        <div class="info-card">
          <div class="info-item">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="info-label">Conference Date</div>
              <div class="info-value">{{ conferenceData.time }}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">📍</div>
            <div class="info-content">
              <div class="info-label">Venue</div>
              <div class="info-value">{{ conferenceData.venue }}</div>
            </div>
          </div>
          
          <div class="info-item" v-if="conferenceData.chair">
            <div class="info-icon">👥</div>
            <div class="info-content">
              <div class="info-label">Conference Chair</div>
              <div class="info-value">{{ conferenceData.chair }}</div>
            </div>
          </div>
          
          <div class="info-item" v-if="conferenceData.attendees && parseInt(conferenceData.attendees) > 0">
            <div class="info-icon">🧑‍🤝‍🧑</div>
            <div class="info-content">
              <div class="info-label">Attendees</div>
              <div class="info-value">{{ conferenceData.attendees }}</div>
            </div>
          </div>

          <div class="info-item" v-if="conferenceData.link">
            <div class="info-icon">🌐</div>
            <div class="info-content">
              <div class="info-label">Official Website</div>
              <div class="info-value">
                <a :href="conferenceData.link" target="_blank" rel="noopener noreferrer" class="website-link">
                  Visit Website
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
            <p>No {{ photoTabs[activeTab] }} photos available</p>
            <p class="empty-suggestion">You can switch to other categories to view related photos</p>
          </div>
          <!-- Pagination component -->
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
        <h2>Photo Submission</h2>
        <p class="form-description">Did you capture memorable moments at the conference? Share your photos with us!</p>
        
        <form @submit.prevent="submitPhotoForm">
          <div class="form-group">
            <label for="submitter-name">Your Name</label>
            <input 
              type="text" 
              id="submitter-name" 
              v-model="photoForm.name" 
              placeholder="Enter your name"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="submitter-email">Your Email</label>
            <input 
              type="text" 
              id="submitter-email" 
              v-model="photoForm.email" 
              placeholder="Enter your email address"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="photo-category">Photo Category</label>
            <select 
              id="photo-category" 
              v-model="photoForm.category"
              required
            >
              <option value="">Select a category</option>
              <option v-for="tab in photoTabs" :key="tab" :value="tab">{{ tab }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="photo-caption">Photo Caption</label>
            <input 
              type="text" 
              id="photo-caption" 
              v-model="photoForm.description" 
              placeholder="Briefly describe the photo"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="photo-file">Select Photo</label>
            <input 
              type="file" 
              id="photo-file" 
              @change="handleFileChange" 
              accept="image/*"
              required
            >
            <div class="file-preview" v-if="photoPreview">
              <img :src="photoPreview" alt="Preview">
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="photoForm.agreement" required>
              <span>I agree to authorize CJNLP conference organizers to use my submitted photos</span>
            </label>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Submitting...' : 'Submit Photo' }}
            </button>
          </div>
          
          <div class="form-message" v-if="formMessage">
            {{ formMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Fullscreen Photo View -->
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
  <SliderCaptcha ref="captchaRef" lang="en"/>
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

const photoTabs = ['Opening Ceremony', 'Presentations', 'Group Photos', 'Activities']

// Category mapping
const categoryMap = {
  'Opening Ceremony': 1,
  'Presentations': 2,
  'Group Photos': 3,
  'Activities': 4
}

// Photo submission form data
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

// Fetch photos data
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
    console.error('Failed to fetch photos:', error)
  }
}

// Handle file selection
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
      photoForm.value.picture = response // Save the returned image URL
      const reader = new FileReader()
      reader.onload = (e) => {
        photoPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
      ElMessage.success('Image uploaded successfully')
    } catch (error) {
      console.error('Failed to upload image:', error)
      ElMessage.error('Failed to upload image, please try again')
    }
  }
}

// Fetch conference data
const fetchConferenceData = async () => {
  try {
    const response = await getConferenceByYearApi(year)
    if (response) {
      conferenceData.value = {
        id: response.id,
        time: `${response.year}`,
        venue: response.location_en || '',
        chair: response.chairman || '',
        attendees: `${response.attendees} attendees`,
        title: response.title_en || '',
        description: response.description_en || '',
        link: response.link || ''
      }
    }
  } catch (error) {
    console.error('Failed to fetch conference data:', error)
    ElMessage.error('Failed to fetch conference data')
  }
}

// Current selected category photos
const currentPhotos = computed(() => {
  return photosList.value.map(photo => ({
    thumbnail: photo.picture,
    fullsize: photo.picture,
    caption: photo.description || 'No description'
  }))
})

// Watch for tab changes and refetch photos
watch(activeTab, async (newTab) => {
  pageNo.value = 1
  await fetchPhotos()
})

// Pagination handlers
const handlePageChange = async (newPage) => {
  pageNo.value = newPage
  await fetchPhotos()
}
const handleSizeChange = async (newSize) => {
  pageSize.value = newSize
  pageNo.value = 1
  await fetchPhotos()
}

// Related conferences (excluding current conference)
const relatedConferences = computed(() => {
  return allConferences.filter(conf => conf.year !== year).slice(0, 4)
})

// Lock/unlock page scrolling
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = '15px' // Prevent scroll bar disappearance causing page shake
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// Open fullscreen photo
const openFullScreen = (photo) => {
  fullscreenPhoto.value = photo
  currentPhotoIndex.value = currentPhotos.value.findIndex(p => p === photo)
  lockBodyScroll()
}

// Close fullscreen photo
const closeFullScreen = () => {
  fullscreenPhoto.value = null
  nextTick(() => {
    unlockBodyScroll()
  })
}

// Photo navigation
const navigatePhoto = (direction) => {
  const newIndex = currentPhotoIndex.value + direction
  if (newIndex >= 0 && newIndex < currentPhotos.value.length) {
    currentPhotoIndex.value = newIndex
    fullscreenPhoto.value = currentPhotos.value[newIndex]
  }
}

// Reset all component states
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
  
  // Reset scroll position
  window.scrollTo(0, 0)
  
  // Ensure scroll is unlocked
  unlockBodyScroll()
}

onMounted(async () => {
  document.title = `CJNLP Conference Photos ${year}`
  
  // Fetch conference data
  await fetchConferenceData()
  
  // Fetch photos data
  await fetchPhotos()
  
  // Ensure page scrolling is normal
  unlockBodyScroll()
  window.scrollTo(0, 0)
})

// Component unmount before ensure unlocking scroll and resetting state
onBeforeUnmount(() => {
  resetComponentState()
})

// Add keep-alive support, although current not used, but retained in case needed in the future
onActivated(() => {
  resetComponentState()
})

onDeactivated(() => {
  resetComponentState()
})

// Submit photo form
const submitPhotoForm = async () => {
  if (!photoForm.value.picture) {
    ElMessage.error('Please upload an image first')
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
    
    formMessage.value = 'Thank you for your submission! Photos will be displayed after review.'
    
    // Reset form
    photoForm.value = {
      name: photoForm.value.name,
      email: photoForm.value.email,
      category: '',
      description: '',
      picture: '',
      agreement: false
    }
    photoPreview.value = null
    
    // Clear file input
    const fileInput = document.getElementById('photo-file')
    if (fileInput) fileInput.value = ''
    
    // Refresh photo list
    await fetchPhotos()
    
  } catch (error) {
    formMessage.value = 'Submission failed, please try again later.'
    console.error('Failed to submit photo:', error)
  } finally {
    isSubmitting.value = false
  }
}
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

/* Fullscreen Photo View */
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

.conference-description {
  color: #666;
  font-size: 1.1rem;
  margin: 1rem 0 2rem;
  line-height: 1.6;
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