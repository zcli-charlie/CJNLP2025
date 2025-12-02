<template>
  <div class="registration-container">
    <div class="content-wrapper">
      <h1>会議登録</h1>

      <!-- 登録説明 -->
      <section class="registration-info">
        <h2>📝 登録説明</h2>
        <p>参加者の皆様は、まず登録料をお支払いいただき、ホテル情報をご確認の上、以下の登録フォームにご記入ください。</p>
        <p>複数名で登録される場合は、全員の氏名をご記入ください。</p>
      </section>

      <!-- 登録料 -->
      <section class="registration-fees">
        <h2>💰 登録料</h2>
        <div class="fees-table">
          <div class="table-row header">
            <div class="cell">登録区分</div>
            <div class="cell">登録料</div>
          </div>
          <div class="table-row" v-for="(fee, index) in registrationFees" :key="index">
            <div class="cell">{{ fee.type }}</div>
            <div class="cell">{{ fee.fee }}</div>
          </div>
        </div>

        <div class="payment-methods">
          <h3>💳 支払方法</h3>
          <div class="payment-method" v-for="(method, index) in paymentMethods" :key="index">
            <h4>{{ method.icon }} {{ method.title }}</h4>
            <p v-for="(detail, dIndex) in method.details" :key="dIndex">
              <strong v-if="detail.label">{{ detail.label }}：</strong>{{ detail.value }}
            </p>
          </div>
        </div>
      </section>

      <!-- ホテル情報 -->
      <section class="hotel-info">
        <h2>🏨 ホテル情報</h2>
        <p>{{ hotelInfo.description }}</p>

        <div class="hotel-table">
          <div class="hotel-row header">
            <div class="hotel-cell">ホテル名</div>
            <div class="hotel-cell">Aタワーデラックスシングル</div>
            <div class="hotel-cell">Aタワーデラックスツイン</div>
            <div class="hotel-cell">Bタワーシングル/ツイン</div>
            <div class="hotel-cell">ホテル住所</div>
          </div>
          <div class="hotel-row" v-for="(hotel, index) in hotelInfo.hotels" :key="index">
            <div class="hotel-cell" data-label="ホテル名">{{ hotel.name }}</div>
            <div class="hotel-cell" v-for="(room, rIndex) in hotel.rooms" :key="rIndex" :data-label="room.type">
              {{ room.price }}
            </div>
            <div class="hotel-cell" data-label="ホテル住所">{{ hotel.address }}</div>
          </div>
        </div>

        <!-- ホテル操作ボタン -->
        <div class="hotel-actions">
          <button 
            class="action-btn primary" 
            @click="toggleRegistrationForm"
            :class="{ 'active': showRegistrationForm }"
          >
            📝 {{ showRegistrationForm ? 'フォームを閉じる' : '会議登録' }}
          </button>
          <button 
            class="action-btn primary" 
            @click="toggleInvoiceForm"
            :class="{ 'active': showInvoiceForm }"
          >
            📄 {{ showInvoiceForm ? 'フォームを閉じる' : '支払い登録&請求書申請' }}
          </button>
          <button class="action-btn secondary" @click="goToInformationQuery">
            🔍 情報照会
          </button>
        </div>

        <!-- 請求書申請フォーム -->
        <div class="invoice-form-container" v-show="showInvoiceForm">
          <div class="invoice-form">
            <h3>📄 請求書申請</h3>
            <form @submit.prevent="submitInvoiceApplication">
            
              <div class="form-group">
                <label for="invoiceName">姓名 *</label>
                <input 
                  type="text" 
                  id="invoiceName" 
                  v-model="invoiceForm.name" 
                  required 
                  placeholder="请输入姓名"
                />
              </div>

              <div class="form-group">
                <label for="invoiceEmail">連絡先メール *</label>
                <input 
                  type="email" 
                  id="invoiceEmail" 
                  v-model="invoiceForm.email" 
                  required 
                  placeholder="連絡先メールを入力してください"
                />
              </div>
              
              <div class="form-group">
                <label for="invoicePhone">連絡先電話</label>
                <input 
                  type="tel" 
                  id="invoicePhone" 
                  v-model="invoiceForm.phone" 
                  placeholder="連絡先電話を入力してください"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceTitle">請求書タイトル *</label>
                <input 
                  type="text" 
                  id="invoiceTitle" 
                  v-model="invoiceForm.invoiceTitle" 
                  required 
                  placeholder="請求書タイトルを入力してください"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceCode">納税者番号 *</label>
                <input 
                  type="text" 
                  id="invoiceCode" 
                  v-model="invoiceForm.invoiceCode" 
                  required 
                  placeholder="納税者番号を入力してください"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceFile">支払証明書 *</label>
                <div class="file-upload-container">
                  <input 
                    type="file" 
                    id="invoiceFile" 
                    @change="handleFileChange"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    required
                  />
                  <div class="file-upload-tip">
                    jpg/png/pdf/doc/docx形式をサポート、ファイルサイズは10MB以下
                  </div>
                  <div v-if="invoiceForm.invoiceFile" class="file-success">
                    ✅ ファイルアップロード成功
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="submit-btn" 
                  :disabled="invoiceSubmitting || !invoiceForm.invoiceFile"
                >
                  {{ invoiceSubmitting ? '送信中...' : '申請提出' }}
                </button>
                <button 
                  type="button" 
                  class="cancel-btn" 
                  @click="cancelInvoiceApplication"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- 登録フォーム -->
      <div class="registration-form-container" v-show="showRegistrationForm">
        <section class="registration-form">
          <h2>✍️ 登録情報入力</h2>
          <form @submit.prevent="handleSubmit">
          <!-- 基本情報 -->
          <div class="form-section">
            <h3>👤 基本情報</h3>
            <div class="form-group">
              <label for="name">氏名</label>
              <input type="text" id="name" v-model="form.name" required>
            </div>
            <div class="form-group">
              <label for="email">メールアドレス</label>
              <input type="email" id="email" v-model="form.email" required @blur="checkEmail">
            </div>
            <div class="form-group">
              <label for="phone">電話番号</label>
              <input type="tel" id="phone" v-model="form.phone" required>
            </div>
            <div class="form-group">
              <label for="organization">所属機関</label>
              <input type="text" id="organization" v-model="form.organization" required>
            </div>
            <div class="form-group">
              <label for="nationality">代表方</label>
              <select id="nationality" v-model="form.nationality">
                <option value="">代表方を選択してください</option>
                <option :value="0">中国側</option>
                <option :value="1">日本側</option>
              </select>
            </div>
            <div class="form-group">
              <label for="accommodation">宿泊タイプ</label>
              <select id="accommodation" v-model="form.accommodation" required>
                <option value="">宿泊タイプを選択してください</option>
                <option :value="1">デラックスシングル</option>
                <option :value="2">デラックスツイン</option>
                <option :value="3">スタンダードシングル/ツイン</option>
                <option :value="4">自己手配</option>
              </select>
            </div>
            <!-- <div class="form-group">
              <label for="isInvoice">請求書</label>
              <select id="isInvoice" v-model="form.isInvoice" required>
                <option value="">請求書を選択してください</option>
                <option :value="1">はい</option>
                <option :value="0">いいえ</option>
              </select>
            </div> -->
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceTitle">請求書タイトル</label>
              <input type="text" id="invoiceTitle" v-model="form.invoiceTitle" placeholder="請求書タイトルを入力してください">
            </div>
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceCode">請求書コード</label>
              <input type="text" id="invoiceCode" v-model="form.invoiceCode" placeholder="請求書コードを入力してください">
            </div>
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceEmail">請求書メール</label>
              <input type="email" id="invoiceEmail" v-model="form.invoiceEmail" placeholder="請求書メールを入力してください">
            </div>
            <div class="form-group">
              <label for="travelInfo">行程情報</label>
              <textarea id="travelInfo" v-model="form.travelInfo" placeholder="行程情報を入力してください"></textarea>
            </div>
          </div>

          <!-- 参加情報 -->
          <div class="form-section">
            <h3>🎯 参加情報</h3>
            <div class="form-group">
              <label for="title">敬称</label>
              <select id="title" v-model="form.title" required @change="handleTitleChange">
                <option value="">敬称を選択してください</option>
                <option :value="1">教授</option>
                <option :value="2">准教授</option>
                <option :value="3">助教</option>
                <option :value="4">研究員</option>
                <option :value="5">准研究員</option>
                <option :value="6">助手研究員</option>
                <option :value="7">博士</option>
                <option :value="8">氏</option>
                <option :value="9">女史</option>
                <option :value="10">その他</option>
              </select>
              <input
                v-if="form.title === 10"
                type="text"
                v-model="form.customTitle"
                placeholder="敬称を入力してください"
                class="custom-title-input"
              >
            </div>
            <div class="form-group">
              <label for="isSpeech">発表</label>
              <select id="isSpeech" v-model="form.isSpeech" required>
                <option value="">発表を選択してください</option>
                <option :value="1">はい</option>
                <option :value="0">いいえ</option>
              </select>
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="paper">発表タイトル</label>
              <input type="text" id="paper" v-model="form.paper" placeholder="発表タイトルを入力してください">
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="paperDescription">報告説明</label>
              <textarea id="paperDescription" v-model="form.paperDescription" placeholder="報告説明を入力してください"></textarea>
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="presentationType">発表形式（希望）</label>
              <select id="presentationType" v-model="form.presentationType" required>
                <option value="">発表形式を選択してください</option>
                <option :value="1">口頭発表</option>
                <option :value="2">ポスター発表</option>
              </select>
            </div>
          </div>

          <!-- 送信ボタン -->
          <div class="form-actions">
            <button type="submit" class="submit-btn">登録する</button>
          </div>
        </form>
        </section>
      </div>

      <!-- 招待状ダウンロード -->
      <section class="invitation-section">
        <h2>📄 招待状ダウンロード</h2>
        <div class="invitation-content">
          <p>経費精算等に必要な招待状をダウンロードしてください。</p>
          <div class="download-buttons">
            <a href="/uploads/accept-files/down/CJNLP2025会议邀请函.pdf" class="download-btn" download>
              <span class="icon">📥</span>
              中国語招待状
            </a>
            <a href="/uploads/accept-files/down/Invitation%20Letter%20for%20CJNLP2025.pdf" class="download-btn" download>
              <span class="icon">📥</span>
              英語招待状
            </a>
          </div>
        </div>
      </section>

      <!-- 注意事項 -->
      <section class="faq-section">
        <h2>❓ {{ faqInfo.title }}</h2>
        <div class="faq-content">
          <p v-for="(item, index) in faqInfo.items" :key="index">{{ index + 1 }}. {{ item }}</p>
        </div>
      </section>
    </div>
    
    <!-- 送信中モーダルダイアログ -->
    <el-dialog
      v-model="isSubmitting"
      title="送信中"
      width="300px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div style="text-align: center; padding: 20px 0;">
        <div style="margin-bottom: 16px;">
          <i class="el-icon-loading" style="font-size: 32px; color: #409eff; animation: rotating 2s linear infinite;"></i>
        </div>
        <div style="font-size: 16px; color: #606266;">
          登録情報を送信中です。お待ちください...
        </div>
      </div>
    </el-dialog>
    
    <!-- 登録成功モーダルダイアログ -->
    <el-dialog
      v-model="showSuccessModal"
      title="登録成功"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div style="text-align: center; padding: 20px 0;">
        <div style="margin-bottom: 20px;">
          <i class="el-icon-success" style="font-size: 48px; color: #67c23a;"></i>
        </div>
        <div style="font-size: 18px; color: #303133; margin-bottom: 16px; font-weight: 500;">
          おめでとうございます！登録成功
        </div>
        <div style="font-size: 14px; color: #606266; line-height: 1.5;">
          お客様の登録情報が正常に送信されました。お申し込みを迅速に処理いたします。
        </div>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="showSuccessModal = false" style="padding: 12px 32px;">
            確認
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <SliderCaptcha ref="captchaRef" lang="ja"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import {ElMessage, ElMessageBox,ElLoading, ElDialog} from "element-plus";
import {postRequest, getRequest} from "../utils/request.js";
import SliderCaptcha from '../components/SliderCaptcha.vue'
import { postUploadApi } from '../api/index'

