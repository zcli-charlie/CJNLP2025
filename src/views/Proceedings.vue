<template>
  <div class="proceedings-container">
    <div class="content-wrapper">
      <h1>会议报告集</h1>

      <!-- 当前会议论文/报告/海报列表 -->
      <section class="proceedings-section">
        <h2>📋 CJNLP 2025 报告/海报列表</h2>

        <div class="category-tabs">
          <div class="tab" :class="tab===0?'active':''"  @click="changeTab(0)">全部</div>
          <div class="tab" :class="tab===2?'active':''" @click="changeTab(2)">报告</div>
          <div class="tab" :class="tab===3?'active':''" @click="changeTab(3)">海报</div>
        </div>

        <div class="paper-search">
          <input type="text" v-model="keywords" placeholder="搜索标题、作者或关键词..." class="search-input">
          <button class="search-btn" @click="search">搜索</button>
        </div>

        <div class="papers-list">
          <template v-if="thesisList.lists && thesisList.lists.length > 0">
            <template v-for="(i,index) in thesisList.lists">
              <div class="paper-item">
                <div class="paper-type" :class="getTypeClass(i.submitType)">{{getSubmitType(i.submitType)}}</div>
                <div class="paper-content">
                  <h3>{{ i.title }}</h3>
                  <p class="authors">{{ i.authors }}</p>
                  <p class="affiliation">{{ i.abstract }}</p>
                  <p class="keywords"><span>关键词：</span>{{ i.keywords }}</p>
                  <div class="paper-actions">
                    <a href="#" class="paper-btn">
                      <span class="icon">📄</span>
                      PDF下载
                    </a>
                    <a href="#" class="paper-btn">
                      <span class="icon">🔍</span>
                      在线阅读
                    </a>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="paper-item empty-state">
              <div class="paper-type type-report">报告</div>
              <div class="paper-content">
                <div class="skeleton-placeholder" style="width: 60%; height: 24px;"></div>
                <div class="skeleton-placeholder" style="width: 40%; height: 18px; margin-top: 12px;"></div>
                <div class="skeleton-placeholder" style="width: 80%; height: 16px; margin-top: 12px;"></div>
                <div class="skeleton-placeholder" style="width: 50%; height: 16px; margin-top: 12px;"></div>
                <div class="paper-actions" style="margin-top: 16px;">
                  <div class="skeleton-placeholder" style="width: 100px; height: 32px;"></div>
                  <div class="skeleton-placeholder" style="width: 100px; height: 32px; margin-left: 8px;"></div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="pagination">
          <el-pagination background layout=" pager" :total="thesisList.count"
                         :page-size="thesisListParams.pageSize" @current-change="changePage" />
        </div>

      </section>

      <!-- 优秀论文 -->
      <section class="proceedings-section">
        <h2>🏆 优秀讲者</h2>
        <div class="best-papers">
          <div class="best-paper-item">
            <h3>CJNLP 2025 优秀讲者</h3>
            <div class="paper-list">
              <template v-if="excellentThesisList.lists && excellentThesisList.lists.length > 0">
                <template v-for="(i,index) in excellentThesisList.lists">
                  <div class="paper-card">
                    <h4>{{i.title}}</h4>
                    <p class="authors">{{i.authors}}</p>
                    <p class="affiliation">{{i.abstract}}</p>
                    <a href="#" class="paper-link">查看论文</a>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="paper-card">
                  <div class="skeleton-placeholder" style="width: 80%; height: 20px;"></div>
                  <div class="skeleton-placeholder" style="width: 60%; height: 16px; margin-top: 12px;"></div>
                  <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 12px;"></div>
                  <div class="skeleton-placeholder" style="width: 100px; height: 20px; margin-top: 16px;"></div>
                </div>
                <div class="paper-card">
                  <div class="skeleton-placeholder" style="width: 80%; height: 20px;"></div>
                  <div class="skeleton-placeholder" style="width: 60%; height: 16px; margin-top: 12px;"></div>
                  <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 12px;"></div>
                  <div class="skeleton-placeholder" style="width: 100px; height: 20px; margin-top: 16px;"></div>
                </div>
                <div class="paper-card">
                  <div class="skeleton-placeholder" style="width: 80%; height: 20px;"></div>
                  <div class="skeleton-placeholder" style="width: 60%; height: 16px; margin-top: 12px;"></div>
                  <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 12px;"></div>
                  <div class="skeleton-placeholder" style="width: 100px; height: 20px; margin-top: 16px;"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- 历届论文集 -->
      <section class="proceedings-section">
        <h2>📚 历届会议报告集</h2>
        <div class="proceedings-list">
          <template v-if="graduatesList && graduatesList.length > 0">
            <template v-for="(i,index) in graduatesList">
              <div class="proceedings-item">
                <div class="year">{{i.year}}</div>
                <div class="proceedings-info">
                  <h3>{{i.title}}</h3>
                  <p class="venue">{{i.location}}</p>
                  <p class="description">
                    {{i.description}}
                  </p>
                  <div class="action-buttons">
                    <a :href="'/proceedings-list?year=' + i.year" class="action-btn view-btn">
                      <span class="icon">🔍</span>
                      在线浏览
                    </a>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="proceedings-item">
              <div class="year">
                <div class="skeleton-placeholder" style="width: 60px; height: 24px;"></div>
              </div>
              <div class="proceedings-info">
                <div class="skeleton-placeholder" style="width: 70%; height: 24px;"></div>
                <div class="skeleton-placeholder" style="width: 50%; height: 18px; margin-top: 12px;"></div>
                <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 12px;"></div>
                <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 8px;"></div>
                <div class="action-buttons" style="margin-top: 16px;">
                  <div class="skeleton-placeholder" style="width: 100px; height: 36px;"></div>
                </div>
              </div>
            </div>
            <div class="proceedings-item">
              <div class="year">
                <div class="skeleton-placeholder" style="width: 60px; height: 24px;"></div>
              </div>
              <div class="proceedings-info">
                <div class="skeleton-placeholder" style="width: 70%; height: 24px;"></div>
                <div class="skeleton-placeholder" style="width: 50%; height: 18px; margin-top: 12px;"></div>
                <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 12px;"></div>
                <div class="skeleton-placeholder" style="width: 90%; height: 16px; margin-top: 8px;"></div>
                <div class="action-buttons" style="margin-top: 16px;">
                  <div class="skeleton-placeholder" style="width: 100px; height: 36px;"></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- 投稿指南 -->
      <section class="proceedings-section">
        <h2>📝 报告集收录与投稿</h2>
        <div class="submission-info">
          <p>CJNLP 2025报告集即将出版。如果您已投稿并被接受，请注意以下事项：</p>
          <ul>
            <li>最终版论文提交截止日期：2025年9月10日</li>
            <li>报告/海报格式需遵循会议模板要求</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {getGraduatesListApi, getThesisListApi} from '../api/index'
