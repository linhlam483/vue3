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

# KIẾN THỨC NÂNG CAO: DEBOUNCE, GIỎ HÀNG TOÀN CỤC & HACK CACHE
## 1. Kỹ Thuật Trì Hoãn Đồng Hồ (Debounce) - "Phục Vụ Bàn Thông Minh"
- **Nỗi đau:** Mỗi lần gõ phím là Vue lập tức kích hoạt gọi API. Gõ chữ "iphone" gửi liên tiếp 6 request trong 1 giây ➔ Spam làm nghẽn mạng và dễ sập server.
- **Ý tưởng giải pháp (Debounce):** Giống như bạn đi gọi món nước. Bạn mở miệng nói chữ "Cho..." rồi ngập ngừng "Cho tôi..." rồi "Cho tôi ly..." rồi "Cho tôi ly nước xoài!". Người phục vụ thông minh sẽ không lập tức chạy đi làm nước từ chữ "Cho...", mà sẽ đứng yên chờ cho đến khi bạn ngậm miệng hoàn toàn 0.5 giây mới đi pha nước.
- **Bản chất Code:**
  - setTimeout: Đặt một lịch hẹn giờ (hẹn 500ms sau sẽ gọi API).
  - clearTimeout: Giật đứt và hủy lịch hẹn cũ nếu phím tiếp theo được gõ xuống trước khi đồng hồ kịp đếm hết 500ms.
- **Kết quả:** Dù bạn gõ 100 chữ liên tục, chỉ có chiếc đồng hồ cuối cùng không bị ai hủy và thực hiện gọi API 1 lần duy nhất!

## 2. Giỏ Hàng Toàn Cục (Shared State) & Két Sắt Trình Duyệt (Persistence)
- **Shared State (Trạng thái dùng chung):**
  - Nếu khai báo biến const cartItems = ref([]) nằm bên trong hàm useCart(), mỗi lần một component gọi useCart nó sẽ tạo ra một giỏ hàng mới độc lập (mất giỏ hàng khi chuyển trang).
  - Bằng cách đưa const cartItems = ref([]) nằm tự do bên ngoài hàm useCart(), biến này trở thành "Bình nước lọc công cộng" đặt ở hành lang. Trang chủ, Header, hay trang Chi tiết đều uống chung từ bình này. Cập nhật ở một nơi, tất cả nơi khác đều thấy ngay lập tức.
- **Persistence (Lưu trữ bền vững):**
  - Chúng ta dùng localStorage.setItem để lưu trữ chuỗi JSON của giỏ hàng.
  - Khi theo dõi giỏ hàng, ta bắt buộc phải dùng thuộc tính { deep: true } trong watch. Vì giỏ hàng là một danh sách chứa các Object. Nếu người dùng chỉ tăng số lượng của 1 cái đùi gà từ 1 lên 2, Vue sẽ không nhận biết được nếu chỉ kiểm tra bề mặt. { deep: true } ra lệnh cho Vue chui sâu vào từng ngóc ngách của các Object con để phát hiện sự thay đổi và lưu vào két sắt kịp thời.

## 3. Toán Học Máy Tính
- **Bản chất:** Máy tính chỉ hiểu hệ nhị phân (0 và 1). Các số thập phân như 3.99 khi dịch sang nhị phân sẽ bị tuần hoàn vô hạn (giống như lấy 10 / 3 ra 3.3333...). Máy tính buộc phải cắt bớt số thập phân ở cuối, dẫn đến các sai số làm tròn siêu nhỏ khi nhân chia.
- **Vũ khí giải quyết:** Hàm số.toFixed(N). Nó sẽ tự động làm tròn số và cắt đúng N số sau dấu phẩy dưới dạng chuỗi (String) để hiển thị lên màn hình đẹp đẽ.
- **Ví dụ:** totalPrice.toFixed(2) biến 35.910000000000004$ thành 35.91$ gọn gàng.

## 4. Kỹ Thuật Hack Cache TanStack Query (setQueryData)
- **Vấn đề:** Các API miễn phí thử nghiệm (như DummyJSON) chỉ giả vờ nhận POST/PATCH/DELETE chứ không lưu thật vào database. Nếu ta dùng TanStack Query để tải lại dữ liệu mới (invalidateQueries), sản phẩm ta vừa thêm sẽ biến mất không dấu vết.
- **Giải pháp:** Chúng ta sử dụng hàm queryClient.setQueryData.
- **Bản chất:** Hàm này cho phép chúng ta tự tay "mở tủ kính nhà kho" của TanStack Query tại local và tự nhét hàng mới vào (hoặc xóa hàng cũ đi). Người dùng sẽ thấy sản phẩm thay đổi ngay lập tức trên màn hình với tốc độ cực nhanh mà không cần chờ xe hàng chở từ Backend về!

