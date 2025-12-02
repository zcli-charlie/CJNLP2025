<template>
  <div class="submission-container">
    <div class="content-wrapper">
      <h1>Paper Submission</h1>

      <!-- Call for Papers -->
      <section class="cfp-section">
        <h2>📢 Call for Papers</h2>
        <div class="cfp-content">
          <div class="topics">
            <h3>📚 Topics</h3>
            <p>This conference accepts presentations/posters in the following areas:</p>
            <ul>
              <li class="highlight-topic">Large Language Models - Exploring frontier LLM technologies and applications</li>
              <li class="highlight-topic">Agent Technology - Multi-agent collaboration and innovative applications</li>
              <li>Natural Language Understanding - Text comprehension and semantic analysis</li>
              <li>Machine Translation - Multilingual translation and cross-language research</li>
              <li>Dialogue Systems - Intelligent dialogue and human-computer interaction</li>
              <li>Information Extraction - Obtaining structured information from unstructured text</li>
              <li>Multimodal Processing - Cross-modal understanding and generation</li>
              <li>Knowledge Graphs - Knowledge representation, reasoning, and applications</li>
              <li>Language Resources - Construction and utilization of Asian language resources</li>
            </ul>
          </div>

          <div class="requirements">
            <h3>📋 Submission Requirements</h3>
            <p class="general-requirement">Presentations/posters may be previously published</p>
           

            <div class="requirement-item">
              <h4>Presentation Requirements</h4>
              <ul>
                <li>Must use the standard PPT template</li>
                <li>Presentation duration: 15-20 minutes</li>
              </ul>
              <a href="/uploads/templates/presentation_template.pptx" class="template-btn" download>
                <span class="icon">📥</span>
                Download PPT Template
              </a>
            </div>

            <div class="requirement-item">
              <h4>Poster Requirements</h4>
              <ul>
                <li>A0 vertical</li>
                <li>Resolution: 300 DPI</li>
              </ul>
              <a href="/uploads/templates/presentation_template.pptx" class="template-btn" download>
                <span class="icon">📥</span>
                Download Poster Template
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Author Guidelines -->
      <section class="author-guidelines">
        <h2>📝 Author Guidelines</h2>
        <div class="guidelines-content">
          <div class="guideline-item">
            <h3>📅 Important Dates</h3>
            <ul class="date-list">
              <li><span class="date-label">Submission Deadline:</span> <span class="date-value">{{ convertDate(config?.submission_time) || 'April 15, 2025' }}</span></li>
              <li><span class="date-label">Notification of Acceptance:</span> <span class="date-value">{{ convertDate(config?.notification_time) || 'September 1, 2025' }}</span></li>
              <li><span class="date-label">Conference Dates:</span> <span class="date-value">{{ convertDate(config?.conference_time) || 'September 13-14, 2025' }}</span></li>
            </ul>
          </div>

          <!-- <div class="guideline-item">
            <h3>✍️ Writing Guidelines</h3>
            <p>To ensure your presentation/poster passes the review process, please note the following:</p>
            <ul>
              <li>Strictly follow the provided template format</li>
              <li>Ensure content is clear and logically coherent</li>
              <li>Figures and tables must be high quality with appropriate captions</li>
              <li>References should be formatted correctly with accurate citations</li>
              <li>Proofread your paper to avoid grammatical and spelling errors</li>
            </ul>
          </div>

          <div class="guideline-item">
            <h3>🔍 Review Process</h3>
            <p>All submissions will go through the following review process:</p>
            <ol>
              <li>Initial review: Check for format compliance and content relevance</li>
              <li>Peer review: Anonymous review by at least two experts in the field</li>
              <li>Final decision: Based on reviewer comments and recommendations</li>
            </ol>
            <p>Review criteria include: innovation, technical depth, experimental thoroughness, clarity of expression, etc.</p>
          </div> -->

          <div class="guideline-item">
            <h3>🎖️ Selection of Outstanding Speakers</h3>
            <p>The conference will select several Outstanding Speakers. Award-winning speakers will:</p>
            <ul>
              <li>Receive an Outstanding Speaker certificate</li>
              <li>Be featured on the conference website</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Submission Form -->
      <section class="submission-form">
        <h2>📤 Paper Submission</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Presentation/Poster Title</label>
            <input type="text" id="title" v-model="form.title" required>
          </div>

          <div class="form-group">
            <label for="submitType">Submission Type</label>
            <select id="submitType" v-model="form.submitType" required>
              <option value="">Please select submission type</option>
              <option :value="2">Presentation</option>
              <option :value="3">Poster</option>
            </select>
          </div>

          <div class="form-group">
            <label for="authors">Author Information</label>
            <textarea id="authors" v-model="form.authors" rows="3" required
              placeholder="Please list all authors' names, affiliations, and emails in order, one author per line"></textarea>
          </div>

          <div class="form-group">
            <label for="abstract">Abstract</label>
            <textarea id="abstract" v-model="form.abstract" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label for="keywords">Keywords</label>
            <input type="text" id="keywords" v-model="form.keywords" required
              placeholder="Please separate keywords with commas">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" id="email" v-model="form.email" required
              placeholder="Please enter your email">
          </div>

          <div class="form-group">
            <label for="fileUrl">Upload File</label>
            <div class="file-upload">
              <input type="file" id="file" @change="handleFileChange" required accept=".pdf,.zip,.pptx">
              <p class="file-hint">Supports PDF format, file size should not exceed 10MB</p>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Submit</button>
          </div>
        </form>
      </section>
    </div>
  </div>
  <SliderCaptcha ref="captchaRef" lang="en"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {postUploadApi,postAddThesisApi,getConfigApi} from '../api/index'
