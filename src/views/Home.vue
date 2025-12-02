<template>
  <div class="home">
    <el-loading 
      v-model:fullscreen="loading"
      text="加载中..."
      background="rgba(255, 255, 255, 0.7)"
    />
    <section class="hero-section" ref="heroSection">
      <div class="hero-content" :style="{ transform: `translateY(${scrollY * 0.5}px)` }">
        <h1>{{ currentConference?.title || '第二十二届中日自然语言处理联合推进会议' }}</h1>
        <h2>{{ currentConference?.title_en || 'The 22th China-Japan Natural Language Processing Joint Promotion Conference，CJNLP2025' }}</h2>
        <p class="hero-subtitle">{{currentConference?.location || '中国·宜昌'}}</p>
        <div class="hero-details">
          <a :href="`https://maps.google.com/?q=${config?.location_q || '三峡机场+宜昌+湖北'}`" target="_blank" class="hero-venue">
            <span class="venue-icon">📍</span>
            {{ config?.location || '机场桃花岭饭店' }}（点击查看地图）
          </a>
          <p class="hero-date">
            <span class="date-icon">📅</span>
            {{ config?.conference_time || '2025年9月13-15日' }}
          </p>
        </div>
        <p class="hero-subtitle">{{ config?.description || '连接中日智慧，探索智能前沿' }}</p>
      </div>
    </section>

    <section class="intro-section" ref="introSection">
      <div class="container" :style="{ opacity: introOpacity, transform: `translateY(${introTranslate}px)` }">
        <h2 class="section-title">关于会议</h2>
        <p class="section-text" style="margin-bottom: 1.5rem">
          第二十二届中日自然语言处理联合推进会议（CJNLP2025）由中国中文信息学会主办，武汉大学承办。会议旨在为中日双方搭建自然语言处理领域的高水平交流平台，推动中日双边乃至亚洲地区在自然语言处理研究和技术应用方面的深入合作。
        </p>
        <p class="section-text" style="margin-bottom: 1.5rem">
          中日自然语言处理联合推进会议（简称CJNLP）始于2001年，每年举办一次。该系列会议在奇数年于日本各地举行，偶数年则在中国各地举办。第一届会议由日本国家信息与通信研究院发起，随后第二届至第十九届会议先后在北京、哈尔滨、苏州、成都、桂林、西双版纳等中国城市，以及日本冲绳、松江市、青森市、北九州市等地区成功举办。
        </p>
        <p class="section-text" style="margin-bottom: 1.5rem">
          CJNLP2025将于2025年9月13日至15日在湖北省宜昌市机场桃花岭饭店召开。本次会议的主题为"<span class="highlight-text">大模型</span>与<span class="highlight-text">智能体</span>驱动的自然语言处理变革"，聚焦探讨<span class="highlight-text">大模型</span>与<span class="highlight-text">智能体</span>技术如何推动自然语言处理领域的深刻变革与创新。会议将致力于促进学术研究与实际应用的紧密结合，进一步深化中日双方在相关领域的技术交流与合作，共同推动自然语言处理技术的未来发展。
        </p>
      </div>
    </section>

    <section class="topics-section" ref="topicsSection">
      <div class="container">
        <h2 class="section-title" :style="{ opacity: topicsOpacity, transform: `translateY(${topicsTranslate}px)` }">会议主题</h2>
        
        <div class="topics-container" :style="{ opacity: topicsOpacity }">
          <div 
            v-for="(topic, index) in topics" 
            :key="index"
            class="topic-item"
            :class="{ 'highlight-topic': topic.highlight }"
          >
            <div class="topic-icon">{{ topic.icon }}</div>
            <div class="topic-content">
              <h3 class="topic-title">{{ topic.name }}</h3>
              <p class="topic-desc">{{ topic.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="dates-section" ref="datesSection">
      <div class="container">
        <h2 class="section-title" :style="{ opacity: datesOpacity, transform: `translateY(${datesTranslate}px)` }">重要日期</h2>
        
        <div class="dates-timeline" :style="{ opacity: datesOpacity }">
          <div 
            v-for="(date, index) in dates" 
            :key="date.date"
            class="date-step"
          >
            <div class="date-card">
              <div class="date-icon">{{ date.icon }}</div>
              <h3>{{ date.title }}</h3>
              <p class="date-value">{{ date.date }}</p>
            </div>
            <div class="date-arrow" v-if="index < dates.length - 1">
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="yichang-section" ref="yichangSection">
      <div class="container">
        <h2 class="section-title" :style="{ opacity: yichangOpacity, transform: `translateY(${yichangTranslate}px)` }">发现宜昌</h2>
        
        <div class="yichang-grid" :style="{ opacity: yichangOpacity }">
          <div 
            v-for="spot in yichangSpots" 
            :key="spot.name"
            class="yichang-card"
          >
            <div class="yichang-image" :style="{ backgroundImage: `url(${spot.image})` }"></div>
            <div class="yichang-content">
              <h3>{{ spot.name }}</h3>
              <p>{{ spot.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="organizers-section">
      <div class="container">
        <div 
          v-for="org in organizers" 
          :key="org.title"
          class="organizers-row"
        >
          <h3>{{ org.title }}</h3>
          <div class="logo-container">
            <img :src="org.logo" :alt="org.alt" class="organizer-logo" />
            <p class="organizer-name">{{ org.name }}</p>
          </div>
        </div>
      </div>
    </section>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { ElLoading } from 'element-plus'

// 静态配置数据（从 http://10.17.0.10:8211/endpoint/config 获取）
const configData = {
  "preparation_time": "2025年1月1日",
  "submission_time": "2025年4月15日",
  "notification_time": "2025年9月1日",
  "conference_time": "2025年9月13-15日",
  "location": "机场桃花岭饭店",
  "location_en": "Airport Taohualing Hotel",
  "location_jp": "空港桃花嶺ホテル",
  "description": "连接中日智慧，探索智能前沿",
  "description_en": "Connecting Chinese-Japanese Wisdom, Exploring the Frontiers of Intelligence",
  "description_jp": "日中の知恵を繋ぎ、インテリジェンスの最前線を探る",
  "location_q": "三峡机场+宜昌+湖北",
  "location_q_en": "Three+Gorges+Airport+Yichang+Hubei",
  "location_q_jp": "三峡機場+宜昌+湖北",
  "theme": "[{\"name\":\"大型语言模型\",\"icon\":\"🧠\",\"description\":\"探索LLM前沿技术与应用\",\"highlight\":true},{\"name\":\"智能体技术\",\"icon\":\"🤖\",\"description\":\"多智能体协作与应用创新\",\"highlight\":true},{\"name\":\"自然语言理解\",\"icon\":\"🔍\",\"description\":\"文本理解与语义分析技术\"},{\"name\":\"机器翻译\",\"icon\":\"🌐\",\"description\":\"多语言翻译与跨语言研究\"},{\"name\":\"对话系统\",\"icon\":\"💬\",\"description\":\"智能对话与人机交互\"},{\"name\":\"信息抽取\",\"icon\":\"📊\",\"description\":\"从非结构化文本中获取结构化信息\"},{\"name\":\"多模态处理\",\"icon\":\"📷\",\"description\":\"跨模态理解与生成\"},{\"name\":\"知识图谱\",\"icon\":\"🔄\",\"description\":\"知识表示、推理与应用\"},{\"name\":\"语言资源\",\"icon\":\"📚\",\"description\":\"亚洲语言资源构建与利用\"}]",
  "promotion": "[{\"name\":\"三峡大坝\",\"image\":\"/cjnlp2025/images/yichang/three-gorges-dam-project.jpg\",\"description\":\"长江三峡是世界级的自然景观，以其壮丽的峡谷风光、深厚的历史文化遗迹和世界最大的水利枢纽工程而闻名。险峻的峡谷与雄伟的景观令游客叹为观止。\"},{\"name\":\"三峡人家\",\"image\":\"/cjnlp2025/images/yichang/sanxiarenjia.jpg\",\"description\":\"三峡人家是展现三峡民俗文化的生态旅游区，依山傍水，完整保留了巴楚文化特色的吊脚楼建筑群。这里不仅能品尝到地道的三峡特色美食，还能体验独特的峡江渔家文化，感受三峡人民的生活智慧与乡土情怀。\"},{\"name\":\"清江画廊\",\"image\":\"/cjnlp2025/images/yichang/qingjianghualan.jpg\",\"description\":\"清江画廊以其清澈的水质、陡峭的峭壁和独特的喀斯特地貌而著名。这里是自然爱好者的天堂，为游客提供了独特的自然景观体验。\"},{\"name\":\"屈原故里\",\"image\":\"/cjnlp2025/images/yichang/quyuguxiang.jpg\",\"description\":\"位于秭归县的屈原故里是中国伟大诗人屈原的出生地和纪念地。这里不仅保存了丰富的历史文物，还建有气势恢宏的纪念馆，让游客深入了解屈原的生平事迹和楚文化的深厚底蕴。每年端午节期间，这里都会举办隆重的纪念活动。\"}]",
  "org": "[{\"title\":\"主办单位\",\"logo\":\"/cjnlp2025/images/logo/cips.png\",\"name\":\"中国中文信息学会\",\"alt\":\"中国中文信息学会\"},{\"title\":\"承办单位\",\"logo\":\"/cjnlp2025/images/logo/whu.png\",\"name\":\"武汉大学\",\"alt\":\"武汉大学\"}]"
}

// 静态会议数据（从 http://10.17.0.10:8211/endpoint/graduates/by-year?year=2025 获取）
const conferenceData = {
  "id": 10,
  "year": 2025,
  "link": "",
  "title": "第二十二届中日自然语言处理联合推进会议",
  "title_en": "The 22nd China-Japan Natural Language Processing Joint Promotion Conference，CJNLP2025",
  "title_jp": "第22回日中自然言語処理共同推進会議",
  "description": "聚焦自然语言处理、大模型、智能体等前沿技术研究，探索中日双边科研合作新机遇。",
  "description_en": "Focus on cutting-edge technology research such as natural language processing, large models, and intelligent agents, and explore new opportunities for China-Japan bilateral scientific research cooperation.",
  "description_jp": "自然言語処理、大規模言語モデル、エージェントなどの最先端技術研究に焦点を当て、日中間の新たな科学研究協力の機会を模索する。",
  "location": "中国·宜昌",
  "location_en": "Yichang, China",
  "location_jp": "中国・宜昌",
  "attendees": 0,
  "chairman": "",
  "nation": 0
}

// 解析配置数据
const topics = JSON.parse(configData.theme)
const yichangSpots = JSON.parse(configData.promotion)
const organizers = JSON.parse(configData.org)

const scrollY = ref(0)
const introOpacity = ref(0)
const introTranslate = ref(50)
const topicsOpacity = ref(0)
const topicsTranslate = ref(50)
const datesOpacity = ref(0)
const datesTranslate = ref(50)
const yichangOpacity = ref(0)
const yichangTranslate = ref(50)

const heroSection = ref(null)
const introSection = ref(null)
const topicsSection = ref(null)
const datesSection = ref(null)
const yichangSection = ref(null)

const currentConference = ref(conferenceData)
const loading = ref(false)
const config = ref(configData)

const dates = ref([
  { title: '会议筹备', date: configData.preparation_time || '2025年1月1日', icon: '📝' },
  { title: '报告/海报征集', date: configData.submission_time || '2025年4月15日', icon: '📅' },
  { title: '录用通知', date: configData.notification_time || '2025年9月1日', icon: '📨' },
  { title: '会议召开', date: configData.conference_time || '2025年9月13-15日', icon: '🎪' }
])

const handleScroll = () => {
  scrollY.value = window.scrollY
  
  const heroRect = heroSection.value?.getBoundingClientRect()
  const introRect = introSection.value?.getBoundingClientRect()
  const topicsRect = topicsSection.value?.getBoundingClientRect()
  const datesRect = datesSection.value?.getBoundingClientRect()
  const yichangRect = yichangSection.value?.getBoundingClientRect()
  
  const scrollIndicator = document.querySelector('.scroll-indicator')
  if (scrollIndicator) {
    if (heroRect && heroRect.bottom > 0) {
      scrollIndicator.style.opacity = Math.max(0, Math.min(0.6, heroRect.bottom / window.innerHeight))
    } else {
      scrollIndicator.style.opacity = 0
    }
  }
  
  if (introRect) {
    const introTrigger = window.innerHeight * 0.8
    introOpacity.value = introRect.top < introTrigger ? 1 : 0
    introTranslate.value = introRect.top < introTrigger ? 0 : 50
  }
  
  if (topicsRect) {
    const topicsTrigger = window.innerHeight * 0.8
    topicsOpacity.value = topicsRect.top < topicsTrigger ? 1 : 0
    topicsTranslate.value = topicsRect.top < topicsTrigger ? 0 : 50
  }
  
  if (datesRect) {
    const datesTrigger = window.innerHeight * 0.8
    datesOpacity.value = datesRect.top < datesTrigger ? 1 : 0
    datesTranslate.value = datesRect.top < datesTrigger ? 0 : 50
  }
  
  if (yichangRect) {
    const yichangTrigger = window.innerHeight * 0.8
    yichangOpacity.value = yichangRect.top < yichangTrigger ? 1 : 0
    yichangTranslate.value = yichangRect.top < yichangTrigger ? 0 : 50
  }
}

onMounted(() => {
  // 使用静态数据，将配置数据存储在 localStorage 中
  localStorage.setItem('siteConfig', JSON.stringify(configData))

  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home {
  overflow-x: hidden;
}

section {
  padding: 120px 0;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  min-height: 100vh;
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%);
  color: #fff;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  max-width: 1000px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  will-change: transform;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: -100px;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.hero-subtitle {
  font-size: 1.6rem;
  opacity: 0.9;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.hero-details {
  margin: 10px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.hero-date {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.hero-date:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.date-icon {
  font-size: 1.1rem;
}

.hero-venue {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  text-decoration: none;
  transition: background 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hero-venue:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  color: white;
}

.venue-icon {
  font-size: 1.1rem;
}

.scroll-indicator,
.mouse,
.mouse::before,
.scroll-text {
  display: none;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 600;
  margin-bottom: 50px;
  text-align: center;
  line-height: 1.2;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.section-text {
  font-size: 1.4rem;
  line-height: 1.8;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
  color: #666;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.topics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 50px;
  transition: opacity 0.8s ease;
}

.topic-item {
  width: calc(33.33% - 20px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  padding: 25px;
  box-sizing: border-box;
}

.topic-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.topic-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background-color: #f6f9fc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 18px;
}

.topic-content {
  flex: 1;
}

.topic-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.topic-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.highlight-topic {
  border-left: 4px solid #2ecc71;
}

.highlight-topic .topic-icon {
  background-color: rgba(46, 204, 113, 0.1);
}

.highlight-topic .topic-title {
  color: #2ecc71;
}

.dates-timeline {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px auto 0;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 20px;
  transition: opacity 0.8s ease;
}

.date-step {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.date-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  width: 200px;
  height: 170px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.date-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.date-icon {
  font-size: 36px;
  margin-bottom: 15px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-card h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #fff;
}

.date-value {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.date-arrow {
  padding: 0 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  display: flex;
  align-items: center;
}

.date-arrow span {
  animation: arrowPulse 1.5s infinite;
}

@keyframes arrowPulse {
  0% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(5px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.5; }
}

.intro-section {
  background: #f5f5f7;
  overflow: hidden;
}

.topics-section {
  background: #fff;
  overflow: hidden;
}

.dates-section {
  background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%);
  color: #fff;
  overflow: hidden;
}

.yichang-section {
  background: #f8f9fa;
  padding: 120px 0;
  overflow: hidden;
}

.yichang-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 50px;
  transition: opacity 0.8s ease;
}

.yichang-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.yichang-card:hover {
  transform: translateY(-10px);
}

.yichang-image {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
}

.yichang-content {
  padding: 25px;
}

.yichang-content h3 {
  font-size: 1.5rem;
  margin: 0 0 15px;
  color: #333;
}

.yichang-content p {
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
  margin: 0;
}

.organizers-section {
  background: transparent;
  padding: 60px 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.organizers-row {
  margin-bottom: 40px;
}

.organizers-row h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.organizer-logo {
  max-width: 300px;
  height: auto;
  margin-bottom: 15px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.organizer-logo:hover {
  opacity: 1;
}

.organizer-name {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

@keyframes scroll {
  0% { transform: translate(-50%, 0); opacity: 1; }
  50% { transform: translate(-50%, 10px); opacity: 0.2; }
  100% { transform: translate(-50%, 0); opacity: 1; }
}

@media (max-width: 1024px) {
  .topic-item {
    width: calc(50% - 20px);
  }
  
  .dates-timeline {
    justify-content: flex-start;
    padding: 0 20px 20px;
  }
  
  .date-step, .date-arrow {
    flex-direction: row;
  }
  
  .date-card {
    width: 180px;
    padding: 20px 10px;
  }
  
  .date-arrow {
    transform: none;
    padding: 0 10px;
  }
  
  .yichang-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .yichang-image {
    height: 200px;
  }
}

@media (max-width: 768px) {
  section {
    padding: 60px 0;
  }

  .hero-content {
    margin-top: 0;
    padding: 0 15px;
  }

  .hero-content h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .hero-content h2 {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-details {
    margin: 15px 0;
  }

  .hero-date, .hero-venue {
    font-size: 0.9rem;
    padding: 8px 15px;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .section-text {
    font-size: 1rem;
    line-height: 1.6;
    padding: 0 10px;
  }

  .topics-container {
    gap: 15px;
    margin-top: 30px;
  }

  .topic-item {
    width: 100%;
    padding: 15px;
  }

  .topic-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
    margin-right: 12px;
  }

  .topic-title {
    font-size: 16px;
  }

  .topic-desc {
    font-size: 13px;
  }

  .dates-timeline {
    margin: 30px auto 0;
    padding: 0 15px;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
  }

  .date-step {
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .date-card {
    width: 100%;
    height: auto;
    padding: 20px 15px;
    margin: 0;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  .date-icon {
    font-size: 28px;
    width: 50px;
    height: 50px;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }

  .date-card h3 {
    font-size: 16px;
    margin: 0 0 8px;
    color: #fff;
    text-align: center;
    font-weight: 600;
    padding: 0 5px;
  }

  .date-value {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    text-align: center;
    padding: 0 5px;
  }

  .date-arrow {
    transform: rotate(90deg);
    padding: 8px 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 20px;
  }

  .yichang-grid {
    gap: 20px;
    margin-top: 30px;
  }

  .yichang-card {
    margin: 0 10px;
  }

  .yichang-image {
    height: 180px;
  }

  .yichang-content {
    padding: 15px;
  }

  .yichang-content h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .yichang-content p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .organizers-section {
    padding: 40px 0;
  }

  .organizers-row {
    margin-bottom: 30px;
  }

  .organizers-row h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
  }

  .organizer-logo {
    max-width: 200px;
  }

  .organizer-name {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.8rem;
  }

  .hero-content h2 {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .date-card {
    padding: 15px 10px;
    border-radius: 12px;
  }

  .date-icon {
    font-size: 24px;
    width: 45px;
    height: 45px;
    margin-bottom: 10px;
  }

  .date-card h3 {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .date-value {
    font-size: 13px;
  }

  .date-arrow {
    font-size: 18px;
    padding: 6px 0;
  }

  .dates-timeline {
    padding: 0 10px;
  }
}

@keyframes arrowPulseVertical {
  0% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(5px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.5; }
}
</style>