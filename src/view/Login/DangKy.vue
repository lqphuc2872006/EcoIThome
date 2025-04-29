<script setup>
import { ref } from 'vue';
import {Register} from "@/view/Login/Js/DangKy";
import { useRouter } from 'vue-router';

const userName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const phoneNumber = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  // Validate confirm password
  if (password.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp';
    loading.value = false;
    return;
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Email không hợp lệ';
    loading.value = false;
    return;
  }

  // Validate password length
  if (password.value.length < 6) {
    error.value = 'Mật khẩu phải dài ít nhất 6 ký tự';
    loading.value = false;
    return;
  }

  try {
    const { message } = await Register(userName.value, password.value, email.value, phoneNumber.value);
    success.value = message;
    userName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    phoneNumber.value = '';
    setTimeout(() => router.push('/dangnhap'), 1500); // Chuyển hướng sau 1.5s
  } catch (err) {
    error.value = err.message || 'Đã xảy ra lỗi khi đăng ký';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
      class="min-h-screen flex items-center justify-center bg-cover bg-center backdrop-blur-md"
      style="background-image: url('https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
  >
    <div
        class="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-500 animate-fade-in">
      <img width="100%" style="padding: 20px" src="../../assets/logoEcoit.jpg" alt="EcoIT Logo" class="mb-4">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Ký</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Họ và Tên</label>
          <input
              type="text"
              id="name"
              v-model="userName"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              placeholder="Nhập họ và tên"
              required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              type="email"
              id="email"
              v-model="email"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              placeholder="Nhập email của bạn"
              required
          />
        </div>
        <div class="mb-4">
          <label for="text" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
              type="text"
              id="sdt"
              v-model="phoneNumber"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              placeholder="Nhập sdt của bạn"
              required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Mật Khẩu</label>
          <input
              type="password"
              id="password"
              v-model="password"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              placeholder="Nhập mật khẩu"
              required
          />
        </div>
        <div class="mb-6">
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">Xác Nhận Mật Khẩu</label>
          <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              placeholder="Xác nhận mật khẩu"
              required
          />
        </div>
        <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
        >
          Đăng Ký
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Đã có tài khoản?
        <router-link class="text-green-600 hover:underline" to="/dangnhap">Đăng nhập</router-link>
      </p>
    </div>
  </div>
  <router-view/>
</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

.backdrop-blur-md {
  backdrop-filter: blur(6px);
}

.bg-white {
  background-color: rgba(255, 255, 255, 0.95);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>