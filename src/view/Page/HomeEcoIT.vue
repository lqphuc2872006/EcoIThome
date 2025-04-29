<script setup>
// Nếu cần logic gì cho header/footer có thể viết tại đây
import HeaderHome from "@/view/FooterHeader/HeaderHome.vue";
import FooterHome from "@/view/FooterHeader/FooterHome.vue";
</script>

<template>
  <div class="layout">
      <HeaderHome/>
    <main class="main-content">
      <img class="banner" src="@/assets/banner.jpg" alt="Banner">
    </main>
  </div>
  <FooterHome/>
</template>

<style scoped>
/* Reset cơ bản */
body {
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

/* Header */
.header {
  background-color: black;
  color: white;
  padding: 16px;
  text-align: center;
}

.banner {
  width: 100%;
  height: 100vh;
}

.footer {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
