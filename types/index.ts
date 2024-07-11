import { Id } from "@/convex/_generated/dataModel";

export interface Product {
    _id: Id<"products">;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}