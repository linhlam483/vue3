# CÔNG NGHỆ QUẢN LÝ DỮ LIỆU: TANSTACK QUERY (VUE QUERY)

## 1. Sự Yếu Kém Của Việc Gọi API Truyền Thống

Khi dùng Axios và biến `ref()` thông thường:

- Rất cồng kềnh vì phải tự viết các biến `dangTai` (Loading), `biLoi` (Error).
- Mỗi lần chuyển trang rồi quay lại, web lại bắt Axios lóc cóc chạy đi gọi API từ đầu ➔ Mạng chậm, tốn tài nguyên máy chủ.

## 2. TanStack Query Sinh Ra Để Làm Gì?

Nó là một thư viện bọc bên ngoài Axios, đóng vai trò như một **"Thủ Kho kiêm Quản Lý"**:

- **Axios** đi lấy hàng về.
- **TanStack Query** cất hàng vào **Nhà Kho Tàng Hình (Cache)**. Lần sau người dùng quay lại trang, nó lấy hàng từ kho ra show luôn lên màn hình (nhanh 0.001 giây), người dùng không cần đợi.
- Trong lúc người dùng đang xem đồ cũ, nó tự động sai Axios lén chạy ngầm (Background Fetch) sang Backend hỏi xem có hàng mới không. Có thì nó tự cập nhật lên màn hình.

## 3. Quản Lý "Server State" vs "Client State"

- **Pinia (Client State):** Chỉ nên dùng để lưu trạng thái cục bộ của giao diện (Tối/Sáng, Menu đóng/mở).
- **TanStack Query (Server State):** Chuyên trị mọi dữ liệu lấy từ Database Backend về (Danh sách sản phẩm, Bình luận, Tin nhắn). Không được nhét chung vào Pinia nữa.

## 4. Code Mẫu Siêu Ngắn Gọn

Khi dùng TanStack Query, bạn không cần phải viết `try...catch` dài dòng nữa. Mọi thứ thu bé lại vừa bằng 1 hàm:

```javascript
import { useQuery } from "@tanstack/vue-query";
import API from "../utils/api";

// Gọi hàm useQuery, nó tự động lo hết mọi thứ
const { isLoading, isError, data } = useQuery({
  queryKey: ["danh-sach-san-pham"], // Đặt tên cho ngăn tủ trong Nhà Kho
  queryFn: () => API.get("/products"), // Giao việc cho Axios đi lấy hàng
});
```
