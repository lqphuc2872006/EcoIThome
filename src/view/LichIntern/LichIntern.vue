```vue
<template>
  <HeaderHome />
  <div class="calendar-container">
    <div class="thanh-chuc-nang">
      <div class="search-bar">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên intern..."
            class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-button">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="button-add">
        <button @click="openModelupdate">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </div>
    </div>


    <div class="bo_loc">
      <input type="date" name="" id="">
      <input type="date" name="" id="">
    </div>

    <h2>Lịch Thực Tập Sinh - Tháng {{ currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }) }}</h2>



    <div class="month-navigation">
      <button @click="changeMonth(-1)">Tháng trước</button>
      <button @click="changeMonth(1)">Tháng sau</button>
    </div>

    <div class="calendar-view">
      <table class="calendar-table">
        <thead>
        <tr>
          <th>Thứ Hai</th>
          <th>Thứ Ba</th>
          <th>Thứ Tư</th>
          <th>Thứ Năm</th>
          <th>Thứ Sáu</th>
          <th>Thứ Bảy</th>
          <th>Chủ Nhật</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(week, weekIndex) in weeksInMonth" :key="weekIndex">
          <td
              v-for="day in week"
              :key="day.date"
              class="day-cell"
              :class="{
                'has-interns': getInternCountByDate(day.date) > 0,
                'not-in-month': !day.isInCurrentMonth,
                'filtered': searchQuery && !isDayRelevant(day.date)
              }"
              @click="day.isInCurrentMonth && selectDay(day.date)"
          >
            <div v-if="day.date" class="day-content">
              <span class="day-number">{{ new Date(day.date).getDate() }}</span>
              <span class="intern-count">({{ getInternCountByDate(day.date) }})</span>
              <div v-if="selectedDay === day.date" class="intern-list">
                <ul v-if="filteredInterns(day.date).length > 0">
                  <li v-for="intern in filteredInterns(day.date)" :key="intern.id" class="intern-name">
                    {{ intern.name }}
                  </li>
                </ul>
                <p v-else>Không có thực tập sinh làm việc trong ngày này.</p>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
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
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px">
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
import { ref, computed, onMounted, watch } from 'vue';
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
const searchQuery = ref('');
const currentDate = ref(new Date(2025, 4, 1));
const selectedDay = ref(null);
const schedules = ref([]);
const selectedDayInterns = ref([]);

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
  if (!date) return 0;
  const formattedDate = date;
  const uniqueInternIds = new Set();
  schedules.value.forEach(schedule => {
    const startDate = schedule.startDate.split('T')[0];
    const endDate = schedule.endDate ? schedule.endDate.split('T')[0] : formatDateToString(new Date());
    const isInRange = formattedDate >= startDate && formattedDate <= endDate;
    if (isInRange && schedule.intern) {
      if (!searchQuery.value || schedule.intern.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        uniqueInternIds.add(schedule.intern.id);
      }
    }
  });
  return uniqueInternIds.size;
};

const isDayRelevant = (date) => {
  if (!date || !searchQuery.value) return true;
  const formattedDate = date;
  return schedules.value.some(schedule => {
    const startDate = schedule.startDate.split('T')[0];
    const endDate = schedule.endDate ? schedule.endDate.split('T')[0] : formatDateToString(new Date());
    const isInRange = formattedDate >= startDate && formattedDate <= endDate;
    return isInRange && schedule.intern && schedule.intern.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
};

const filteredInterns = (date) => {
  if (!date) return [];
  if (!searchQuery.value) return selectedDayInterns.value;
  return selectedDayInterns.value.filter(intern => intern.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
};

const weeksInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay() || 7;
  const weeks = [];
  let currentWeek = [];

  for (let i = 1; i < firstDayWeekday; i++) {
    currentWeek.push({ date: null, isInCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    currentWeek.push({
      date: formatDateToString(date),
      isInCurrentMonth: true,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null, isInCurrentMonth: false });
    }
    weeks.push(currentWeek);
  }

  return weeks;
});

const changeMonth = (offset) => {
  const newMonth = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + offset,
      1
  );
  currentDate.value = newMonth;
  selectedDay.value = null;
  selectedDayInterns.value = [];
  fetchSchedules();
};

const selectDay = async (day) => {
  if (selectedDay.value === day) {
    selectedDay.value = null;
    selectedDayInterns.value = [];
  } else {
    selectedDay.value = day;
    selectedDayInterns.value = await fetchInternsByDate(day) || [];
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  selectedDay.value = null;
  selectedDayInterns.value = [];
};

watch(searchQuery, () => {
  selectedDay.value = null;
  selectedDayInterns.value = [];
});

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

/* Thanh tìm kiếm */
.search-bar {
  width: 100%;

}
.thanh-chuc-nang{
  gap: 10px;
  display: flex;
  justify-content: space-between;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.clear-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #718096;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
}

.clear-button:hover {
  color: #2d3748;
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

.calendar-view {
  margin-top: 20px;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-table th {
  background-color: #f7fafc;
  color: #2d3748;
  font-weight: 600;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.day-cell {
  border: 1px solid #e2e8f0;
  height: 150px;
  vertical-align: top;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.day-cell.has-interns {
  background-color: #e6fffa;
  border-color: #4fd1c5;
}

.day-cell:hover:not(.not-in-month):not(.filtered) {
  background-color: #edf2f7;
}

.day-cell.not-in-month {
  background-color: #f7fafc;
  cursor: default;
}

.day-cell.filtered {
  background-color: #f7fafc;
  opacity: 0.5;
  cursor: default;
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.day-number {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.intern-count {
  color: #4fd1c5;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.intern-list {
  width: 100%;
  max-height: 80px;
  overflow-y: auto;
  font-size: 0.85rem;
  color: #2d3748;
}

.intern-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.intern-list li {
  padding: 4px 0;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.intern-list p {
  font-size: 0.85rem;
  color: #718096;
  text-align: center;
  margin: 0;
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
.bo_loc {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
.bo_loc input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

</style>
```