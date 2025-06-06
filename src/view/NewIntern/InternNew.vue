<script setup>
import { ref, onMounted } from 'vue';
import HeaderHome from '@/view/FooterHeader/HeaderHome.vue';
import { getAllInterns, addIntern, deleteIntern, updateIntern , thanhSearch } from '@/view/NewIntern/Js/intern';

// Biến phản ứng
const items = ref([]); // Lưu danh sách intern
const loading = ref(true); // Trạng thái tải
const error = ref(null); // Lưu lỗi nếu có
const showModel = ref(false); // Hiển thị modal
const isEditing = ref(false); // Trạng thái chỉnh sửa
const currentInternId = ref(null); // Lưu ID intern đang chỉnh sửa
const currentPage = ref(0); // Trang hiện tại
const pageSize = ref(5); // Số mục trên mỗi trang
const totalPages = ref(0); // Tổng số trang
const totalItems = ref(0); // Tổng số intern
const keyword = ref(''); // Lưu từ khóa tìm kiếm
const isSearching = ref(false); // Trạng thái tìm kiếm

const handleSearch = async () => {
  if (!keyword.value.trim()) {
    // Nếu không có từ khóa, tải lại toàn bộ danh sách
    loading.value = true;
    await fetchAllData(0);
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await thanhSearch(keyword.value);
    items.value = data; // Giả sử API trả về danh sách intern
    currentPage.value = 0; // Reset trang về 0
    totalItems.value = data.length;
    totalPages.value = Math.ceil(totalItems.value / pageSize.value);
    isSearching.value = true;
  } catch (err) {
    error.value = 'Không thể tìm kiếm intern. Vui lòng thử lại!';
    items.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

// Hàm gọi API
const fetchAllData = async (page = 0) => {
  try {
    const data = await getAllInterns(page, pageSize.value);
    items.value = data.interns;
    currentPage.value = data.currentPage;
    totalPages.value = data.totalPages;
    totalItems.value = data.totalItems;
  } catch (err) {
    error.value = 'Không thể tải danh sách intern. Vui lòng thử lại!';
  } finally {
    loading.value = false;
  }
};

const newIntern = ref({
  name: '',
  dateOfBirth: '',
  gender: '',
  startDate: '',
  nextReviewDate: ''
});

const reset = () => {
  newIntern.value = {
    name: '',
    dateOfBirth: '',
    gender: '',
    startDate: '',
    nextReviewDate: ''
  };
  isEditing.value = false;
  currentInternId.value = null;
};

// Hàm xử lý submit form (thêm hoặc cập nhật)
const handleFormSubmit = async (event) => {
  event.preventDefault();
  try {
    const internData = { ...newIntern.value };
    if (isEditing.value && currentInternId.value) {
      // Cập nhật intern
      const updatedIntern = await updateIntern(currentInternId.value, internData);
      items.value = items.value.map(intern =>
          intern.id === currentInternId.value ? updatedIntern : intern
      );
    } else {
      // Thêm intern mới
      const addedIntern = await addIntern(internData);
      items.value.push(addedIntern);
      totalItems.value += 1;
      totalPages.value = Math.ceil(totalItems.value / pageSize.value);
    }
    closeModel();
    reset();
  } catch (err) {
    error.value = isEditing.value
        ? 'Không thể cập nhật intern. Vui lòng thử lại!'
        : 'Không thể thêm intern. Vui lòng thử lại!';
  }
};

// Hàm xóa intern
const handleDeleteIntern = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa intern này?')) {
    try {
      await deleteIntern(id);
      items.value = items.value.filter(intern => intern.id !== id);
      totalItems.value -= 1;
      totalPages.value = Math.ceil(totalItems.value / pageSize.value);
      if (items.value.length === 0 && currentPage.value > 0) {
        currentPage.value -= 1;
        await fetchAllData(currentPage.value);
      }
      error.value = null;
    } catch (err) {
      error.value = 'Không thể xóa intern. Vui lòng thử lại!';
    }
  }
};

// Mở modal chỉnh sửa
const openEditModel = (intern) => {
  newIntern.value = {
    name: intern.name,
    dateOfBirth: intern.dateOfBirth,
    gender: intern.gender ? '1' : '0',
    startDate: intern.startDate,
    nextReviewDate: intern.nextReviewDate
  };
  isEditing.value = true;
  currentInternId.value = intern.id;
  showModel.value = true;
};

// Mở modal thêm mới
const openModel = () => {
  reset();
  showModel.value = true;
};

// Đóng modal
const closeModel = () => {
  showModel.value = false;
  reset();
};

