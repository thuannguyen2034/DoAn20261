package com.foodmarket.food_market.review.repository;

import com.foodmarket.food_market.review.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Kiểm tra xem User đã review sản phẩm này trong đơn hàng này chưa
    boolean existsByUserIdAndOrderIdAndProductId(UUID userId, UUID orderId, Long productId);

    // Lấy danh sách review theo sản phẩm (để hiển thị trang chi tiết Product)
    Page<Review> findByProductId(Long productId, Pageable pageable);
}