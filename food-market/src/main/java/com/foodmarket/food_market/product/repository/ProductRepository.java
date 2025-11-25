package com.foodmarket.food_market.product.repository;

import com.foodmarket.food_market.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    // JpaSpecificationExecutor sẽ cung cấp các hàm (findAll)
    // cho phép chúng ta lọc động (dynamic filtering)
    Optional<Product> findBySlug(String slug);
    Optional<Product> findByIdAndIsDeletedFalse(Long id);
    @Query("select p.name from Product p where p.id = :id")
    String findNameById(@Param("id") Long id);
    // 1. Tăng số lượng bán (Query Native/JPQL để tối ưu tốc độ)
    @Modifying
    @Query("UPDATE Product p SET p.soldCount = COALESCE(p.soldCount, 0) + :qty WHERE p.id = :id")
    void incrementSoldCount(@Param("id") Long id, @Param("qty") Integer qty);

    // 2. Query gợi ý từ khóa (cho cái Dropdown Navbar)
    @Query(value = "SELECT DISTINCT p.name FROM products p " +
            "WHERE unaccent(p.name) ILIKE unaccent(concat('%', :keyword, '%')) " +
            "LIMIT 5", nativeQuery = true)
    List<String> searchKeywordSuggestions(@Param("keyword") String keyword);
}