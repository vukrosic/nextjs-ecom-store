import { Id } from "@/convex/_generated/dataModel";

export interface Product {
    _id: Id<"products">;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}


export interface CartItem {
    _id: string;
    title: string;
    price: number;
    quantity: number;
}


export interface Review {
    _id: Id<"reviews">;
    productId: Id<"products">;
    rating: number;
    comment: string;
    createdAt: number;
    username: string;
}