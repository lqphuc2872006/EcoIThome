<script setup>
import HeaderHome from "@/view/FooterHeader/HeaderHome.vue";
import FooterHome from "@/view/FooterHeader/FooterHome.vue";
import { getAllHopIntern, detailIntern,updateIntern,deletedIntern,addIntern, getAllMentor,getSearch } from "@/view/HopIntern/Hopintern";
import { ref, onMounted } from "vue";

const showModel = ref(false);
const showModelAdd = ref(false)
const errorMessage = ref("");
const successMessage = ref("");
const isEditing = ref(false); // Trạng thái chỉnh sửa


const openModelAdd = () => {
  reseat();
  showModelAdd.value = true;
}
// Mở modal và lấy dữ liệu chi tiết
const openModel = async (id) => {
  try {
    const data = await detailIntern(id);
    internHopData.value = {
      id: data.id || "",
      noiDung: data.noiDung || "",
      hinhThuc: data.hinhThuc || "",
      thoiGian: data.thoiGian || "",
      nhiemVu: data.nhiemVu || "",
      createdAt: data.createdAt,
    };
    showModel.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    isEditing.value = false; // Reset trạng thái chỉnh sửa
  } catch (error) {
    errorMessage.value = `Không thể lấy chi tiết cuộc họp: ${error.message}`;
    console.error("Lỗi khi lấy chi tiết:", error);
  }
};

// Đóng modal
const closeModel = () => {
  showModel.value = false;
  showModelAdd.value = false;
  errorMessage.value = "";
  successMessage.value = "";
  isEditing.value = false;
};

// Bật chế độ chỉnh sửa
const enableEdit = () => {
  isEditing.value = true;
};

// Lưu dữ liệu chỉnh sửa
const saveChanges = async () => {
 try {
   const updateData = {
     nhiemVu: internHopData.value.nhiemVu,
     hinhThuc: internHopData.value.hinhThuc,
     thoiGian: internHopData.value.thoiGian,
   }
   await updateIntern(internHopData.value.id,updateData);
   await fetchInterns();
   successMessage.value = "cap nhat thanh cong";
   setTimeout(() => {closeModel()},2000)
 } catch (error){
   errorMessage.value = `Lỗi khi cập nhật cuộc họp: ${error.message}`;
   console.error("LSy khi lưu chỉnh sửa:", error);
 }
};

const add = async () => {
  try {
    const internData = {
      mentor: internHopData.value.mentor,
      ngayHop: internHopData.value.ngayHop,
      hinhThuc: internHopData.value.hinhThuc,
      thoiGian: internHopData.value.thoiGian,
      nhiemVu: internHopData.value.nhiemVu,
      noiDung: internHopData.value.noiDung,
    };
    await addIntern(internData);
    await fetchInterns();
    successMessage.value = "add thanh cong";
    setTimeout(() => {closeModel()},2000)
  } catch (error){
    errorMessage.value = `Lỗi khi add: ${error.message}`;
    console.error("LSy khi add:", error);
  }
};



const deleted = async (id) =>{
  if (confirm("Ban co chac chan muon xoa k")){
    try {
      await deletedIntern(id);
      await fetchInterns();
    } catch (error){
      console.error("Loi khi xoa:", error);

    }
  }
}
// Danh sách cuộc họp
const items = ref([]);

const mentor = ref([]);
//timkiem
const keyword = ref('');
const isLoading = ref(false);
const handleSearch = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    if (!keyword.value.trim()) {
      await fetchInterns();
    } else {
      const data = await getSearch(keyword.value);
      items.value = data;
    }
  } catch (error) {
    errorMessage.value = `Lỗi khi tìm kiếm: ${error.message}`;
    console.error("Lỗi khi tìm kiếm:", error);
  } finally {
    isLoading.value = false;
  }
};

// Lấy danh sách cuộc họp
const fetchInterns = async () => {
  try {
    const data = await getAllHopIntern();
    items.value = data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    errorMessage.value = "Không thể tải danh sách cuộc họp.";
  }
};

const fetchMentor = async () => {
  try {
    const data = await getAllMentor();
    mentor.value = data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    errorMessage.value = "Không thể tải danh sách cuộc họp.";
  }
};

// Dữ liệu chi tiết cuộc họp
const internHopData = ref({
  id: "",
  mentor:"",
  ngayHop:"",
  noiDung: "",
  hinhThuc: "",
  thoiGian: "",
  nhiemVu: "",
  createdAt: "",
});
const reseat = () => {
  internHopData.value = {
    noiDung: "",
    hinhThuc: "",
    thoiGian: "",
    nhiemVu: "",
    createdAt: "",
  }
}

// Gọi fetchInterns khi component được mount
onMounted(() => {
  fetchInterns();
  fetchMentor();
});

</script>

