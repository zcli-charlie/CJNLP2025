<template>
  <div class="information-query">
    <!-- 照会フォーム -->
    <div class="query-form">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="130px" inline>
        <el-form-item label="メールアドレス" prop="email">
          <el-input
            v-model="form.email"
            placeholder="メールアドレスを入力してください"
          />
        </el-form-item>
        <el-form-item label="パスワード" prop="password">
          <el-input
            v-model="form.password"
            placeholder="パスワードを入力してください（任意）"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCheck">照会</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 検索ボックス -->
    <div v-if="tableData.length" class="search-container">
      <el-input
        v-model="searchEmail"
        placeholder="メールアドレスで検索"
        style="width: 300px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="table-container">
      <template v-for="item in filteredTableData" :key="item.id">
        <div class="table-item">
          <div class="table-item-bg">
            <img src="../static/CJNLP2025/images/bg.png" alt="" />
          </div>

          <div class="table-item-content">
            <div class="table-item-content1">
              <div class="table-item-left">
                <div class="table-item-left-top">
                  <div class="table-item-left-top-name">{{ item.name }}</div>
                  <div class="table-item-left-top-nationality">
                    {{ item.nationality === 0 ? "中方" : "日方" }}
                  </div>
                </div>

                <div class="table-item-left-bottom">{{ item.email }}</div>
              </div>
              <div class="table-item-right">
                <div class="table-item-right-organization">
                  {{ item.organization }}
                </div>
              </div>
            </div>

            <div class="table-item-content2">
              <div class="table-item-content2-i">
                <div class="table-item-content2-i-title">登録状況</div>
                <div class="table-item-content2-i-content">
                  <img src="../static/CJNLP2025/images/pick.png" alt="" v-if="item.is_reg === 1 || item.is_reg === 2" />

<img src="../static/CJNLP2025/images/unpick.png" alt="" v-else />
                </div>
              </div>
              <div class="table-item-content2-i">
                <div class="table-item-content2-i-title">支払い状況</div>
                <div class="table-item-content2-i-content">
                  <img src="../static/CJNLP2025/images/pick.png" alt="" v-if="item.payment_status === 1" />

<img src="../static/CJNLP2025/images/unpick.png" alt="" v-else />
                </div>
              </div>
              <div class="table-item-content2-i">
                <div class="table-item-content2-i-title">チェックイン</div>
                <div class="table-item-content2-i-content">
                  <img src="../static/CJNLP2025/images/pick.png" alt="" v-if="item.check_in === 1" />

<img src="../static/CJNLP2025/images/unpick.png" alt="" v-else />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { checkPasswordApi } from "../api/index";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue';

const formRef = ref();
const form = reactive({
  email: "",
  password: "",
});
const rules = {
  email: [
    { required: true, message: "メールアドレスを入力してください", trigger: "blur" },
    { type: "email", message: "メールアドレスの形式が正しくありません", trigger: "blur" },
  ],
};

const tableData = ref([]);
const searchEmail = ref('');

// フィルタリングされたテーブルデータ
const filteredTableData = computed(() => {
  if (!searchEmail.value) {
    return tableData.value;
  }
  return tableData.value.filter(item => 
    item.email && item.email.toLowerCase().includes(searchEmail.value.toLowerCase())
  );
});

const handleSearch = () => {
  // 検索ロジックはcomputedで実装
};

const handleCheck = async () => {
  await formRef.value.validate();
  try {
    const res = await checkPasswordApi({ ...form });
    if (res && res.code === 200 && res.data) {
      tableData.value = Array.isArray(res.data) ? res.data : [res.data];
    } else {
      ElMessage.error(res.msg || "認証に失敗しました");
    }
  } catch (e) {
    ElMessage.error("認証に失敗しました");
  }
};
</script>

<style scoped lang="scss">
.information-query {
  padding: 24px;
}

.query-form {
  background: #f5f7fa;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.search-container {
  margin-top: 24px;
  margin-bottom: 16px;
}

.query-form :deep(.el-form-item) {
  margin-bottom: 16px;
  margin-right: 24px;
}

.query-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.table-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  &  * {
    box-sizing: border-box;
  }
  .table-item {
    width: 400px;
    height: 195px;
    background-color: #fff;
    border-radius: 16px;
    margin-bottom: 16px;
    position: relative;
    margin-right: 16px;
    .table-item-bg {
      width: 100%;
      height: 100%;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .table-item-content {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: relative;
      top: 0;
      left: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 27px;
      .table-item-content1 {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-top: 27px;
        .table-item-left {
          .table-item-left-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-left: 12px;
            .table-item-left-top-name {
              font-weight: 400;
              font-size: 14px;
              color: #303030;
              line-height: 16px;
            }
            .table-item-left-top-nationality {
              margin-left: 8px;
              width: 41px;
              height: 18px;
              background: rgba(107, 170, 98, 0.5);
              border-radius: 5px 5px 5px 5px;
              font-weight: 400;
              font-size: 9px;
              color: #2d8268;
              line-height: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .table-item-left-bottom {
            font-weight: 400;
            font-size: 11px;
            color: #575757;
            line-height: 16px;
            margin-left: 12px;
            margin-top: 10px;
          }
        }
        .table-item-right {
          .table-item-right-organization {
            padding: 1px 8px;
            border-radius: 5px 5px 5px 5px;
            border: 1px solid #126e76;
            font-weight: 400;
            font-size: 9px;
            color: #126e76;
            line-height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .table-item-content2 {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 16px;
        padding:4px 13px 0px 16px;
        .table-item-content2-i {
          display: flex;
          flex-direction: column;
          justify-content: space-around; 
          align-items: center;
          .table-item-content2-i-title {
            font-weight: 400;
            font-size: 9px;
            color: #7c7c7c;
            line-height: 16px;
          }
          .table-item-content2-i-content {
            width: 16px;
            height: 16px;
            margin-top: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .information-query {
    padding: 16px;
  }
  .query-form {
    padding: 16px;

    .el-form{
      text-align: center;
    }
  }

  .table-container {
    .table-item {
      margin-right: 0;
      width: 340px;
      height: 160px;
      .table-item-content {
        padding: 16px;
        .table-item-content1 {
          padding-top: 16px;
        }
      }
    }
  }
}
</style> 