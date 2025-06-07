<script setup>
import { ref } from 'vue'

const activeDropdown = ref(null)
const isCollapsed = ref(false)

const toggleDropdown = (dropdownName) => {
  if (activeDropdown.value === dropdownName) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = dropdownName
  }
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  // Đóng tất cả dropdown khi thu gọn
  if (isCollapsed.value) {
    activeDropdown.value = null
  }
}
</script>

<template>
  <header class="header" :class="{ 'collapsed': isCollapsed }">
    <!-- Toggle Button -->
    <button class="toggle-btn" @click="toggleSidebar" :title="isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'">
      <svg class="toggle-icon" :class="{ 'rotated': isCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="logo">
      <img src="@/assets/logoEcoit.jpg" alt="EcoIT Logo" />
      <span class="logo-text" v-show="!isCollapsed">EcoIT</span>
    </div>

    <nav class="nav-menu">
      <ul>
        <li>
          <RouterLink to="/home-EcoIT" :title="isCollapsed ? 'Trang Chủ' : ''">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="nav-text" v-show="!isCollapsed">Trang Chủ</span>
          </RouterLink>
        </li>

        <li class="dropdown-item">
          <a href="#" class="dropdown-link" @click.prevent="!isCollapsed && toggleDropdown('thuctapsinh')" :title="isCollapsed ? 'Thực tập sinh' : ''">
            <div class="nav-content">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span class="nav-text" v-show="!isCollapsed">Thực tập sinh</span>
            </div>
            <svg v-show="!isCollapsed" class="dropdown-icon" :class="{ 'rotated': activeDropdown === 'thuctapsinh' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <div v-show="!isCollapsed" class="submenu-container" :class="{ 'open': activeDropdown === 'thuctapsinh' }">
            <ul class="submenu">
              <li>
                <RouterLink to="/lich-lam-viec">
                  <svg class="submenu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Lịch Thực Tập Sinh
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/danh-sach-thuc-tap-sinh">
                  <svg class="submenu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Danh Sách Thực Tập Sinh
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/hop-intern">
                  <svg class="submenu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Họp Intern
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>

        <li class="dropdown-item">
          <a href="#" class="dropdown-link" @click.prevent="!isCollapsed && toggleDropdown('sanpham')" :title="isCollapsed ? 'Sản phẩm' : ''">
            <div class="nav-content">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span class="nav-text" v-show="!isCollapsed">Sản phẩm</span>
            </div>
            <svg v-show="!isCollapsed" class="dropdown-icon" :class="{ 'rotated': activeDropdown === 'sanpham' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <div v-show="!isCollapsed" class="submenu-container" :class="{ 'open': activeDropdown === 'sanpham' }">
            <ul class="submenu">
              <li>
                <RouterLink to="/lich-lam-viec">
                  <svg class="submenu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Lịch Thực Tập Sinh
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/danh-sach-thuc-tap-sinh">
                  <svg class="submenu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Danh Sách Thực Tập Sinh
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>

        <li>
          <RouterLink to="/gioi-thieu" :title="isCollapsed ? 'Giới Thiệu' : ''">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="nav-text" v-show="!isCollapsed">Giới Thiệu</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="user-profile">
      <div class="user-info dropdown-item" @click.prevent="!isCollapsed && toggleDropdown('user')" :title="isCollapsed ? 'Adudu' : ''">
        <div class="user-avatar">
          <img class="avatar-img" src="@/assets/anh3cu.jpg" alt="Avatar" />
        </div>
        <div class="user-details" v-show="!isCollapsed">
          <span class="greeting">Xin chào</span>
          <span class="username">Adudu</span>
        </div>
        <svg v-show="!isCollapsed" class="dropdown-icon" :class="{ 'rotated': activeDropdown === 'user' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div v-show="!isCollapsed" class="submenu-container user-submenu-container" :class="{ 'open': activeDropdown === 'user' }">
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
  padding: 20px 15px;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
  border-right: 1px solid #333;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.collapsed {
  width: 80px;
  padding: 20px 10px;
}

.toggle-btn {
  position: absolute;
  top: 15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.toggle-btn:hover {
  background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.toggle-icon {
  width: 16px;
  height: 16px;
  color: #333;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(90deg);
}

.logo {
  margin-bottom: 30px;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.header.collapsed .logo {
  border-bottom: none;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.logo img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: brightness(1.1) contrast(1.1);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.header:not(.collapsed) .logo img {
  width: 120px;
  height: auto;
}

.logo-text {
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
  transition: opacity 0.3s ease;
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
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
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

.header.collapsed .nav-menu li a {
  justify-content: center;
  padding: 16px 12px;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.header.collapsed .nav-content {
  justify-content: center;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  transition: opacity 0.3s ease;
}

.dropdown-link {
  justify-content: space-between !important;
  cursor: pointer;
}

.header.collapsed .dropdown-link {
  justify-content: center !important;
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

.header.collapsed .nav-menu li a:hover {
  transform: translateX(0) scale(1.1);
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
  max-height: 300px;
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
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 400;
  color: #e0e0e0;
  border-radius: 8px;
  margin: 0 8px;
  gap: 10px;
}

.submenu-icon {
  width: 16px;
  height: 16px;
}

.submenu li a:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: #000000;
  transform: translateX(8px);
}

.user-profile {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.header.collapsed .user-profile {
  border-top: none;
  padding-top: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #404040;
  position: relative;
}

.header.collapsed .user-info {
  justify-content: center;
  padding: 12px;
}

.user-submenu-container {
  margin-top: 8px;
}

.user-submenu-container.open {
  max-height: 100px;
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  transition: all 0.3s ease;
}

.header.collapsed .avatar-img {
  width: 36px;
  height: 36px;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  transition: all 0.3s ease;
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

  .header.collapsed {
    width: 100%;
    padding: 15px 20px;
  }

  .toggle-btn {
    position: static;
    margin-left: auto;
    margin-right: 15px;
  }

  .logo {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
    flex-direction: row;
  }

  .logo img {
    width: 40px !important;
    height: 40px !important;
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