const router = useRouter();
const captchaRef = ref(null);
const invoiceFormRef = ref(null);

// 請求書申請関連状態
const showInvoiceForm = ref(false);
const invoiceSubmitting = ref(false);
const loading = ref(false);

// 送信状態制御
const isSubmitting = ref(false);

// 成功モーダル制御
const showSuccessModal = ref(false);

// 登録フォーム関連状態
const showRegistrationForm = ref(true);

// 請求書申請フォームデータ
const invoiceForm = ref({
  name: "",
  email: "",
  phone: "",
  invoiceTitle: "",
  invoiceCode: "",
  invoiceFile: ""
});

// 請求書申請フォーム検証ルール
const invoiceRules = {
  name: [
    { required: true, message: "申請者氏名を入力してください", trigger: "blur" }
  ],
  email: [
    { required: true, message: "連絡先メールを入力してください", trigger: "blur" },
    { type: "email", message: "正しいメール形式を入力してください", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "連絡先電話を入力してください", trigger: "blur" }
  ],
  invoiceTitle: [
    { required: true, message: "請求書タイトルを入力してください", trigger: "blur" }
  ],
  taxpayerId: [
    { required: true, message: "納税者番号を入力してください", trigger: "blur" }
  ],
  invoiceType: [
    { required: true, message: "請求書タイプを選択してください", trigger: "change" }
  ],
  address: [
    { required: true, message: "郵送先住所を入力してください", trigger: "blur" }
  ]
};
// 登録料データ
const registrationFees = [
  { type: '中国側参加者', fee: '2000元/人' },
  { type: '日本側参加者', fee: '1000元/人' }
]

