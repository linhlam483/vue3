<template>
  <!-- Đây là giao diện của Mảnh ghép -->
  <div class="bg-blue-500 text-white p-6 rounded-lg shadow-lg w-1/2 mt-5">
    <h3 class="text-xl font-bold">{{ title }}</h3>
    <p>Tôi là một mảnh ghép nằm trong Trang chính.</p>

    <button
      class="mt-4 bg-white text-blue-500 px-4 py-2 rounded font-semibold hover:bg-blue-100"
    >
      Bấm vào tôi
    </button>
  </div>
</template>

<script setup>
// Khai báo rằng mảnh ghép này cần nhận vào một "title" từ bên ngoài (từ View truyền vào)
defineProps({
  title: String,
});
</script>
