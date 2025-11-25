package com.foodmarket.food_market.product.repository;

import com.foodmarket.food_market.product.model.Product;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    /**
     * Tạo Specification động
     *
     * @param searchTerm (tìm theo tên sản phẩm)
     * @param categorySlug (lọc theo danh mục)
     * @return Specification<Product>
     */
    public static Specification<Product> filterBy(
            String searchTerm,
            Long categoryId,
            String categorySlug,
            Boolean includeSoftDeleted,
            Boolean onlySoftDeleted
    ) {

        return Specification.allOf(filterDeleted(includeSoftDeleted, onlySoftDeleted))
                .and(hasSearchTerm(searchTerm))
                .and(hasCategoryId(categoryId))
                .and(hasCategory(categorySlug));
    }

    private static Specification<Product> filterDeleted(Boolean includeSoftDeleted, Boolean onlySoftDeleted) {

        // Chỉ lấy sản phẩm bị xoá mềm
        if (Boolean.TRUE.equals(onlySoftDeleted)) {
            return (root, query, cb) -> cb.isTrue(root.get("isDeleted"));
        }

        // Nếu includeDeleted = true → không cần lọc deleted
        if (Boolean.TRUE.equals(includeSoftDeleted)) {
            return null;
        }

        // Mặc định: chỉ lấy chưa xoá
        return (root, query, cb) -> cb.isFalse(root.get("isDeleted"));
    }

    private static Specification<Product> hasSearchTerm(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return null;

        return (root, query, cb) -> {
            // 1. Lấy giá trị cột name và bọc trong hàm unaccent
            Expression<String> unaccentName = cb.function("unaccent", String.class, root.get("name"));

            // 2. Tạo pattern tìm kiếm, cũng bọc keyword trong unaccent
            // Lưu ý: concat '%' ở ngoài để tránh phức tạp trong hàm function
            String pattern = "%" + keyword.toLowerCase() + "%";
            Expression<String> unaccentPattern = cb.function("unaccent", String.class, cb.literal(pattern));

            // 3. So sánh ILIKE (lower case)
            return cb.like(cb.lower(unaccentName), cb.lower(unaccentPattern));
        };
    }
    private static Specification<Product> hasCategoryId(Long categoryId) {
        if (categoryId == null) return null;
        return (root, query, cb) ->
                cb.equal(root.get("category").get("id"), categoryId);
    }
    private static Specification<Product> hasCategory(String categorySlug) {
        if (categorySlug == null) return null;

        return (root, query, cb) ->
                cb.equal(root.get("category").get("slug"), categorySlug);
    }
}