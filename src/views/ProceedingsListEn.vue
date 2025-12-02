<template>
  <div class="proceedings-list-container">
    <div class="content-wrapper">
      <h1>Proceedings List</h1>
      <h2 class="conference-title">{{ conferenceTitle }}</h2>

      <div class="filter-section">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="Search by title, author or keywords..." class="search-input">
          <button class="search-btn" @click="handleSearch">Search</button>
        </div>
        <div class="filter-tabs">
          <div class="tab" :class="{ active: currentType === 0 }" @click="handleTypeChange(0)">All</div>
          <div class="tab" :class="{ active: currentType === 1 }" @click="handleTypeChange(1)">Papers</div>
          <div class="tab" :class="{ active: currentType === 2 }" @click="handleTypeChange(2)">Reports</div>
          <div class="tab" :class="{ active: currentType === 3 }" @click="handleTypeChange(3)">Posters</div>
        </div>
      </div>

      <div class="papers-list">
        <div v-for="paper in paperList" :key="paper.id" class="paper-item">
          <div class="paper-type" :class="getTypeClass(paper.submitType)">{{ getTypeLabel(paper.submitType) }}</div>
          <div class="paper-content">
            <h3>{{ paper.title }}</h3>
            <p class="authors">{{ paper.authors }}</p>
            <p class="abstract">{{ paper.abstract }}</p>
            <p class="keywords"><span>Keywords: </span>{{ paper.keywords }}</p>
            <div class="paper-actions">
              <a :href="paper.pdfUrl" class="action-btn" target="_blank">
                <span class="icon">📄</span>
                Download PDF
              </a>
              <a :href="paper.viewUrl" class="action-btn" target="_blank">
                <span class="icon">🔍</span>
                View Online
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getThesisListApi, getGraduatesListApi } from '../api'
import { useRoute } from 'vue-router'

const route = useRoute()
const year = ref(route.query.year || '2025')
const conferenceTitle = ref('')

const searchQuery = ref('')
const currentType = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const paperList = ref([])

const getTypeLabel = (type) => {
  const types = {
    1: 'Paper',
    2: 'Report',
    3: 'Poster'
  }
  return types[type] || ''
}

const getTypeClass = (type) => {
  switch (type) {
    case 1: return 'type-paper'
    case 2: return 'type-report'
    case 3: return 'type-poster'
    default: return ''
  }
}

const handleTypeChange = async (type) => {
  currentType.value = type
  currentPage.value = 1
  await fetchPapers()
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await fetchPapers()
}

const handleSearch = async () => {
  currentPage.value = 1
  await fetchPapers()
}

const fetchConferenceInfo = async () => {
  try {
    const graduatesList = await getGraduatesListApi()
    const conference = graduatesList.find(item => item.year === year.value)
    if (conference) {
      conferenceTitle.value = conference.title
    }
  } catch (error) {
    console.error('Failed to fetch conference info:', error)
  }
}

const fetchPapers = async () => {
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      submitType: currentType.value,
      search: searchQuery.value,
      year: year.value
    }
    const res = await getThesisListApi(params)
    paperList.value = res.lists
    total.value = res.count
  } catch (error) {
    console.error('Failed to fetch papers:', error)
  }
}

onMounted(async () => {
  await fetchConferenceInfo()
  await fetchPapers()
})
</script>

<style scoped>
.proceedings-list-container {
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

.conference-title {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.filter-section {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-btn {
  padding: 0.5rem 1.5rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #40a9ff;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.tab.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.papers-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.paper-item {
  display: flex;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.paper-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.paper-type {
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-weight: bold;
  color: white;
  padding: 1rem 0.5rem;
  background: #1890ff;
}

.paper-type.type-paper {
  background: #1890ff;
}

.paper-type.type-report {
  background: #2ecc71;
}

.paper-type.type-poster {
  background: #e67e22;
}

.paper-content {
  padding: 1.5rem;
  flex: 1;
}

.paper-content h3 {
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}

.authors {
  color: #666;
  margin-bottom: 0.5rem;
}

.abstract {
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.keywords {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.keywords span {
  color: #999;
}

.paper-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
  transition: background 0.3s;
}

.action-btn:hover {
  background: rgba(24, 144, 255, 0.2);
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .proceedings-list-container {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .search-box {
    flex-direction: column;
  }

  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .paper-item {
    flex-direction: column;
  }

  .paper-type {
    writing-mode: horizontal-tb;
    width: 100%;
    min-width: auto;
    padding: 0.5rem;
  }

  .paper-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .proceedings-list-container {
    padding: 0.8rem;
  }

  .content-wrapper {
    padding: 0.8rem;
  }

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
  }

  .conference-title {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
  }

  .filter-section {
    margin-bottom: 1.5rem;
  }

  .search-box {
    flex-direction: row;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .search-input {
    flex: 1;
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .search-btn {
    padding: 0.5rem 1rem;
    white-space: nowrap;
  }

  .filter-tabs {
    gap: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
  }

  .tab {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .paper-item {
    flex-direction: column;
  }

  .paper-type {
    writing-mode: horizontal-tb;
    width: 100%;
    min-width: auto;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .paper-content {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .paper-content h3 {
    font-size: 1.1rem;
  }

  .authors, .abstract, .keywords {
    font-size: 0.9rem;
  }

  .paper-actions {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    padding: 0.5rem;
  }

  .pagination {
    margin-top: 1.5rem;
  }
}
</style> 