import {ref} from "vue";

const tab = ref(0)
const keywords = ref('')
const thesisList = ref({})
const thesisListParams = {
  year:2025,
  pageNo:1,
  pageSize:4,
  submitType:0,
  search:''
}

const excellentThesisList = ref({})
const excellentThesisListParams = {
  year:2025,
  isExcellent:1,
  pageNo:1,
  pageSize:3
}

const graduatesList = ref({})

const changePage =async (page)=>{
  thesisListParams.pageNo = page
  thesisList.value = await getThesisListApi(thesisListParams)
}

const changeTab = async (curTab) =>{
  if(tab.value !== curTab){
    tab.value = curTab
    thesisListParams.submitType = curTab
    thesisListParams.pageNo = 1
    thesisList.value = await getThesisListApi(thesisListParams)
  }
}

const search = async ()=>{
  thesisListParams.search = keywords.value
    thesisListParams.pageNo = 1
    thesisList.value = await getThesisListApi(thesisListParams)
}

const initData =async ()=>{
  thesisList.value = await getThesisListApi(thesisListParams)

  excellentThesisList.value = await getThesisListApi(excellentThesisListParams)

  graduatesList.value = await getGraduatesListApi()
  // Sort graduatesList by year in descending order
  graduatesList.value.sort((a, b) => b.year - a.year)
}

const getSubmitType = (type)=>{
  switch (type){
    case 2:
      return '报告'
    case 3:
      return '海报'
    default:
      return ''
  }
}

const getTypeClass = (type) => {
  switch (type) {
    case 2: return 'type-report'
    case 3: return 'type-poster'
    default: return ''
  }
}

initData()
</script>

<style scoped>
.proceedings-container {
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
  font-size: 1.2rem;
  color: #555;
  margin: 0.5rem 0 1rem;
}

