import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Cart {
    createdAt: bigint;
    items: Array<CartItem>;
}
export interface CartItem {
    selectedVariant: string;
    productId: string;
    quantity: bigint;
}
export interface EcommerceStats {
    totalProducts: bigint;
    totalOrders: bigint;
    featuredProducts: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    shippingAddress: string;
}
export interface Product {
    id: string;
    featured: boolean;
    name: string;
    createdAt: bigint;
    description: string;
    variants: Array<string>;
    category: string;
    image: ExternalBlob;
    price: number;
    videoUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(item: CartItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart | null>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getMyRecommendations(): Promise<Array<Product>>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getStats(): Promise<EcommerceStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitQuiz(answers: Array<string>): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
