<template>
  <div class="layout-container">
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="nav-content">
        <router-link :to="localePath('/')" class="nav-logo">CJNLP 2025</router-link>
        <div class="nav-links" :class="{ 'nav-links-mobile': isMobileMenuOpen }">
          <router-link :to="localePath('/')" class="nav-link" @click="closeMobileMenu">{{ t('nav.home') }}</router-link>
          <router-link :to="localePath('/committee')" class="nav-link" @click="closeMobileMenu">{{ t('nav.committee') }}</router-link>
          <router-link :to="localePath('/schedule')" class="nav-link" @click="closeMobileMenu">{{ t('nav.schedule') }}</router-link>
          <!-- <router-link :to="localePath('/submission')" class="nav-link" @click="closeMobileMenu">{{ t('nav.submission') }}</router-link> -->
          <!-- <router-link :to="localePath('/proceedings')" class="nav-link" @click="closeMobileMenu">{{ t('nav.proceedings') }}</router-link> -->
          <!-- <router-link :to="localePath('/registration')" class="nav-link" @click="closeMobileMenu">{{ t('nav.registration') }}</router-link> -->
          <router-link :to="localePath('/transportation')" class="nav-link" @click="closeMobileMenu">{{ t('nav.transportation') }}</router-link>
          <!-- <router-link :to="localePath('/contact')" class="nav-link" @click="closeMobileMenu">{{ t('nav.contact') }}</router-link> -->
          <router-link :to="localePath('/historical')" class="nav-link" @click="closeMobileMenu">{{ t('nav.historical') }}</router-link>
          <router-link :to="localePath('/memory')" class="nav-link" @click="closeMobileMenu">{{ t('nav.memory') }}</router-link>
        </div>
        
        <div class="language-selector">
          <el-dropdown @command="handleLanguageChange">
            <span class="el-dropdown-link">
              {{ currentLanguage }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="ja">日本語</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ 'is-active': isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <p>Copyright © CJNLP 2025</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t, locale } = useI18n()
