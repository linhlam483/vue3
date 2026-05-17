import axios from 'axios';

// Tạo một trạm phát sóng riêng (instance)
const api = axios.create({
  // Điền địa chỉ Backend gốc vào đây. Từ nay về sau không cần gõ lại đoạn này nữa.
  baseURL: 'https://dummyjson.com',
  
  // Thời gian chờ tối đa (nếu Backend sập quá 10 giây thì tự động ngắt máy)
  timeout: 10000, 
});

// (Phần nâng cao): Kẹp Thẻ bài Token vào mỗi lần gọi điện
api.interceptors.request.use((config) => {
  // Giả sử lấy token từ Két sắt LocalStorage
  const token = localStorage.getItem('token_cua_toi');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Dán token vào phong bì
  }
  return config;
});

export default api;