// 支払方法データ
const paymentMethods = [
  {
    icon: '🏦',
    title: '銀行振込',
    details: [
      { label: '口座名義', value: '中国中文情報学会' },
      { label: '口座番号', value: '0200004509014415619' },
      { label: '取引銀行', value: '工商銀行北京市海淀西区支店' },
      { label: '備考', value: 'CJNLP+氏名（複数名の場合は全員の氏名をご記入ください）' }
    ]
  },
  {
    icon: '📱',
    title: 'Alipay送金',
    details: [
      { label: '口座名義', value: '中国中文情報学会' },
      { label: 'アカウント', value: 'cips_pay@163.com' },
      { label: '備考', value: 'CJNLP+氏名（複数名の場合は全員の氏名をご記入ください）' }
    ]
  },
  {
    icon: '💵',
    title: '現地支払',
    details: [
      { value: '現金またはカード決済（領収書は後日郵送）' }
    ]
  },
  {
    icon: '🧾',
    title: '領収書',
    details: [
      { value: '領収書が必要な場合は、登録フォームに宛名と納税者識別番号をご記入ください' }
    ]
  }
]

// ホテル情報データ
const hotelInfo = {
  description: '会議指定ホテルの宿泊料金は以下の通りです（費用は自己負担となります）。',
  hotels: [
    {
      name: '空港桃花嶺ホテル',
      address: '湖北省宜昌市猇亭区機場路29号',
      rooms: [
        { type: 'Aタワーデラックスシングル', price: '330元' },
        { type: 'Aタワーデラックスツイン', price: '330元' },
        { type: 'Bタワーシングル/ツイン', price: '260元' }
      ]
    }
  ]
}

