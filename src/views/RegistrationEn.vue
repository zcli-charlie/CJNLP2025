<template>
  <div class="registration-container">
    <div class="content-wrapper">
      <h1>Conference Registration</h1>

      <!-- Registration Instructions -->
      <section class="registration-info">
        <h2>📝 Registration Instructions</h2>
        <p>Please pay the registration fee first, check the hotel information, and then complete the registration form below.</p>
        <p>If registering multiple people together, please fill in all names.</p>
      </section>

      <!-- Registration Fees -->
      <section class="registration-fees">
        <h2>💰 Registration Fees</h2>
        <div class="fees-table">
          <div class="table-row header">
            <div class="cell">Registration Type</div>
            <div class="cell">Fee</div>
          </div>
          <div class="table-row" v-for="(fee, index) in registrationFees" :key="index">
            <div class="cell">{{ fee.type }}</div>
            <div class="cell">{{ fee.fee }}</div>
          </div>
        </div>

        <div class="payment-methods">
          <h3>💳 Payment Methods</h3>
          <div class="payment-method" v-for="(method, index) in paymentMethods" :key="index">
            <h4>{{ method.icon }} {{ method.title }}</h4>
            <p v-for="(detail, dIndex) in method.details" :key="dIndex">
              <strong v-if="detail.label">{{ detail.label }}:</strong> {{ detail.value }}
            </p>
          </div>
        </div>
      </section>

      <!-- Hotel Information -->
      <section class="hotel-info">
        <h2>🏨 Hotel Information</h2>
        <p>{{ hotelInfo.description }}</p>

        <div class="hotel-table">
          <div class="hotel-row header">
            <div class="hotel-cell">Hotel Name</div>
            <div class="hotel-cell">Building A Deluxe Single</div>
            <div class="hotel-cell">Building A Superior Twin</div>
            <div class="hotel-cell">Building B Single/Twin</div>
            <div class="hotel-cell">Hotel Address</div>
          </div>
          <div class="hotel-row" v-for="(hotel, index) in hotelInfo.hotels" :key="index">
            <div class="hotel-cell" data-label="Hotel Name">{{ hotel.name }}</div>
            <div class="hotel-cell" v-for="(room, rIndex) in hotel.rooms" :key="rIndex" :data-label="room.type">
              {{ room.price }}
            </div>
            <div class="hotel-cell" data-label="Hotel Address">{{ hotel.address }}</div>
          </div>
        </div>

        <!-- Hotel Action Buttons -->
        <div class="hotel-actions">
          <button 
            class="action-btn primary" 
            @click="toggleRegistrationForm"
            :class="{ 'active': showRegistrationForm }"
          >
            📝 {{ showRegistrationForm ? 'Hide Form' : 'Conference Registration' }}
          </button>
          <button 
            class="action-btn primary" 
            @click="toggleInvoiceForm"
            :class="{ 'active': showInvoiceForm }"
          >
            📄 {{ showInvoiceForm ? 'Hide Form' : 'Payment Registration & Apply for Invoice' }}
          </button>
          <button class="action-btn secondary" @click="goToInformationQuery">
            🔍 Information Query
          </button>
        </div>

        <!-- Invoice Application Form -->
        <div class="invoice-form-container" v-show="showInvoiceForm">
          <div class="invoice-form">
            <h3>📄 Apply for Invoice</h3>
            <form @submit.prevent="submitInvoiceApplication">

              <div class="form-group">
                <label for="invoiceName">Name *</label>
                <input 
                  type="text" 
                  id="invoiceName" 
                  v-model="invoiceForm.name" 
                  required 
                  placeholder="Please enter name"
                />
              </div>

              <div class="form-group">
                <label for="invoiceEmail">Contact Email *</label>
                <input 
                  type="email" 
                  id="invoiceEmail" 
                  v-model="invoiceForm.email" 
                  required 
                  placeholder="Please enter contact email"
                />
              </div>
              
              <div class="form-group">
                <label for="invoicePhone">Contact Phone</label>
                <input 
                  type="tel" 
                  id="invoicePhone" 
                  v-model="invoiceForm.phone" 
                  placeholder="Please enter contact phone"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceTitle">Invoice Title *</label>
                <input 
                  type="text" 
                  id="invoiceTitle" 
                  v-model="invoiceForm.invoiceTitle" 
                  required 
                  placeholder="Please enter invoice title"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceCode">Tax ID *</label>
                <input 
                  type="text" 
                  id="invoiceCode" 
                  v-model="invoiceForm.invoiceCode" 
                  required 
                  placeholder="Please enter tax ID"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceFile">Payment Proof *</label>
                <div class="file-upload-container">
                  <input 
                    type="file" 
                    id="invoiceFile" 
                    @change="handleFileChange"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    required
                  />
                  <div class="file-upload-tip">
                    Support jpg/png/pdf/doc/docx formats, file size no more than 10MB
                  </div>
                  <div v-if="invoiceForm.invoiceFile" class="file-success">
                    ✅ File uploaded successfully
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="submit-btn" 
                  :disabled="invoiceSubmitting || !invoiceForm.invoiceFile"
                >
                  {{ invoiceSubmitting ? 'Submitting...' : 'Submit Application' }}
                </button>
                <button 
                  type="button" 
                  class="cancel-btn" 
                  @click="cancelInvoiceApplication"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Registration Form -->
      <div class="registration-form-container" v-show="showRegistrationForm">
        <section class="registration-form">
          <h2>✍️ Personal Information</h2>
          <form @submit.prevent="handleSubmit">
          <!-- Basic Information -->
          <div class="form-section">
            <h3>👤 Basic Information</h3>
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" v-model="form.name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required @blur="checkEmail">
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" v-model="form.phone" required>
            </div>
            <div class="form-group">
              <label for="organization">Organization</label>
              <input type="text" id="organization" v-model="form.organization" required>
            </div>
            <div class="form-group">
              <label for="nationality">Nationality</label>
              <select id="nationality" v-model="form.nationality">
                <option value="">Please select nationality</option>
                <option :value="0">Chinese Side</option>
                <option :value="1">Japanese Side</option>
              </select>
            </div>
            <div class="form-group">
              <label for="accommodation">Accommodation</label>
              <select id="accommodation" v-model="form.accommodation" required>
                <option value="">Please select accommodation type</option>
                <option :value="1">Deluxe Single Room</option>
                <option :value="2">Deluxe Twin Room</option>
                <option :value="3">Standard Single/Twin Room</option>
                <option :value="4">Self-arranged</option>
              </select>
            </div>
            <!-- <div class="form-group">
              <label for="isInvoice">Is Invoice</label>
              <select id="isInvoice" v-model="form.isInvoice" required>
                <option value="">Please select is invoice</option>
                <option :value="1">Yes</option>
                <option :value="0">No</option>
              </select>
            </div> -->
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceTitle">Invoice Title</label>
              <input type="text" id="invoiceTitle" v-model="form.invoiceTitle" placeholder="Please enter invoice title">
            </div>
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceCode">Invoice Code</label>
              <input type="text" id="invoiceCode" v-model="form.invoiceCode" placeholder="Please enter invoice code">
            </div>
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceEmail">Invoice Email</label>
              <input type="email" id="invoiceEmail" v-model="form.invoiceEmail" placeholder="Please enter invoice email">
            </div>
            <div class="form-group">
              <label for="travelInfo">Travel Info</label>
              <textarea id="travelInfo" v-model="form.travelInfo" placeholder="Please enter your travel info"></textarea>
            </div>
          </div>

          <!-- Conference Information -->
          <div class="form-section">
            <h3>🎯 Conference Information</h3>
            <div class="form-group">
              <label for="title">Title</label>
              <select id="title" v-model="form.title" required @change="handleTitleChange">
                <option value="">Please select title</option>
                <option :value="1">Professor</option>
                <option :value="2">Associate Professor</option>
                <option :value="3">Assistant Professor</option>
                <option :value="4">Researcher</option>
                <option :value="5">Associate Researcher</option>
                <option :value="6">Assistant Researcher</option>
                <option :value="7">Doctor</option>
                <option :value="8">Mr.</option>
                <option :value="9">Ms.</option>
                <option :value="10">Other</option>
              </select>
              <input
                v-if="form.title === 10"
                type="text"
                v-model="form.customTitle"
                placeholder="Please enter your title"
                class="custom-title-input"
              >
            </div>
            <div class="form-group">
              <label for="isSpeech">Is Speech</label>
              <select id="isSpeech" v-model="form.isSpeech" required>
                <option value="">Please select is speech</option>
                <option :value="1">Yes</option>
                <option :value="0">No</option>
              </select>
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="paper">Presentation Title</label>
              <input type="text" id="paper" v-model="form.paper" placeholder="Please enter your presentation title">
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="paperDescription">Report Description</label>
              <textarea id="paperDescription" v-model="form.paperDescription" placeholder="Please enter your report description"></textarea>
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="presentationType">Presentation Type (Preference)</label>
              <select id="presentationType" v-model="form.presentationType" required>
                <option value="">Please select presentation type</option>
                <option :value="1">Oral Presentation</option>
                <option :value="2">Poster Presentation</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button type="submit" class="submit-btn">Submit Registration</button>
          </div>
        </form>
        </section>
      </div>

      <!-- Invitation Letter Download -->
      <section class="invitation-section">
        <h2>📄 Download Invitation Letter</h2>
        <div class="invitation-content">
          <p>Please download the conference invitation letter for reimbursement and other purposes.</p>
          <div class="download-buttons">
            <a href="/uploads/accept-files/down/CJNLP2025会议邀请函.pdf" class="download-btn" download>
              <span class="icon">📥</span>
              Chinese Invitation Letter
            </a>
            <a href="/uploads/accept-files/down/Invitation%20Letter%20for%20CJNLP2025.pdf" class="download-btn" download>
              <span class="icon">📥</span>
              English Invitation Letter
            </a>
          </div>
        </div>
      </section>

      <!-- Important Notes -->
      <section class="faq-section">
        <h2>❓ {{ faqInfo.title }}</h2>
        <div class="faq-content">
          <p v-for="(item, index) in faqInfo.items" :key="index">{{ index + 1 }}. {{ item }}</p>
        </div>
      </section>
    </div>
    
    <!-- Submission Modal Dialog -->
    <el-dialog
      v-model="isSubmitting"
      title="Submitting"
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
          Submitting registration information, please wait...
        </div>
      </div>
    </el-dialog>
    
    <!-- Registration Success Modal Dialog -->
    <el-dialog
      v-model="showSuccessModal"
      title="Registration Successful"
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
          Congratulations! Registration Successful
        </div>
        <div style="font-size: 14px; color: #606266; line-height: 1.5;">
          Your registration information has been successfully submitted, and we will process your application as soon as possible.
        </div>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="showSuccessModal = false" style="padding: 12px 32px;">
            OK
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <SliderCaptcha ref="captchaRef" lang="en"/>
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

