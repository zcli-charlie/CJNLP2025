<template>
  <div class="schedule-container">
    <div class="content-wrapper">
      <h1>会议日程</h1>

      <!-- 日程列表 -->
      <section
        v-for="schedule in scheduleList"
        :key="schedule.id"
        class="schedule-section"
      >
        <h2>📆 {{ schedule.title }}</h2>
        <div class="schedule-block">
          <div class="day-header">
            <h3>{{ formatDate(schedule.date) }}</h3>
            <p>{{ schedule.location }}</p>
          </div>

          <!-- 上午日程 -->
          <div
            v-if="getAgendaByMidday(schedule.agenda_list, 1).length > 0"
            class="time-period"
          >
            <div class="period-header">上午</div>
            <div class="schedule-table">
              <div
                v-for="agenda in getAgendaByMidday(schedule.agenda_list, 1)"
                :key="agenda.id"
                :class="[
                  'schedule-row',
                  agenda.is_special ? 'special-event' : '',
                ]"
              >
                <div class="time-cell">{{ agenda.time_range }}</div>
                <div class="content-cell" :class="{ 'has-chair': agenda.chair }">
                  <div class="event-title">{{ agenda.title }}</div>
                  <div v-if="agenda.chair" class="content-with-chair">
                    <div class="content-left">
                      <div v-if="agenda.description" class="event-description">
                        {{ agenda.description }}
                      </div>
                    </div>
                    <div class="content-right">
                      <div class="chair-info">{{ agenda.chair }}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="agenda.description" class="event-description">
                      {{ agenda.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 下午日程 -->
          <div
            v-if="getAgendaByMidday(schedule.agenda_list, 2).length > 0"
            class="time-period"
          >
            <div class="period-header">下午</div>
            <div class="schedule-table">
              <div
                v-for="agenda in getAgendaByMidday(schedule.agenda_list, 2)"
                :key="agenda.id"
                :class="[
                  'schedule-row',
                  agenda.is_special ? 'special-event' : '',
                ]"
              >
                <div class="time-cell">{{ agenda.time_range }}</div>
                <div class="content-cell" :class="{ 'has-chair': agenda.chair }">
                  <div class="event-title">{{ agenda.title }}</div>
                  <div v-if="agenda.chair" class="content-with-chair">
                    <div class="content-left">
                      <div v-if="agenda.description" class="event-description">
                        {{ agenda.description }}
                      </div>
                    </div>
                    <div class="content-right">
                      <div class="chair-info">{{ agenda.chair }}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="agenda.description" class="event-description">
                      {{ agenda.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无时间段日程 -->
          <div
            v-if="getAgendaByMidday(schedule.agenda_list, 0).length > 0"
            class="time-period"
          >
            <div class="period-header">其他</div>
            <div class="schedule-table">
              <div
                v-for="agenda in getAgendaByMidday(schedule.agenda_list, 0)"
                :key="agenda.id"
                :class="[
                  'schedule-row',
                  agenda.is_special ? 'special-event' : '',
                ]"
              >
                <div class="time-cell">{{ agenda.time_range }}</div>
                <div class="content-cell" :class="{ 'has-chair': agenda.chair }">
                  <div class="event-title">{{ agenda.title }}</div>
                  <div v-if="agenda.chair" class="content-with-chair">
                    <div class="content-left">
                      <div v-if="agenda.description" class="event-description">
                        {{ agenda.description }}
                      </div>
                    </div>
                    <div class="content-right">
                      <div class="chair-info">{{ agenda.chair }}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="agenda.description" class="event-description">
                      {{ agenda.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 静态日程数据（从 http://10.17.0.10:8211/endpoint/agenda/list 获取）
const scheduleListData = [
  {
    id: 8,
    title: "注册安排",
    title_en: "Registration Arrangements",
    title_jp: "登録手続きの案内",
    date: "2025-09-12",
    location: "酒店大堂一楼",
    location_en: "Hotel Lobby, First Floor",
    location_jp: "ホテルのロビー1階",
    agenda_list: [
      {
        id: 8,
        schedule_id: 8,
        time_range: "9:00-21:00",
        title: "会议注册",
        title_en: "Conference Registration",
        title_jp: "会議登録",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 0,
        order: 0,
        midday: 0,
      },
    ],
  },
  {
    id: 9,
    title: "会议日程 - 第一天",
    title_en: "Conference Schedule - Day One",
    title_jp: "会議スケジュール - 初日",
    date: "2025-09-13",
    location: "酒店二楼桃花源厅",
    location_en: "Peach Blossom Hall, Second Floor, Hotel",
    location_jp: "ホテル2階 桃花源ホール",
    agenda_list: [
      {
        id: 9,
        schedule_id: 9,
        time_range: "09:00-9:20",
        title: "开幕式",
        title_en: "Opening Ceremony",
        title_jp: "開会式",
        description: "主持人：李祖超",
        description_en: "Chair: Zuchao Li",
        description_jp: "司会：李祖超",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 10,
        schedule_id: 9,
        time_range: "09:20-9:45",
        title: "主题报告1",
        title_en: "Keynote Speech 1",
        title_jp: "基調講演1",
        description: "主讲人：赵海\n报告：Native Brain-like AI large model with SiFu learning",
        description_en: "Speaker: Hai Zhao\nReport: Native Brain-like AI large model with SiFu learning",
        description_jp: "講演者：赵海\n報告：Native Brain-like AI large model with SiFu learning",
        chair:"主持人：李祖超",
        chair_en:"Chair: Zuchao Li",
        chair_jp:"司会：李祖超",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 11,
        schedule_id: 9,
        time_range: "09:45-10:10",
        title: "主题报告2",
        title_en: "Keynote Speech 2",
        title_jp: "基調講演2",
        description: "主讲人：须藤克仁\n报告：Recent Activities in Simultaneous Speech Translation",
        description_en: "Speaker: Katsuhito Sudoh\nReport: Recent Activities in Simultaneous Speech Translation",
        description_jp: "講演者：须藤克仁\n報告：Recent Activities in Simultaneous Speech Translation",
        chair:"主持人：李祖超",
        chair_en:"Chair: Zuchao Li",
        chair_jp:"司会：李祖超",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 12,
        schedule_id: 9,
        time_range: "10:10-10:40",
        title: "茶歇",
        title_en: "Tea Break",
        title_jp: "ティーブレイク",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 1,
        order: 0,
        midday: 1,
      },
      {
        id: 13,
        schedule_id: 9,
        time_range: "10:40-11:05",
        title: "主题报告3",
        title_en: "Keynote Speech 3",
        title_jp: "基調講演3",
        description: "主讲人：钟承志\n报告：What Language Do Non-English-Centric Large Language Models Think in?",
        description_en: "Speaker: Chengzhi Zhong\nReport: What Language Do Non-English-Centric Large Language Models Think in?",
        description_jp: "講演者：钟承志\n報告：What Language Do Non-English-Centric Large Language Models Think in?",
        chair:"主持人：劉倩瑩",
        chair_en:"Chair: Qianying Liu",
        chair_jp:"司会：劉倩瑩",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 14,
        schedule_id: 9,
        time_range: "11:05-11:30",
        title: "主题报告4",
        title_en: "Keynote Speech 4",
        title_jp: "基調講演4",
        description: "主讲人：刘康\n报告：Shuttle between Symbolic Knowledge and Neural Parameters",
        description_en: "Speaker: Kang Liu\nReport: Shuttle between Symbolic Knowledge and Neural Parameters",
        description_jp: "講演者：刘康\n報告：Shuttle between Symbolic Knowledge and Neural Parameters",
        chair:"主持人：劉倩瑩",
        chair_en:"Chair: Qianying Liu",
        chair_jp:"司会：劉倩瑩",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 16,
        schedule_id: 9,
        time_range: "11:40-14:00",
        title: "午餐：酒店一楼，自助餐",
        title_en: "Lunch: Hotel First Floor, Buffet",
        title_jp: "昼食：ホテル1階、ビュッフェ形式",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 1,
        order: 0,
        midday: 1,
      },
      {
        id: 17,
        schedule_id: 9,
        time_range: "14:00-14:25",
        title: "主题报告5",
        title_en: "Keynote Speech 5",
        title_jp: "基調講演5",
        description: "主讲人：肖桐\n报告：Some Applications of ODE Methods in NLP",
        description_en: "Speaker: Tong Xiao\nReport: Some Applications of ODE Methods in NLP",
        description_jp: "講演者：肖桐\n報告：Some Applications of ODE Methods in NLP",
        chair:"主持人：赵阳",
        chair_en:"Chair: Yang Zhao",
        chair_jp:"司会：赵阳",
        is_special: 0,
        order: 0,
        midday: 2,
      },
      {
        id: 18,
        schedule_id: 9,
        time_range: "14:25-14:50",
        title: "主题报告6",
        title_en: "Keynote Speech 6",
        title_jp: "基調講演6",
        description: "主讲人：井佐原均\n报告：Natural Language Processing for Therapy, Counseling, and Patient Information Support",
        description_en: "Speaker: Hitoshi Isahara\nReport: Natural Language Processing for Therapy, Counseling, and Patient Information Support",
        description_jp: "講演者：井佐原均\n報告：Natural Language Processing for Therapy, Counseling, and Patient Information Support",
        chair:"主持人：赵阳",
        chair_en:"Chair: Yang Zhao",
        chair_jp:"司会：赵阳",
        is_special: 0,
        order: 0,
        midday: 2,
      },
      {
        id: 19,
        schedule_id: 9,
        time_range: "14:50-15:20",
        title: "茶歇 & Poster",
        title_en: "Tea Break & Poster Session",
        title_jp: "ティーブレイク & ポスター展示",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 1,
        order: 0,
        midday: 2,
      },
      {
        id: 20,
        schedule_id: 9,
        time_range: "15:20-15:45",
        title: "主题报告7",
        title_en: "Keynote Speech 7",
        title_jp: "基調講演7",
        description: "主讲人：劉倩瑩\n报告：7 Points to Tsinghua but 10 Points to 清华? Assessing Agentic Large Language Models in Multilingual National Bias",
        description_en: "Speaker: Qianying Liu\nReport: 7 Points to Tsinghua but 10 Points to 清华? Assessing Agentic Large Language Models in Multilingual National Bias",
        description_jp: "講演者：劉倩瑩\n報告：7 Points to Tsinghua but 10 Points to 清华? Assessing Agentic Large Language Models in Multilingual National Bias",
        chair:"主持人：林鸿宇",
        chair_en:"Chair: Hongyu Lin",
        chair_jp:"司会：林鸿宇",
        is_special: 0,
        order: 0,
        midday: 2,
      },
      {
        id: 21,
        schedule_id: 9,
        time_range: "15:45-16:10",
        title: "主题报告8",
        title_en: "Keynote Speech 8",
        title_jp: "基調講演8",
        description: "主讲人：赵阳\n报告：From Text Lines to Full Pages: Text Image Machine Translation for Multiple Scenarios",
        description_en: "Speaker: Yang Zhao\nReport: From Text Lines to Full Pages: Text Image Machine Translation for Multiple Scenarios",
        description_jp: "講演者：赵阳\n報告：From Text Lines to Full Pages: Text Image Machine Translation for Multiple Scenarios",
        chair:"主持人：林鸿宇",
        chair_en:"Chair: Hongyu Lin",
        chair_jp:"司会：林鸿宇",
        is_special: 0,
        order: 0,
        midday: 2,
      },
      {
        id: 23,
        schedule_id: 9,
        time_range: "16:40-17:30",
        title: "Panel环节",
        title_en: "Panel",
        title_jp: "Panel",
        description: "嘉宾:张家俊、韩先培、程飞、須藤克仁\n主持人：张倬胜",
        description_en: "Speaker: Jiajun Zhang, Xianpei Han, Fei Cheng, Katsuhito Sudoh\nChair: Zhuosheng Zhang",
        description_jp: "講演者：张家俊、韩先培、程飞、須藤克仁\n司会：張倬勝",
        is_special: 1,
        order: 0,
        midday: 2,
      },
      {
        id: 24,
        schedule_id: 9,
        time_range: "18:00-20:00",
        title: "欢迎晚宴",
        title_en: "Welcome Banquet",
        title_jp: "歓迎夕食会",
        description: "酒店大堂一楼包房",
        description_en: "Private Room, Hotel Lobby First Floor",
        description_jp: "ホテルロビー1階の個室",
        is_special: 0,
        order: 0,
        midday: 2,
      },
    ],
  },
  {
    id: 12,
    title: "会议日程 - 第二天",
    title_en: "Conference Schedule - Day Two",
    title_jp: "会議スケジュール - 2日目",
    date: "2025-09-14",
    location: "会议中心二楼，桃花源厅",
    location_en: "Peach Blossom Hall, Second Floor, Conference Center",
    location_jp: "会議センター2階、桃花源ホール",
    agenda_list: [
      {
        id: 25,
        schedule_id: 12,
        time_range: "09:00-9:25",
        title: "主题报告9",
        title_en: "Keynote Speech 9",
        title_jp: "基調講演9",
        description: "主讲人：中岩浩巳\n报告：Data Scientist Development Project through Academic-Industrial Collaboration",
        description_en: "Speaker: Hiromi Nakaiwa\nReport: Data Scientist Development Project through Academic-Industrial Collaboration",
        description_jp: "講演者：中岩浩巳\n報告：Data Scientist Development Project through Academic-Industrial Collaboration",
        chair:"主持人：須藤克仁",
        chair_en:"Chair: Katsuhito Sudoh",
        chair_jp:"司会：須藤克仁",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 26,
        schedule_id: 12,
        time_range: "09:25-9:50",
        title: "主题报告10",
        title_en: "Keynote Speech 10",
        title_jp: "基調講演10",
        description: "主讲人：陈文亮\n报告：UAQFact: Evaluating Factual Knowledge Utilization of LLMs on Unanswerable Questions",
        description_en: "Speaker: Wenliang Chen\nReport: UAQFact: Evaluating Factual Knowledge Utilization of LLMs on Unanswerable Questions",
        description_jp: "講演者：陈文亮\n報告：UAQFact: Evaluating Factual Knowledge Utilization of LLMs on Unanswerable Questions",
        chair:"主持人：須藤克仁",
        chair_en:"Chair: Katsuhito Sudoh",
        chair_jp:"司会：須藤克仁",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 27,
        schedule_id: 12,
        time_range: "09:50-10:20",
        title: "茶歇",
        title_en: "Tea Break",
        title_jp: "ティーブレイク",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 1,
        order: 0,
        midday: 1,
      },
      {
        id: 28,
        schedule_id: 12,
        time_range: "10:20-10:45",
        title: "主题报告11",
        title_en: "Keynote Speech 11",
        title_jp: "基調講演11",
        description: "主讲人：程飞\n报告：SpeechIQ: Speech-Agentic Intelligence Quotient Across Cognitive Levels in Voice Understanding by Large Language Models",
        description_en: "Speaker: Fei Cheng\nReport: SpeechIQ: Speech-Agentic Intelligence Quotient Across Cognitive Levels in Voice Understanding by Large Language Models",
        description_jp: "講演者：程飞\n報告：SpeechIQ: Speech-Agentic Intelligence Quotient Across Cognitive Levels in Voice Understanding by Large Language Models",
        chair:"主持人：陈文亮",
        chair_en:"Chair: Wenliang Chen",
        chair_jp:"司会：陈文亮",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 29,
        schedule_id: 12,
        time_range: "10:45-11:10",
        title: "主题报告12",
        title_en: "Keynote Speech 12",
        title_jp: "基調講演12",
        description: "主讲人：李祖超\n报告：Towards Local Large Language Models",
        description_en: "Speaker: Zuchao Li\nReport: Towards Local Large Language Models",
        description_jp: "講演者：李祖超\n報告：Towards Local Large Language Models",
        chair:"主持人：陈文亮",
        chair_en:"Chair: Wenliang Chen",
        chair_jp:"司会：陈文亮",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 31,
        schedule_id: 12,
        time_range: "11:10-11:40",
        title: "闭幕式",
        title_en: "Closing Ceremony",
        title_jp: "閉会式",
        description: "主持人：李祖超",
        description_en: "Chair: Zuchao Li",
        description_jp: "司会：李祖超",
        is_special: 0,
        order: 0,
        midday: 1,
      },
      {
        id: 32,
        schedule_id: 12,
        time_range: "11:40-14:00",
        title: "午餐：酒店一楼，自助餐",
        title_en: "Lunch: Buffet, First Floor, Hotel",
        title_jp: "昼食：ホテル1階、ビュッフェ形式",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 1,
        order: 0,
        midday: 1,
      },
    ],
  },
  {
    id: 13,
    title: "会议日程 - 第三天",
    title_en: "Conference Schedule - Day Three",
    title_jp: "会議スケジュール - 3日目",
    date: "2025-09-15",
    location: "会议中心二楼，桃花源厅",
    location_en: "Peach Blossom Hall, Second Floor, Conference Center",
    location_jp: "会議センター2階、桃花源ホール",
    agenda_list: [
      {
        id: 35,
        schedule_id: 13,
        time_range: "9:00-16:30",
        title: "企业参观",
        title_en: "Company Visit",
        title_jp: "企業見学",
        description: "",
        description_en: "",
        description_jp: "",
        is_special: 0,
        order: 0,
        midday: 2,
      },
    ],
  },
];

const scheduleList = ref(scheduleListData);

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日 星期${weekday}`;
};

// 根据上下午筛选日程
const getAgendaByMidday = (agendaList, midday) => {
  return agendaList.filter((agenda) => agenda.midday === midday);
};
</script>

<style scoped>
.schedule-container {
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

.schedule-section {
  margin-bottom: 3rem;
}

.schedule-block {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.day-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.day-header h3 {
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 0.25rem;
}

.day-header p {
  color: #666;
  margin: 0;
}

.time-period {
  margin-bottom: 2rem;
}

.period-header {
  background: #e6f7ff;
  color: #1890ff;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.schedule-table {
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.schedule-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  border-bottom: 1px solid #eee;
}

.schedule-row:last-child {
  border-bottom: none;
}

.time-cell {
  padding: 1rem;
  background: #fafafa;
  font-weight: 500;
  border-right: 1px solid #eee;
  display: flex;
  align-items: center;
}

.content-cell {
  padding: 1rem;
  color: #333;
}

.content-cell.has-chair {
  padding: 0;
}

.content-with-chair {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.content-left {
  flex: 1;
  min-width: 0;
}

.content-right {
  width: 180px;
  flex-shrink: 0;
  border-left: 1px solid #eee;
  padding-left: 1rem;
  display: flex;
  align-items: flex-start;
}

.chair-info {
  color: #1890ff;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.5;
}

.event-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  padding: 1rem 1rem 0.5rem 1rem;
}

.content-cell.has-chair .event-title {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0;
}

.event-description {
  color: #666;
  white-space: pre-wrap;
}

.break-row {
  background: #f8f9fa;
}

.break-row .content-cell {
  color: #666;
  font-style: italic;
}

.special-event {
  font-style: italic;
}

.special-event .event-title {
  color: inherit;
}

.speaker {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.skeleton-placeholder {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 70%;
}

.speaker .skeleton-placeholder {
  width: 50%;
  height: 14px;
}

.speaker .skeleton-placeholder:last-child {
  width: 30%;
}

.report-title .skeleton-placeholder {
  width: 90%;
}

@media (max-width: 768px) {
  .schedule-container {
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

  .schedule-section {
    margin-bottom: 2rem;
  }

  .schedule-block {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .day-header {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }

  .time-period {
    margin-bottom: 1.5rem;
  }

  .period-header {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .schedule-row {
    grid-template-columns: 90px 1fr;
  }

  .time-cell,
  .content-cell {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .event-title {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }

  .event-description {
    font-size: 0.85rem;
  }

  .content-with-chair {
    flex-direction: column;
    gap: 0.8rem;
  }

  .content-right {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
    padding-left: 0;
    padding-top: 0.8rem;
  }

  .content-cell.has-chair .event-title {
    padding: 0.8rem 0.8rem 0.5rem 0.8rem;
  }

  .content-with-chair {
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .schedule-container {
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

  .schedule-block {
    padding: 0.8rem;
  }

  .schedule-row {
    grid-template-columns: 80px 1fr;
  }

  .time-cell,
  .content-cell {
    padding: 0.6rem;
    font-size: 0.85rem;
  }

  .event-title {
    font-size: 0.9rem;
  }

  .event-description {
    font-size: 0.8rem;
  }

  .content-with-chair {
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.6rem;
  }

  .content-right {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
    padding-left: 0;
    padding-top: 0.6rem;
  }

  .content-cell.has-chair .event-title {
    padding: 0.6rem 0.6rem 0.4rem 0.6rem;
  }

  .chair-info {
    font-size: 0.85rem;
  }

  .period-header {
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
  }
}
</style>
