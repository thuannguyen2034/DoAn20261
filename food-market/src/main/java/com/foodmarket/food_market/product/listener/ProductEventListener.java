package com.foodmarket.food_market.product.listener;

import com.foodmarket.food_market.order.event.OrderStatusChangedEvent;
import com.foodmarket.food_market.order.model.OrderItem;
import com.foodmarket.food_market.order.model.enums.OrderStatus;
import com.foodmarket.food_market.order.repository.OrderItemRepository;
import com.foodmarket.food_market.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductEventListener {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository; // Cần repo này để lấy list item

    @Async // Chạy ở thread khác để không làm chậm luồng chính
    @Transactional(propagation = Propagation.REQUIRES_NEW) // Tạo transaction mới hoàn toàn
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT) // Chỉ chạy khi Order đã lưu DB thành công 100%
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {

        if (event.getNewStatus() == OrderStatus.CONFIRMED) {
            // Query lại Item từ DB để đảm bảo an toàn (tránh lỗi Lazy Loading)
            List<OrderItem> items = orderItemRepository.findByOrderId(event.getOrder().getId());

            items.forEach(item ->
                    productRepository.incrementSoldCount(item.getProductIdSnapshot(), item.getQuantity())
            );
        }
    }
}