// Invoice application related state
const showInvoiceForm = ref(false);
const invoiceSubmitting = ref(false);
const loading = ref(false);

// Submission state control
const isSubmitting = ref(false);

// Success modal control
const showSuccessModal = ref(false);

// Registration form related state
const showRegistrationForm = ref(true);

// Invoice application form data
const invoiceForm = ref({
  name: "",
  email: "",
  phone: "",
  invoiceTitle: "",
  invoiceCode: "",
  invoiceFile: ""
});

const handleFileChange =async (event) => {
  const params = new FormData()
  params.append('file', event.target.files[0])
  params.append('type', '4')
  loading.value = true
  // 先检查邮箱是否存在
  // let res = await getRequest("/registration/check_email", {
  //   email: invoiceForm.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }
  postUploadApi(params).then(res=>{
    loading.value = false
    invoiceForm.value.invoiceFile = res
    ElMessage.success({ message: '上传成功' })
  }).catch(err=>{
    loading.value = false
  })
}

// Registration fee data
const registrationFees = [
  { type: 'Chinese Representative', fee: '2000 CNY/person' },
  { type: 'Japanese Representative', fee: '1000 CNY/person' }
]

// Payment methods data
const paymentMethods = [
  {
    icon: '🏦',
    title: 'Bank Transfer',
    details: [
      { label: 'Account Name', value: 'Chinese Information Processing Society of China' },
      { label: 'Account Number', value: '0200004509014415619' },
      { label: 'Bank', value: 'ICBC Beijing Haidian West Branch' },
      { label: 'Note', value: 'CJNLP+Name(s) (If paying for multiple people, please include all names)' }
    ]
  },
  {
    icon: '📱',
    title: 'Alipay Transfer',
    details: [
      { label: 'Account Name', value: 'Chinese Information Processing Society of China' },
      { label: 'Account', value: 'cips_pay@163.com' },
      { label: 'Note', value: 'CJNLP+Name(s) (If paying for multiple people, please include all names)' }
    ]
  },
  {
    icon: '💵',
    title: 'On-site Payment',
    details: [
      { value: 'Cash or card payment, invoice will be mailed after the conference' }
    ]
  },
  {
    icon: '🧾',
    title: 'Invoice',
    details: [
      { value: 'If you need an invoice, please provide the invoice title and tax ID in the registration form' }
    ]
  }
]

