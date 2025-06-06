<script setup>
import HeaderHome from "@/view/FooterHeader/HeaderHome.vue";
import FooterHome from "@/view/FooterHeader/FooterHome.vue";
</script>

<template>
  <div class="layout">
    <div>
      <HeaderHome />
    </div>
    <div class="main_banner">
      <img class="banner" src="@/assets/banner.jpg" alt="Banner" />
    </div>
  </div>
  <FooterHome/>
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
.main_banner{
  margin-left: 250px;
}

</style>