// Hàm chuyển trang
const goToPage = async (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    loading.value = true;
    await fetchAllData(page);
  }
};

const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

onMounted(() => fetchAllData(currentPage.value));
</script>

<template>
  <div class="app-container">
    <!-- Header Section -->
    <div class="header-section">
      <HeaderHome />
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-background">
            <img src="@/assets/banner.jpg" alt="Banner" class="hero-image" />
            <div class="hero-overlay"></div>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">Quản Lý Thực Tập Sinh</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-container">
        <!-- Control Panel -->
        <div class="control-panel">
          <div class="search-section">
            <div class="search-container">
              <div class="search-input-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input
                    v-model="keyword"
                    @keyup.enter="handleSearch"
                    type="text"
                    placeholder="Tìm kiếm thực tập sinh..."
                    class="search-input"
                />
              </div>
              <button @click="handleSearch" class="search-btn">
                <i class="fas fa-search"></i>
                Tìm kiếm
              </button>
            </div>
          </div>

          <div class="action-section">
            <button @click="openModel" class="add-btn">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon bg-blue-500">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalItems }}</h3>
              <p class="stat-label">Tổng số thực tập sinh</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-green-500">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ items.length }}</h3>
              <p class="stat-label">Hiển thị trên trang</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-purple-500">
              <i class="fas fa-calendar"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalPages }}</h3>
              <p class="stat-label">Tổng số trang</p>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-container">
          <!-- Loading State -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-container">
            <div class="error-content">
              <i class="fas fa-exclamation-triangle"></i>
              <p>{{ error }}</p>
              <button @click="fetchAllData(currentPage)" class="retry-btn">
                <i class="fas fa-redo"></i>
                Thử lại
              </button>
            </div>
          </div>

          <!-- Data Table -->
          <div v-else class="table-wrapper">
            <table class="data-table">
              <thead>
              <tr>
                <th>STT</th>
                <th>Họ và Tên</th>
                <th>Ngày Sinh</th>
                <th>Giới Tính</th>
                <th>Ngày Bắt Đầu</th>
                <th>Ngày Đánh Giá</th>
                <th>Thao Tác</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(intern, index) in items"
                  :key="intern.id"
                  class="table-row"
              >
                <td class="row-number">{{ index + 1 + (currentPage * pageSize) }}</td>
                <td class="name-cell">
                  <div class="name-content">
                    <div class="avatar">
                      {{ intern.name.charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ intern.name }}</span>
                  </div>
                </td>
                <td>{{ intern.dateOfBirth }}</td>
                <td>
                    <span class="gender-badge" :class="intern.gender ? 'male' : 'female'">
                      <i :class="intern.gender ? 'fas fa-mars' : 'fas fa-venus'"></i>
                      {{ intern.gender ? 'Nam' : 'Nữ' }}
                    </span>
                </td>
                <td>{{ intern.startDate }}</td>
                <td>{{ intern.nextReviewDate }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                        @click="openEditModel(intern)"
                        class="edit-btn"
                        title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                        @click="handleDeleteIntern(intern.id)"
                        class="delete-btn"
                        title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="!items.length" class="empty-state">
              <div class="empty-content">
                <i class="fas fa-users"></i>
                <h3>Không có dữ liệu</h3>
                <p>Chưa có thực tập sinh nào được thêm vào hệ thống</p>
                <button @click="openModel" class="add-first-btn">
                  <i class="fas fa-plus"></i>
                  Thêm thực tập sinh đầu tiên
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && items.length && totalPages > 1" class="pagination-container">
            <div class="pagination-info">
              <span>Hiển thị {{ items.length }} trên {{ totalItems }} kết quả</span>
            </div>
            <div class="pagination-controls">
              <button
                  :disabled="currentPage === 0"
                  @click="prevPage"
                  class="pagination-btn prev-btn"
              >
                <i class="fas fa-chevron-left"></i>
                Trước
              </button>

              <div class="page-numbers">
                <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="goToPage(page - 1)"
                    :class="['page-btn', { active: currentPage === page - 1 }]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                  :disabled="currentPage === totalPages - 1"
                  @click="nextPage"
                  class="pagination-btn next-btn"
              >
                Sau
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModel" class="modal-overlay" @click="closeModel">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus'"></i>
            {{ isEditing ? 'Cập Nhật Thực Tập Sinh' : 'Thêm Thực Tập Sinh Mới' }}
          </h2>
          <button @click="closeModel" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit="handleFormSubmit" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name" class="form-label">
                <i class="fas fa-user"></i>
                Họ và Tên *
              </label>
              <input
                  v-model="newIntern.name"
                  type="text"
                  id="name"
                  class="form-input"
                  placeholder="Nhập họ và tên"
                  required
              />
            </div>

            <div class="form-group">
              <label for="dateOfBirth" class="form-label">
                <i class="fas fa-birthday-cake"></i>
                Ngày Sinh *
              </label>
              <input
                  v-model="newIntern.dateOfBirth"
                  type="date"
                  id="dateOfBirth"
                  class="form-input"
                  required
              />
            </div>

            <div class="form-group">
              <label for="gender" class="form-label">
                <i class="fas fa-venus-mars"></i>
                Giới Tính *
              </label>
              <select v-model="newIntern.gender" id="gender" class="form-select" required>
                <option value="">Chọn giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
                <option value="2">Khác</option>
              </select>
            </div>

            <div class="form-group">
              <label for="startDate" class="form-label">
                <i class="fas fa-calendar-plus"></i>
                Ngày Bắt Đầu *
              </label>
              <input
                  v-model="newIntern.startDate"
                  type="date"
                  id="startDate"
                  class="form-input"
                  required
              />
            </div>

            <div class="form-group full-width">
              <label for="nextReviewDate" class="form-label">
                <i class="fas fa-calendar-check"></i>
                Ngày Đánh Giá Tiếp Theo *
              </label>
              <input
                  v-model="newIntern.nextReviewDate"
                  type="date"
                  id="nextReviewDate"
                  class="form-input"
                  required
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModel" class="cancel-btn">
              <i class="fas fa-times"></i>
              Hủy
            </button>
            <button type="submit" class="submit-btn">
              <i :class="isEditing ? 'fas fa-save' : 'fas fa-plus'"></i>
              {{ isEditing ? 'Cập Nhật' : 'Thêm Mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
}

/* Header Section */
.header-section {
  position: relative;
}

.hero-banner {
  position: relative;
  height: 350px;
  overflow: hidden;
}

.hero-content {
  position: relative;
  height: 100%;
}

.hero-background {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(0,0,0,0.7), rgba(102,126,234,0.6));
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Main Content */
.main-content {
  position: relative;
  margin-top: -100px;
  z-index: 20;
  padding: 0 2rem 2rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Control Panel */
.control-panel {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  backdrop-filter: blur(10px);
}

.search-section {
  flex: 1;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 10;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.search-btn {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16,185,129,0.3);
}

.add-btn {
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16,185,129,0.3);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.stat-content p {
  color: #6b7280;
  font-weight: 500;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.data-table th {
  padding: 1.5rem 1rem;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8fafc;
  transform: scale(1.01);
}

.data-table td {
  padding: 1.5rem 1rem;
  vertical-align: middle;
}

.row-number {
  font-weight: 600;
  color: #6b7280;
  text-align: center;
  border-radius: 8px;
  width: 40px;
}

.name-cell {
  min-width: 200px;
}

.name-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.gender-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.gender-badge.male {
  background: #dbeafe;
  color: #1e40af;
}

.gender-badge.female {
  background: #fce7f3;
  color: #be185d;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background: #1e40af;
  color: white;
  transform: scale(1.1);
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
  transform: scale(1.1);
}

/* Loading & Error States */
.loading-container, .error-container {
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content {
  color: #dc2626;
}

.error-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  color: #6b7280;
}

.empty-content i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.add-first-btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

/* Pagination */
.pagination-container {
  padding: 2rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #059669;
  color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.page-btn:hover {
  background: #f9fafb;
  border-color: #667eea;
  color: #667eea;
}

.page-btn.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #667eea;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title i {
  color: #667eea;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-form {
  padding: 1rem 2rem 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-label i {
  color: #667eea;
  width: 16px;
}

.form-input, .form-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.form-select {
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.cancel-btn {
  padding: 1rem 2rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.cancel-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
  background: #fef2f2;
}

.submit-btn {
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102,126,234,0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .main-content {
    padding: 0 1rem 1rem;
    margin-top: -50px;
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-container {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .modal-container {
    max-height: 95vh;
    margin: 0.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .control-panel {
    padding: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .page-numbers {
    max-width: 200px;
    overflow-x: auto;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .app-container {
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  }

  .control-panel,
  .stat-card,
  .table-container,
  .modal-container {
    background: #1f2937;
    color: #f9fafb;
  }

  .search-input,
  .form-input,
  .form-select {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .table-row:hover {
    background: #374151;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #5a67d8, #6b46c1);
}

/* Print styles */
@media print {
  .control-panel,
  .pagination-container,
  .action-buttons,
  .modal-overlay {
    display: none !important;
  }

  .hero-banner {
    height: 200px;
  }

  .main-content {
    margin-top: 0;
  }

  .table-container {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style>