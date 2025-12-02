<template>
  <div class="historical-container">
    <div class="content-wrapper">
      <h1>历届CJNLP历史沿革</h1>
      
      <section class="historical-section">
        <div class="intro-text">
          <p>中日自然语言处理联合推进会议（CJNLP）自2001年首次举办以来，已成功举办多届。下面是CJNLP历年举办的时间轴，展示了从2001年至今的会议的辉煌历程。</p>
        </div>
        
        <div class="timeline-container">
          <div class="timeline">
            <template v-for="(item, index) in graduatesList" :key="item.year">
              <div class="timeline-item" :class="index % 2 === 0 ? 'timeline-item-right' : 'timeline-item-left'">
                <div class="timeline-year">{{ item.year }}</div>
                <div class="timeline-content" :class="item.nation === 0 ? 'china-hosted' : 'japan-hosted'">
                  <h3>
                    {{ item.title }}
                    <span v-if="item.year === 2025" class="current-badge">当前</span>
                  </h3>
                  <p class="timeline-venue">{{ item.location }}</p>
                  <p class="timeline-description">{{ item.description }}</p>
                  <div class="timeline-actions">
                    <!-- <router-link :to="`/historical/${item.year}`" class="timeline-button">
                      查看照片
                    </router-link> -->
                    <a v-if="item.link" :href="item.link" target="_blank" class="timeline-button website-button">
                      官网地址
                    </a>
                  </div>
                </div>
              </div>
            </template>
          </div>
          
          <div class="timeline-legend">
            <div class="legend-item">
              <span class="legend-dot china-dot"></span>
              <span>中国举办</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot japan-dot"></span>
              <span>日本举办</span>
            </div>
          </div>
        </div>
      </section>
      
      <section class="historical-section">
        <h2>CJNLP成就与影响</h2>
        <div class="achievements-grid">
          <div class="achievement-card">
            <div class="achievement-icon">🌉</div>
            <h3>促进跨语言研究</h3>
            <p>多年来，CJNLP一直致力于促进中日两国在自然语言处理领域的学术交流，推动了大量跨语言研究项目的开展。</p>
          </div>
          
          <div class="achievement-card">
            <div class="achievement-icon">🔬</div>
            <h3>技术创新</h3>
            <p>会议历届演讲和论文涵盖了从统计机器翻译到神经网络，再到现代大语言模型的技术演进历程。</p>
          </div>
          
          <div class="achievement-card">
            <div class="achievement-icon">🌏</div>
            <h3>国际影响力</h3>
            <p>CJNLP已发展成为亚洲地区最具影响力的自然语言处理专业会议之一，吸引了全球研究者的参与。</p>
          </div>
          
          <div class="achievement-card">
            <div class="achievement-icon">🤝</div>
            <h3>产学研合作</h3>
            <p>通过连接学术界和产业界，CJNLP促成了许多成功的产学研合作项目，推动了研究成果的实际应用。</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 静态历届会议数据（从 http://10.17.0.10:8211/endpoint/graduates/list_all 获取）
