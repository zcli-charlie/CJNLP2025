<template>
  <div class="submission-container">
    <div class="content-wrapper">
      <h1>論文投稿</h1>

      <!-- Call for Papers -->
      <section class="cfp-section">
        <h2>📢 論文募集</h2>
        <div class="cfp-content">
          <div class="topics">
            <h3>📚 募集テーマ</h3>
            <p>本会議では以下の分野の発表/ポスターを受け付けています：</p>
            <ul>
              <li class="highlight-topic">大規模言語モデル - LLMの最先端技術と応用の探求</li>
              <li class="highlight-topic">エージェント技術 - マルチエージェント協調と革新的応用</li>
              <li>自然言語理解 - テキスト理解と意味分析技術</li>
              <li>機械翻訳 - 多言語翻訳と言語横断研究</li>
              <li>対話システム - 知的対話と人間-コンピュータ相互作用</li>
              <li>情報抽出 - 非構造化テキストからの構造化情報の取得</li>
              <li>マルチモーダル処理 - クロスモーダル理解と生成</li>
              <li>知識グラフ - 知識表現、推論、および応用</li>
              <li>言語リソース - アジア言語資源の構築と活用</li>
            </ul>
          </div>

          <div class="requirements">
            <h3>📋 投稿要件</h3>
            <p class="general-requirement">発表/ポスターは既に発表済みのものも可能です</p>
           

            <div class="requirement-item">
              <h4>発表の要件</h4>
              <ul>
                <li>標準PPTテンプレートを使用すること</li>
                <li>発表時間は15〜20分</li>
              </ul>
              <a href="/uploads/templates/presentation_template.pptx" class="template-btn" download>
                <span class="icon">📥</span>
                PPTテンプレートをダウンロード
              </a>
            </div>

            <div class="requirement-item">
              <h4>ポスターの要件</h4>
              <ul>
                <li>A0縦向き</li>
                <li>解像度：300 DPI</li>
              </ul>
              <a href="/uploads/templates/presentation_template.pptx" class="template-btn" download>
                <span class="icon">📥</span>
                ポスターテンプレートのダウンロード
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 著者ガイドライン -->
      <section class="author-guidelines">
        <h2>📝 著者ガイドライン</h2>
        <div class="guidelines-content">
          <div class="guideline-item">
            <h3>📅 重要な日程</h3>
            <ul class="date-list">
              <li><span class="date-label">投稿締切日:</span> <span class="date-value">{{ config?.submission_time || '2025年4月15日' }}</span></li>
              <li><span class="date-label">採択通知日:</span> <span class="date-value">{{ config?.notification_time || '2025年9月1日' }}</span></li>
              <li><span class="date-label">会議期間:</span> <span class="date-value">{{ config?.conference_time || '2025年9月13-14日' }}</span></li>
            </ul>
          </div>

          <!-- <div class="guideline-item">
            <h3>✍️ 執筆ガイドライン</h3>
            <p>あなたの発表/ポスターが審査を通過するために、以下の点に注意してください：</p>
            <ul>
              <li>提供されたテンプレート形式を厳守すること</li>
              <li>内容が明確で論理的一貫性があること</li>
              <li>図表は高品質で、適切な説明を含むこと</li>
              <li>参考文献の形式は標準的で、引用が正確であること</li>
              <li>文法や綴りのミスを避けるために原稿を校正すること</li>
            </ul>
          </div>

          <div class="guideline-item">
            <h3>🔍 審査プロセス</h3>
            <p>すべての投稿は以下の審査プロセスを経ます：</p>
            <ol>
              <li>初期審査：形式の適合性と内容の関連性の確認</li>
              <li>ピアレビュー：少なくとも2名の分野専門家による匿名審査</li>
              <li>最終決定：審査コメントに基づく採択の最終決定</li>
            </ol>
            <p>審査基準には、革新性、技術的深さ、実験の完全性、表現の明確さなどが含まれます</p>
          </div> -->

          <div class="guideline-item">
            <h3>🎖️ 優秀発表者選出</h3>
            <p>会議では、優秀発表者が数名選出され、受賞者は：</p>
            <ul>
              <li>優秀発表者証明書を授与されます</li>
              <li>会議ウェブサイトでの掲載</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 投稿フォーム -->
      <section class="submission-form">
        <h2>📤 論文投稿</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">発表/ポスタータイトル</label>
            <input type="text" id="title" v-model="form.title" required>
          </div>

          <div class="form-group">
            <label for="submitType">投稿タイプ</label>
            <select id="submitType" v-model="form.submitType" required>
              <option value="">投稿タイプを選択してください</option>
              <option :value="2">発表</option>
              <option :value="3">ポスター</option>
            </select>
          </div>

          <div class="form-group">
            <label for="authors">著者情報</label>
            <textarea id="authors" v-model="form.authors" rows="3" required
              placeholder="すべての著者の氏名、所属、メールアドレスを順番に記載してください。著者ごとに1行で記入"></textarea>
          </div>

          <div class="form-group">
            <label for="abstract">要旨</label>
            <textarea id="abstract" v-model="form.abstract" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label for="keywords">キーワード</label>
            <input type="text" id="keywords" v-model="form.keywords" required
              placeholder="キーワードをコンマで区切ってください">
          </div>

          <div class="form-group">
            <label for="email">メールアドレス</label>
            <input type="text" id="email" v-model="form.email" required
              placeholder="メールアドレスを入力してください">
          </div>

          <div class="form-group">
            <label for="fileUrl">ファイルのアップロード</label>
            <div class="file-upload">
              <input type="file" id="file" @change="handleFileChange" required accept=".pdf,.zip,.pptx">
              <p class="file-hint">PDF形式をサポートし、ファイルサイズは10MB以下にしてください</p>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">投稿</button>
          </div>
        </form>
      </section>
    </div>
  </div>
  <SliderCaptcha ref="captchaRef" lang="ja"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {postUploadApi,postAddThesisApi,getConfigApi} from '../api/index'
import {ElMessage} from "element-plus";
import SliderCaptcha from '../components/SliderCaptcha.vue'
import { getRequest } from '../utils/request'


const captchaRef = ref(null)

const form = ref({
  email: '',
  year: '2025',
  title: '',
  submitType: '',
  authors: '',
  abstract: '',
  keywords: '',
  fileUrl:''
})

const loading = ref(false)
const config = ref(null)

const fetchConfig = async () => {
  try {
    const configData = await getConfigApi()
    if (configData) {
      config.value = configData
      // 設定データをlocalStorageに保存
      localStorage.setItem('siteConfig', JSON.stringify(configData))
    }
    return configData
  } catch (error) {
    console.error('Failed to fetch config data:', error)
    return null
  }
}

onMounted(async () => {
  // localStorageから設定データを取得
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
  // if (!res) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }
  postUploadApi(params).then(res=>{
    loading.value = false
    form.value.fileUrl = res
    ElMessage.success({ message: 'アップロード成功' })
  }).catch(err=>{
    loading.value = false
  })
}

const handleSubmit = () => {
  // TODO: 实现文件上传和表单提交逻辑
  if(!form.value.fileUrl){
    ElMessage.error({ message: '論文ファイルをアップロードしてください' })
    return
  }
  postAddThesisApi(form.value).then(res=>{
    ElMessage.success({ message: "保存成功" })
    form.value = {
      email: form.value.email,
      year: '2025',
      title: '',
      submitType: '',
      authors: '',
      abstract: '',
      keywords: '',
      fileUrl:''
    }
    const input = document.getElementById('file')
    input.value = ''
  }).catch(err=>{
    ElMessage.error({ message: "保存に失敗しました" })
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
