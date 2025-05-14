<script setup>
import HeaderHome from "@/view/FooterHeader/HeaderHome.vue";
import FooterHome from "@/view/FooterHeader/FooterHome.vue";
</script>

<template>
  <div class="layout">
    <HeaderHome />
    <main class="main-content">
      <img class="banner" src="@/assets/banner.jpg" alt="Banner" />
    </main>
    <FooterHome />
  </div>
</template>

<style scoped>
/* Reset cơ bản */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Tổng thể bố cục */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Main content */
.main-content {
  flex: 1;
}

/* Banner */
.banner {
  width: 100%;
  height: 100vh;
}

/* Style cho HeaderHome */
.header {
  background-color: #000;
  color: #fff;
  padding: 16px;
  display: flex;
  align-items: center;
}

/* Style cho menu trong HeaderHome */
.nav-menu {
  display: flex;
  flex-direction: row; /* Menu nằm ngang */
  gap: 20px;
  align-items: center;
}

/* Style cho các mục menu */
.nav-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #ccc;
}

/* Footer */
.footer {
  background-color: #222;
  color: #fff;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

</style>