// 注意事項データ
const faqInfo = {
  title: '注意事項',
  items: [
    '9月は宜昌の観光ハイシーズンのため、ホテルの予約が大変混み合います。8月31日までに会議登録とホテル予約を完了してください。',
    '各部屋タイプの数に限りがあるため、登録順に部屋を割り当てさせていただきます。ご不便をおかけしますが、ご了承ください。'
  ]
}

// フォームデータ
const form = ref({
  name: '',
  email: '',
  phone: '',
  organization: '',
  accommodation: 1,
  title: 1,
  customTitle: '',
  isSpeech: 1,
  paperDescription: '',
  paper: '',
  presentationType: 1,
  isInvoice: 0,
  invoiceTitle: '',
  invoiceCode: '',
  invoiceEmail: '',
  nationality: 0,
  travelInfo: ''
})

// 敬称選択の処理
const handleTitleChange = () => {
  if (form.value.title !== 'other') {
    form.value.customTitle = ''
  }
}

// 請求書フォームの表示切り替え
const toggleInvoiceForm = () => {
  showInvoiceForm.value = !showInvoiceForm.value;
  if (showInvoiceForm.value) {
    // 展開時にフォームをリセット
    resetInvoiceForm();
    // 登録フォームを閉じる
    showRegistrationForm.value = false;
  }
};

// 登録フォームの表示切り替え
const toggleRegistrationForm = () => {
  showRegistrationForm.value = !showRegistrationForm.value;
  if (showRegistrationForm.value) {
    // 請求書フォームを閉じる
    showInvoiceForm.value = false;
  }
};

// 情報照会ページへ移動
const goToInformationQuery = () => {
  router.push('/information-query');
};

// ファイルアップロード処理
const handleFileChange = async (event) => {
  const params = new FormData()
  params.append('file', event.target.files[0])
  params.append('type', '4')
  loading.value = true
  
  // メールチェック
  // let res = await getRequest("/registration/check_email", {
  //   email: invoiceForm.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }
  
  try {
    const response = await postUploadApi(params);
    loading.value = false;
    invoiceForm.value.invoiceFile = response;
    ElMessage.success({ message: 'アップロード成功' });
  } catch (err) {
    loading.value = false;
    ElMessage.error('アップロード失敗');
  }
};

