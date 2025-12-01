// src/types/cart.ts

// 1. Khớp với CartItemProductInfoDTO.java
export interface CartItemProductInfo {
    id: number;
    name: string;
    imageUrl: string | null;
    unit: string;
    slug: string;
    categorySlug: string;
}

// 2. Khớp với CartItemResponseDTO.java
export interface CartItem {
    cartItemId: number;
    quantity: number;
    basePrice: number;       // BigDecimal -> number
    itemPrice: number;       // BigDecimal -> number
    totalBasePrice: number;
    totalItemPrice: number;
    product: CartItemProductInfo; // Nested Object
    note?: string;           // Field quan trọng để hiện warning
}

// 3. Khớp với CartResponseDTO.java
export interface CartResponse {
    cartId: string; // UUID
    items: CartItem[];
    grandTotal: number;
    baseGrandTotal: number;
}

// Map dùng cho CartContext để tra cứu nhanh (O(1))
export type CartMap = Record<number, { 
    cartItemId: number; 
    quantity: number; 
    note?: string; // Lưu note vào map để ProductCard có thể hiện warning nếu cần
}>;