<template>
    <el-dialog v-model="visible" width="360px" :show-close="false" :lock-scroll="true">
        <template #header>
            <div class="dialog-title">
                <span>{{ title }}</span>
                <el-button link type="primary" :icon="RefreshLeft" @click="refreshCaptcha" />
            </div>
        </template>

        <div class="captcha-container relative">
            <div class="captcha-box" :class="{ 'pointer-events-none': loading }">
                <div class="image-wrapper">
                    <img :src="bgImage" class="bg-img" v-show="imagesLoaded" />
                    <img :src="sliderImage" class="slider-img"
                        :style="{ left: `${sliderLeft}px`, top: `${sliderImageTop}px` }" v-show="imagesLoaded" />
                </div>

                <div class="slider-track">
                    <div class="slider-fill" :style="{ width: `${sliderLeft + 20}px` }"></div>
                    <div class="slider-button" :style="{ left: `${sliderLeft}px` }" @mousedown="startDrag">
                        ⇆
                    </div>
                </div>
            </div>


            <div v-if="loading" class="captcha-loading-mask">
                <div class="captcha-loading-spinner">
                    <el-icon class="is-loading">
                        <Loading />
                    </el-icon>
                </div>
            </div>
        </div>

    </el-dialog>
</template>

<script setup>
import { ref, defineExpose, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, RefreshLeft } from '@element-plus/icons-vue'
import { getCaptchaApi, postCaptchaApi } from '../api/index'


const props = defineProps({
    lang: {
        type: String,
        default: 'zh'
    }
})
const title = computed(() => {
    return props.lang === 'zh' ? '请完成验证码' : (props.lang === 'en' ? 'Please complete the CAPTCHA' : 'CAPTCHA を入力してください')
})
const visible = ref(false)
const captchaId = ref('')
const bgImage = ref('')
const sliderImage = ref('')
const sliderLeft = ref(0)
const sliderImageTop = ref(0)
const startX = ref(0)
const dragging = ref(false)
const loading = ref(false)        // 控制内部loading状态
const imagesLoaded = ref(false)

let resolveCaptcha = null

const preloadImages = (bg, slider) => {
    return new Promise((resolve) => {
        let loaded = 0
        const check = () => {
            loaded++
            if (loaded === 2) resolve()
        }
        const bgImg = new Image()
        const sliderImg = new Image()
        bgImg.onload = check
        sliderImg.onload = check
        bgImg.src = bg
        sliderImg.src = slider
    })
}

const fetchCaptcha = async () => {
    loading.value = true
    imagesLoaded.value = false
    try {
        const res = await getCaptchaApi()
        captchaId.value = res.captcha_id
        const bg = res.bg_image.startsWith('data:') ? res.bg_image : `data:image/png;base64,${res.bg_image}`
        const slider = res.slider_image.startsWith('data:') ? res.slider_image : `data:image/png;base64,${res.slider_image}`
        bgImage.value = bg
        sliderImage.value = slider
        sliderImageTop.value = res.height ? res.height - 12 : 0
        sliderLeft.value = 0
        await preloadImages(bg, slider)
        imagesLoaded.value = true
    } catch (e) {
        if (props.lang === 'zh') {
            ElMessage.error('加载验证码失败')
        } else if (props.lang === 'en') {
            ElMessage.error('Failed to load captcha')
        } else if (props.lang === 'ja') {
            ElMessage.error('キャプチャの読み込みに失敗しました')
        }

        await fetchCaptcha()
    } finally {
        loading.value = false
    }
}

const refreshCaptcha = async () => {
    await fetchCaptcha()
}

const startDrag = (e) => {
    if (!imagesLoaded.value || loading.value) return
    dragging.value = true
    startX.value = e.clientX - sliderLeft.value
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', endDrag)
}

const onDrag = (e) => {
    if (!dragging.value) return
    let moveX = e.clientX - startX.value
    moveX = Math.max(0, Math.min(moveX, 280))
    sliderLeft.value = moveX
}

const endDrag = async () => {
    dragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', endDrag)
    await submit()
}

const show = async () => {
    visible.value = true
    await fetchCaptcha()
    return new Promise((resolve) => {
        resolveCaptcha = resolve
    })
}

const onClose = () => {
    visible.value = false
    resolveCaptcha?.(false)
}

const submit = async () => {
    loading.value = true
    try {
        const res = await postCaptchaApi({
            captcha_id: captchaId.value,
            distance: Math.round(sliderLeft.value) + 20,
        })
        if (res === '验证成功' || res?.data?.code === 200) {
            visible.value = false
            resolveCaptcha(true)
        } else {
            if(props.lang==='zh'){
                ElMessage.error('验证失败，请重试')
            }else if(props.lang==='en'){
                ElMessage.error('Verification failed, please try again')
            }else if(props.lang==='ja'){
                ElMessage.error('認証に失敗しました。もう一度お試しください。')
            }
            await fetchCaptcha()
        }
    } catch (error) {
        await fetchCaptcha()
    }

    finally {
        loading.value = false
    }
}

defineExpose({ show })
</script>

<style scoped>
.dialog-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.captcha-container {
    position: relative;
    display: flex;
    justify-content: center;
}

.captcha-box {
    width: 300px;
}

.image-wrapper {
    position: relative;
    width: 300px;
    height: 150px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.slider-img {
    position: absolute;
    width: 46px;
    height: 46px;
    object-fit: contain;
    pointer-events: none;
}

.slider-track {
    position: relative;
    margin-top: 16px;
    height: 40px;
    background: #f0f0f0;
    border-radius: 20px;
}

.slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(0, 123, 255, 0.3);
    border-radius: 20px;
}

.slider-button {
    position: absolute;
    top: 0;
    width: 40px;
    height: 40px;
    background-color: #409eff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    border-radius: 50%;
    z-index: 2;
    user-select: none;
}

/* 内部 loading 蒙层 */
.captcha-loading-mask {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.captcha-loading-spinner {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #409eff;
    font-size: 14px;
}
</style>
