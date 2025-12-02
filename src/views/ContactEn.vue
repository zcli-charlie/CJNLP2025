<template>
    <div class="contact-container">
        <div class="content-wrapper">
            <h1>Conference Contact</h1>

            <!-- Contact Information -->
            <section class="contact-section">
                <h2>📞 {{ contactInfo.title }}</h2>
                <div class="contact-cards">
                    <div class="contact-card" v-for="(dept, index) in contactInfo.departments" :key="index">
                        <div class="contact-icon">{{ dept.icon }}</div>
                        <h3>{{ dept.title }}</h3>
                        <div class="contact-info">
                            <p><strong>Contact:</strong> {{ dept.contact }}</p>
                            <p><strong>Phone:</strong> {{ dept.phone }}</p>
                            <p><strong>Email:</strong> {{ dept.email }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Emergency Contact -->
            <!-- <section class="contact-section">
        <h2>🚨 {{ contactInfo.emergency.title }}</h2>
        <div class="emergency-contact">
          <p>{{ contactInfo.emergency.description }}</p>
          <div class="emergency-info">
            <p><strong>Emergency Contact:</strong> {{ contactInfo.emergency.contact }}</p>
            <p><strong>Phone:</strong> {{ contactInfo.emergency.phone }}</p>
            <p><strong>WeChat:</strong> {{ contactInfo.emergency.wechat }}</p>
          </div>
        </div>
      </section> -->

            <!-- Contact Form -->
            <!-- <section class="contact-section">
                <h2>📩 Inquiry Form</h2>
                <form @submit.prevent="handleSubmit" class="contact-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" v-model="form.name" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="text" id="email" v-model="form.email" required>
                    </div>

                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <select id="subject" v-model="form.subject" required>
                            <option value="">Please select a subject</option>
                            <option value="1">Academic Inquiries</option>
                            <option value="2">Registration Inquiries</option>
                            <option value="3">Accommodation Inquiries</option>
                            <option value="4">Transportation Inquiries</option>
                            <option value="5">Other Inquiries</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" v-model="form.message" rows="5" required></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Submit Inquiry</button>
                    </div>
                </form>
            </section> -->

            <!-- <section class="contact-section">
                <h2>❓ Frequently Asked Questions</h2>
                <div v-if="faqList.length > 0" class="faq-list">
                    <div class="faq-item" v-for="(faq, index) in faqList" :key="index">
                        <p><strong>Topic:</strong> {{ subjectMapEn[faq.subject] }}</p>
                        <p><strong>Question:</strong> {{ faq.content }}</p>
                        <p><strong>Answer:</strong> {{ faq.answer }}</p>
                    </div>
                    <div class="pagination">
                        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                        <span>Page {{ currentPage }} / {{ totalPages }}</span>
                        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
                    </div>
                </div>
                <p v-else>No FAQs available.</p>
            </section> -->

        </div>
    </div>
    <SliderCaptcha ref="captchaRef" lang="en" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import SliderCaptcha from '../components/SliderCaptcha.vue'


const captchaRef = ref(null)

// Contact information data
const contactInfo = {
    title: 'Conference Staff Contacts',
    emergency: {
        title: 'Emergency Contact',
        description: 'In case of emergency during the conference, please contact:',
        contact: 'Conference General Coordinator',
        phone: '138-8888-8888',
        wechat: 'Same as phone number'
    },
    departments: [
        {
            icon: '🏨',
            title: 'Accommodation',
          contact: '马子阳',
          phone: '15623103711',
          email: 'maziyang@whu.edu.cn'
        },
        {
            icon: '📝',
            title: 'Registration',
          contact: '李奇伟',
          phone: '19937308029',
          email: 'qw-line@whu.edu.cn'
        },
        {
            icon: '✈️',
            title: 'Transportation',
          contact: '肖腾',
          phone: '18571555618',
          email: 'xiaoxiao@whu.edu.cn'
        }
    ]
}

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const handleSubmit = async () => {

    try {
        // 先检查邮箱是否存在
        // let res = await getRequest("/registration/check_email", {
        //     email: form.value.email,
        // });
        // if (!res.email) {
        //     const ok = await captchaRef.value?.show();
        //     if (!ok) return;
        // }
        await consultation({
            name: form.value.name,
            email: form.value.email,
            subject: parseInt(form.value.subject),
            content: form.value.message
        })

        // Clear form after successful submission
        form.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }

        // Show success message
        alert('Your inquiry has been submitted. We will reply as soon as possible!')
    } catch (error) {
        console.error('Submission failed:', error)
        alert('Submission failed. Please try again later.')
    }
}
</script>

<style scoped>
.contact-container {
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
    margin: 0.5rem 0 1rem;
}

.contact-section {
    margin-bottom: 3rem;
}

.contact-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.contact-card {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.contact-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
}

.contact-info p {
    margin: 0.5rem 0;
    color: #666;
}

.emergency-contact {
    background: #fff8e6;
    border-radius: 6px;
    padding: 1.5rem;
    border-left: 4px solid #faad14;
}

.emergency-info {
    margin-top: 1rem;
}

.emergency-info p {
    margin: 0.5rem 0;
    color: #666;
}

.contact-form {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 1.5rem;
    margin-top: 1.5rem;
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
select,
textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
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

textarea {
    resize: vertical;
    min-height: 100px;
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

@media (max-width: 768px) {
    .contact-container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .contact-cards {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .contact-container {
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
        margin: 0.4rem 0 0.8rem;
    }

    .contact-section {
        margin-bottom: 2rem;
    }

    .contact-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1rem;
    }

    .contact-card {
        padding: 1rem;
    }

    .contact-icon {
        font-size: 1.8rem;
        margin-bottom: 0.8rem;
    }

    .contact-info p {
        margin: 0.4rem 0;
        font-size: 0.9rem;
    }

    .emergency-contact {
        padding: 1rem;
    }

    .emergency-info {
        margin-top: 0.8rem;
    }

    .emergency-info p {
        margin: 0.4rem 0;
        font-size: 0.9rem;
    }

    .contact-form {
        padding: 1rem;
        margin-top: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .form-group {
        margin-bottom: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    label {
        margin-bottom: 0.4rem;
        font-size: 0.9rem;
        display: block;
        width: 100%;
    }

    input[type="text"],
    input[type="email"],
    select,
    textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 0.4rem;
        font-size: 0.9rem;
    }

    select {
        width: 100%;
        box-sizing: border-box;
        padding-right: 2rem;
    }

    textarea {
        min-height: 80px;
    }

    .form-actions {
        margin-top: 1.5rem;
    }

    .submit-btn {
        padding: 0.6rem 1.5rem;
        font-size: 0.9rem;
    }
}

.skeleton-placeholder {
    display: inline-block;
    height: 16px;
    background: #f0f0f0;
    border-radius: 4px;
    width: 60%;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1rem;
}

.faq-item {
    background: #eef6fb;
    border-left: 4px solid #1890ff;
    padding: 1rem;
    border-radius: 6px;
}

.faq-item p {
    margin: 0.5rem 0;
    color: #444;
}

.pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.pagination button {
    padding: 0.4rem 1rem;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
    background-color: #f0f0f0;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>