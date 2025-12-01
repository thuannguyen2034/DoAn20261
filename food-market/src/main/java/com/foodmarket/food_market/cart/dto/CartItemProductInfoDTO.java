package com.foodmarket.food_market.cart.dto;

import com.foodmarket.food_market.product.model.Product;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemProductInfoDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private String unit;
    private String slug;
    private String categorySlug;

    public static CartItemProductInfoDTO fromEntity(Product product) {
        String imageUrl = (product.getImages() != null && !product.getImages().isEmpty())
                ? product.getImages().get(0).getImageUrl()
                : null;
        return CartItemProductInfoDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .imageUrl(imageUrl)
                .unit(product.getUnit())
                .slug(product.getSlug())
                .categorySlug(product.getCategory().getSlug())
                .build();
    }
}