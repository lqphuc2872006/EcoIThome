<template>
  <HeaderHome />
  <div class="calendar-container">
    <h2>Lịch Thực Tập Sinh - Tháng {{ currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }) }}</h2>

    <div class="month-navigation">
      <button @click="changeMonth(-1)">Tháng trước</button>
      <button @click="changeMonth(1)">Tháng sau</button>
    </div>

    <div class="days-list">
      <div
          v-for="day in daysInMonth"
          :key="day.date"
          class="day-card"
          :class="{ 'has-interns': getInternCountByDate(day.date) > 0 }"
          @click="selectDay(day.date)"
      >
        <h3>
          {{ new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }) }}
          <span class="intern-count">({{ getInternCountByDate(day.date) }})</span>
        </h3>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal && selectedDay" class="modal-overlay">
      <div class="modal-content">
        <h3>
          {{
            new Date(selectedDay).toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }}
        </h3>
        <ul v-if="selectedDayInterns.length > 0">
          <li v-for="intern in selectedDayInterns" :key="intern.id">
            <span class="intern-name">{{ intern.name }}</span>
          </li>
        </ul>
        <p v-else>Không có thực tập sinh làm việc trong ngày này.</p>
        <button class="modal-close" @click="closeModal">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderHome from '@/view/FooterHeader/HeaderHome.vue';
import axios from 'axios';

const currentDate = ref(new Date(2025, 4, 1)); // Mặc định tháng 5/2025
const selectedDay = ref(null);
const showModal = ref(false);
const schedules = ref([]);
const selectedDayInterns = ref([]);

// Hàm định dạng ngày thành YYYY-MM-DD mà không phụ thuộc vào múi giờ
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fetch dữ liệu lịch làm việc từ API
const fetchSchedules = async () => {
  try {
    const response = await axios.get('http://localhost:8080/EcoIT/intern-work-schedules');
    console.log('Dữ liệu lịch làm việc từ API:', response.data); // Debug dữ liệu
    schedules.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy lịch làm việc:', error.message);
    if (error.response) {
      console.error('Mã trạng thái:', error.response.status);
      console.error('Thông tin lỗi:', error.response.data);
    }
  }
};

// Fetch danh sách thực tập sinh làm việc theo ngày
const fetchInternsByDate = async (date) => {
  const formattedDate = date; // Đã ở dạng YYYY-MM-DD
  try {
    const response = await axios.get(`http://localhost:8080/EcoIT/intern-work-schedules/by-date?date=${formattedDate}`);
    console.log(`Dữ liệu lịch làm việc cho ngày ${formattedDate}:`, response.data); // Debug dữ liệu

    // Lọc thực tập sinh duy nhất dựa trên intern.id
    const uniqueInterns = [];
    const seenInternIds = new Set();
    response.data.forEach(schedule => {
      if (schedule.intern && !seenInternIds.has(schedule.intern.id)) {
        seenInternIds.add(schedule.intern.id);
        uniqueInterns.push({
          id: schedule.intern.id,
          name: schedule.intern.name
        });
      }
    });

    console.log(`Danh sách thực tập sinh làm việc cho ngày ${formattedDate}:`, uniqueInterns);
    return uniqueInterns;
  } catch (error) {
    console.error('Lỗi khi lấy thực tập sinh theo ngày:', error.message);
    if (error.response) {
      console.error('Mã trạng thái:', error.response.status);
      console.error('Thông tin lỗi:', error.response.data);
    }
    return [];
  }
};

// Hàm lấy số lượng thực tập sinh làm việc theo ngày
const getInternCountByDate = (date) => {
  const formattedDate = date; // Đã ở dạng YYYY-MM-DD

  // Lọc các lịch có ngày nằm trong khoảng start_date đến end_date
  const uniqueInternIds = new Set();
  schedules.value.forEach(schedule => {
    const startDate = schedule.startDate.split('T')[0]; // Lấy YYYY-MM-DD từ start_date
    const endDate = schedule.endDate ? schedule.endDate.split('T')[0] : formatDateToString(new Date()); // Nếu end_date null, dùng ngày hiện tại
    const isInRange = formattedDate >= startDate && formattedDate <= endDate;
    if (isInRange && schedule.intern) {
      uniqueInternIds.add(schedule.intern.id);
    }
    console.log(`Ngày ${formattedDate} - Schedule: start=${startDate}, end=${endDate}, isInRange=${isInRange}, internId=${schedule.intern ? schedule.intern.id : 'null'}`);
  });

  const count = uniqueInternIds.size;
  console.log(`Số lượng thực tập sinh làm việc cho ngày ${formattedDate}: ${count}`);
  return count;
};

// Tạo danh sách ngày trong tháng
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const days = [];
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i);
    days.push({
      date: formatDateToString(date), // Lưu dưới dạng chuỗi YYYY-MM-DD
      displayDate: date // Dùng để hiển thị
    });
  }

  return days;
});

// Chuyển tháng trước/sau
const changeMonth = (offset) => {
  const newMonth = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + offset,
      1
  );
  currentDate.value = newMonth;
  selectedDay.value = null;
  showModal.value = false;
  fetchSchedules();
};

// Xử lý khi click vào ngày
const selectDay = async (day) => {
  selectedDay.value = day;
  selectedDayInterns.value = await fetchInternsByDate(day);
  showModal.value = true;
};

// Đóng modal
const closeModal = () => {
  showModal.value = false;
  selectedDay.value = null;
  selectedDayInterns.value = [];
};

// Load dữ liệu khi component được mount
onMounted(() => {
  fetchSchedules();
});
</script>

<style scoped>
.calendar-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  font-family: 'Inter', sans-serif;
}

h2 {
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}

.month-navigation {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.month-navigation button {
  padding: 12px 24px;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.month-navigation button:hover {
  background-color: #2b6cb0;
}

.days-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.day-card {
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.day-card.has-interns {
  background-color: #e6fffa;
  border-color: #4fd1c5;
}

.day-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.day-card h3 {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.intern-count {
  color: #4fd1c5;
  font-size: 0.9rem;
  font-weight: 700;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

.modal-content h3 {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin-bottom: 24px;
}

.modal-content li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
}

.intern-name {
  color: #2d3748;
  font-weight: 600;
}

.modal-content p {
  color: #718096;
  font-size: 1rem;
  margin-bottom: 24px;
}

.modal-close {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: #c53030;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>