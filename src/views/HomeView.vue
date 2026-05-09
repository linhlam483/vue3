<script setup>
import BlueCard from "../components/BlueCard.vue";
</script>

<template>
  <div class="p-10">
    <h1 class="text-4xl font-bold text-red-500 bg-green-200 p-4 rounded-xl">
      Tailwind v4!
    </h1>
    <!-- Bước 2: Dùng thẻ tự chế như một thẻ HTML bình thường -->
    <!-- Đồng thời, ta truyền dữ liệu "title" vào trong thẻ -->
    <BlueCard title="Xin chào, tôi là mảnh ghép số 1" />

    <!-- Bạn thậm chí có thể nhân bản nó lên rất nhiều lần với dữ liệu khác nhau -->
    <BlueCard title="Tôi là mảnh ghép số 2" />
    <BlueCard title="Còn tôi là mảnh ghép số 3" />
  </div>
</template>
