import { ref, watch } from 'vue';

/**
 * Custom Composable giúp làm trễ (debounce) sự thay đổi của một biến ref.
 * 
 * @param {Ref} sourceRef - Biến ref gốc muốn theo dõi (ví dụ: từ khóa người dùng đang gõ)
 * @param {number} delay - Thời gian chờ (mili-giây), mặc định là 500ms
 * @returns {Ref} - Biến ref mới đã được debounce (chỉ thay đổi giá trị khi nguồn dừng thay đổi đủ lâu)
 */
export function useDebounce(sourceRef, delay = 500) {
  // 1. Tạo một biến ref phụ chứa giá trị đã được làm trễ
  const debouncedValue = ref(sourceRef.value);

  // Biến lưu trữ ID của chiếc đồng hồ hẹn giờ
  let timeoutId = null;

  // 2. Theo dõi biến gốc (sourceRef)
  watch(sourceRef, (newValue) => {
    // Nếu có một chiếc đồng hồ hẹn giờ cũ đang chạy, ta lập tức hủy nó đi
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Đặt một chiếc đồng hồ hẹn giờ mới
    timeoutId = setTimeout(() => {
      // Chỉ khi người dùng dừng gõ đủ lâu (hết thời gian delay),
      // ta mới cập nhật giá trị mới cho biến phụ
      debouncedValue.value = newValue;
    }, delay);
  });

  // 3. Trả về biến đã được làm trễ để bên giao diện sử dụng
  return debouncedValue;
}