const isMobileMenuOpen = ref(false)

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
  "about": "第二十二届中日自然语言处理联合推进会议（CJNLP2025）\"由中国中文信息学会主办，武汉大学幂思实验室承办。会议旨在为中日双方搭建自然语言处理领域的高水平交流平台，推动中日双边乃至亚洲地区在自然语言处理研究和技术应用方面的深入合作。\n\n中日自然语言处理联合推进会议（简称CJNLP）始于2001年，每年举办一次。该系列会议在奇数年于日本各地举行，偶数年则在中国各地举办。第一届会议由日本国家信息与通信研究院发起，随后第二届至第十九届会议先后在北京、哈尔滨、苏州、成都、桂林、西双版纳等中国城市，以及日本冲绳、松江市、青森市、北九州市等地区成功举办。\n\nCJNLP2025将于2025年9月13日至14日在湖北省宜昌市机场桃花岭饭店召开。本次会议的主题为\"大模型与智能体驱动的自然语言处理变革\"，聚焦探讨大模型与智能体技术如何推动自然语言处理领域的深刻变革与创新。会议将致力于促进学术研究与实际应用的紧密结合，进一步深化中日双方在相关领域的技术交流与合作，共同推动自然语言处理技术的未来发展。",
  "about_en": "The 22nd China-Japan Conference on Natural Language Processing (CJNLP2025) is hosted by the Chinese Information Processing Society of China and organized by the Myth Laboratory of Wuhan University. The conference aims to establish a high-level exchange platform in the field of natural language processing for both China and Japan, promoting in-depth cooperation in research and technological applications between the two countries and throughout the Asian region.\n\nThe China-Japan Conference on Natural Language Processing (CJNLP) began in 2001 and is held annually. The conference series alternates between Japanese cities in odd-numbered years and Chinese cities in even-numbered years. The first conference was initiated by Japan's National Institute of Information and Communications Technology, followed by the second through nineteenth conferences successfully held in Chinese cities such as Beijing, Harbin, Suzhou, Chengdu, Guilin, and Xishuangbanna, as well as Japanese regions including Okinawa, Matsue, Aomori, and Kitakyushu.\n\nCJNLP2025 will be held at the Airport Taohualing Hotel in Yichang, Hubei Province, from September 13 to 14, 2025. The theme of this conference is \"Natural Language Processing Revolution Driven by Large Models and Intelligent Agents\", focusing on how Large Models and Intelligent Agent technologies are driving profound changes and innovation in the field of natural language processing. The conference will strive to promote the close integration of academic research and practical applications, further deepening technical exchanges and cooperation between China and Japan in related fields, and jointly promoting the future development of natural language processing technology.",
  "about_jp": "第22回中日自然言語処理共同推進会議（CJNLP2025）は中国中文情報学会が主催し、武漢大学幂思実験室が運営します。本会議は中日両国に自然言語処理分野における高水準な交流プラットフォームを構築し、中日二国間さらにはアジア地域における自然言語処理研究と技術応用面での深い協力を推進することを目的としています。\n\n中日自然言語処理共同推進会議（略称CJNLP）は2001年に始まり、毎年一回開催されています。このシリーズの会議は奇数年に日本各地で開催され、偶数年には中国各地で開催されます。第1回会議は日本国立情報通信研究院によって発起され、その後、第2回から第19回の会議は北京、ハルビン、蘇州、成都、桂林、西双版納などの中国の都市、および日本の沖縄、松江市、青森市、北九州市などの地域で成功裏に開催されました。\n\nCJNLP2025は2025年9月13日から14日まで湖北省宜昌市の空港桃花嶺ホテルで開催されます。今回の会議のテーマは「大規模言語モデルとエージェントが推進する自然言語処理の変革」であり、大規模言語モデルとエージェント技術がどのように自然言語処理分野の深い変革とイノベーションを推進するかに焦点を当てます。本会議は学術研究と実用応用の密接な結合を促進し、関連分野における中日両国の技術交流と協力をさらに深め、自然言語処理技術の未来の発展を共に推進することに努めます。",
  "theme": "[{\"name\":\"大型语言模型\",\"icon\":\"🧠\",\"description\":\"探索LLM前沿技术与应用\",\"highlight\":true},{\"name\":\"智能体技术\",\"icon\":\"🤖\",\"description\":\"多智能体协作与应用创新\",\"highlight\":true},{\"name\":\"自然语言理解\",\"icon\":\"🔍\",\"description\":\"文本理解与语义分析技术\"},{\"name\":\"机器翻译\",\"icon\":\"🌐\",\"description\":\"多语言翻译与跨语言研究\"},{\"name\":\"对话系统\",\"icon\":\"💬\",\"description\":\"智能对话与人机交互\"},{\"name\":\"信息抽取\",\"icon\":\"📊\",\"description\":\"从非结构化文本中获取结构化信息\"},{\"name\":\"多模态处理\",\"icon\":\"📷\",\"description\":\"跨模态理解与生成\"},{\"name\":\"知识图谱\",\"icon\":\"🔄\",\"description\":\"知识表示、推理与应用\"},{\"name\":\"语言资源\",\"icon\":\"📚\",\"description\":\"亚洲语言资源构建与利用\"}]",
  "theme_en": "[{\"name\":\"Large Language Models\",\"icon\":\"🧠\",\"description\":\"Exploring LLM frontier technologies and applications\",\"highlight\":true},{\"name\":\"Intelligent Agent Technology\",\"icon\":\"🤖\",\"description\":\"Multi-agent collaboration and application innovation\",\"highlight\":true},{\"name\":\"Natural Language Understanding\",\"icon\":\"🔍\",\"description\":\"Text understanding and semantic analysis technology\"},{\"name\":\"Machine Translation\",\"icon\":\"🌐\",\"description\":\"Multilingual translation and cross-language research\"},{\"name\":\"Dialogue Systems\",\"icon\":\"💬\",\"description\":\"Intelligent dialogue and human-computer interaction\"},{\"name\":\"Information Extraction\",\"icon\":\"📊\",\"description\":\"Extracting structured information from unstructured text\"},{\"name\":\"Multimodal Processing\",\"icon\":\"📷\",\"description\":\"Cross-modal understanding and generation\"},{\"name\":\"Knowledge Graphs\",\"icon\":\"🔄\",\"description\":\"Knowledge representation, reasoning, and applications\"},{\"name\":\"Language Resources\",\"icon\":\"📚\",\"description\":\"Asian language resource construction and utilization\"}]",
  "theme_jp": "[{\"name\":\"大規模言語モデル\",\"icon\":\"🧠\",\"description\":\"LLMの最先端技術と応用を探る\",\"highlight\":true},{\"name\":\"エージェント技術\",\"icon\":\"🤖\",\"description\":\"マルチエージェント協調と応用革新\",\"highlight\":true},{\"name\":\"自然言語理解\",\"icon\":\"🔍\",\"description\":\"テキスト理解と意味解析技術\"},{\"name\":\"機械翻訳\",\"icon\":\"🌐\",\"description\":\"多言語翻訳と言語横断研究\"},{\"name\":\"対話システム\",\"icon\":\"💬\",\"description\":\"インテリジェント対話と人間機械対話\"},{\"name\":\"情報抽出\",\"icon\":\"📊\",\"description\":\"非構造化テキストから構造化情報を取得\"},{\"name\":\"マルチモーダル処理\",\"icon\":\"📷\",\"description\":\"モーダル横断理解と生成\"},{\"name\":\"ナレッジグラフ\",\"icon\":\"🔄\",\"description\":\"知識表現、推論と応用\"},{\"name\":\"言語資源\",\"icon\":\"📚\",\"description\":\"アジア言語資源の構築と活用\"}]",
  "promotion": "[{\"name\":\"三峡大坝\",\"image\":\"/images/yichang/three-gorges-dam-project.jpg\",\"description\":\"长江三峡是世界级的自然景观，以其壮丽的峡谷风光、深厚的历史文化遗迹和世界最大的水利枢纽工程而闻名。险峻的峡谷与雄伟的景观令游客叹为观止。\"},{\"name\":\"三峡人家\",\"image\":\"/images/yichang/sanxiarenjia.jpg\",\"description\":\"三峡人家是展现三峡民俗文化的生态旅游区，依山傍水，完整保留了巴楚文化特色的吊脚楼建筑群。这里不仅能品尝到地道的三峡特色美食，还能体验独特的峡江渔家文化，感受三峡人民的生活智慧与乡土情怀。\"},{\"name\":\"清江画廊\",\"image\":\"/images/yichang/qingjianghualan.jpg\",\"description\":\"清江画廊以其清澈的水质、陡峭的峭壁和独特的喀斯特地貌而著名。这里是自然爱好者的天堂，为游客提供了独特的自然景观体验。\"},{\"name\":\"屈原故里\",\"image\":\"/images/yichang/quyuguxiang.jpg\",\"description\":\"位于秭归县的屈原故里是中国伟大诗人屈原的出生地和纪念地。这里不仅保存了丰富的历史文物，还建有气势恢宏的纪念馆，让游客深入了解屈原的生平事迹和楚文化的深厚底蕴。每年端午节期间，这里都会举办隆重的纪念活动。\"}]",
  "promotion_en": "[{\"name\":\"Three Gorges\",\"image\":\"/images/yichang/three-gorges-dam-project.jpg\",\"description\":\"The Three Gorges is a scenic area along the Yangtze River, famous for its stunning natural beauty, historical sites, and the world's largest hydroelectric power station.\"},{\"name\":\"Three Gorges Folk Village\",\"image\":\"/images/yichang/sanxiarenjia.jpg\",\"description\":\"The Three Gorges Folk Village is an eco-tourism area showcasing the folk culture of the Three Gorges region. It features traditional stilt house architecture that preserves the characteristics of Ba-Chu culture. Visitors can savor authentic Three Gorges cuisine and experience unique river fishing culture, gaining insight into the wisdom and heritage of the Three Gorges people.\"},{\"name\":\"Qingjiang Gallery\",\"image\":\"/images/yichang/qingjianghualan.jpg\",\"description\":\"A beautiful river valley featuring crystal clear waters, steep cliffs, and unique karst landscapes, perfect for nature lovers.\"},{\"name\":\"Qu Yuan's Hometown\",\"image\":\"/images/yichang/quyuguxiang.jpg\",\"description\":\"Located in Zigui County, this is the birthplace and memorial site of Qu Yuan, one of China's greatest poets. The site features a magnificent memorial hall and rich historical relics, offering visitors insights into Qu Yuan's life and the profound Chu culture. Grand commemorative events are held here during the Dragon Boat Festival each year.\"}]",
  "promotion_jp": "[{\"name\":\"三峡\",\"image\":\"/images/yichang/three-gorges-dam-project.jpg\",\"description\":\"長江に沿って広がる三峡は、壮大な自然美、歴史的遺跡、そして世界最大の水力発電所で知られる景勝地です。険しい峡谷と雄大な景観が訪れる人々を魅了します。\"},{\"name\":\"三峡の里\",\"image\":\"/images/yichang/sanxiarenjia.jpg\",\"description\":\"三峡の里は三峡地方の民俗文化を紹介するエコツーリズムエリアです。山と水に囲まれた環境に、巴楚文化の特徴を残す高床式建築群が立ち並びます。ここでは本場の三峡料理を味わい、独特な渓谷の漁村文化を体験しながら、三峡の人々の生活の知恵と郷土の情緒を感じることができます。\"},{\"name\":\"清江画廊\",\"image\":\"/images/yichang/qingjianghualan.jpg\",\"description\":\"透明度の高い水、切り立った崖、独特のカルスト地形が特徴の美しい渓谷です。自然愛好家にとって理想的な観光スポットとなっています。\"},{\"name\":\"屈原の故郷\",\"image\":\"/images/yichang/quyuguxiang.jpg\",\"description\":\"秭帰県に位置する屈原の故郷は、中国の偉大な詩人・屈原の生誕地であり記念地です。壮大な記念館と豊富な歴史的遺物を通じて、屈原の生涯と楚文化の深い歴史を体験できます。毎年端午節には盛大な記念行事が開催され、伝統文化の継承を実感できます。\"}]",
  "org": "[{\"title\":\"主办单位\",\"logo\":\"/images/logo/cips.png\",\"name\":\"中国中文信息学会\",\"alt\":\"中国中文信息学会\"},{\"title\":\"承办单位\",\"logo\":\"/images/logo/whu.png\",\"name\":\"武汉大学\",\"alt\":\"武汉大学\"},{\"title\":\"赞助单位\",\"logo\":\"/images/logo/myth.png\",\"name\":\"幂思实验室\",\"alt\":\"幂思实验室\"}]",
  "org_en": "[{\"title\":\"Host Organization\",\"logo\":\"/images/logo/cips.png\",\"name\":\"Chinese Information Processing Society of China\",\"alt\":\"Chinese Information Processing Society of China\"},{\"title\":\"Organizing Institution\",\"logo\":\"/images/logo/whu.png\",\"name\":\"Wuhan University\",\"alt\":\"Wuhan University\"},{\"title\":\"Sponsor\",\"logo\":\"/images/logo/myth.png\",\"name\":\"Myth Laboratory\",\"alt\":\"Myth Laboratory\"}]",
  "org_jp": "[{\"title\":\"主催機関\",\"logo\":\"/images/logo/cips.png\",\"name\":\"中国中文情報学会\",\"alt\":\"中国中文情報学会\"},{\"title\":\"運営機関\",\"logo\":\"/images/logo/whu.png\",\"name\":\"武漢大学\",\"alt\":\"武漢大学\"},{\"title\":\"スポンサー\",\"logo\":\"/images/logo/myth.png\",\"name\":\"幂思実験室\",\"alt\":\"幂思実験室\"}]"
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const localePath = (path) => {
  return locale.value === 'zh' ? path : `/${locale.value}${path}`
}

