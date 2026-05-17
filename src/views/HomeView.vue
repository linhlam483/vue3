<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-8 text-blue-600">Cửa Hàng Điện Thoại</h1>
    <div class="text-center mb-8">
        <button @click="taodienthoaimoi"
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
          xem chi tiết
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import API from '../utils/api';

// Tạo 2 biến để lưu trữ trạng thái và dữ liệu
const danhSachSanPham = ref([]); // Lúc đầu là mảng rỗng
const dangTai = ref(true);       // Trạng thái đang tải dữ liệu

// Hàm gọi API
const layDuLieuSanPham = async () => {
  try {
    // Axios chọc vào link API (Backend)
    const response = await API.get('/products');
    
    // Lưu kết quả Backend trả về vào biến của Vue
    danhSachSanPham.value = response.data.products;
    
    // Tắt trạng thái đang tải
    dangTai.value = false;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    dangTai.value = false;
  }
};

// onMounted nghĩa là: Ngay khi trang web vừa mở lên (render xong) thì chạy hàm lấy dữ liệu luôn
onMounted(() => {
  layDuLieuSanPham();
});

// Thêm hàm gửi dữ liệu lên Backend
const taodienthoaimoi = async () => {
  try {
    alert("Đang gửi dữ liệu lên máy chủ...");

    // Gọi API.post để GỬI một gói dữ liệu lên Backend
    const response = await API.post('/products/add', {
      title: 'iPhone 20 Pro Max',
      price: 9999,
      description: 'Điện thoại mới',
      thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
    });

    // In kết quả Backend trả về ra màn hình để xem
    console.log("Backend đã nhận và báo lại:", response.data);
    alert("Tạo thành công!");
    
    danhSachSanPham.value.push(response.data);
    alert("Đã thêm sản phẩm vào danh sách!");

  } catch (error) {
    console.error("Lỗi rồi:", error);
  }
};

</script>
