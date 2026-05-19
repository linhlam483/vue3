<template>
  <div class="p-8 max-w-2xl mx-auto text-center mt-10 bg-white rounded-xl shadow-lg border">
    
    <div v-if="dangTai" class="text-xl text-gray-500">Đang tìm trong kho...</div>
    
    <div v-else-if="chiTietSanPham">
      <!-- Nút quay lại -->
      <router-link to="/" class="text-blue-500 underline mb-6 inline-block">← Quay lại cửa hàng</router-link>
      
      <h1 class="text-3xl font-bold text-gray-800">{{ chiTietSanPham.title }}</h1>
      <img :src="chiTietSanPham.thumbnail" class="w-64 h-64 object-cover mx-auto my-6 rounded-lg shadow-md" />
      <p class="text-gray-600 mb-4">{{ chiTietSanPham.description }}</p>
      <p class="text-2xl font-bold text-red-600">{{ chiTietSanPham.price }}$</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import API from '../utils/api';

const route = useRoute(); // Công cụ giúp bới móc thanh URL để tìm ID
const chiTietSanPham = ref(null);
const dangTai = ref(true);

const layChiTiet = async () => {
  try {
    // route.params.id chính là cái số nằm trên thanh địa chỉ
    const response = await API.get(`/products/${route.params.id}`); 
    chiTietSanPham.value = response.data;
  } catch (error) {
    console.error("Không tìm thấy sản phẩm:", error);
  } finally {
    dangTai.value = false;
  }
};

onMounted(() => {
  layChiTiet();
});
</script>
