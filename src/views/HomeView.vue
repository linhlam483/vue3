<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-8 text-blue-600">Cửa Hàng Điện Thoại</h1>
    
    <div class="flex gap-4 justify-center mb-8">
        <button @click="taoDienThoaiMoi" class="bg-blue-500 text-white px-4 py-2 rounded">+ Tạo (POST)</button>
        <button @click="capNhatGia" class="bg-yellow-500 text-white px-4 py-2 rounded">Giảm giá (PATCH)</button>
        <button @click="xoaDienThoai" class="bg-red-500 text-white px-4 py-2 rounded">Xóa (DELETE)</button>
        <button @click="dangNhapThu" class="bg-purple-500 text-white px-4 py-2 rounded">Đăng Nhập (Auth)</button>
        <button @click="timKiemSanPham" class="bg-gray-800 text-white px-4 py-2 rounded">Tìm (GET Params)</button>

    </div>


    <div class="text-center mb-8">
        <button @click="taoDienThoaiMoi"
                class="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition">
          + Tạo sản phẩm mới
    </button>
    </div>

    <!-- Nếu dữ liệu chưa tải xong, hiện chữ Đang tải -->
    <div v-if="dangTai" class="text-center text-gray-500 text-xl">
      Đang tải dữ liệu từ máy chủ...
    </div>

    <!-- Khi có dữ liệu, dùng v-for để lặp danh sách sản phẩm thành các thẻ (Card) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="sanPham in danhSachSanPham" 
        :key="sanPham.id" 
        class="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition"
      >
        <img :src="sanPham.thumbnail" alt="Hình sản phẩm" class="w-full h-48 object-cover rounded-md mb-4" />
        <h2 class="text-lg font-bold text-gray-800">{{ sanPham.title }}</h2>
        <p class="text-sm text-gray-500 mb-2">{{ sanPham.description?.substring(0, 50) }}...</p>
        <p class="text-xl font-bold text-red-500">{{ sanPham.price }}$</p>
          <button class="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">
            <!-- Thay chữ bằng thẻ này -->
            <router-link :to="{ name: 'ProductDetail', params: { id: sanPham.id } }" class="block w-full h-full">
              Xem chi tiết
            </router-link>
          </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nhập cái kho logic mình vừa tạo vào
import { useProducts } from '../composables/useProducts';

// Lôi thêm 3 hàm mới ra đây
const { 
  danhSachSanPham, dangTai, taoDienThoaiMoi,
  capNhatGia, xoaDienThoai, dangNhapThu, timKiemSanPham
} = useProducts();
</script>