const graduatesListData = [
  {"id":7,"year":2001,"link":"","title":"第一届中日自然语言处理联合推进会议","title_en":"The First China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第1回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·京阪奈","location_en":"Keihanna, Japan","location_jp":"日本・京阪奈","attendees":0,"chairman":"","nation":1},
  {"id":8,"year":2002,"link":"","title":"第二届中日自然语言处理联合推进会议","title_en":"The Second China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第2回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·北京","location_en":"Beijing, China","location_jp":"中国・北京","attendees":0,"chairman":"","nation":0},
  {"id":9,"year":2003,"link":"","title":"第三届中日自然语言处理联合推进会议","title_en":"The Third China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第3回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·滋贺","location_en":"Shiga, Japan","location_jp":"日本・滋賀","attendees":0,"chairman":"","nation":1},
  {"id":12,"year":2004,"link":"","title":"第四届中日自然语言处理联合推进会议","title_en":"The Fourth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第4回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·香港","location_en":"Hong Kong, China","location_jp":"中国・香港","attendees":0,"chairman":"","nation":0},
  {"id":13,"year":2005,"link":"","title":"第五届中日自然语言处理联合推进会议","title_en":"The Fifth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第5回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·山梨县","location_en":"Yamanashi Prefecture, Japan","location_jp":"日本・山梨県","attendees":0,"chairman":"","nation":1},
  {"id":14,"year":2006,"link":"","title":"第六届中日自然语言处理联合推进会议","title_en":"The Sixth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第6回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·上海","location_en":"Shanghai, China","location_jp":"中国・上海","attendees":0,"chairman":"","nation":0},
  {"id":15,"year":2007,"link":"","title":"第七届中日自然语言处理联合推进会议","title_en":"The Seventh China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第7回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·名古屋","location_en":"Nagoya, Japan","location_jp":"日本・名古屋","attendees":0,"chairman":"","nation":1},
  {"id":16,"year":2008,"link":"","title":"第八届中日自然语言处理联合推进会议","title_en":"The Eighth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第8回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·北京","location_en":"Beijing, China","location_jp":"中国・北京","attendees":0,"chairman":"","nation":0},
  {"id":17,"year":2009,"link":"","title":"第九届中日自然语言处理联合推进会议","title_en":"The Ninth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第9回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·冲绳","location_en":"Okinawa, Japan","location_jp":"日本・沖縄","attendees":0,"chairman":"","nation":1},
  {"id":18,"year":2010,"link":"","title":"第十届中日自然语言处理联合推进会议","title_en":"The Tenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第10回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·苏州","location_en":"Suzhou, China","location_jp":"中国・蘇州","attendees":0,"chairman":"","nation":0},
  {"id":19,"year":2011,"link":"","title":"第十一届中日自然语言处理联合推进会议","title_en":"The Eleventh China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第11回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·宫崎","location_en":"Miyazaki, Japan","location_jp":"日本・宮崎","attendees":0,"chairman":"","nation":1},
  {"id":20,"year":2012,"link":"","title":"第十二届中日自然语言处理联合推进会议","title_en":"The Twelfth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第12回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·哈尔滨","location_en":"Harbin, China","location_jp":"中国・ハルビン","attendees":0,"chairman":"","nation":0},
  {"id":21,"year":2013,"link":"","title":"第十三届中日自然语言处理联合推进会议","title_en":"The Thirteenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第13回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·岛根松江","location_en":"Matsue, Shimane, Japan","location_jp":"日本・島根松江","attendees":0,"chairman":"","nation":1},
  {"id":22,"year":2014,"link":"","title":"第十四届中日自然语言处理联合推进会议","title_en":"The Fourteenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第14回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·成都","location_en":"Chengdu, China","location_jp":"中国・成都","attendees":0,"chairman":"","nation":0},
  {"id":23,"year":2015,"link":"","title":"第十五届中日自然语言处理联合推进会议","title_en":"The Fifteenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第15回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·青森","location_en":"Aomori, Japan","location_jp":"日本・青森","attendees":0,"chairman":"","nation":1},
  {"id":24,"year":2016,"link":"","title":"第十六届中日自然语言处理联合推进会议","title_en":"The Sixteenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第16回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"中国·沈阳","location_en":"Shenyang, China","location_jp":"中国・瀋陽","attendees":0,"chairman":"","nation":0},
  {"id":25,"year":2017,"link":"","title":"第十七届中日自然语言处理联合推进会议","title_en":"The Seventeenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第17回日中自然言語処理合同推進会議","description":"","description_en":"","description_jp":"","location":"日本·北九州","location_en":"Kitakyushu, Japan","location_jp":"日本・北九州","attendees":0,"chairman":"","nation":1},
  {"id":26,"year":2018,"link":"","title":"第十八届中日自然语言处理联合推进会议","title_en":"The Eighteenth China-Japan Joint Conference on Natural Language Processing Promotion","title_jp":"第十八回中日自然言語処理共同推進会議","description":"","description_en":"","description_jp":"","location":"中国·桂林","location_en":"Guilin, China","location_jp":"中国・桂林","attendees":0,"chairman":"","nation":0},
  {"id":27,"year":2019,"link":"","title":"第十九届中日自然语言处理联合推进会议","title_en":"The 19th China-Japan Joint Promotion Conference on Natural Language Processing","title_jp":"第十九回中日自然言語処理共同推進会議","description":"","description_en":"","description_jp":"","location":"日本·静冈沼津","location_en":"Numazu, Shizuoka Prefecture, Japan","location_jp":"日本・静岡沼津","attendees":0,"chairman":"","nation":1},
  {"id":28,"year":2023,"link":"https://liip.kust.edu.cn/CJNLP2023/index.html","title":"第二十届中日自然语言处理联合推进会议","title_en":"The 20th China-Japan Joint Promotion Conference on Natural Language Processing","title_jp":"第二十回中日自然言語処理共同推進会議","description":"深入探讨生成式人工智能在跨语言场景下的应用与挑战。","description_en":"In-depth exploration of the applications and challenges of generative artificial intelligence in cross-lingual scenarios.","description_jp":"生成型人工知能の言語間シナリオにおける応用と課題を深く探讨する。","location":"中国·西双版纳","location_en":"Xishuangbanna, China","location_jp":"中国・西双版納","attendees":0,"chairman":"","nation":0},
  {"id":29,"year":2024,"link":"","title":"第二十一届中日自然语言处理联合推进会议","title_en":"The 21st China-Japan Joint Promotion Conference on Natural Language Processing","title_jp":"第二十一回中日自然言語処理共同推進会議","description":"探讨大语言模型在中日双语环境下的应用与挑战，加强跨语言研究合作。","description_en":"Discuss the applications and challenges of large language models in Chinese-Japanese bilingual environments, and strengthen cross-lingual research collaboration.","description_jp":"大規模言語モデルの日中バイリンガル環境における応用と課題を探讨し、言語間研究協力を強化する。","location":"日本·奈良葛城","location_en":"Katsuragi, Nara Prefecture, Japan","location_jp":"日本・奈良葛城","attendees":0,"chairman":"","nation":1},
  {"id":10,"year":2025,"link":"","title":"第二十二届中日自然语言处理联合推进会议","title_en":"The 22nd China-Japan Natural Language Processing Joint Promotion Conference，CJNLP2025","title_jp":"第22回日中自然言語処理共同推進会議","description":"聚焦自然语言处理、大模型、智能体等前沿技术研究，探索中日双边科研合作新机遇。","description_en":"Focus on cutting-edge technology research such as natural language processing, large models, and intelligent agents, and explore new opportunities for China-Japan bilateral scientific research cooperation.","description_jp":"自然言語処理、大規模言語モデル、エージェントなどの最先端技術研究に焦点を当て、日中間の新たな科学研究協力の機会を模索する。","location":"中国·宜昌","location_en":"Yichang, China","location_jp":"中国・宜昌","attendees":0,"chairman":"","nation":0}
]

// 按年份倒序排序
const graduatesList = ref(graduatesListData.sort((a, b) => b.year - a.year))

onMounted(() => {
  document.title = "CJNLP历届会议 - 历史沿革"
  
  // 恢复时间轴和成就卡片的动画效果
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item)
    item.classList.add('animate')
  })
  
  document.querySelectorAll('.achievement-card').forEach(card => {
    observer.observe(card)
    card.classList.add('animate')
  })
})
</script>

