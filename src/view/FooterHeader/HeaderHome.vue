<script setup>
</script>

<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logoEcoit.jpg" alt="EcoIT Logo" />
    </div>
    <nav class="nav-menu">
      <ul>
        <li><a href="/home-EcoIT">Trang Chủ</a></li>
        <!-- Bắt đầu menu xổ xuống -->
        <li class="relative group">
          <a href="#" class="flex items-center gap-1">
            Thực tập sinh
            <svg class="w-3 h-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 15l7-7 7 7" />
            </svg>
          </a>
          <ul class="absolute hidden group-hover:block bg-white text-black shadow-md rounded-md mt-2 w-64">
            <li>
              <RouterLink to="/lich-lam-viec" class="block px-6 py-3 hover:bg-gray-200">Lịch Thực Tập Sinh</RouterLink>
            </li>
            <li>
              <RouterLink to="/danh-sach-thuc-tap-sinh" class="block px-6 py-3 hover:bg-gray-200">Danh Sách Thực Tập Sinh</RouterLink>
            </li>
            <li>
              <RouterLink to="/hop-intern" class="block px-6 py-3 hover:bg-gray-200">Họp Intern</RouterLink>
            </li>
          </ul>
        </li>

        <li class="relative group">
          <a href="#" class="flex items-center gap-1">
            Sản phẩm
            <svg class="w-3 h-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 15l7-7 7 7" />
            </svg>
          </a>
          <ul class="absolute hidden group-hover:block bg-white text-black shadow-md rounded-md mt-2 w-64">
            <li>
              <RouterLink to="/lich-lam-viec" class="block px-6 py-3 hover:bg-gray-200">Lịch Thực Tập Sinh</RouterLink>
            </li>
            <li>
              <RouterLink to="/danh-sach-thuc-tap-sinh" class="block px-6 py-3 hover:bg-gray-200">Danh Sách Thực Tập Sinh</RouterLink>
            </li>
          </ul>

        </li>
        <!-- Kết thúc menu xổ xuống -->
        <li><a href="#">Giới Thiệu</a></li>
        <li class="relative group">
            <div style="display: flex;align-items: center;gap: 5px">
              <label style="font-size: 15px;color: white">Xin chào, <strong>Adudu</strong></label>
              <img  class="avt" src="@/assets/anh3cu.jpg">
              <svg class="w-3 h-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 15l7-7 7 7" />
              </svg>
            </div>
          <ul class="absolute hidden group-hover:block bg-white text-black shadow-md rounded-md mt-2 w-100">
            <li>
              <RouterLink to="/lich-lam-viec" class="block px-6 py-3 hover:bg-gray-200">
                <div style="display: flex;align-items: center;justify-content: center;color: #1a1a1a;gap: 5px">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-1" />
                  </svg> Đăng xuất
                </div>
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
/* --- giữ nguyên CSS cũ --- */

.header {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: black;
}

.logo img {
  height: 50px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.1);
}

.nav-menu ul {
  display: flex;
  align-items: center;
  gap: 40px;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
}

.nav-menu li {
  position: relative;
}

.nav-menu li a {
  padding: 0px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  position: relative;
  transition: color 0.3s ease;
}

.nav-menu li a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: #a8ff78;
  transition: width 0.3s ease;
}

.nav-menu li a:hover::after {
  width: 100%;
}

.nav-menu li a:hover {
  color: #a8ff78;
}

.group:hover ul {
  display: block;
}
.group svg {
  transition: transform 0.3s ease;
}

.group:hover svg {
  transform: rotate(180deg);
}


.group ul {
  display: none;
  position: absolute;
  background: white;
  color: black;
  top: 100%;
  left: 0;
  min-width: 160px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.group ul li a {
  display: block;
  padding: 10px 15px;
  color: black;
  text-decoration: none;
  font-weight: 500;
}

.group ul li a:hover {
  background-color: #f0f0f0;
}


.user-profile-inner svg {
  width: 27px;
  height: 27px;
  fill: #fff;
}
.avt{
  width: 70px;
  border-radius: 100px;
  border: 3px solid greenyellow;
}
.button-out{

}
</style>
