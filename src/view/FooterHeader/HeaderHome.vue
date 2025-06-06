<script setup>
import { ref } from 'vue'

const activeDropdown = ref(null)

const toggleDropdown = (dropdownName) => {
  if (activeDropdown.value === dropdownName) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = dropdownName
  }
}
</script>

<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logoEcoit.jpg" alt="EcoIT Logo" />
    </div>
    <nav class="nav-menu">
      <ul>
        <li><RouterLink to="/home-EcoIT">Trang Chủ</RouterLink></li>
        <li class="dropdown-item">
          <a href="#" class="dropdown-link" @click.prevent="toggleDropdown('thuctapsinh')">
            Thực tập sinh
            <svg class="dropdown-icon" :class="{ 'rotated': activeDropdown === 'thuctapsinh' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <div class="submenu-container" :class="{ 'open': activeDropdown === 'thuctapsinh' }">
            <ul class="submenu">
              <li>
                <RouterLink to="/lich-lam-viec">Lịch Thực Tập Sinh</RouterLink>
              </li>
              <li>
                <RouterLink to="/danh-sach-thuc-tap-sinh">Danh Sách Thực Tập Sinh</RouterLink>
              </li>
              <li>
                <RouterLink to="/hop-intern">Họp Intern</RouterLink>
              </li>
            </ul>
          </div>
        </li>
        <li class="dropdown-item">
          <a href="#" class="dropdown-link" @click.prevent="toggleDropdown('sanpham')">
            Sản phẩm
            <svg class="dropdown-icon" :class="{ 'rotated': activeDropdown === 'sanpham' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <div class="submenu-container" :class="{ 'open': activeDropdown === 'sanpham' }">
            <ul class="submenu">
              <li>
                <RouterLink to="/lich-lam-viec">Lịch Thực Tập Sinh</RouterLink>
              </li>
              <li>
                <RouterLink to="/danh-sach-thuc-tap-sinh">Danh Sách Thực Tập Sinh</RouterLink>
              </li>
            </ul>
          </div>
        </li>
        <li><RouterLink to="/gioi-thieu">Giới Thiệu</RouterLink></li>
      </ul>
    </nav>

    <div class="user-profile">
      <div class="user-info dropdown-item" @click.prevent="toggleDropdown('user')">
        <div class="user-avatar">
          <img class="avatar-img" src="@/assets/anh3cu.jpg" alt="Avatar" />
        </div>
        <div class="user-details">
          <span class="greeting">Xin chào</span>
          <span class="username">Adudu</span>
        </div>
        <svg class="dropdown-icon" :class="{ 'rotated': activeDropdown === 'user' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div class="submenu-container user-submenu-container" :class="{ 'open': activeDropdown === 'user' }">
        <ul class="submenu user-submenu">
          <li>
            <RouterLink to="/dang-xuat" class="logout-link">
              <svg class="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Đăng xuất
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 280px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
  display: flex;
  flex-direction: column;
  padding: 30px 25px;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
  border-right: 1px solid #333;
}

.logo {
  margin-bottom: 40px;
  text-align: center;
  padding-bottom: 30px;
  border-bottom: 1px solid #333;
}

.logo img {
  width: 160px;
  height: auto;
  object-fit: contain;
  filter: brightness(1.1) contrast(1.1);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.logo img:hover {
  transform: scale(1.03);
  filter: brightness(1.2) contrast(1.2);
}

.nav-menu {
  flex: 1;
  width: 100%;
}

.nav-menu ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  position: relative;
  width: 100%;
}

.nav-menu li a {
  display: block;
  padding: 16px 20px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
  font-size: 15px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.nav-menu li a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-menu li a:hover::before {
  left: 100%;
}

.nav-menu li a:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #000000;
  border-color: #e0e0e0;
  transform: translateX(5px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.15);
}

.nav-menu li a.router-link-active {
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  color: #000000;
  border-color: #e0e0e0;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.dropdown-item {
  position: relative;
  width: 100%;
}

.dropdown-link {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.submenu-container {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-container.open {
  max-height: 200px;
}

.submenu {
  background: linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  margin: 8px 0;
  padding: 12px 0;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid #404040;
  list-style: none;
}

.submenu li a {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 400;
  color: #e0e0e0;
  border-radius: 8px;
  margin: 0 8px;
}

.submenu li a:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: #000000;
  transform: translateX(8px);
}

.user-profile {
  margin-top: auto;
  padding-top: 30px;
  border-top: 1px solid #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #404040;
  position: relative;
}

.user-submenu-container {
  margin-top: 8px;
}

.user-submenu-container.open {
  max-height: 100px;
}

.user-avatar {
  position: relative;
}

.avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  transition: all 0.3s ease;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  transition: color 0.3s ease;
}

.greeting {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.8;
  line-height: 1.2;
}

.username {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
}

.user-submenu {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 8px;
}

.logout-link {
  display: flex !important;
  align-items: center;
  gap: 10px;
  color: #ff4444 !important;
  font-weight: 500;
}

.logout-link:hover {
  background: linear-gradient(135deg, #ff4444 0%, #ff2222 100%) !important;
  color: #ffffff !important;
  transform: translateX(8px);
}

.logout-icon {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    padding: 15px 20px;
  }

  .logo {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .logo img {
    width: 120px;
  }

  .nav-menu {
    display: none;
  }

  .user-profile {
    margin-top: 0;
    margin-left: auto;
    padding-top: 0;
    border-top: none;
  }
}

/* Animation for smooth transitions */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-menu li {
  animation: slideIn 0.3s ease forwards;
}

.nav-menu li:nth-child(1) { animation-delay: 0.1s; }
.nav-menu li:nth-child(2) { animation-delay: 0.2s; }
.nav-menu li:nth-child(3) { animation-delay: 0.3s; }
.nav-menu li:nth-child(4) { animation-delay: 0.4s; }
</style>