package com.foodmarket.food_market.review.service;

import com.foodmarket.food_market.review.dto.request.CreateReviewRequestDTO;
import com.foodmarket.food_market.review.dto.response.ReviewResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReviewService {
    ReviewResponseDTO createReview(UUID userId, CreateReviewRequestDTO request);
    Page<ReviewResponseDTO> getReviewsByProduct(Long productId, Pageable pageable);
}