<template>
  <HeaderHome />
  <main>
    <img src="@/assets/banner.jpg" alt="Banner" />
    <div class="concak mx-auto px-4 py-10">
      <div style="justify-content: space-between;display: flex">
        <div class="thanh-search">
          <input v-model="keyword" @keyup.enter="handleSearch" placeholder="Search..." type="text" class="form-control" name="" id="">
        </div>

        <div>
          <button class="bg-green-600" @click="openModelAdd">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      <table class="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <thead class="bg-green-600 text-white">
        <tr>
          <th class="py-3 px-4 text-left">#</th>
          <th class="py-3 px-4 text-left">Mentor</th>
          <th class="py-3 px-4 text-left">Meeting day</th>
          <th class="py-3 px-4 text-left">Text</th>
          <th class="py-3 px-4 text-left">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(hopintern, index) in items"
            :key="hopintern.id"
            class="hover:bg-gray-100 transition-colors"
        >
          <th class="py-3 px-4 border-b border-gray-200">{{ index + 1 }}</th>
          <td class="py-3 px-4 border-b border-gray-200">{{ hopintern.mentor.ten }}</td>
          <td class="py-3 px-4 border-b border-gray-200">{{ hopintern.ngayHop }}</td>
          <td class="py-3 px-4 border-b border-gray-200">{{ hopintern.noiDung }}</td>
          <td class="py-3 px-4 border-b border-gray-200">
            <div class="button-click">
              <button
                  @click="openModel(hopintern.id)"
                  class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md"
                  title="Xem chi tiết"
              >
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click="deleted(hopintern.id)"
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

    <div v-if="showModel" class="modal-new">
      <div class="modal-content">
        <div class="form-add">
          <h3 style="text-align: center">Chi tiết cuộc họp Intern</h3>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          <form @submit.prevent="saveChanges">
            <div class="form-group">
              <label>Ngày tạo cuộc họp</label>
              <input
                  v-model="internHopData.createdAt"
                  type="date"
                  class="form-control"
                  disabled
              />
            </div>
            <div class="form-group">
              <label>Hình thức</label>
              <select
                  v-model="internHopData.hinhThuc"
                  class="form-select"
                  :disabled="!isEditing"
                  required
              >
                <option value="" disabled>Hình thức</option>
                <option value="Online">Online</option>
                <option value="Trực tiếp">Trực tiếp</option>
              </select>
            </div>
            <div class="form-group">
              <label>Thời gian</label>
              <input
                  v-model="internHopData.thoiGian"
                  type="text"
                  class="form-control"
                  :disabled="!isEditing"
                  required
              />
            </div>
            <div class="form-group">
              <label>Nhiệm vụ</label>
              <input
                  v-model="internHopData.nhiemVu"
                  type="text"
                  class="form-control"
                  :disabled="!isEditing"
                  required
              />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px">
              <button type="button" class="bg-red-500" @click="closeModel">Đóng</button>
              <button
                  type="button"
                  class="bg-green-600"
                  @click="enableEdit"
              >
                Sửa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showModelAdd" class="modal-new">
      <div class="modal-content">
        <div class="form-add">
          <h3 style="text-align: center">Chi tiết cuộc họp Intern</h3>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          <form @submit.prevent="add">
            <div class="form-group">
              <label>Ngày tạo cuộc họp</label>
              <input
                  v-model="internHopData.ngayHop"
                  type="date"
                  class="form-control"

              />
            </div>
            <div class="form-group">
              <label>Người chủ trì</label>
              <select
                  v-model="internHopData.mentor"
                  class="form-select"
                  required
              >
                <option v-for="mentors in mentor" :key="mentors.id" :value="mentors.id">
                  {{ mentors.ten }}
                </option>              </select>
            </div>
            <div class="form-group">
              <label>Hình thức</label>
              <select
                  v-model="internHopData.hinhThuc"
                  class="form-select"
                  required
              >
                <option value="" disabled>Hình thức</option>
                <option value="Online">Online</option>
                <option value="Trực tiếp">Trực tiếp</option>
              </select>
            </div>
            <div class="form-group">
              <label>Thời gian</label>
              <input
                  v-model="internHopData.thoiGian"
                  type="text"
                  class="form-control"
                  required
              />
            </div>
            <div class="form-group">
              <label>Nhiệm vụ</label>
              <input
                  v-model="internHopData.nhiemVu"
                  type="text"
                  class="form-control"
                  required
              />
            </div>
            <div class="form-group">
              <label>Nội dung</label>
              <input
                  v-model="internHopData.noiDung"
                  type="text"
                  class="form-control"
                  required
              />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px">
              <button type="button" class="bg-red-500" @click="closeModel">Đóng</button>
              <button
                  type="submit"
                  class="bg-green-600"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
  <FooterHome />
</template>

<style scoped>
img {
  width: 100%;
  height: 100vh;
}
.concak {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
.button-click {
  display: flex;
  gap: 20px;
}
button {
  border: none;
  display: flex;
  padding: 0.75rem 1.5rem;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-align: center;
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
.form-group {
  margin-bottom: 20px;
  padding: 5px;
}
.form-control,
.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error-message {
  color: red;
  margin-bottom: 1rem;
}
.success-message {
  color: green;
  margin-bottom: 1rem;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.thanh-search{
  width: 30%;
  margin-bottom: 20px;
}
</style>