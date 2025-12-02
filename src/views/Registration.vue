<template>
  <div class="registration-container">
    <div class="content-wrapper">
      <h1>会议注册</h1>

      <!-- 注册说明 -->
      <section class="registration-info">
        <h2>📝 注册说明</h2>
        <p>
          请各位会议代表先缴纳注册费，查看酒店信息，然后填写下方注册表完成注册。
        </p>
        <p>若多人一起注册，请填写全部姓名。</p>
      </section>

      <!-- 注册费用 -->
      <section class="registration-fees">
        <h2>💰 注册费用</h2>
        <div class="fees-table">
          <div class="table-row header">
            <div class="cell">注册类型</div>
            <div class="cell">注册费</div>
          </div>
          <div
            class="table-row"
            v-for="(fee, index) in registrationFees"
            :key="index"
          >
            <div class="cell">{{ fee.type }}</div>
            <div class="cell">{{ fee.fee }}</div>
          </div>
        </div>

        <div class="payment-methods">
          <h3>💳 缴费方式</h3>
          <div
            class="payment-method"
            v-for="(method, index) in paymentMethods"
            :key="index"
          >
            <h4>{{ method.icon }} {{ method.title }}</h4>
            <p v-for="(detail, dIndex) in method.details" :key="dIndex">
              <strong v-if="detail.label">{{ detail.label }}：</strong
              >{{ detail.value }}
            </p>
          </div>
        </div>
      </section>

      <!-- 酒店信息 -->
      <section class="hotel-info">
        <h2>🏨 酒店信息</h2>
        <p>{{ hotelInfo.description }}</p>

        <div class="hotel-table">
          <div class="hotel-row header">
            <div class="hotel-cell">酒店名称</div>
            <div class="hotel-cell">A座豪华单间</div>
            <div class="hotel-cell">A座高级标间</div>
            <div class="hotel-cell">B座单/标间</div>
            <div class="hotel-cell">酒店地址</div>
          </div>
          <div
            class="hotel-row"
            v-for="(hotel, index) in hotelInfo.hotels"
            :key="index"
          >
            <div class="hotel-cell" data-label="酒店名称">{{ hotel.name }}</div>
            <div
              class="hotel-cell"
              v-for="(room, rIndex) in hotel.rooms"
              :key="rIndex"
              :data-label="room.type"
            >
              {{ room.price }}
            </div>
            <div class="hotel-cell" data-label="酒店地址">
              {{ hotel.address }}
            </div>
          </div>
        </div>

        <!-- 酒店操作按钮 -->
        <div class="hotel-actions">
          <button 
            class="action-btn primary" 
            @click="toggleRegistrationForm"
            :class="{ 'active': showRegistrationForm }"
          >
            📝 {{ showRegistrationForm ? '收起登记' : '会议注册' }}
          </button>
          <button 
            class="action-btn primary" 
            @click="toggleInvoiceForm"
            :class="{ 'active': showInvoiceForm }"
          >
            📄 {{ showInvoiceForm ? '收起申请' : '缴费登记&申请开票' }}
          </button>
          <button class="action-btn secondary" @click="goToInformationQuery">
            🔍 信息查询
          </button>
        </div>

        <!-- 申请开票表单 -->
        <div class="invoice-form-container" v-show="showInvoiceForm">
          <div class="invoice-form">
            <h3>📄 申请开票</h3>
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
                <label for="invoiceEmail">联系邮箱 *</label>
                <input 
                  type="email" 
                  id="invoiceEmail" 
                  v-model="invoiceForm.email" 
                  required 
                  placeholder="请输入联系邮箱"
                />
              </div>
              
              <div class="form-group">
                <label for="invoicePhone">联系电话</label>
                <input 
                  type="tel" 
                  id="invoicePhone" 
                  v-model="invoiceForm.phone" 
                  placeholder="请输入联系电话"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceTitle">发票抬头 *</label>
                <input 
                  type="text" 
                  id="invoiceTitle" 
                  v-model="invoiceForm.invoiceTitle" 
                  required 
                  placeholder="请输入发票抬头"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceCode">统一社会信用代码 *</label>
                <input 
                  type="text" 
                  id="invoiceCode" 
                  v-model="invoiceForm.invoiceCode" 
                  required 
                  placeholder="请输入统一社会信用代码"
                />
              </div>
              
              <div class="form-group">
                <label for="invoiceFile">缴费凭证 *</label>
                <div class="file-upload-container">
                  <input 
                    type="file" 
                    id="invoiceFile" 
                    @change="handleFileChange"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    required
                  />
                  <div class="file-upload-tip">
                    支持 jpg/png/pdf/doc/docx 格式，文件大小不超过 10MB
                  </div>
                  <div v-if="invoiceForm.invoiceFile" class="file-success">
                    ✅ 文件上传成功
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="submit-btn" 
                  :disabled="invoiceSubmitting || !invoiceForm.invoiceFile"
                >
                  {{ invoiceSubmitting ? '提交中...' : '提交申请' }}
                </button>
                <button 
                  type="button" 
                  class="cancel-btn" 
                  @click="cancelInvoiceApplication"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- 注册表单 -->
      <div class="registration-form-container" v-show="showRegistrationForm">
        <section class="registration-form">
          <h2>✍️ 填写信息</h2>
          <form @submit.prevent="handleSubmit">
          <!-- 基本信息 -->
          <div class="form-section">
            <h3>👤 基本信息</h3>
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="form.name" required />
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input type="email" id="email" v-model="form.email" required @blur="checkEmail" />
            </div>
            <div class="form-group">
              <label for="phone">电话</label>
              <input type="tel" id="phone" v-model="form.phone" required />
            </div>
            <div class="form-group">
              <label for="organization">单位</label>
              <input
                type="text"
                id="organization"
                v-model="form.organization"
                required
              />
            </div>
            <div class="form-group">
              <label for="nationality">代表方</label>
              <select id="nationality" v-model="form.nationality">
                <option value="">请选择代表方</option>
                <option :value="0">中方</option>
                <option :value="1">日方</option>
              </select>
            </div>
            <div class="form-group">
              <label for="accommodation">住宿酒店</label>
              <select id="accommodation" v-model="form.accommodation" required>
                <option value="">请选择住宿类型</option>
                <option :value="1">豪华单间</option>
                <option :value="2">豪华标间</option>
                <option :value="3">普通标/单间</option>
                <option :value="4">自行预订</option>
              </select>
            </div>
            <!-- <div class="form-group">
              <label for="isInvoice">是否需要发票</label>
              <select id="isInvoice" v-model="form.isInvoice" required>
                <option value="">请选择是否需要发票</option>
                <option :value="1">是</option>
                <option :value="0">否</option>
              </select>
            </div> -->
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceTitle">发票抬头</label>
              <input
                type="text"
                id="invoiceTitle"
                v-model="form.invoiceTitle"
                placeholder="请输入发票抬头"
              />
            </div>
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceCode">统一社会信用代码</label>
              <input
                type="text"
                id="invoiceCode"
                v-model="form.invoiceCode"
                placeholder="请输入统一社会信用代码"
              />
            </div>
            <div class="form-group" v-if="form.isInvoice === 1">
              <label for="invoiceEmail">邮箱</label>
              <input
                type="email"
                id="invoiceEmail"
                v-model="form.invoiceEmail"
                placeholder="请输入邮箱"
              />
            </div>
            <div class="form-group">
              <label for="travelInfo">行程信息</label>
              <textarea
                id="travelInfo"
                v-model="form.travelInfo"
                placeholder="请输入行程信息"
                :autosize="{ minRows: 4, maxRows: 10 }"
                :maxlength="1000"
                show-word-limit
                clearable
              />
            </div>
          </div>

          <!-- 参会信息 -->
          <div class="form-section">
            <h3>🎯 参会信息</h3>
            <div class="form-group">
              <label for="title">称呼</label>
              <select
                id="title"
                v-model="form.title"
                required
                @change="handleTitleChange"
              >
                <option value="">请选择称呼</option>
                <option :value="1">教授</option>
                <option :value="2">副教授</option>
                <option :value="3">助理教授</option>
                <option :value="4">研究员</option>
                <option :value="5">副研究员</option>
                <option :value="6">助理研究员</option>
                <option :value="7">博士</option>
                <option :value="8">先生</option>
                <option :value="9">女士</option>
                <option :value="10">其他</option>
              </select>
              <input
                v-if="form.title === 10"
                type="text"
                v-model="form.customTitle"
                placeholder="请输入称呼"
                class="custom-title-input"
              />
            </div>
            <div class="form-group">
              <label for="isSpeech">是否演讲</label>
              <select id="isSpeech" v-model="form.isSpeech" required>
                <option value="">请选择是否演讲</option>
                <option :value="1">是</option>
                <option :value="0">否</option>
              </select>
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="paper">报告题目</label>
              <input
                type="text"
                id="paper"
                v-model="form.paper"
                placeholder="请输入报告题目"
              />
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="paperDescription">报告描述</label>
              <textarea
                id="paperDescription"
                v-model="form.paperDescription"
                placeholder="请输入报告描述"
                :autosize="{ minRows: 4, maxRows: 10 }"
                :maxlength="1000"
                show-word-limit
                clearable
              />
            </div>
            <div class="form-group" v-if="form.isSpeech === 1">
              <label for="presentationType">报告形式（倾向）</label>
              <select
                id="presentationType"
                v-model="form.presentationType"
                required
              >
                <option value="">请选择报告形式</option>
                <option :value="1">口头报告</option>
                <option :value="2">海报展示</option>
              </select>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <button type="submit" class="submit-btn">提交注册</button>
          </div>
        </form>
        </section>
      </div>

      <!-- 邀请函下载 -->
      <section class="invitation-section">
        <h2>📄 邀请函下载</h2>
        <div class="invitation-content">
          <p>请下载会议邀请函，用于报销等用途。</p>
          <div class="download-buttons">
            <a
              href="/uploads/accept-files/down/CJNLP2025会议邀请函.pdf"
              class="download-btn"
              download
            >
              <span class="icon">📥</span>
              中文邀请函
            </a>
            <a
              href="/uploads/accept-files/down/Invitation%20Letter%20for%20CJNLP2025.pdf"
              class="download-btn"
              download
            >
              <span class="icon">📥</span>
              英文邀请函
            </a>
          </div>
        </div>
      </section>

      <!-- 提示 -->
      <section class="faq-section">
        <h2>❓ {{ faqInfo.title }}</h2>
        <div class="faq-content">
          <p v-for="(item, index) in faqInfo.items" :key="index">
            {{ index + 1 }}. {{ item }}
          </p>
        </div>
      </section>
    </div>
    
    <!-- 提交中模态弹窗 -->
    <el-dialog
      v-model="isSubmitting"
      title="提交中"
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
          正在提交注册信息，请稍候...
        </div>
      </div>
    </el-dialog>
    
    <!-- 注册成功模态弹窗 -->
    <el-dialog
      v-model="showSuccessModal"
      title="注册成功"
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
          恭喜您！注册成功
        </div>
        <div style="font-size: 14px; color: #606266; line-height: 1.5;">
          您的注册信息已经成功提交，我们会尽快处理您的申请。
        </div>
      </div>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="showSuccessModal = false" style="padding: 12px 32px;">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <SliderCaptcha ref="captchaRef" lang="zh" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postRequest, getRequest } from "../utils/request";
