import { createRouter, createWebHistory } from 'vue-router'
import DangKy from "@/view/Login/DangKy.vue";
import DangNhap from "@/view/Login/DangNhap.vue";
import HomeEcoIT from "@/view/Page/HomeEcoIT.vue";
import InternNew from "@/view/NewIntern/InternNew.vue";
import LichIntern from "@/view/LichIntern/LichIntern.vue";
const routes = [
    {
        path: '/',
        redirect: '/dangnhap'
    },
    {
        path: '/dangnhap',
        name: 'dangnhap',
        component: DangNhap
    },
    {
        path: '/dangky',
        name: 'dang-ky',
        component: DangKy
    },
    {
        path: '/home-EcoIT',
        name: 'homeEcoIT',
        component: HomeEcoIT
    },
    {
        path: '/lich-lam-viec',
        name: 'lichlamviec',
        component: LichIntern
    },
    {
        path: '/danh-sach-thuc-tap-sinh',
        name: 'danhsachthuctapsinh',
        component: InternNew
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
