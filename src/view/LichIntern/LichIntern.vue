```vue
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

const getTotalInternsInMonth = () => {
  const uniqueInternIds = new Set();
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  schedules.value.forEach(schedule => {
    const startDate = new Date(schedule.startDate);
    const endDate = schedule.endDate ? new Date(schedule.endDate) : new Date();

    if ((startDate <= lastDay && endDate >= firstDay) && schedule.intern) {
      uniqueInternIds.add(schedule.intern.id);
    }
  });

  return uniqueInternIds.size;
};

const isWeekend = (date) => {
  if (!date) return false;
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
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

<template>
  <HeaderHome />
  <div class="calendar-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-title">
        <h1>📅 Lịch Thực Tập Sinh</h1>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="control-panel">
      <div class="search-section">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tên thực tập sinh..."
              class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="openModelupdate" class="btn-primary">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    </div>

    <!-- Date Filter -->
    <div class="date-filter">
      <div class="filter-group">
        <label>📅 Từ ngày:</label>
        <input type="date" class="date-input" />
      </div>
      <div class="filter-group">
        <label>📅 Đến ngày:</label>
        <input type="date" class="date-input" />
      </div>
      <button class="btn-filter">
        <i class="fas fa-filter"></i>
        Lọc
      </button>
    </div>

    <!-- Month Navigation -->
    <div class="month-header">
      <button @click="changeMonth(-1)" class="nav-button">
        <i class="fas fa-chevron-left"></i>
        <span>Tháng trước</span>
      </button>

      <div class="current-month">
        <h2>{{ currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }) }}</h2>
        <div class="month-stats">
          <span class="stat-item">
            <i class="fas fa-users"></i>
            {{ getTotalInternsInMonth() }} thực tập sinh
          </span>
        </div>
      </div>

      <button @click="changeMonth(1)" class="nav-button">
        <span>Tháng sau</span>
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-wrapper">
      <div class="calendar-grid">
        <!-- Week Headers -->
        <div class="week-headers">
          <div class="day-header">Thứ Hai</div>
          <div class="day-header">Thứ Ba</div>
          <div class="day-header">Thứ Tư</div>
          <div class="day-header">Thứ Năm</div>
          <div class="day-header">Thứ Sáu</div>
          <div class="day-header weekend">Thứ Bảy</div>
          <div class="day-header weekend">Chủ Nhật</div>
        </div>

        <!-- Calendar Body -->
        <div class="calendar-body">
          <div
              v-for="(week, weekIndex) in weeksInMonth"
              :key="weekIndex"
              class="week-row"
          >
            <div
                v-for="day in week"
                :key="day.date"
                class="day-cell"
                :class="{
                'has-interns': getInternCountByDate(day.date) > 0,
                'not-in-month': !day.isInCurrentMonth,
                'filtered': searchQuery && !isDayRelevant(day.date),
                'selected': selectedDay === day.date,
                'weekend': isWeekend(day.date),
                'today': isToday(day.date)
              }"
                @click="day.isInCurrentMonth && selectDay(day.date)"
            >
              <div v-if="day.date" class="day-content">
                <div class="day-header-info">
                  <span class="day-number">{{ new Date(day.date).getDate() }}</span>
                  <div class="intern-badge" v-if="getInternCountByDate(day.date) > 0">
                    <i class="fas fa-user-friends"></i>
                    {{ getInternCountByDate(day.date) }}
                  </div>
                </div>

                <div v-if="selectedDay === day.date" class="intern-details">
                  <div class="intern-list-header">
                    <i class="fas fa-list"></i>
                    <span>Danh sách làm việc</span>
                  </div>
                  <div class="intern-list-content">
                    <div v-if="filteredInterns(day.date).length > 0" class="intern-items">
                      <div
                          v-for="intern in filteredInterns(day.date)"
                          :key="intern.id"
                          class="intern-item"
                      >
                        <div class="intern-avatar">
                          {{ intern.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="intern-name">{{ intern.name }}</span>
                      </div>
                    </div>
                    <div v-else class="no-interns">
                      <i class="fas fa-calendar-times"></i>
                      <p>Không có thực tập sinh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update -->
    <div v-if="showModelupdate" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>
            <i class="fas fa-edit"></i>
            Cập Nhật Lịch Thực Tập Sinh
          </h3>
          <button @click="closeModelupdate" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <form @submit.prevent="submitUpdate" class="form-update">
            <div class="form-row">
              <div class="form-group">
                <label for="intern">
                  <i class="fas fa-user"></i>
                  Chọn thực tập sinh
                </label>
                <select
                    v-model="selectedInternId"
                    id="intern"
                    class="form-select"
                    required
                    @change="fetchInternSchedule"
                >
                  <option value="" disabled>Chọn thực tập sinh</option>
                  <option v-for="intern in interns" :key="intern.id" :value="intern.id">
                    {{ intern.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate">
                  <i class="fas fa-calendar-alt"></i>
                  Ngày bắt đầu
                </label>
                <input
                    v-model="internData.startDate"
                    id="startDate"
                    type="date"
                    class="form-input"
                    required
                />
              </div>
              <div class="form-group">
                <label for="endDate">
                  <i class="fas fa-calendar-check"></i>
                  Ngày kết thúc
                </label>
                <input
                    v-model="internData.endDate"
                    id="endDate"
                    type="date"
                    class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="hours">
                  <i class="fas fa-clock"></i>
                  Số giờ làm việc/tuần
                </label>
                <input
                    v-model="internData.availableHoursPerWeek"
                    id="hours"
                    type="number"
                    class="form-input"
                    min="1"
                    max="40"
                    required
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModelupdate" class="btn-secondary">
                <i class="fas fa-times"></i>
                Hủy bỏ
              </button>
              <button type="submit" class="btn-success">
                <i class="fas fa-save"></i>
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
* {
  box-sizing: border-box;
}

.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  min-height: 100vh;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.3);
}

.header-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* Control Panel */
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
  flex-wrap: wrap;
}

.search-section {
  flex: 1;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 15px 20px 15px 45px;
  border: 2px solid #e5e7eb;
  border-radius: 15px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.clear-button {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

/* Date Filter */
.date-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.date-input {
  padding: 10px 15px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.date-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-filter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
}

/* Month Header */
.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.current-month {
  text-align: center;
}

.current-month h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #059669;
  margin: 0 0 8px 0;
}

.month-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Calendar */
.calendar-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.week-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.day-header {
  padding: 15px;
  text-align: center;
  font-weight: 700;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-header.weekend {
  background: rgba(0, 0, 0, 0.1);
}

.calendar-body {
  display: flex;
  flex-direction: column;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e5e7eb;
}

.week-row:last-child {
  border-bottom: none;
}

.day-cell {
  min-height: 120px;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.day-cell:last-child {
  border-right: none;
}

.day-cell:hover:not(.not-in-month):not(.filtered) {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

.day-cell.has-interns {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-left: 4px solid #10b981;
}

.day-cell.has-interns:hover {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.day-cell.not-in-month {
  background: #f9fafb;
  opacity: 0.5;
  cursor: default;
}

.day-cell.filtered {
  background: #f9fafb;
  opacity: 0.3;
  cursor: default;
}

.day-cell.selected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.day-cell.weekend {
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
}

.day-cell.today {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.day-cell.today.selected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #f59e0b;
}

.day-content {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.day-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.day-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: inherit;
}

.intern-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.selected .intern-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.intern-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.intern-list-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: inherit;
  opacity: 0.9;
}

.intern-list-content {
  flex: 1;
  overflow-y: auto;
}

.intern-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.intern-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.selected .intern-item {
  background: rgba(255, 255, 255, 0.2);
}

.intern-item:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(2px);
}

.selected .intern-item:hover {
  background: rgba(255, 255, 255, 0.3);
}

.intern-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.selected .intern-avatar {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.intern-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: inherit;
  flex: 1;
}

.no-interns {
  text-align: center;
  color: inherit;
  opacity: 0.7;
  padding: 10px;
}

.no-interns i {
  font-size: 1.2rem;
  margin-bottom: 4px;
  display: block;
}

.no-interns p {
  font-size: 0.8rem;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 600;
}

.alert-error {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #059669;
  border: 1px solid #bbf7d0;
}

.form-update {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.form-row:has(.form-group:nth-child(2)) {
  grid-template-columns: 1fr 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary,
.btn-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-1px);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-container {
    padding: 15px;
  }

  .header-title h1 {
    font-size: 2rem;
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .search-section {
    max-width: none;
  }

  .date-filter {
    flex-direction: column;
    gap: 15px;
  }

  .month-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .nav-button {
    order: 2;
  }

  .current-month {
    order: 1;
  }

  .day-cell {
    min-height: 100px;
  }

  .form-row:has(.form-group:nth-child(2)) {
    grid-template-columns: 1fr;
  }

  .modal-container {
    width: 95%;
    margin: 10px;
  }

  .modal-body {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .header-title h1 {
    font-size: 1.5rem;
  }

  .day-cell {
    min-height: 80px;
  }

  .day-header {
    padding: 10px 5px;
    font-size: 0.8rem;
  }

  .intern-item {
    padding: 4px;
  }

  .intern-name {
    font-size: 0.75rem;
  }
}

</style>