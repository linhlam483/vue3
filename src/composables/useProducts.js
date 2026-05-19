import { ref, onMounted } from 'vue';
import API from '../utils/api';

export function useProducts() {
  const danhSachSanPham = ref([]);
  const dangTai = ref(true);

  // Hàm tải dữ liệu
  const layDuLieuSanPham = async () => {
    try {
      const response = await API.get('/products');
      danhSachSanPham.value = response.data.products;
    } catch (error) {
      console.error("Lỗi rồi:", error);
    } finally {
      dangTai.value = false; // Luôn tắt loading dù thành công hay lỗi
    }
  };

  // Hàm gửi dữ liệu (Tạo mới)
  const taoDienThoaiMoi = async () => {
    try {
      const response = await API.post('/products/add', {
        title: 'iPhone 20 Pro Max',
        price: 9999,
        description: 'Điện thoại siêu cấp',
        thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
      });
      danhSachSanPham.value.unshift(response.data);
      alert("Tạo thành công!");
    } catch (error) {
      console.error("Lỗi tạo mới:", error);
    }
  };

    // 1. Dùng PATCH để cập nhật mỗi cái giá tiền của Điện thoại số 1
  const capNhatGia = async () => {
    try {
      const response = await API.patch('/products/1', {
        price: 500 // Chỉ gửi mỗi cái giá tiền (Payload)
      });
      console.log("Đã vá (PATCH) thành công:", response.data);
      alert("Đã giảm giá sản phẩm số 1 xuống còn 500$! Xem Console nhé.");
    } catch (error) {
      console.error(error);
    }
  };

    // 2. Dùng DELETE để xóa Điện thoại số 1
  const xoaDienThoai = async () => {
    try {
      const response = await API.delete('/products/1'); // Hoàn toàn không có cục {} Body nào ở đây
      console.log("Đã xóa (DELETE) thành công:", response.data);
      alert("Đã tiêu diệt sản phẩm số 1! Xem Console nhé.");
    } catch (error) {
      console.error(error);
    }
  };

    // 3. Thực hành Auth Token
  const dangNhapThu = async () => {
    try {
      // DummyJSON cấp sẵn tài khoản test: emilys / emilyspass
      const response = await API.post('/auth/login', {
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 30 // Thẻ bài này sống 30 phút
      });
      
      // Lấy Token do Backend trả về, cất vào két sắt trình duyệt
      localStorage.setItem('token_cua_toi', response.data.accessToken);
      
      console.log("Thông tin user đăng nhập:", response.data);
      alert("Đăng nhập thành công! Nhấn F12 -> tab Application -> Local Storage để soi Thẻ Bài.");
    } catch (error) {
      console.error(error);
    }
  };

    // 4. Thực hành GET kết hợp với PARAMS (Tuyệt đối không dùng Payload)
  const timKiemSanPham = async () => {
    try {
      alert("Đang tìm chữ 'phone'...");
      
      // Axios sẽ tự động biến cái params này thành: /products/search?q=phone
      const response = await API.get('/products/search', {
        params: {
          q: 'phone' 
        }
      });
      
      console.log("Kết quả tìm kiếm chữ 'phone':", response.data.products);
      alert("Đã tìm thấy " + response.data.products.length + " sản phẩm! Xem chi tiết ở Console.");
      
      // Nếu thích, bạn có thể đắp nó lên giao diện luôn bằng dòng này:
       danhSachSanPham.value = response.data.products;
      
    } catch (error) {
      console.error(error);
    }
  };

  // Tự động tải dữ liệu khi trang vừa mở
  onMounted(() => {
    layDuLieuSanPham();
  });

  // Trả về những gì HTML cần xài
  return {
    danhSachSanPham,
    dangTai,
    taoDienThoaiMoi,
    capNhatGia,
    xoaDienThoai,
    dangNhapThu,
    timKiemSanPham
  };
}
