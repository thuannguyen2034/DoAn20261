package com.foodmarket.food_market.review.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateReviewRequestDTO {
    @NotNull(message = "Product ID không được để trống")
    private Long productId;

    @NotNull(message = "Order ID không được để trống")
    private UUID orderId;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Đánh giá thấp nhất là 1 sao")
    @Max(value = 5, message = "Đánh giá cao nhất là 5 sao")
    private Integer rating;

    private String comment;
}