package com.foodmarket.food_market.review.dto.response;

import com.foodmarket.food_market.review.model.Review;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewResponseDTO {
    private Long id;
    private UUID userId;
    private String userName;
    private Long productId;
    private String productName;
    private int rating;
    private String comment;
    private OffsetDateTime createdAt;

    public static ReviewResponseDTO fromEntity(Review review,String username) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .userName(username)
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}