const currentLanguage = computed(() => {
  const languageMap = {
    zh: '中文',
    ja: '日本語',
    en: 'English'
  }
  return languageMap[locale.value]
})

const handleLanguageChange = (lang) => {
  locale.value = lang

  // 使用 Vue Router 的当前路由，而不是 window.location.pathname
  const currentRoute = router.currentRoute.value
  const pathSegments = currentRoute.path.split('/')

  // 如果当前路径包含语言前缀，移除它
  if (['en', 'ja'].includes(pathSegments[1])) {
    pathSegments.splice(1, 1)
  }

  // 根据选择的语言添加新的路径前缀
  if (lang !== 'zh') {
    pathSegments.splice(1, 0, lang)
  }

  let newPath = pathSegments.join('/')
  if (newPath === '') {
    newPath = '/'
  }

  if (newPath !== currentRoute.path) {
    router.push(newPath)
  }
}

const syncLocaleWithRoute = (path) => {
  const pathSegments = path.split('/')
  if (pathSegments[1]) {
    const lang = pathSegments[1]
    if (['en', 'ja'].includes(lang)) {
      locale.value = lang
      return
    }
  }
  // 没有语言前缀时，默认中文
  locale.value = 'zh'
}

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  // 根据当前路由同步一次语言（考虑到首屏时路由可能已经更新）
  syncLocaleWithRoute(router.currentRoute.value.path)

  // 使用静态配置数据并存储到localStorage
  if (configData) {
    // 将配置数据存储在localStorage中
    localStorage.setItem('siteConfig', JSON.stringify(configData))
  }

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