import { ElMessage, ElMessageBox, ElLoading, ElDialog } from "element-plus";
import SliderCaptcha from "../components/SliderCaptcha.vue";
import { postUploadApi } from '../api/index'

const router = useRouter();
const captchaRef = ref(null);
const invoiceFormRef = ref(null);

// 申请开票相关状态
const showInvoiceForm = ref(false);
const invoiceSubmitting = ref(false);
const loading = ref(false);

// 提交状态控制
const isSubmitting = ref(false);

// 成功提示控制
const showSuccessModal = ref(false);

// 注册表单相关状态
const showRegistrationForm = ref(true);

// 申请开票表单数据
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

// 注册费用数据
const registrationFees = [
  { type: "中方代表", fee: "2000元/人" },
  { type: "日方代表", fee: "1000元/人" },
];

// 缴费方式数据
const paymentMethods = [
  {
    icon: "🏦",
    title: "银行转账",
    details: [
      { label: "户名", value: "中国中文信息学会" },
      { label: "账号", value: "0200004509014415619" },
      { label: "开户行", value: "工商行北京市分行海淀西区支行" },
      {
        label: "备注信息",
        value: "CJNLP+姓名(若多人一起汇款，请备注全部姓名)",
      },
    ],
  },
  {
    icon: "📱",
    title: "支付宝账号转账",
    details: [
      { label: "户名", value: "中国中文信息学会" },
      { label: "账号", value: "cips_pay@163.com" },
      {
        label: "备注信息",
        value: "CJNLP+姓名(若多人一起汇款，请备注全部姓名)",
      },
    ],
  },
  {
    icon: "💵",
    title: "现场缴费",
    details: [{ value: "现金或刷卡会后邮寄发票" }],
  },
  {
    icon: "🧾",
    title: "发票",
    details: [{ value: "如需开具发票请在注册表中提供发票抬头及纳税人识别号" }],
  },
];

