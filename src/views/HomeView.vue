<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-8 text-blue-600">Cửa Hàng Điện Thoại</h1>
    <input 
      v-model="tuKhoaTimKiem" 
      type="text" 
      placeholder="🔍 Nhập tên điện thoại cần tìm..." 
      class="max-w-md mx-auto block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 text-sm mb-8"
    />
    <div class="flex gap-4 justify-center mb-8">
        <button @click="taoDienThoaiMoi" class="bg-blue-500 text-white px-4 py-2 rounded">+ Tạo (POST)</button>
        <button @click="capNhatGia" class="bg-yellow-500 text-white px-4 py-2 rounded">Giảm giá (PATCH)</button>
        <button @click="xoaDienThoai" class="bg-red-500 text-white px-4 py-2 rounded">Xóa (DELETE)</button>
        <button @click="dangNhapThu" class="bg-purple-500 text-white px-4 py-2 rounded">Đăng Nhập (Auth)</button>
        <button @click="timKiemSanPham" class="bg-gray-800 text-white px-4 py-2 rounded">Tìm (GET Params)</button>

    </div>


    <!-- Nút bấm ẩn/hiện Form -->
    <div class="text-center mb-8">
      <button 
        @click="hienThiForm = !hienThiForm"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
      >
        {{ hienThiForm ? '✖ Đóng Form' : '➕ Tạo sản phẩm mới' }}
      </button>
    </div>

    <!-- Form Thêm Sản Phẩm Mới (Chỉ hiện khi hienThiForm = true) -->
    <div v-if="hienThiForm" class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-gray-200 shadow-lg mb-8">
      <h3 class="text-lg font-bold text-gray-800 mb-4">✨ Thêm Điện Thoại Mới</h3>
      
      <!-- Lắng nghe sự kiện submit của form, chặn tải lại trang bằng .prevent -->
      <form @submit.prevent="xuLyTaoSanPham" class="space-y-4 text-left">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">Tên điện thoại *</label>
          <input 
            v-model="formSanPhamMoi.title" 
            type="text" 
            required 
            placeholder="Ví dụ: iPhone 16 Pro Max" 
            class="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
          />
        </div>
        
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">Giá bán ($) *</label>
          <input 
            v-model="formSanPhamMoi.price" 
            type="number" 
            required 
            min="1"
            placeholder="Ví dụ: 1099" 
            class="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">Mô tả thiết bị *</label>
          <textarea 
            v-model="formSanPhamMoi.description" 
            required 
            rows="3"
            placeholder="Nhập vài dòng mô tả cấu hình..." 
            class="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 bg-white"
          ></textarea>
        </div>

        <button 
          type="submit" 
          class="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition active:scale-95 cursor-pointer shadow-md shadow-emerald-500/10"
        >
          Lưu sản phẩm
        </button>
      </form>
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
        <div class="flex gap-2 mt-4">
          <button class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold">
            <router-link :to="{ name: 'ProductDetail', params: { id: sanPham.id } }" class="block w-full h-full text-center">
              Xem chi tiết
            </router-link>
          </button>
          <button 
            @click="addToCart(sanPham)"
            class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold cursor-pointer"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
      <!-- KHU VỰC GIỎ HÀNG Ở CUỐI TRANG -->
  <div class="mt-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      🛒 Giỏ Hàng Của Bạn ({{ totalItems }} sản phẩm)
    </h2>
    
    <!-- Nếu chưa có gì trong giỏ -->
    <div v-if="cartItems.length === 0" class="text-center py-6 text-gray-400 text-sm">
      Giỏ hàng trống trơn. Hãy bấm "Mua ngay" ở các sản phẩm phía trên nhé!
    </div>

    <!-- Nếu có sản phẩm trong giỏ -->
    <div v-else class="space-y-4">
      <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between border-b pb-3 text-left">
        <div class="flex items-center gap-4">
          <img :src="item.thumbnail" class="w-12 h-12 object-cover rounded-md border" />
          <div>
            <h4 class="font-bold text-gray-800 text-sm">{{ item.title }}</h4>
            <p class="text-xs text-slate-400">Đơn giá: {{ item.price }}$ x {{ item.quantity }} cái</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <span class="font-bold text-emerald-600">{{ (item.price * item.quantity).toFixed(2) }}$</span>
          <button 
            @click="removeFromCart(item.id)" 
            class="text-xs text-red-500 hover:text-red-700 underline font-semibold cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </div>

      <!-- Tổng tiền -->
      <div class="flex justify-between items-center pt-4 font-bold text-lg text-gray-800">
        <span>Tổng tiền thanh toán:</span>
        <span class="text-xl text-red-500">{{ totalPrice.toFixed(2) }}$</span>
      </div>
    </div>
  </div>

  </div>
</template>



<script setup>
import { ref } from 'vue';
import { useProducts } from '../composables/useProducts';
import { useCart } from '../composables/useCart';

// 1. Chỉ cần lôi biến tuKhoaTimKiem ra từ useProducts. Không cần tự khai báo ref hay watch nữa!
const { 
  tuKhoaTimKiem, danhSachSanPham, dangTai, taoDienThoaiMoi,
  capNhatGia, xoaDienThoai, dangNhapThu
} = useProducts();

const { cartItems, addToCart, removeFromCart, totalItems, totalPrice } = useCart();

// Các dòng khai báo Form và ẩn/hiện Form (Giữ nguyên như Bài Học 3)
const hienThiForm = ref(false);
const formSanPhamMoi = ref({
  title: '',
  price: '',
  description: '',
  thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
});

const xuLyTaoSanPham = () => {
  taoDienThoaiMoi(formSanPhamMoi.value);
  formSanPhamMoi.value = {
    title: '', price: '', description: '',
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
  };
  hienThiForm.value = false;
};
</script>