// 监听路由变化，自动同步语言前缀和 i18n 的 locale
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    syncLocaleWithRoute(newPath)
  }
)

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  text-decoration: none;
  background: linear-gradient(90deg, #000 0%, #333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.3s ease;
}

.nav-logo:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.language-selector {
  margin-left: 30px;
  margin-top: 5px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 1rem;
}

.el-dropdown-link:hover {
  color: #000;
}

.nav-link {
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #000 0%, #333 100%);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #000;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.main-content {
  flex: 1;
  margin-top: 70px;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  color: #666;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-menu-btn span {
  display: block;
  width: 100%;
  height: 2px;
  background: #333;
  transition: all 0.3s ease;
}

.mobile-menu-btn.is-active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.mobile-menu-btn.is-active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.is-active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.info-query-link-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.info-query-link {
  font-size: 0.9rem;
  color: #666;
  text-decoration: underline;
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  transition: color 0.3s ease;
}

.info-query-link:hover {
  color: #333;
  background: none;
  border: none;
}

@media (max-width: 768px) {
  .nav-content {
    height: 60px;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .nav-links-mobile {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    width: 100%;
    padding: 10px 0;
    font-size: 1.1rem;
  }

  .language-selector {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .nav-content {
    height: 50px;
  }

  .nav-links {
    top: 50px;
    padding: 15px;
  }

  .nav-link {
    font-size: 1rem;
    padding: 8px 0;
  }
}
</style>