// 請求書フォームリセット
const resetInvoiceForm = () => {
  invoiceForm.value = {
    name: "",
    email: "",
    phone: "",
    invoiceTitle: "",
    invoiceCode: "",
    invoiceFile: ""
  };
};

// 請求書申請キャンセル
const cancelInvoiceApplication = () => {
  showInvoiceForm.value = false;
  resetInvoiceForm();
};

// 請求書申請提出
const submitInvoiceApplication = async () => {
  try {
    // フォーム検証
    if (!invoiceForm.value.email) {
      ElMessage.error('連絡先メールを入力してください');
      return;
    }
    if (!invoiceForm.value.name) {
      ElMessage.error('姓名を入力してください');
      return;
    }
    if (!invoiceForm.value.invoiceTitle) {
      ElMessage.error('請求書タイトルを入力してください');
      return;
    }
    if (!invoiceForm.value.invoiceCode) {
      ElMessage.error('納税者番号を入力してください');
      return;
    }
    if (!invoiceForm.value.invoiceFile) {
      ElMessage.error('支払証明書をアップロードしてください');
      return;
    }
    
    invoiceSubmitting.value = true;
    
    // 請求書申請提出
    await postRequest('/invoice/add', invoiceForm.value);
    
    ElMessage.success('請求書申請が正常に提出されました');
    showInvoiceForm.value = false;
    resetInvoiceForm();
    
  } catch (error) {
    console.error('請求書申請失敗:', error);
    ElMessage.error('請求書申請に失敗しました。しばらくしてから再度お試しください');
  } finally {
    invoiceSubmitting.value = false;
  }
};



// フォーム送信
const handleSubmit = async () => {
  // 检验数据
  if(!form.value.name){
    ElMessage.error({ message: 'お名前を入力してください' })
  }
  if(!form.value.email){
    ElMessage.error({ message: 'メールアドレスを入力してください' })
  }

  if (form.value.isInvoice === 1 && !form.value.invoiceTitle) {
    ElMessage.error({ message: '請求書タイトルを入力してください' })
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceCode) {
    ElMessage.error({ message: '請求書コードを入力してください' })
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceEmail) { 
    ElMessage.error({ message: '請求書メールを入力してください' })
  }

  // 先检查邮箱是否存在
  // let res = await getRequest("/registration/check_email", {
  //   email: form.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }

  // 送信中モーダルダイアログを表示
  isSubmitting.value = true;
  postRequest('/registration/add', form.value).then(res=>{
    isSubmitting.value = false;
    showSuccessModal.value = true;
    form.value = {
      name: '',
      email: '',
      phone: '',
      organization: '',
      accommodation: 1,
      title: 1,
      customTitle: '',
      isSpeech: 1,
      paperDescription: '',
      paper: '',
      presentationType: 1,
      isInvoice: 0,
      invoiceTitle: '',
      invoiceCode: '',
      invoiceEmail: '',
      nationality: 1,
      travelInfo: ''
    }
  }).catch(err=>{
    console.log(err)
    ElMessage.error({ message: '登録失敗' })
    isSubmitting.value = false;
  })
}

const checkEmail = async () => {
  let res = await getRequest("/registration/check_email", {
    email: form.value.email,
  });
  if (res && res.id) {
    form.value.nationality = res.nationality
  }
}
</script>

