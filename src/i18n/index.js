import { createI18n } from 'vue-i18n'
import zh from '../locales/zh.json'
import en from '../locales/en.json'
import ja from '../locales/ja.json'

export default createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
    ja
  }
}) 