package com.foodmarket.food_market.product.dto;

import com.foodmarket.food_market.product.model.Product;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@Builder
public class AdminProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Map<String, String> specifications;
    private List<ProductImageDTO> images;
    private String unit;
    private BigDecimal basePrice; // Giá gốc
    private String slug;
    private int stockQuantity;
    // Thông tin liên quan
    private CategorySummaryDTO category; // Dùng 1 DTO con để tránh trả về quá nhiều
    private List<TagDTO> tags;
    private LocalDate soonestExpirationDate;
    private boolean isDeleted;
    /**
     * Hàm static fromEntity phức tạp
     * Logic tính giá (finalPrice) sẽ do Service thực hiện và truyền vào đây.
     * DTO chỉ chịu trách nhiệm map dữ liệu.
     */
    public static AdminProductResponseDTO fromEntity(
            Product product,
            int stockQuantity,
            LocalDate soonestExpirationDate
    ) {
        return AdminProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .specifications(product.getSpecifications()!=null?product.getSpecifications():new HashMap<>())
                .images(product.getImages().stream()
                        .map(ProductImageDTO::fromEntity)
                        .collect(Collectors.toList()))
                .unit(product.getUnit())
                .basePrice(product.getBasePrice())
                .stockQuantity(stockQuantity)
                .slug(product.getSlug())
                .soonestExpirationDate(soonestExpirationDate)
                .category(CategorySummaryDTO.fromEntity(product.getCategory()))
                .tags(product.getTags().stream()
                        .map(TagDTO::fromEntity)
                        .collect(Collectors.toList()))
                .isDeleted(product.isDeleted())
                .build();
    }
}