// Hotel information data
const hotelInfo = {
  description: 'For conference attendees booking hotel rooms, the conference special rates are as follows (at your own expense):',
  hotels: [
    {
      name: 'Airport Taohualing Hotel',
      address: '29 Airport Road, Yiling District, Yichang, Hubei Province',
      rooms: [
        { type: 'Building A Deluxe Single', price: '330 CNY' },
        { type: 'Building A Superior Twin', price: '330 CNY' },
        { type: 'Building B Single/Twin', price: '260 CNY' }
      ]
    }
  ]
}

// FAQ information data
const faqInfo = {
  title: 'Important Notes',
  items: [
    'September is the peak tourist season in Yichang, and hotel rooms are in high demand. Please complete your conference registration and hotel booking before August 31st.',
    'Room types are limited and will be allocated on a first-come, first-served basis. We apologize for any inconvenience this may cause.'
  ]
}

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  organization: '',
  accommodation: 1,
  isInvoice: 0,
  invoiceTitle: '',
  invoiceCode: '',
  invoiceEmail: '',
  title: 1,
  customTitle: '',
  isSpeech: 1,
  paperDescription: '',
  paper: '',
  presentationType: 1,
  nationality: 0,
  travelInfo: ''
})

// 处理称呼选择变化
const handleTitleChange = () => {
  if (form.value.title !== 'other') {
    form.value.customTitle = ''
  }
}