// 酒店信息数据
const hotelInfo = {
  description: "预订会议酒店房间的参会代表，会议协议价如下，费用自理。",
  hotels: [
    {
      name: "机场桃花岭饭店",
      address: "湖北省宜昌市猇亭区机场路29号",
      rooms: [
        { type: "A座豪华单间", price: "330元" },
        { type: "A座高级标间", price: "330元" },
        { type: "B座单/标间", price: "260元" },
      ],
    },
  ],
};

// 提示信息数据
const faqInfo = {
  title: "提示",
  items: [
    "9月为宜昌旅游旺季，酒店非常紧张，请务必于8月31日前完成会议注册，完成酒店预订。",
    "各个房型数量有限，将优先按注册顺序安排房间，造成的不便敬请谅解。",
  ],
};

// 表单数据
const form = ref({
  name: "",
  email: "",
  phone: "",
  organization: "",
  accommodation: 1,
  title: 1,
  customTitle: "",
  isSpeech: 1,
  paperDescription: "",
  paper: "",
  presentationType: 1,
  isInvoice: 0,
  invoiceTitle: "",
  invoiceCode: "",
  invoiceEmail: "",
  nationality: 0,
  travelInfo: "",
});

// 处理称呼选择变化
const handleTitleChange = () => {
  if (form.value.title !== "other") {
    form.value.customTitle = "";
  }
};