import {ElMessage} from "element-plus";
import SliderCaptcha from '../components/SliderCaptcha.vue'
import { getRequest } from '../utils/request'


const captchaRef = ref(null)

const form = ref({
  year: '2025',
  title: '',
  submitType: '',
  authors: '',
  abstract: '',
  keywords: '',
  fileUrl:'',
  email:''
})

const loading = ref(false)
const config = ref(null)

// 月份映射表
const monthMap = {
  '1': 'January', '2': 'February', '3': 'March', '4': 'April',
  '5': 'May', '6': 'June', '7': 'July', '8': 'August',
  '9': 'September', '10': 'October', '11': 'November', '12': 'December'
}

// 转换日期格式
const convertDate = (dateStr) => {
  if (!dateStr) return ''
  
  try {
    // 处理日期范围（如：2025年9月13-14日）
    if (dateStr.includes('-')) {
      const [start, end] = dateStr.split('-')
      const yearMatch = start.match(/(\d{4})年/)
      const monthMatch = start.match(/(\d{1,2})月/)
      const startDayMatch = start.match(/(\d{1,2})日/)
      const endDayMatch = end.match(/(\d{1,2})日/)
      
      if (!yearMatch || !monthMatch || !startDayMatch || !endDayMatch) {
        return ''
      }
      
      const year = yearMatch[1]
      const month = monthMatch[1]
      const startDay = startDayMatch[1]
      const endDay = endDayMatch[1]
      
      return `${monthMap[month]} ${startDay}-${endDay}, ${year}`
    }
    
    // 处理单个日期（如：2025年4月15日）
    const yearMatch = dateStr.match(/(\d{4})年/)
    const monthMatch = dateStr.match(/(\d{1,2})月/)
    const dayMatch = dateStr.match(/(\d{1,2})日/)
    
    if (!yearMatch || !monthMatch || !dayMatch) {
      return ''
    }
    
    const year = yearMatch[1]
    const month = monthMatch[1]
    const day = dayMatch[1]
    
    return `${monthMap[month]} ${day}, ${year}`
  } catch (error) {
    console.error('Date conversion error:', error)
    return ''
  }
}

const fetchConfig = async () => {
  try {
    const configData = await getConfigApi()
    if (configData) {
      config.value = configData
      // Store config data in localStorage
      localStorage.setItem('siteConfig', JSON.stringify(configData))
    }
    return configData
  } catch (error) {
    console.error('Failed to fetch config data:', error)
    return null
  }
}

onMounted(async () => {
  // Get config data from localStorage
  const configData = localStorage.getItem('siteConfig')
  if (configData) {
    try {
      config.value = JSON.parse(configData)
    } catch (error) {
      console.error('Failed to parse config data:', error)
      await fetchConfig()
    }
  } else {
    await fetchConfig()
  }
})

const handleFileChange =async (event) => {
  const params = new FormData()
  params.append('file', event.target.files[0])
  params.append('type', '1')
  loading.value = true
  // 先检查邮箱是否存在
  // let res = await getRequest("/registration/check_email", {
  //   email: form.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }
  postUploadApi(params).then(res=>{
    loading.value = false
    form.value.fileUrl = res
    ElMessage.success({ message: 'Upload successful' })
  }).catch(err=>{
    loading.value = false
  })
}

const handleSubmit = () => {
  // TODO: 实现文件上传和表单提交逻辑
  if(!form.value.fileUrl){
    ElMessage.error({ message: 'Please upload the thesis file' })
    return
  }
  postAddThesisApi(form.value).then(res=>{
    ElMessage.success({ message: "Save successful" })
    form.value = {
      year: '2025',
      title: '',
      submitType: '',
      authors: '',
      abstract: '',
      keywords: '',
      fileUrl:'',
      email:form.value.email
    }
    const input = document.getElementById('file')
    input.value = ''
  }).catch(err=>{
    ElMessage.error({ message: "Save failed" })
  })
}
</script>

<style scoped>
.submission-container {
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
  margin: 1.5rem 0 1rem;
}

