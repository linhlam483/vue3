# 🚀 Tổng Hợp Kiến Thức: Tư Duy Kiến Trúc Web Hiện Đại (Vue 3)

Tài liệu này đúc kết toàn bộ những gì chúng ta đã trao đổi và thực hành, giúp bạn rũ bỏ tư duy lập trình cũ (viết mọi thứ vào một file) để chuyển sang tư duy chia nhỏ của kỹ sư phần mềm hiện đại.

---

## 1. Bộ Ba Vũ Khí Hạng Nặng
Bỏ qua các phiên bản cũ kỹ từ 5 năm trước, đây là bộ công cụ chuẩn mực cho năm nay:

*   **Vite (Nhà Phiên Dịch & Đóng Gói):** Trình duyệt không hiểu code Vue. Vite sẽ dịch code `.vue`, `.css` của bạn sang HTML/JS thuần trong chớp mắt (tức thì), và gom chúng lại cho thật gọn nhẹ khi xuất bản dự án.
*   **Vue 3 (Người Đạo Diễn & Dựng Khung):** Lo phần xương cốt (HTML), quản lý dữ liệu, và chịu trách nhiệm làm trang web cập nhật tự động mà không cần nhấn F5.
*   **Tailwind CSS v4 (Chuyên Gia Trang Điểm):** Không tạo ra nội dung, không tạo ra chức năng. Nó chỉ cung cấp các "class" để bạn khoác lên thẻ HTML giúp trang web có màu sắc, hình khối, bo góc ngay lập tức mà không cần viết file CSS rời rạc.

---

## 2. Cấu Trúc Dự Án (Nguyên lý "Đài Truyền Hình")
Thay vì viết một tràng dài, dự án được chặt nhỏ ra:

*   **`App.vue` (Vỏ Tivi):** Là cái khung cố định chứa màn hình chiếu `<RouterView />`.
*   **`router/` (Cái Điều Khiển):** Lắng nghe người dùng gõ URL (ví dụ `/about`) để chọn đúng Sân khấu hiển thị lên Tivi.
*   **`views/` (Sân Khấu):** Là trang chính (`HomeView`, `AboutView`). Nó gọi API lấy dữ liệu và sắp xếp các Đạo cụ vào đúng chỗ.
*   **`components/` (Đạo Cụ / Mảnh Ghép):** Là các nút bấm, thẻ thông tin (`BlueCard`). Tính tái sử dụng cực cao. Bạn viết 1 lần, mang đi đặt ở 10 sân khấu khác nhau cũng được.

---

## 3. Quản Lý Logic Ở Đâu? (Chống Spaghetti Code)
Code xử lý (tính toán, điều kiện) không còn bị nhồi nhét vào một chỗ nữa, mà chia làm 3 cấp độ:

*   **Cấp 1 (Riêng tư):** Nút nào tự lo việc của nút đó. Viết thẳng vào `<script setup>` của file `.vue`.
*   **Cấp 2 (Dùng chung tiện ích):** Hàm tính thuế, format ngày tháng... được viết thành file JS ném vào thư mục `utils/`. File nào cần thì `import` vào dùng.
*   **Cấp 3 (Dữ liệu toàn cục):** Thông tin User đăng nhập, Giỏ hàng... được cất vào **Pinia** (Một két sắt dùng chung). Bất kỳ trang nào cũng có thể chọc vào két sắt này để lấy dữ liệu.

---

## 4. Ranh Giới Frontend - Backend & Cơ Sở Dữ Liệu
Đây là sự giác ngộ lớn nhất để phân biệt web kiểu cũ (như PHP thuần) và web hiện đại:

*   **Pinia KHÔNG phải Database:** Nó chỉ là cái "Ví tiền" (RAM) dùng để lưu dữ liệu tạm thời cho màn hình hiển thị. Nhấn F5 tải lại trang là bay sạch. Không được lưu file lớn vào đây.
*   **Frontend (Vue) CẤM kết nối trực tiếp DB:** Code Vue chạy trên máy khách hàng, nếu để mật khẩu Database ở đây thì hacker sẽ lấy được ngay lập tức.
*   **Giải pháp (API & Backend):** 
    *   **Backend (Máy chủ)** là nơi an toàn duy nhất kết nối với Cơ sở dữ liệu (Database).
    *   **Frontend (Vue)** dùng công cụ như **Axios** hoặc **Fetch** để "gọi điện" (API) đến Backend xin dữ liệu. Backend chắt lọc dữ liệu, đóng gói thành file văn bản (JSON) rồi ném trả lại cho Vue hiển thị.

---

## 5. Cơ Chế Đăng Nhập & Phân Quyền (Nguyên lý "Quán Bar VIP")
Sự kết hợp giữa Frontend và Backend trong việc bảo mật:
*   **Backend (Vệ Sĩ):** Nắm giữ danh sách khách hàng. Khi người dùng nhập đúng Tên/Mật khẩu, Backend phát ra một **Thẻ Bài (Token)**.
*   **Vue 3 (Lễ Tân):** Cầm Thẻ Bài cất vào túi. Dùng tính năng *Router Guards* để chặn cửa: *"Không có Thẻ Bài thì không được vào trang Admin, mời quay lại trang Login!"*.
*   **Tuyệt đối an toàn:** Dù người dùng bẻ khóa được Vue để mò vào trang Admin, khi gọi API, Backend không thấy Thẻ Bài xịn thì sẽ chặn luôn dữ liệu. Trang Admin khi đó chỉ là một màn hình trống rỗng.

---

## 6. Kiến Trúc Đa Hệ Thống (Mô Hình "Con Bướm")
Tại sao code cũ khó làm phân quyền phức tạp (như Web Sinh Viên và Web Giáo Viên)? Vì xưa kia chúng bị nhồi chung vào một cục. Kiến trúc hiện đại giải quyết bằng mô hình Con Bướm:

*   **Thân Bướm (Backend + Database):** Điểm xử lý tập trung duy nhất. Kiểm tra xem Thẻ Bài gửi đến là của Giáo Viên hay Sinh Viên để trả về đúng dữ liệu.
*   **Cánh Trái (Frontend Sinh Viên):** Một dự án Vue 3 độc lập. Chỉ chứa giao diện của Sinh Viên.
*   **Cánh Phải (Frontend Giáo Viên):** Một dự án Vue 3 độc lập khác. Chứa giao diện chấm điểm, thêm sửa khóa học.
*   **Lợi ích:** Frontend tách rời hoàn toàn. Code sửa bên giao diện Sinh Viên sẽ không bao giờ làm hỏng hay đứt gãy tính năng bảo mật của bên Giáo Viên.

---
*💡 Lời nhắn: Đừng cố học thuộc lòng đoạn code. Hãy nhớ cái "Tư duy" và "Sự phân chia nhiệm vụ" ở trên. Chỉ cần hiểu luồng đi, khi quên code bạn hoàn toàn có thể tra Google hoặc hỏi AI rất dễ dàng!*
