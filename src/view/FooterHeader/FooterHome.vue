<script setup>
// Không cần logic trong script setup
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="contact-info">
        <a href="mailto:lequangphuc2872006@gmail.com" class="contact-link">
          <i class="fas fa-envelope"></i> lequangphuc2872006@gmail.com
        </a>
        <span class="separator">|</span>
        <a href="tel:+0564795015" class="contact-link">
          <i class="fas fa-phone"></i> 0564795015
        </a>
      </div>
      <div class="copyright">
        <p>&copy; 2025 EcoIT. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

/* Import Font Awesome cho biểu tượng */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');

.footer {
  width: 100%;
  background: linear-gradient(90deg, #1a1a1a, #242424); /* Gradient nền đồng bộ với header */
  padding: 40px;
  box-sizing: border-box;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2); /* Bóng nhẹ phía trên */
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.contact-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  transition: color 0.3s ease;
}

.contact-link i {
  margin-right: 8px;
  color: #a8ff78; /* Màu xanh lá cây đồng bộ với header */
}

.contact-link:hover {
  color: #a8ff78;
}

.separator {
  color: #ffffff;
  font-size: 16px;
}

.copyright p {
  margin: 0;
  font-size: 14px;
  color: #cccccc;
}

</style>