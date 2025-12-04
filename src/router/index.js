import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/en',
      name: 'home-en',
      component: () => import('../views/HomeEn.vue')
    },
    {
      path: '/ja',
      name: 'home-ja',
      component: () => import('../views/HomeJa.vue')
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/Schedule.vue')
    },
    {
      path: '/en/schedule',
      name: 'schedule-en',
      component: () => import('../views/ScheduleEn.vue')
    },
    {
      path: '/ja/schedule',
      name: 'schedule-ja',
      component: () => import('../views/ScheduleJa.vue')
    },
    {
      path: '/submission',
      name: 'submission',
      component: () => import('../views/Submission.vue')
    },
    {
      path: '/en/submission',
      name: 'submission-en',
      component: () => import('../views/SubmissionEn.vue')
    },
    {
      path: '/ja/submission',
      name: 'submission-ja',
      component: () => import('../views/SubmissionJa.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/Registration.vue')
    },
    {
      path: '/en/registration',
      name: 'registration-en',
      component: () => import('../views/RegistrationEn.vue')
    },
    {
      path: '/ja/registration',
      name: 'registration-ja',
      component: () => import('../views/RegistrationJa.vue')
    },
    {
      path: '/committee',
      name: 'committee',
      component: () => import('../views/Committee.vue')
    },
    {
      path: '/en/committee',
      name: 'committee-en',
      component: () => import('../views/CommitteeEn.vue')
    },
    {
      path: '/ja/committee',
      name: 'committee-ja',
      component: () => import('../views/CommitteeJa.vue')
    },
    {
      path: '/transportation',
      name: 'transportation',
      component: () => import('../views/Transportation.vue')
    },
    {
      path: '/en/transportation',
      name: 'transportation-en',
      component: () => import('../views/TransportationEn.vue')
    },
    {
      path: '/ja/transportation',
      name: 'transportation-ja',
      component: () => import('../views/TransportationJa.vue')
    },
    {
      path: '/proceedings',
      name: 'proceedings',
      component: () => import('../views/Proceedings.vue')
    },
    {
      path: '/en/proceedings',
      name: 'proceedings-en',
      component: () => import('../views/ProceedingsEn.vue')
    },
    {
      path: '/ja/proceedings',
      name: 'proceedings-ja',
      component: () => import('../views/ProceedingsJa.vue')
    },
    {
      path: '/proceedings-list',
      name: 'ProceedingsList',
      component: () => import('../views/ProceedingsList.vue')
    },
    {
      path: '/en/proceedings-list',
      name: 'ProceedingsListEn',
      component: () => import('../views/ProceedingsListEn.vue')
    },
    {
      path: '/ja/proceedings-list',
      name: 'ProceedingsListJa',
      component: () => import('../views/ProceedingsListJa.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/en/contact',
      name: 'contact-en',
      component: () => import('../views/ContactEn.vue')
    },
    {
      path: '/ja/contact',
      name: 'contact-ja',
      component: () => import('../views/ContactJa.vue')
    },
    {
      path: '/historical',
      name: 'historical',
      component: () => import('../views/Historical.vue')
    },
    {
      path: '/en/historical',
      name: 'historical-en',
      component: () => import('../views/HistoricalEn.vue')
    },
    {
      path: '/ja/historical',
      name: 'historical-ja',
      component: () => import('../views/HistoricalJa.vue')
    },
    {
      path: '/historical/:year',
      name: 'conference-photos',
      component: () => import('../views/ConferencePhotos.vue')
    },
    {
      path: '/en/historical/:year',
      name: 'conference-photos-en',
      component: () => import('../views/ConferencePhotosEn.vue')
    },
    {
      path: '/ja/historical/:year',
      name: 'conference-photos-ja',
      component: () => import('../views/ConferencePhotosJa.vue')
    },
    {
      path: '/memory',
      name: 'memory',
      component: () => import('../views/Memory.vue')
    },
    {
      path: '/en/memory',
      name: 'memory-en',
      component: () => import('../views/MemoryEn.vue')
    },
    {
      path: '/ja/memory',
      name: 'memory-ja',
      component: () => import('../views/MemoryJa.vue')
    },
    // 信息查询
    {
      path: '/information-query',
      name: 'information-query',
      component: () => import('../views/InformationQuery.vue')
    },
    {
      path: '/en/information-query',
      name: 'information-query-en',
      component: () => import('../views/InformationQueryEn.vue')
    },
    {
      path: '/ja/information-query',
      name: 'information-query-ja',
      component: () => import('../views/InformationQueryJa.vue')
    }
  ]
})

export default router
