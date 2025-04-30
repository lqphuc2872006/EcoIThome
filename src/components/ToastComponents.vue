<template>
  <ul class="notifications" aria-live="polite">
    <li
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', toast.type]"
        role="alert"
    >
      <div class="column">
        <i :class="['fas', toast.icon, `${toast.type}-icon`]"></i>
        <span>{{ toast.message }}</span>
      </div>
      <button
          class="close-btn"
          @click="removeToast(toast.id)"
          aria-label="Close notification"
      >
        <i class="fas fa-times close-icon"></i>
      </button>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])

const toastDetails = {
  success: { icon: 'fa-check-circle' },
  error: { icon: 'fa-times-circle' },
  warning: { icon: 'fa-exclamation-circle' },
  info: { icon: 'fa-info-circle' }
}

const showToast = (type, message, duration = 3000) => {
  if (!toastDetails[type]) {
    console.warn(`Invalid toast type: ${type}`)
    return
  }

  const id = Date.now()
  toasts.value.push({ id, type, message, icon: toastDetails[type].icon })

  setTimeout(() => removeToast(id), duration)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

defineExpose({ showToast })
</script>

<style scoped>
.notifications {
  position: fixed;
  top: 30px;
  right: 20px;
  z-index: 9999;
  list-style: none;
  padding: 0;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 400px;
  max-width: 90vw;
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: show_toast 0.3s ease forwards;
}

.column {
  display: flex;
  align-items: center;
}

.toast i {
  font-size: 1.5rem;
  margin-right: 10px;
}

.toast span {
  font-size: 1rem;
  word-break: break-word;
}

.toast.success { border-left: 5px solid #00b894; }
.toast.error { border-left: 5px solid #d63031; }
.toast.warning { border-left: 5px solid #fdcb6e; }
.toast.info { border-left: 5px solid #0984e3; }

.success-icon { color: #00b894; }
.error-icon { color: #d63031; }
.warning-icon { color: #fdcb6e; }
.info-icon { color: #0984e3; }

.close-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.close-icon {
  font-size: 1.2rem;
  color: #888;
  transition: color 0.2s ease;
}

.close-icon:hover {
  color: #555;
}

@keyframes show_toast {
  from { transform: translateX(110%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 480px) {
  .toast {
    width: 100%;
    max-width: 320px;
  }
}
</style>