import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import API from '../utils/api';
import { useDebounce } from './useDebounce';

// 1. Tạo một biến tìm kiếm phản xạ toàn cục (Singleton)
const tuKhoaTimKiem = ref('');

export function useProducts() {
  const queryClient = useQueryClient();

  // 2. Bọc từ khóa tìm kiếm qua Debounce (Trì hoãn 500ms giống như bạn làm ở bài 2)
  const tuKhoaDaDebounce = useDebounce(tuKhoaTimKiem, 500);

  // 3. Khóa tủ trong cache: Hễ từ khóa đã debounce thay đổi, tủ cache sẽ tự làm mới!
  const queryKey = computed(() => ['products', tuKhoaDaDebounce.value]);

  // 4. Gọi hàm useQuery - Tự động lo hết isLoading, try...catch và quản lý cache
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      if (tuKhoaDaDebounce.value.trim() !== "") {
        // Nếu có từ khóa, gọi API tìm kiếm
        const response = await API.get('/products/search', {
          params: { q: tuKhoaDaDebounce.value }
        });
        return response.data.products;
      } else {
        // Mặc định lấy toàn bộ sản phẩm
        const response = await API.get('/products');
        return response.data.products;
      }
    },
    staleTime: 60000, // Dữ liệu được coi là mới trong 1 phút, chuyển trang quay lại không cần load lại!
  });

  // Biến đổi dữ liệu thô từ Query thành biến phản xạ để giao diện dễ dùng
  const danhSachSanPham = computed(() => data.value || []);
  const dangTai = isLoading;

  // 5. Hàm gửi dữ liệu (Tạo mới) bằng useMutation
  const taoDienThoaiMoi = async (duLieuDienThoai) => {
    try {
      const response = await API.post('/products/add', {
        title: duLieuDienThoai?.title || 'iPhone 20 Pro Max',
        price: Number(duLieuDienThoai?.price) || 9999,
        description: duLieuDienThoai?.description || 'Điện thoại siêu cấp',
        thumbnail: duLieuDienThoai?.thumbnail || 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
      });

      // Kỹ thuật nâng cao: Đồng bộ cache cục bộ
      // Vì API ảo DummyJSON không lưu thật, ta tự nhét sản phẩm mới lên đầu mảng trong Cache tủ
      queryClient.setQueryData(queryKey.value, (oldData) => {
        return oldData ? [response.data, ...oldData] : [response.data];
      });

      alert("Tạo sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi tạo mới:", error);
    }
  };

  // 6. Dùng PATCH để cập nhật giá tiền của sản phẩm số 1
  const capNhatGia = async () => {
    try {
      const response = await API.patch('/products/1', { price: 500 });

      // Đồng bộ cache cục bộ: Tìm sản phẩm số 1 và sửa giá thành 500$
      queryClient.setQueryData(queryKey.value, (oldData) => {
        return oldData ? oldData.map(p => p.id === 1 ? { ...p, price: 500 } : p) : [];
      });

      alert("Đã giảm giá sản phẩm số 1 xuống còn 500$!");
    } catch (error) {
      console.error(error);
    }
  };

  // 7. Dùng DELETE để xóa Điện thoại số 1
  const xoaDienThoai = async () => {
    try {
      await API.delete('/products/1');

      // Đồng bộ cache cục bộ: Loại bỏ sản phẩm số 1 ra khỏi cache tủ
      queryClient.setQueryData(queryKey.value, (oldData) => {
        return oldData ? oldData.filter(p => p.id !== 1) : [];
      });

      alert("Đã tiêu diệt sản phẩm số 1 khỏi cache!");
    } catch (error) {
      console.error(error);
    }
  };

  // 8. Thực hành Auth Token
  const dangNhapThu = async () => {
    try {
      const response = await API.post('/auth/login', {
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 30
      });
      localStorage.setItem('token_cua_toi', response.data.accessToken);
      alert("Đăng nhập thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  // Trả về những gì HTML cần xài
  return {
    tuKhoaTimKiem, // Trả về để ô Input ở View liên kết v-model trực tiếp
    danhSachSanPham,
    dangTai,
    isError,
    taoDienThoaiMoi,
    capNhatGia,
    xoaDienThoai,
    dangNhapThu
  };
}
