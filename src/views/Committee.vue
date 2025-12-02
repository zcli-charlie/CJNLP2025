<template>
  <div class="committee-container">
    <div class="content-wrapper">
      <h1>会议委员会</h1>

      <!-- 大会主席 -->
      <section class="committee-section">
        <h2>👑 大会主席</h2>
        <div class="members-grid">
          <!-- 直接硬编码每位大会主席 -->
          <template v-for="(i,index) in orgList.conference_chairs">
            <div class="member-card">
              <div class="member-photo">
                <img :src="i.avatar" alt="">
              </div>
              <div class="member-info">
                <h3>{{i.name}}</h3>
                <p>{{i.organization}}</p>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- 程序委员会主席 -->
      <section class="committee-section">
        <h2>📋 程序委员会主席</h2>
        <div class="members-grid">
          <!-- 直接硬编码每位程序委员会主席 -->
          <template v-for="(i,index) in orgList.program_chairs">
            <div class="member-card">
              <div class="member-photo">
                <img :src="i.avatar" alt="">
              </div>
              <div class="member-info">
                <h3>{{i.name}}</h3>
                <p>{{i.organization}}</p>
              </div>
            </div>
          </template>

        </div>
      </section>

      <!-- 组织委员会 -->
      <section class="committee-section">
        <h2>🔧 组织委员会成员</h2>
        <div class="members-grid">
          <!-- 直接硬编码每位组织委员会成员 -->
          <template v-for="(i,index) in orgList.organizing_committee">
            <div class="member-card">
              <div class="member-photo">
                <img :src="i.avatar" alt="">
              </div>
              <div class="member-info">
                <h3>{{i.name}}</h3>
                <p>{{i.organization}}</p>
              </div>
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";

// 静态组织数据（从 http://10.17.0.10:8211/endpoint/org/list 获取）
const orgListData = {
  "conference_chairs": [  
    {"id":14,"avatar":"/cjnlp2025/images/committee/yuhao.png","name":"于浩","organization":"联想控股","order":1},
    {"id":13,"avatar":"/cjnlp2025/images/committee/sutou.png","name":"須藤 克仁","organization":"奈良女子大学","order":0}
  ],
  "program_chairs": [
    {"id":16,"avatar":"/cjnlp2025/images/committee/chengfei.png","name":"程飞","organization":"京都大学","order":1},
    {"id":17,"avatar":"/cjnlp2025/images/committee/linhongyu.png","name":"林鸿宇","organization":"中国科学院软件研究所","order":0}
  ],
  "organizing_committee": [
    {"id":11,"avatar":"/cjnlp2025/images/committee/licuochao.png","name":"李祖超","organization":"武汉大学","order":1},
    {"id":15,"avatar":"/cjnlp2025/images/committee/zhangzuosheng.png","name":"张倬胜","organization":"上海交通大学","order":0},
    {"id":18,"avatar":"/cjnlp2025/images/committee/jiangshu.png","name":"姜舒","organization":"南通大学","order":0}
  ]
}

const orgList = reactive({
  conference_chairs: orgListData.conference_chairs,
  organizing_committee: orgListData.organizing_committee,
  program_chairs: orgListData.program_chairs,
})
</script>

<style scoped>
.committee-container {
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
  margin: 0.5rem 0;
}

.committee-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.member-card {
  background: white;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eee;
}

.member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.member-photo {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info p {
  color: #666;
  margin: 0.5rem 0 0;
}

@media (max-width: 768px) {
  .committee-container {
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
  }

  .committee-section {
    margin-bottom: 2rem;
    padding: 1rem;
  }

  .members-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .member-card {
    padding: 1rem;
  }

  .member-photo {
    width: 90px;
    height: 90px;
    margin: 0 auto 0.8rem;
    border-width: 3px;
  }

  .member-info p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .committee-container {
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

  .committee-section {
    margin-bottom: 1.5rem;
    padding: 0.8rem;
  }

  .member-photo {
    width: 80px;
    height: 80px;
    margin-bottom: 0.6rem;
  }

  .member-info p {
    font-size: 0.85rem;
  }
}

.skeleton-placeholder {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;
}
</style>
