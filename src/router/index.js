import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue' // 1. Nhập trang mới vào

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // 2. Thêm cấu hình cho trang Chi tiết
    {
      path: '/product/:id', // Chữ :id là một cái túi rỗng để hứng ID truyền sang
      name: 'ProductDetail',
      component: ProductDetailView
    }
  ],
})

export default router
