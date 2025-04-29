<script setup>
import { LoginIn } from "@/view/Login/Js/DangNhap";
import { ref } from "vue";
import {useRouter} from "vue-router";

const userName = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();

const handinLogin = async () => {
  try {
    const { token } = await LoginIn(userName.value, password.value);
    localStorage.setItem('authToken', token); // Lưu token
    userName.value = '';
    password.value = '';
    router.push('/home-EcoIT');
  } catch (err) {
    error.value = err.message || 'Đã xảy ra lỗi khi đăng nhập';
  }
};
</script>

<template>

  <div
      class="min-h-screen flex items-center justify-center bg-cover bg-center backdrop-blur-md"
      style="background-image: url('https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
  >
    <div class="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-500 animate-fade-in">
      <img width="100%" style="padding: 20px" src="../../assets/logoEcoit.jpg" alt="EcoIT Logo" class="mb-4">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>
      <form @submit.prevent="handinLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">UserName</label>
          <input
              type="text"
              id="email"
              v-model="userName"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-500 transition duration-200"
              placeholder="Nhập userName của bạn"
              required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Mật Khẩu</label>
          <input
              type="password"
              id="password"
              v-model="password"
              class="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-500 transition duration-200"
              placeholder="Nhập mật khẩu"
              required
          />
        </div>
        <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
        >
          Đăng Nhập
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Chưa có tài khoản? <router-link class="text-green-600 hover:underline" to="/dangky">Đăng ký</router-link>
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