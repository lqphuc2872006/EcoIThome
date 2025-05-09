<template>
  <HeaderHome />
  <div class="calendar-container">
    <div class="button-add">
      <button @click="openModelupdate">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
    </div>
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

    <!-- Modal hiển thị danh sách thực tập sinh -->
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

    <!-- Modal cập nhật InternWorkSchedule -->
    <div v-if="showModelupdate" class="modal-new">
      <div class="modal-content">
        <div class="form-add">
          <h3 style="text-align: center">Cập Nhật Intern</h3>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          <form @submit.prevent="submitUpdate">
            <div class="form-group">
              <label for="intern">Tên Intern:</label>
              <select
                  v-model="selectedInternId"
                  id="intern"
                  class="form-control"
                  required
                  @change="fetchInternSchedule"
              >
                <option value="" disabled>Chọn Intern</option>
                <option v-for="intern in interns" :key="intern.id" :value="intern.id">
                  {{ intern.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="startDate">Ngày bắt đầu:</label>
              <input
                  v-model="internData.startDate"
                  id="startDate"
                  type="date"
                  class="form-control"
                  required
              />
            </div>
            <div class="form-group">
              <label for="endDate">Ngày kết thúc:</label>
              <input
                  v-model="internData.endDate"
                  id="endDate"
                  type="date"
                  class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="hours">Số giờ/tuần:</label>
              <input
                  v-model="internData.availableHoursPerWeek"
                  id="hours"
                  type="number"
                  class="form-control"
                  required
              />
            </div>
            <div style="display: flex;justify-content: flex-end;gap: 10px;margin-top: 20px">
              <button type="button" class="bg-red-500" @click="closeModelupdate">Đóng</button>
              <button type="submit" class="bg-green-600">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderHome from '@/view/FooterHeader/HeaderHome.vue';
import axios from 'axios';

const internData = ref({
  startDate: '',
  endDate: '',
  availableHoursPerWeek: '',
});

const interns = ref([]);
const selectedInternId = ref('');
const scheduleId = ref(null);
const showModelupdate = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const openModelupdate = async () => {
  await fetchInterns();
  showModelupdate.value = true;
  errorMessage.value = '';
  successMessage.value = '';
};

const closeModelupdate = () => {
  showModelupdate.value = false;
  internData.value = { startDate: '', endDate: '', availableHoursPerWeek: '' };
  selectedInternId.value = '';
  scheduleId.value = null;
  errorMessage.value = '';
  successMessage.value = '';
};

const fetchInterns = async () => {
  try {
    const response = await axios.get('http://localhost:8080/EcoIT/interngetall');
    interns.value = response.data;
    console.log('Danh sách Intern:', response.data);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Intern:', error.message);
    errorMessage.value = 'Không thể tải danh sách Intern. Vui lòng thử lại.';
  }
};

const fetchInternSchedule = async () => {
  if (!selectedInternId.value) {
    internData.value = { startDate: '', endDate: '', availableHoursPerWeek: '' };
    scheduleId.value = null;
    return;
  }
  try {
    const response = await axios.get(`http://localhost:8080/EcoIT/intern-work-schedules/intern/${selectedInternId.value}`);
    if (response.data) {
      internData.value = {
        startDate: response.data.startDate.split('T')[0],
        endDate: response.data.endDate ? response.data.endDate.split('T')[0] : '',
        availableHoursPerWeek: response.data.availableHoursPerWeek,
      };
      scheduleId.value = response.data.id;
    } else {
      internData.value = { startDate: '', endDate: '', availableHoursPerWeek: '' };
      scheduleId.value = null;
    }
    console.log('Lịch làm việc của Intern:', response.data);
  } catch (error) {
    console.error('Lỗi khi lấy lịch làm việc:', error.message);
    internData.value = { startDate: '', endDate: '', availableHoursPerWeek: '' };
    scheduleId.value = null;
  }
};

const submitUpdate = async () => {
  if (!selectedInternId.value || !scheduleId.value) {
    errorMessage.value = 'Vui lòng chọn Intern và đảm bảo có lịch làm việc.';
    return;
  }
  try {
    const selectedIntern = interns.value.find(intern => intern.id === selectedInternId.value);
    const response = await axios.put(`http://localhost:8080/EcoIT/intern-updateinternWk/${scheduleId.value}`, {
      startDate: internData.value.startDate,
      endDate: internData.value.endDate || null,
      availableHoursPerWeek: parseInt(internData.value.availableHoursPerWeek),
      intern: { name: selectedIntern.name },
    });
    console.log('Cập nhật InternWorkSchedule thành công:', response.data);
    successMessage.value = 'Cập nhật lịch làm việc thành công!';
    setTimeout(() => {
      closeModelupdate();
      fetchSchedules();
    }, 2000);
  } catch (error) {
    console.error('Lỗi khi cập nhật InternWorkSchedule:', error.message);
    errorMessage.value = 'Không thể cập nhật lịch làm việc. Vui lòng thử lại.';
  }
};

const currentDate = ref(new Date(2025, 4, 1));
const selectedDay = ref(null);
const showModal = ref(false);
const schedules = ref([]);
const selectedDayInterns = ref([]);

const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchSchedules = async () => {
  try {
    const response = await axios.get('http://localhost:8080/EcoIT/intern-work-schedules');
    console.log('Dữ liệu lịch làm việc từ API:', response.data);
    schedules.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy lịch làm việc:', error.message);
    errorMessage.value = 'Không thể tải danh sách lịch làm việc. Vui lòng thử lại.';
  }
};

const fetchInternsByDate = async (date) => {
  const formattedDate = date;
  try {
    const response = await axios.get(`http://localhost:8080/EcoIT/intern-work-schedules/by-date?date=${formattedDate}`);
    console.log(`Dữ liệu lịch làm việc cho ngày ${formattedDate}:`, response.data);
    const uniqueInterns = [];
    const seenInternIds = new Set();
    response.data.forEach(schedule => {
      if (schedule.intern && schedule.intern.id && schedule.intern.name && !seenInternIds.has(schedule.intern.id)) {
        seenInternIds.add(schedule.intern.id);
        uniqueInterns.push({
          id: schedule.intern.id,
          name: schedule.intern.name,
        });
      }
    });
    console.log(`Danh sách thực tập sinh làm việc cho ngày ${formattedDate}:`, uniqueInterns);
    return uniqueInterns;
  } catch (error) {
    console.error('Lỗi khi lấy thực tập sinh theo ngày:', error.message);
    errorMessage.value = 'Không thể tải danh sách thực tập sinh. Vui lòng thử lại.';
    return [];
  }
};

const getInternCountByDate = (date) => {
  const formattedDate = date;
  const uniqueInternIds = new Set();
  schedules.value.forEach(schedule => {
    const startDate = schedule.startDate.split('T')[0];
    const endDate = schedule.endDate ? schedule.endDate.split('T')[0] : formatDateToString(new Date());
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

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const days = [];
  const totalDays = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i);
    days.push({
      date: formatDateToString(date),
      displayDate: date,
    });
  }
  return days;
});

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

const selectDay = async (day) => {
  selectedDay.value = day;
  selectedDayInterns.value = (await fetchInternsByDate(day)) || [];
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedDay.value = null;
  selectedDayInterns.value = [];
};

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

.button-add {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 24px;
}

.button-add button {
  padding: 12px 24px;
  background-color: green;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-add button:hover {
  background-color: #42b983;
}

.modal-new {
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

.modal-new .modal-content {
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

.form-add {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.form-control {
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.bg-red-500 {
  background-color: #e53e3e;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bg-red-500:hover {
  background-color: #c53030;
}

.bg-green-600 {
  background-color: #38a169;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bg-green-600:hover {
  background-color: #2f855a;
}

.error-message {
  color: #e53e3e;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 16px;
}

.success-message {
  color: #38a169;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 16px;
}
</style>