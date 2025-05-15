<script setup>
</script>

<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logoEcoit.jpg" alt="EcoIT Logo" />
    </div>
    <nav class="nav-menu">
      <ul>
        <li><RouterLink to="/home-EcoIT">Trang Chủ</RouterLink></li>
        <li class="relative group">
          <a href="#" style="display: flex">
            Thực tập sinh
            <svg class="w-3 h-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </a>
          <ul class="submenu hidden group-hover:block">
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
        </li>
        <li class="relative group">
          <a href="#" style="display: flex">
            Sản phẩm
            <svg class="w-3 h-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </a>
          <ul class="submenu hidden group-hover:block">
            <li>
              <RouterLink to="/lich-lam-viec">Lịch Thực Tập Sinh</RouterLink>
            </li>
            <li>
              <RouterLink to="/danh-sach-thuc-tap-sinh">Danh Sách Thực Tập Sinh</RouterLink>
            </li>
          </ul>
        </li>
        <li><RouterLink to="/gioi-thieu">Giới Thiệu</RouterLink></li>
        <li class="relative group user-profile">
          <div class="user-info">
            <img class="avt" src="@/assets/anh3cu.jpg" alt="Avatar" />
            <span>Xin chào, <strong>Adudu</strong></span>
            <svg class="w-3 h-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </div>
          <ul class="submenu hidden group-hover:block">
            <li>
              <RouterLink to="/dang-xuat" class="logout" style="display: flex;justify-content: center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-1" />
                </svg>
                Đăng xuất
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}

.logo {
  margin-bottom: 30px;
}

.logo img {
  width: 150px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.05);
}

.nav-menu {
  width: 100%;
}

.nav-menu ul {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  padding: 12px 20px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-menu li a:hover {
  background-color: #a8ff78;
  color: #1a1a1a;
}

.group > a {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group svg {
  transition: transform 0.3s ease;
}

.group:hover svg {
  transform: rotate(180deg);
}

.submenu {
  background: #2a2a2a;
  border-radius: 8px;
  margin-top: 5px;
  padding: 10px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submenu li a {
  padding: 10px 30px;
  font-size: 14px;
  color: #ffffff;
}

.submenu li a:hover {
  background-color: #a8ff78;
  color: #1a1a1a;
}

.user-profile {
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #a8ff78;
  color: #1a1a1a;
}

.avt {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #a8ff78;
  object-fit: cover;
}

.logout {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>