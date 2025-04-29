<script setup>
// Không thay đổi gì trong script
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
              <RouterLink to="/lich-nhan-vien" class="block px-6 py-3 hover:bg-gray-200">Lịch nhân viên</RouterLink>
            </li>
            <li>
              <RouterLink to="/danh-sach-thuc-tap-sinh" class="block px-6 py-3 hover:bg-gray-200">Danh Sách Thực Tập Sinh</RouterLink>
            </li>
          </ul>

        </li>
        <!-- Kết thúc menu xổ xuống -->
        <li><a href="#">Giới Thiệu</a></li>

        <li>
          <div
              aria-label="User Login Button"
              tabindex="0"
              role="button"
              class="user-profile"
          >
            <div class="user-profile-inner">
              <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
              >
                <g data-name="Layer 2" id="Layer_2">
                  <path
                      d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"
                  ></path>
                </g>
              </svg>
              <RouterLink to="/dangnhap" class="login-link">
                <span>Login</span>
              </RouterLink>
            </div>
          </div>
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

/* Dropdown menu */
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

/* User profile giữ nguyên */
.user-profile {
  width: 131px;
  height: 51px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s ease;
  background: linear-gradient(to bottom right, white 0%, rgba(46, 142, 255, 0) 30%);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile:hover,
.user-profile:focus {
  background-color: greenyellow;
  box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
  outline: none;
}

.user-profile-inner {
  width: 127px;
  height: 47px;
  border-radius: 13px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #fff;
  font-weight: 600;
}

.user-profile-inner svg {
  width: 27px;
  height: 27px;
  fill: #fff;
}
</style>