h4 {
  font-size: 1.1rem;
  color: #666;
  margin: 1rem 0 0.5rem;
}

.cfp-section {
  margin-bottom: 3rem;
}

.cfp-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.topics ul {
  list-style-type: none;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.topics li {
  position: relative;
  margin: 0.7rem 0;
  color: #666;
  padding-left: 0.5rem;
}

.topics li::before {
  content: "•";
  position: absolute;
  left: -1rem;
  color: #1890ff;
}

.topics .highlight-topic {
  padding-left: 0.8rem;
  color: #2ecc71;
  font-weight: 500;
}

.topics .highlight-topic::before {
  color: #2ecc71;
}

.requirements {
  margin-top: 2rem;
}

.general-requirement {
  margin: 0.5rem 0 1.5rem;
  color: #666;
  font-weight: 500;
  padding-left: 0.5rem;
  border-left: 3px solid #1890ff;
}

.requirement-item {
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
}

.requirement-item ul {
  list-style-type: none;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.requirement-item li {
  position: relative;
  margin: 0.5rem 0;
  color: #666;
}

.requirement-item li::before {
  content: "•";
  position: absolute;
  left: -1rem;
  color: #1890ff;
}

.template-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: background 0.3s;
}

.template-btn:hover {
  background: #40a9ff;
}

.submission-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.file-upload {
  border: 2px dashed #ddd;
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
  background: #fafafa;
}

.file-hint {
  margin: 0.5rem 0 0;
  color: #999;
  font-size: 0.9rem;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.submit-btn {
  padding: 0.8rem 2rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #40a9ff;
}

@media (max-width: 768px) {
  .submission-container {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem;
  }

  h3 {
    font-size: 1.1rem;
    margin: 1.2rem 0 0.8rem;
  }

  h4 {
    font-size: 1rem;
    margin: 0.8rem 0 0.4rem;
  }

  .cfp-section {
    margin-bottom: 2rem;
  }

  .cfp-content {
    padding: 1rem;
  }

  .topics ul {
    padding-left: 1.2rem;
    margin: 0.8rem 0;
  }

  .topics li {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  .requirements {
    margin-top: 1.5rem;
  }

  .general-requirement {
    margin: 0.4rem 0 1.2rem;
    font-size: 0.95rem;
  }

  .requirement-item {
    margin: 1.2rem 0;
    padding: 0.8rem;
  }

  .requirement-item ul {
    padding-left: 1.2rem;
    margin: 0.4rem 0;
  }

  .requirement-item li {
    margin: 0.4rem 0;
    font-size: 0.95rem;
  }

  .template-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
  }

  .form-group {
    margin-bottom: 1.2rem;
  }

  label {
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }

  input[type="text"],
  select,
  textarea {
    padding: 0.4rem;
    font-size: 0.95rem;
  }

  .file-upload {
    padding: 1.2rem;
  }

  .file-hint {
    font-size: 0.85rem;
  }

  .submit-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .submission-container {
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

  .cfp-content {
    padding: 0.8rem;
  }

  .topics li {
    font-size: 0.9rem;
  }

  .requirement-item {
    padding: 0.6rem;
  }

  .requirement-item li {
    font-size: 0.9rem;
  }

  .template-btn {
    width: 100%;
    justify-content: center;
    padding: 0.5rem;
    box-sizing: border-box;
    margin: 0.5rem 0;
  }

  .form-group {
    margin-bottom: 1rem;
    width: 100%;
  }

  label {
    font-size: 0.9rem;
  }

  input[type="text"],
  select,
  textarea {
    width: 100%;
    box-sizing: border-box;
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .file-upload {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .file-upload input[type="file"] {
    width: 100%;
    box-sizing: border-box;
  }

  .file-hint {
    font-size: 0.8rem;
  }

  .submit-btn {
    width: 100%;
    padding: 0.5rem;
  }
}

.guidelines-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.guideline-item {
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
}

.guideline-item:first-child {
  margin-top: 0;
}

.date-list {
  list-style-type: none;
  padding-left: 0;
}

.date-list li {
  margin: 0.8rem 0;
  display: flex;
  flex-wrap: wrap;
}

.date-label {
  font-weight: 500;
  min-width: 120px;
  color: #555;
}

.date-value {
  color: #f06292;
  font-weight: 500;
}

.guideline-item p {
  margin: 0.5rem 0;
  color: #666;
}

.guideline-item ul, .guideline-item ol {
  padding-left: 1.5rem;
  margin: 0.8rem 0;
}

.guideline-item li {
  margin: 0.5rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .guidelines-content {
    padding: 1rem;
  }

  .guideline-item {
    padding: 0.8rem;
  }

  .date-list li {
    flex-direction: column;
  }

  .date-label {
    margin-bottom: 0.2rem;
  }
}
</style>
