<template>
  <div class="submission-container">
    <div class="content-wrapper">
      <h1>报告提交</h1>

      <!-- Call for Papers -->
      <section class="cfp-section">
        <h2>📢 报告征集</h2>
        <div class="cfp-content">
          <div class="topics">
            <h3>📚 征稿主题</h3>
            <p>本次会议接受以下方向的报告/海报：</p>
            <ul>
              <li class="highlight-topic">大型语言模型 - 探索LLM前沿技术与应用</li>
              <li class="highlight-topic">智能体技术 - 多智能体协作与应用创新</li>
              <li>自然语言理解 - 文本理解与语义分析技术</li>
              <li>机器翻译 - 多语言翻译与跨语言研究</li>
              <li>对话系统 - 智能对话与人机交互</li>
              <li>信息抽取 - 从非结构化文本中获取结构化信息</li>
              <li>多模态处理 - 跨模态理解与生成</li>
              <li>知识图谱 - 知识表示、推理与应用</li>
              <li>语言资源 - 亚洲语言资源构建与利用</li>
            </ul>
          </div>

          <div class="requirements">
            <h3>📋 提交要求</h3>
            <p class="general-requirement">报告/海报可以已经发表</p>
            

            <div class="requirement-item">
              <h4>报告要求</h4>
              <ul>
                <li>需使用标准PPT模板</li>
                <li>报告时长15-20分钟</li>
              </ul>
              <a href="/uploads/templates/presentation_template.pptx" class="template-btn" download>
                <span class="icon">📥</span>
                下载PPT模板
              </a>
            </div>

            <div class="requirement-item">
              <h4>海报要求</h4>
              <ul>
                <li>A0纵向</li>
                <li>分辨率：300 DPI</li>
              </ul>
              <a href="/uploads/templates/presentation_template.pptx" class="template-btn" download>
                <span class="icon">📥</span>
                下载海报模板
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 作者指南 -->
      <section class="author-guidelines">
        <h2>📝 作者指南</h2>
        <div class="guidelines-content">
          <div class="guideline-item">
            <h3>📅 重要日期</h3>
            <ul class="date-list">
              <li><span class="date-label">投稿截止日期:</span> <span class="date-value">{{ config?.submission_time || '2025年4月15日' }}</span></li>
              <li><span class="date-label">录取通知日期:</span> <span class="date-value">{{ config?.notification_time || '2025年9月1日' }}</span></li>
              <li><span class="date-label">会议日期:</span> <span class="date-value">{{ config?.conference_time || '2025年9月13-14日' }}</span></li>
            </ul>
          </div>

          <!-- <div class="guideline-item">
            <h3>✍️ 撰写指南</h3>
            <p>为确保您的报告/海报顺利通过评审，请注意以下几点：</p>
            <ul>
              <li>严格遵循提供的模板格式</li>
              <li>确保内容清晰、逻辑连贯</li>
              <li>图表须高质量，且包含适当说明</li>
              <li>参考文献格式规范，引用准确</li>
              <li>校对文章，避免语法和拼写错误</li>
            </ul>
          </div>

          <div class="guideline-item">
            <h3>🔍 评审流程</h3>
            <p>所有提交将经过以下评审流程：</p>
            <ol>
              <li>初审：检查格式规范性和内容相关性</li>
              <li>同行评审：由至少两位领域专家进行匿名评审</li>
              <li>终审：根据评审意见作出最终录取决定</li>
            </ol>
            <p>评审标准包括：创新性、技术深度、实验充分性、表达清晰度等</p>
          </div> -->

          <div class="guideline-item">
            <h3>🎖️ 优秀讲者评选</h3>
            <p>会议将评选优秀讲者若干人，获奖讲者将：</p>
            <ul>
              <li>获得优秀讲者证书</li>
              <li>在会议官网进行展示</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 提交表单 -->
      <section class="submission-form" v-loading="loading">
        <h2>📤 报告提交</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">报告/海报标题</label>
            <input type="text" id="title" v-model="form.title" required>
          </div>

          <div class="form-group">
            <label for="submitType">提交类型</label>
            <select id="submitType" v-model="form.submitType" required>
              <option value="">请选择提交类型</option>
              <option :value="2">报告</option>
              <option :value="3">海报</option>
            </select>
          </div>

          <div class="form-group">
            <label for="authors">作者信息</label>
            <textarea id="authors" v-model="form.authors" rows="3" required
              placeholder="请按顺序列出所有作者姓名、单位和邮箱，每行一个作者"></textarea>
          </div>

          <div class="form-group">
            <label for="abstract">摘要</label>
            <textarea id="abstract" v-model="form.abstract" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label for="keywords">关键词</label>
            <input type="text" id="keywords" v-model="form.keywords" required
              placeholder="请用逗号分隔关键词">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" id="email" v-model="form.email" required
              placeholder="Please enter your email">
          </div>

          <div class="form-group">
            <label for="fileUrl">上传文件</label>
            <div class="file-upload">
              <input  type="file" id="file" @change="handleFileChange" required
                     accept=".pdf">
              <p class="file-hint">支持PDF格式，文件大小不超过10MB</p>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">提交</button>
          </div>
        </form>
      </section>
    </div>
  </div>
  <SliderCaptcha ref="captchaRef"/>
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

const fetchConfig = async () => {
  try {
    const configData = await getConfigApi()
    if (configData) {
      config.value = configData
      // 将配置数据存储在localStorage中
      localStorage.setItem('siteConfig', JSON.stringify(configData))
    }
    return configData
  } catch (error) {
    console.error('Failed to fetch config data:', error)
    return null
  }
}

onMounted(async () => {
  // 从localStorage中获取配置数据
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
  // const res = await getRequest("/registration/check_email", {
  //   email: form.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }
  postUploadApi(params).then(res=>{
    loading.value = false
    form.value.fileUrl = res
    ElMessage.success({ message: '上传成功' })
  }).catch(err=>{
    loading.value = false
  })
}

const handleSubmit = () => {
  // TODO: 实现文件上传和表单提交逻辑
  if(!form.value.fileUrl){
    ElMessage.error({ message: '请上传报告文件' })
    return
  }
  postAddThesisApi(form.value).then(res=>{
    ElMessage.success({ message: "保存成功" })
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
    ElMessage.error({ message: "保存失败" })
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