<style scoped>
.historical-container {
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

.historical-section {
  margin-bottom: 3rem;
}

.intro-text {
  line-height: 1.6;
  color: #555;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 时间轴样式 */
.timeline-container {
  padding: 1rem 0;
  position: relative;
}

.timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline::after {
  content: '';
  position: absolute;
  width: 4px;
  background-color: #1890ff;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -2px;
  border-radius: 2px;
  z-index: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  transition: opacity 0.6s ease, transform 0.6s ease;
  width: 50%;
  clear: both;
  z-index: 1;
}

.timeline-item-right {
  float: right;
  padding-left: 40px;
  transform: translate(-30px);
}

.timeline-item-left {
  float: left;
  padding-right: 40px;
  text-align: right;
  transform: translate(30px);
}

.timeline-item.animate.visible {
  opacity: 1;
  transform: translate(0);
}

.timeline-year {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.timeline-item-right .timeline-year {
  left: -20px;
}

.timeline-item-left .timeline-year {
  right: -20px;
}

.timeline-content {
  padding: 20px;
  background-color: #f8f9fa !important;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  cursor: pointer;
  margin: 0 10px;
  z-index: 2;
}

.timeline-item-right .timeline-content.china-hosted {
  border-left: 4px solid #e63946; /* 中国红 */
}

.timeline-item-left .timeline-content.china-hosted {
  border-right: 4px solid #e63946; /* 中国红 */
}

.timeline-item-right .timeline-content.japan-hosted {
  border-left: 4px solid #4361ee; /* 日本蓝 */
}

.timeline-item-left .timeline-content.japan-hosted {
  border-right: 4px solid #4361ee; /* 日本蓝 */
}

.timeline-item-right .timeline-content:hover {
  transform: translate(-8px);
}

.timeline-item-left .timeline-content:hover {
  transform: translate(8px);
}

.timeline-content h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.current-badge {
  display: inline-block;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(238, 90, 111, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.timeline-venue {
  color: #666;
  font-style: italic;
  margin: 5px 0 15px;
}

.timeline-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.timeline-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  clear: both;
  padding-top: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.china-dot {
  background-color: #e63946;
}

.japan-dot {
  background-color: #4361ee;
}

/* 清除浮动 */
.timeline:after {
  content: "";
  display: table;
  clear: both;
}

/* 成就与影响样式 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.achievement-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.achievement-card.animate.visible {
  opacity: 1;
  transform: translateY(0);
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.achievement-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.achievement-card p {
  color: #666;
  line-height: 1.6;
}

.skeleton-placeholder {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 70%;
}

.timeline-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.timeline-button {
  display: inline-block;
  padding: 8px 15px;
  background-color: #4a6fa5;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.timeline-button:hover {
  background-color: #385788;
}

.website-button {
  background-color: #5a9a6f;
}

.website-button:hover {
  background-color: #488559;
}

.photo-button {
  background-color: #5a9a6f;
}

.photo-button:hover {
  background-color: #488559;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .historical-container {
    padding: 1rem;
  }
  
  .content-wrapper {
    padding: 1rem;
  }
  
  .timeline::after {
    left: 50%;
  }
  
  .timeline-item {
    width: 80%;
    float: none;
    margin: 0 auto 30px;
  }
  
  .timeline-item-left,
  .timeline-item-right {
    padding: 0 0 0 40px;
    text-align: left;
  }
  
  .timeline-item-left .timeline-year,
  .timeline-item-right .timeline-year {
    left: -20px;
    right: auto;
  }
  
  .timeline-item-left .timeline-content,
  .timeline-item-right .timeline-content {
    border-left: 4px solid #1890ff;
    border-right: none;
  }
  
  .timeline-item-left .timeline-content:hover,
  .timeline-item-right .timeline-content:hover {
    transform: translateX(-8px);
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .historical-container {
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
    margin: 0.4rem 0 0.8rem;
  }

  .historical-section {
    margin-bottom: 2rem;
  }

  .intro-text {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .timeline-container {
    padding: 0.5rem 0;
  }

  .timeline::after {
    left: 30px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 60px;
    margin-bottom: 2rem;
    float: none;
    box-sizing: border-box;
  }

  .timeline-item-right,
  .timeline-item-left {
    float: none;
    padding: 0 0 0 60px;
    text-align: left;
    transform: none;
    width: 100%;
    box-sizing: border-box;
  }

  .timeline-item-left .timeline-year,
  .timeline-item-right .timeline-year {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
    left: 12px !important;
    right: auto;
  }

  .timeline-content {
    padding: 1rem;
    margin: 0;
    border-left: 4px solid #1890ff;
    border-right: none;
    width: 100%;
    box-sizing: border-box;
  }

  .timeline-content h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
    word-break: break-word;
  }

  .timeline-venue {
    font-size: 0.9rem;
    margin: 0.3rem 0 0.8rem;
    word-break: break-word;
  }

  .timeline-description {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    word-break: break-word;
  }

  .timeline-actions {
    margin-top: 0.8rem;
  }

  .timeline-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .timeline-legend {
    margin-top: 1.5rem;
    gap: 1.5rem;
    padding-top: 1.5rem;
  }

  .legend-item {
    font-size: 0.8rem;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .achievement-card {
    padding: 1rem;
  }

  .achievement-icon {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .achievement-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  .achievement-card p {
    font-size: 0.9rem;
  }

  .timeline-item-right .timeline-content.china-hosted,
  .timeline-item-left .timeline-content.china-hosted {
    border-left: 4px solid #e63946;
    border-right: none;
  }

  .timeline-item-right .timeline-content.japan-hosted,
  .timeline-item-left .timeline-content.japan-hosted {
    border-left: 4px solid #4361ee;
    border-right: none;
  }

  .timeline-item-right .timeline-content:hover,
  .timeline-item-left .timeline-content:hover {
    transform: translateX(-8px);
  }
}
</style> 