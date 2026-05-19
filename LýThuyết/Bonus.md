# KINH NGHIỆM THỰC CHIẾN & BẮT LỖI (DEBUG) FRONTEND

## 1. Vũ Khí Cứu Sập Giao Diện: Dấu Hỏi Chấm Thần Kỳ (`?.`)
- **Tên gọi:** Optional Chaining.
- **Tình huống:** API Backend bị lỗi, trả về thiếu dữ liệu (ví dụ thiếu chữ `description`). Khi Vue cố gắng gọi hàm cắt chữ `.substring()` trên một dữ liệu rỗng, nó sẽ báo lỗi `Cannot read properties of undefined` và **đánh sập toàn bộ giao diện**.
- **Cách cứu nét:** Thêm dấu `?` ngay trước dấu chấm. VD: `sanPham.description?.substring(0, 50)`. Dấu này dặn Vue là: *"Nếu có dữ liệu thì mới cắt chữ, nếu không có thì lơ nó đi, đừng sập web!"*.

## 2. Kỹ Năng Tìm Dấu Vết Lỗi (Debug)
- Khi web đột nhiên biến mất trắng trơn (màn hình trắng), đừng hoảng sợ. Hãy bấm ngay phím **`F12`**, mở tab **`Console`**.
- Mọi lời "chửi mắng" của Vue hoặc báo lỗi của hệ thống đều hiện chữ màu đỏ ở đây. Chỉ cần copy dòng lỗi đó ném lên Google hoặc hỏi AI là ra ngay bệnh.

## 3. Cú Lừa Của API Đồ Giả (Mock API) & Quản Lý Trạng Thái UI
- **Hiện tượng:** Bấm gọi `API.post` tạo điện thoại mới, Backend báo `200 OK` nhưng tải lại trang không thấy đâu.
- **Bản chất:** Các API miễn phí (như DummyJSON) chỉ giả vờ nhận dữ liệu chứ không lưu thật vào Database (để chống sập server của họ). 
- **Bài học:** Frontend không tự động load lại dữ liệu khi gửi POST thành công. Lập trình viên phải tự viết lệnh nhét sản phẩm đó vào danh sách (dùng lệnh `push()` để nhét xuống cuối, hoặc `unshift()` để nhét lên đầu) để người dùng thấy được ngay lập tức.

## 4. Lỗi Trắng Trang Do Vue Router
- **Hiện tượng:** Code đúng cú pháp `<router-link :to="{ name: 'ProductDetail' }">` nhưng web vẫn sập.
- **Bản chất:** Bạn đã gọi thẻ Link nhưng lại QUÊN chưa khai báo tên trang đó trong file `router/index.js`.
- **Bài học:** Thẻ Router-link cực kỳ nhạy cảm. Trước khi nhúng link chuyển trang vào HTML, luôn luôn phải đảm bảo cái "Đích đến" đã được khai báo đàng hoàng trong tổng đài Router.