// Toggle invoice form display
const toggleInvoiceForm = () => {
  showInvoiceForm.value = !showInvoiceForm.value;
  if (showInvoiceForm.value) {
    // Reset form when expanding
    resetInvoiceForm();
    // Close registration form
    showRegistrationForm.value = false;
  }
};

// Toggle registration form display
const toggleRegistrationForm = () => {
  showRegistrationForm.value = !showRegistrationForm.value;
  if (showRegistrationForm.value) {
    // Close invoice form
    showInvoiceForm.value = false;
  }
};

// Navigate to information query page
const goToInformationQuery = () => {
  router.push('/information-query');
};

// Reset invoice form
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

// Cancel invoice application
const cancelInvoiceApplication = () => {
  showInvoiceForm.value = false;
  resetInvoiceForm();
};

// Submit invoice application
const submitInvoiceApplication = async () => {
  try {
    // Form validation
    if (!invoiceForm.value.email) {
      ElMessage.error('Please enter contact email');
      return;
    }
    if (!invoiceForm.value.name) {
      ElMessage.error('Please enter name');
      return;
    }
    if (!invoiceForm.value.invoiceTitle) {
      ElMessage.error('Please enter invoice title');
      return;
    }
    if (!invoiceForm.value.invoiceCode) {
      ElMessage.error('Please enter tax ID');
      return;
    }
    if (!invoiceForm.value.invoiceFile) {
      ElMessage.error('Please upload payment proof');
      return;
    }
    
    invoiceSubmitting.value = true;
    
    // Submit invoice application
    await postRequest('/invoice/add', invoiceForm.value);
    
    ElMessage.success('Invoice application submitted successfully');
    showInvoiceForm.value = false;
    resetInvoiceForm();
    
  } catch (error) {
    console.error('Invoice application failed:', error);
    ElMessage.error('Invoice application failed, please try again later');
  } finally {
    invoiceSubmitting.value = false;
  }
};

// 提交表单
const handleSubmit = async () => {

  // 检验数据
  if(!form.value.name){
    ElMessage.error({ message: 'Please enter your name' })
  }
  if(!form.value.email){
    ElMessage.error({ message: 'Please enter your email' })
  }

  if (form.value.isInvoice === 1 && !form.value.invoiceTitle) {
    ElMessage.error({ message: 'Please enter invoice title' })
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceCode) {
    ElMessage.error({ message: 'Please enter invoice code' })
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceEmail) { 
    ElMessage.error({ message: 'Please enter invoice email' })
  }

  // 先检查邮箱是否存在
  // let res = await getRequest("/registration/check_email", {
  //   email: form.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }

  // Show submission modal dialog
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
      nationality: 0,
      travelInfo: ''
    }
  }).catch(err=>{
    console.log(err)
    ElMessage.error({ message: 'Registration failed' })
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

/* Rotating animation */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
