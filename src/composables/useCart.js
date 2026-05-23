import { ref, computed, watch } from 'vue';

// 1. Khai báo biến giỏ hàng ở NGOÀI hàm export để biến này thành trạng thái dùng chung (Shared State)
const cartItems = ref([]);

// 2. Khi khởi động ứng dụng, tự động kiểm tra xem có giỏ hàng cũ trong localStorage không
const storedCart = localStorage.getItem('gio_hang');
if (storedCart) {
    try {
        cartItems.value = JSON.parse(storedCart);
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng cũ:", e);
        cartItems.value = [];
    }
}

// 3. Theo dõi giỏ hàng: Hễ thêm, bớt, hoặc sửa số lượng là tự động lưu vào localStorage
// Chúng ta bắt buộc phải dùng { deep: true } vì cartItems là một mảng chứa các Object phức tạp
watch(cartItems, (newVal) => {
    localStorage.setItem('gio_hang', JSON.stringify(newVal));
}, { deep: true });

export function useCart() {

    // Hàm thêm sản phẩm vào giỏ
    const addToCart = (product) => {
        // Tìm xem sản phẩm đã có trong giỏ hàng chưa
        const productExist = cartItems.value.find(item => item.id === product.id);

        if (productExist) {
            // Nếu có rồi, chỉ cần tăng số lượng lên 1
            productExist.quantity += 1;
        } else {
            // Nếu chưa có, nhét sản phẩm mới vào kèm thuộc tính quantity = 1
            cartItems.value.push({
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: 1
            });
        }
    };

    // Hàm xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
        cartItems.value = cartItems.value.filter(item => item.id !== productId);
    };

    // Tính tổng số lượng hàng trong giỏ (Dùng computed để tự động cập nhật trên UI)
    const totalItems = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.quantity, 0);
    });

    // Tính tổng số tiền phải thanh toán
    const totalPrice = computed(() => {
        return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    // Trả về cho giao diện sử dụng
    return {
        cartItems,
        addToCart,
        removeFromCart,
        totalItems,
        totalPrice
    };
}