h4 {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}

.proceedings-section {
  margin-bottom: 3rem;
}

/* 论文/报告/海报列表样式 */
.category-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.tab.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.tab:hover {
  color: #1890ff;
}

.paper-search {
  display: flex;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-btn {
  padding: 0.5rem 1rem;
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

.papers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.paper-item {
  display: flex;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.authors {
  color: #666;
  margin: 0.5rem 0 0.25rem;
}

.affiliation {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
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
  gap: 0.5rem;
  flex-wrap: wrap;
}

.paper-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
  transition: background 0.3s;
}

.paper-btn:hover {
  background: rgba(24, 144, 255, 0.2);
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn.active {
  background: #1890ff;
  color: white;
}

.page-btn:hover:not(.active) {
  background: #e0e0e0;
}

/* 历届论文集样式 */
.proceedings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.proceedings-item {
  display: flex;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.proceedings-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.year {
  background: #1890ff;
  color: white;
  padding: 2rem 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.proceedings-info {
  padding: 1.5rem;
  flex: 1;
}

.venue {
  color: #666;
  font-style: italic;
  margin: 0.25rem 0 0.75rem;
}

.description {
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.download-btn {
  background: #1890ff;
  color: white;
}

.download-btn:hover {
  background: #40a9ff;
}

.view-btn {
  background: #f0f0f0;
  color: #333;
}

.view-btn:hover {
  background: #e0e0e0;
}

/* 优秀论文样式 */
.best-papers {
  margin-top: 1.5rem;
}

.best-paper-item {
  margin-bottom: 2rem;
}

.paper-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.paper-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1.5rem;
  border-left: 4px solid #1890ff;
  transition: transform 0.3s ease;
}

.paper-card:hover {
  transform: translateY(-3px);
}

.paper-link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
}

.paper-link:hover {
  text-decoration: underline;
}

/* 投稿指南样式 */
.submission-info {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.submission-info p {
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.submission-info ul {
  color: #555;
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.submission-info li {
  margin-bottom: 0.5rem;
  position: relative;
}

@media (max-width: 768px) {
  .proceedings-container {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .category-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    white-space: nowrap;
  }

  .paper-search {
    flex-direction: column;
  }

  .proceedings-item,
  .paper-item {
    flex-direction: column;
  }

  .paper-type {
    writing-mode: horizontal-tb;
    width: 100%;
    min-width: auto;
    padding: 0.5rem;
  }

  .year {
    padding: 1rem;
    width: 100%;
    min-width: auto;
  }

  .paper-list {
    grid-template-columns: 1fr;
  }

  .paper-actions,
  .action-buttons {
    flex-direction: column;
  }

  .paper-btn,
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .proceedings-container {
    padding: 0.8rem;
  }

  .content-wrapper {
    padding: 0.8rem;
  }

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
  }

  h2 {
    font-size: 1.2rem;
    margin: 1.2rem 0 0.8rem;
  }

  h3 {
    font-size: 1rem;
    margin: 1rem 0 0.6rem;
  }

  h4 {
    font-size: 0.95rem;
    margin: 0.6rem 0 0.4rem;
  }

  .proceedings-section {
    margin-bottom: 2rem;
  }

  .category-tabs {
    margin: 1rem 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .paper-search {
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .search-input {
    flex: 1;
    box-sizing: border-box;
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .search-btn {
    width: auto;
    min-width: 80px;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
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

  .authors, .affiliation, .keywords {
    font-size: 0.9rem;
  }

  .paper-actions {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .paper-btn {
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    padding: 0.5rem;
  }

  .proceedings-item {
    flex-direction: column;
  }

  .year {
    width: 100%;
    min-width: auto;
    padding: 0.8rem;
    font-size: 1.2rem;
  }

  .proceedings-info {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .proceedings-info h3 {
    font-size: 1.1rem;
  }

  .venue, .description {
    font-size: 0.9rem;
  }

  .action-buttons {
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

  .paper-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .paper-card {
    padding: 1rem;
  }

  .paper-card h4 {
    font-size: 1rem;
  }

  .paper-card .authors, 
  .paper-card .affiliation {
    font-size: 0.9rem;
  }

  .submission-info {
    padding: 1rem;
  }

  .submission-info p,
  .submission-info li {
    font-size: 0.9rem;
  }
}

.skeleton-placeholder {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 70%;
}
</style>