// 切换申请开票表单显示状态
const toggleInvoiceForm = () => {
  showInvoiceForm.value = !showInvoiceForm.value;
  if (showInvoiceForm.value) {
    // 展开时重置表单
    resetInvoiceForm();
    // 关闭注册表单
    showRegistrationForm.value = false;
  }
};

// 切换注册表单显示状态
const toggleRegistrationForm = () => {
  showRegistrationForm.value = !showRegistrationForm.value;
  if (showRegistrationForm.value) {
    // 关闭申请开票表单
    showInvoiceForm.value = false;
  }
};

// 跳转到信息查询页面
const goToInformationQuery = () => {
  router.push('/information-query');
};

// 重置申请开票表单
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

// 取消申请开票
const cancelInvoiceApplication = () => {
  showInvoiceForm.value = false;
  resetInvoiceForm();
};

// 提交申请开票
const submitInvoiceApplication = async () => {
  try {
    // 表单验证
    if (!invoiceForm.value.email) {
      ElMessage.error('请输入联系邮箱');
      return;
    }
    if (!invoiceForm.value.name) {
      ElMessage.error('请输入姓名');
      return;
    }
    if (!invoiceForm.value.invoiceTitle) {
      ElMessage.error('请输入发票抬头');
      return;
    }
    if (!invoiceForm.value.invoiceCode) {
      ElMessage.error('请输入统一社会信用代码');
      return;
    }
    if (!invoiceForm.value.invoiceFile) {
      ElMessage.error('请上传缴费凭证');
      return;
    }
    
    invoiceSubmitting.value = true;
    
    // 提交申请开票请求
    await postRequest('/invoice/add', invoiceForm.value);
    
    ElMessage.success('申请开票提交成功');
    showInvoiceForm.value = false;
    resetInvoiceForm();
    
  } catch (error) {
    console.error('申请开票失败:', error);
    ElMessage.error('申请开票失败，请稍后重试');
  } finally {
    invoiceSubmitting.value = false;
  }
};

// 提交表单
const handleSubmit = async () => {
  // 检验数据
  if (!form.value.name) {
    ElMessage.error({ message: "请输入姓名" });
  }
  if (!form.value.email) {
    ElMessage.error({ message: "请输入邮箱" });
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceTitle) {
    ElMessage.error({ message: "请输入发票抬头" });
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceCode) {
    ElMessage.error({ message: "请输入统一社会信用代码" });
  }
  if (form.value.isInvoice === 1 && !form.value.invoiceEmail) {
    ElMessage.error({ message: "请输入邮箱" });
  }

  // 先检查邮箱是否存在
  // let res = await getRequest("/registration/check_email", {
  //   email: form.value.email,
  // });
  // if (!res.email) {
  //   const ok = await captchaRef.value?.show();
  //   if (!ok) return;
  // }

  // 显示提交中模态弹窗
  isSubmitting.value = true;
  postRequest("/registration/add", form.value)
    .then((res) => {
      isSubmitting.value = false;
      showSuccessModal.value = true;
      form.value = {
        name: "",
        email: "",
        phone: "",
        organization: "",
        accommodation: 1,
        title: 1,
        customTitle: "",
        isSpeech: 1,
        paperDescription: "",
        paper: "",
        presentationType: 1,
        isInvoice: 0,
        invoiceTitle: "",
        invoiceCode: "",
        invoiceEmail: "",
        nationality: 0,
        travelInfo: "",
      };
    })
    .catch((err) => {
      console.log(err);
      isSubmitting.value = false;
      ElMessage.error({ message: "注册失败" });
    });
};

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
    align-items: center; /* 添加居中对齐 */
    width: 100%; /* 确保容器占满宽度 */
  }

  .download-btn {
    width: 100%;
    max-width: 280px; /* 限制最大宽度 */
    justify-content: center;
    padding: 0.6rem;
    font-size: 0.9rem;
    text-align: center; /* 确保文字居中 */
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

/* 旋转动画 */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