<style scoped>
.registration-container {
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
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h4 {
  font-size: 1.1rem;
  color: #555;
  margin: 1rem 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.registration-info {
  margin-bottom: 2rem;
}

.registration-fees {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.fees-table {
  margin: 1.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #ddd;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.header {
  background: #f0f0f0;
  font-weight: bold;
}

.cell {
  padding: 0.75rem;
  text-align: center;
}

.payment-methods {
  margin-top: 2rem;
}

.payment-method {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
}

.payment-method p {
  margin: 0.5rem 0;
  color: #666;
}

.form-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
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
input[type="email"],
input[type="tel"],
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: none;
  height: 100px;
  overflow-y: auto;
  box-sizing: border-box;
  line-height: 1.2;
}

select {
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2rem;
}

select:focus {
  outline: none;
  border-color: #1890ff;
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

.faq-section {
  margin-top: 3rem;
}

.faq-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.faq-content p {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.faq-content p:last-child {
  margin-bottom: 0;
}

.hotel-info {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.hotel-table {
  margin: 1.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.hotel-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 2fr;
  border-bottom: 1px solid #ddd;
}

.hotel-row:last-child {
  border-bottom: none;
}

.hotel-row.header {
  background: #f0f0f0;
  font-weight: bold;
}

.hotel-cell {
  padding: 0.75rem;
  text-align: center;
}

@media (max-width: 768px) {
  .hotel-row {
    grid-template-columns: 1fr;
  }

  .hotel-cell {
    border-bottom: 1px solid #eee;
    padding: 0.75rem;
    text-align: left;
  }

  .hotel-row.header {
    display: none;
  }

  .hotel-row:not(.header) .hotel-cell:before {
    content: attr(data-label);
    font-weight: bold;
    display: inline-block;
    width: 40%;
    margin-right: 10px;
  }

  .hotel-row:last-child .hotel-cell:last-child {
    border-bottom: none;
  }
}

.custom-title-input {
  margin-top: 0.5rem;
}

.hotel-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: #1890ff;
  color: white;
}

.action-btn.primary:hover {
  background: #40a9ff;
}

.action-btn.secondary {
  background: #52c41a;
  color: white;
}

.action-btn.secondary:hover {
  background: #73d13d;
}

.action-btn.active {
  background: #40a9ff;
  transform: scale(0.98);
}

.invoice-form-container,
.registration-form-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.invoice-form h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 0.5rem;
}

.invoice-form .form-group {
  margin-bottom: 1.5rem;
}

.invoice-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

.invoice-form input[type="text"],
.invoice-form input[type="email"],
.invoice-form input[type="tel"],
.invoice-form input[type="file"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.invoice-form input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.file-upload-container {
  position: relative;
}

.file-upload-tip {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
}

.file-success {
  font-size: 0.9rem;
  color: #52c41a;
  margin-top: 0.5rem;
  font-weight: 500;
}

.invoice-form .form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #e6e6e6;
  border-color: #bfbfbf;
}

.submit-btn:disabled {
  background: #f5f5f5;
  color: #bfbfbf;
  cursor: not-allowed;
}

.submit-btn:disabled:hover {
  background: #f5f5f5;
}

.invitation-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.invitation-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.invitation-content p {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;
}

.download-btn:hover {
  background: #40a9ff;
}

.download-btn .icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .download-buttons {
    flex-direction: column;
  }

  .download-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .registration-container {
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
    margin: 1rem 0 0.5rem;
  }

  h4 {
    font-size: 1rem;
    margin: 0.8rem 0 0.4rem;
  }

  .registration-info,
  .registration-fees,
  .hotel-info,
  .registration-form,
  .invitation-section,
  .faq-section {
    margin-bottom: 1.5rem;
  }

  .fees-table,
  .hotel-table {
    margin: 1rem 0;
  }

  .table-row,
  .hotel-row {
    grid-template-columns: 1fr;
  }

  .cell,
  .hotel-cell {
    padding: 0.6rem;
    text-align: left;
  }

  .table-row.header,
  .hotel-row.header {
    display: none;
  }

  .table-row:not(.header) .cell:before,
  .hotel-row:not(.header) .hotel-cell:before {
    content: attr(data-label);
    font-weight: bold;
    display: inline-block;
    width: 40%;
    margin-right: 10px;
  }

  .payment-method {
    margin: 1rem 0;
    padding: 0.8rem;
  }

  .payment-method p {
    margin: 0.4rem 0;
    font-size: 0.9rem;
  }

  .form-section {
    margin: 1.5rem 0;
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .form-group {
    margin-bottom: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  label {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
    display: block;
    width: 100%;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select {
    width: 100%;
    box-sizing: border-box;
    font-size: 0.9rem;
    padding: 0.4rem;
  }

  .custom-title-input {
    width: 100%;
    box-sizing: border-box;
    margin-top: 0.5rem;
  }

  .submit-btn {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .download-buttons {
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
    width: 100%;
  }

  .download-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    padding: 0.6rem;
    font-size: 0.9rem;
    text-align: center;
  }

  .faq-content {
    padding: 1rem;
  }

  .faq-content p {
    font-size: 0.9rem;
    margin: 0 0 0.8rem 0;
  }

  .hotel-actions {
    margin-top: 1rem;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }

  .action-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .invoice-form-container {
    margin-top: 1rem;
    padding: 1rem;
  }

  .invoice-form .form-actions {
    flex-direction: column;
    gap: 0.8rem;
  }

  .cancel-btn,
  .invoice-form .submit-btn {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.9rem;
  }
}

/* 回転アニメーション */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
