<!-- src/components/InternTable.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import HeaderHome from '@/view/FooterHeader/HeaderHome.vue';
import { getAllInterns, addIntern, deleteIntern, updateIntern } from '@/view/NewIntern/Js/intern';
import FooterHome from "@/view/FooterHeader/FooterHome.vue";

// Biến phản ứng
const items = ref([]); // Lưu danh sách intern
const loading = ref(true); // Trạng thái tải
const error = ref(null); // Lưu lỗi nếu có
const showModel = ref(false); // Hiển thị modal
const isEditing = ref(false); // Trạng thái chỉnh sửa
const currentInternId = ref(null); // Lưu ID intern đang chỉnh sửa

// Hàm gọi API
const fetchAllData = async () => {
  try {
    const data = await getAllInterns();
    items.value = data;
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
  currentInternId.value = intern.id; // Đảm bảo ID được gán
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

onMounted(fetchAllData);
</script>

<template>
  <HeaderHome />
  <img src="@/assets/banner.jpg" alt="Banner" />
  <div class="concak mx-auto px-4 py-10">
    <div class="mb-3 flex justify-end">
      <button class="bg-green-600" @click="openModel">
        <svg
            aria-hidden="true"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        ADD Intern
      </button>
    </div>
    <div v-if="loading" class="text-center">Đang tải...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <table v-else class="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <thead class="bg-green-600 text-white">
      <tr>
        <th class="py-3 px-4 text-left">#</th>
        <th class="py-3 px-4 text-left">Name</th>
        <th class="py-3 px-4 text-left">Date of Birth</th>
        <th class="py-3 px-4 text-left">Gender</th>
        <th class="py-3 px-4 text-left">Start Date</th>
        <th class="py-3 px-4 text-left">Next Review Date</th>
        <th class="py-3 px-4 text-left">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(intern, index) in items"
          :key="intern.id"
          class="hover:bg-gray-100 transition-colors"
      >
        <th class="py-3 px-4 border-b border-gray-200">{{ index + 1 }}</th>
        <td class="py-3 px-4 border-b border-gray-200">{{ intern.name }}</td>
        <td class="py-3 px-4 border-b border-gray-200">{{ intern.dateOfBirth }}</td>
        <td class="py-3 px-4 border-b border-gray-200">{{ intern.gender ? 'Nam' : 'Nữ' }}</td>
        <td class="py-3 px-4 border-b border-gray-200">{{ intern.startDate }}</td>
        <td class="py-3 px-4 border-b border-gray-200">{{ intern.nextReviewDate }}</td>
        <td class="py-3 px-4 border-b border-gray-200">
          <div class="button-click">
            <button
                @click="openEditModel(intern)"
                class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md"
                title="Cập nhật"
            >
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button
                @click="handleDeleteIntern(intern.id)"
                class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
                title="Xóa"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal -->
  <div v-if="showModel" class="modelNew">
    <div class="modal-content">
      <div class="form-add">
        <a>{{ isEditing ? 'Cập Nhật Intern' : 'Thêm Intern Mới' }}</a>
        <form @submit="handleFormSubmit">
          <div class="form-group">
            <label for="name">Họ và Tên</label>
            <input
                v-model="newIntern.name"
                type="text"
                id="name"
                class="form-control"
                placeholder="Nhập họ và tên"
                required
            />
          </div>
          <div class="form-group">
            <label for="dateOfBirth">Ngày Sinh</label>
            <input
                v-model="newIntern.dateOfBirth"
                type="date"
                id="dateOfBirth"
                class="form-control"
                required
            />
          </div>
          <div class="form-group">
            <label for="gender">Giới Tính</label>
            <select v-model="newIntern.gender" id="gender" class="form-control" required>
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
              <option value="2">Bue due</option>
            </select>
          </div>
          <div class="form-group">
            <label for="startDate">Ngày Bắt Đầu</label>
            <input
                v-model="newIntern.startDate"
                type="date"
                id="startDate"
                class="form-control"
                required
            />
          </div>
          <div class="form-group">
            <label for="nextReviewDate">Ngày Đánh Giá Tiếp Theo</label>
            <input
                v-model="newIntern.nextReviewDate"
                type="date"
                id="nextReviewDate"
                class="form-control"
                required
            />
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="closeModel" class="bg-red-500">Hủy</button>
            <button type="submit" class="bg-green-600">{{ isEditing ? 'Cập Nhật' : 'Thêm' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <FooterHome />
</template>

<style scoped>
.modelNew {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.concak {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

img {
  width: 100%;
  height: 100vh;
}

/* Style cho bảng */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
}

.form-add {
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  background-color: #f9f9f9;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-add button:active {
  transform: translateY(-5px);
}

.form-control {
  margin-bottom: 20px;
}

button {
  border: none;
  display: flex;
  padding: 0.75rem 1.5rem;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-align: right;
  cursor: pointer;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  user-select: none;
  gap: 0.75rem;
  box-shadow:
      0 4px 6px -1px #488aec31,
      0 2px 4px -1px #488aec17;
  transition: all 0.6s ease;
}

button:hover {
  box-shadow:
      0 10px 15px -3px #488aec4f,
      0 4px 6px -2px #488aec17;
}

button:focus,
button:active {
  opacity: 0.85;
  box-shadow: none;
}

button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.button-click {
  display: flex;
  gap: 20px;
}
</style>