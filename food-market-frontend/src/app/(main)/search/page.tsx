'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryResponse, ProductResponse, PageResponse } from '@/types/product';
import styles from './SearchPage.module.css';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchQuery = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort') || 'newest';

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        categoryParam ? categoryParam : null
    );
    const [sortBy, setSortBy] = useState(sortParam);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Fetch matching categories
    useEffect(() => {
        if (!searchQuery) return;

        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `/api/v1/categories/search?keyword=${encodeURIComponent(searchQuery)}`
                );
                if (response.ok) {
                    const data: CategoryResponse[] = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [searchQuery]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async (pageNum: number, append: boolean = false) => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (selectedCategory) params.append('categorySlug', selectedCategory);
                params.append('sort', sortBy);
                params.append('page', pageNum.toString());
                params.append('size', '20');

                const response = await fetch(`/api/v1/products?${params.toString()}`);
                if (response.ok) {
                    const data: PageResponse<ProductResponse> = await response.json();
                    if (append) {
                        setProducts(prev => [...prev, ...data.content]);
                    } else {
                        setProducts(data.content);
                    }
                    setHasMore(!data.last);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(page, page > 0);
    }, [searchQuery, selectedCategory, sortBy, page]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        if (sortBy !== 'newest') params.append('sort', sortBy);

        const newUrl = `/search?${params.toString()}`;
        const currentUrl = window.location.pathname + window.location.search;

        if (newUrl !== currentUrl) {
            router.replace(newUrl, { scroll: false });
        }
    }, [selectedCategory, sortBy, router]);

    const handleCategoryFilter = (categorySlug: string | null) => {
        setSelectedCategory(categorySlug);
        setPage(0);
    };

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setPage(0);
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Kết quả tìm kiếm{searchQuery && `: "${searchQuery}"`}</h1>

            {/* Matching Categories */}
            {categories.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Danh mục liên quan</h2>
                    <div className={styles.categoriesContainer}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryFilter(cat.slug)}
                                className={`${styles.categoryButton} ${selectedCategory === cat.slug ? styles.active : ''}`}
                            >
                                {cat.imageUrl && (
                                    <img
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        className={styles.categoryImage}
                                    />
                                )}
                                {cat.name}
                            </button>
                        ))}
                        {selectedCategory && (
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={styles.clearFilterButton}
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* Sort Controls */}
            <div className={styles.controls}>
                <span>Sắp xếp:</span>
                <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá thấp đến cao</option>
                    <option value="price_desc">Giá cao đến thấp</option>
                    <option value="best_selling">Bán chạy</option>
                </select>
            </div>

            {/* Products Grid */}
            {loading && page === 0 ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : products.length === 0 ? (
                <div className={styles.empty}>Không tìm thấy sản phẩm nào</div>
            ) : (
                <>
                    <div className={styles.productsGrid}>
                        {products.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className={styles.productCard}
                            >
                                {product.images[0] && (
                                    <img
                                        src={product.images[0].imageUrl}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                )}
                                <h3>{product.name}</h3>
                                <p>{product.category.name}</p>
                                <div className={styles.priceRow}>
                                    <span className={styles.finalPrice}>
                                        {formatPrice(product.finalPrice)}
                                    </span>
                                    {product.discountPercentage > 0 && (
                                        <>
                                            <span className={styles.basePrice}>
                                                {formatPrice(product.basePrice)}
                                            </span>
                                            <span className={styles.discount}>
                                                -{product.discountPercentage}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className={styles.loadMore}>
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className={styles.loadMoreButton}
                            >
                                {loading ? 'Đang tải...' : 'Xem thêm'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
