import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        title: v.string(),
        description: v.string(),
        price: v.number(),
        discountedPrice: v.optional(v.number()),
        tags: v.array(v.string()),
        variants: v.array(v.object({
            color: v.string(),
            images: v.array(v.string()),
        })),
        sizes: v.array(v.string()),
    }),
    tags: defineTable({
        name: v.string(),
    }).index("by_name", ["name"]),
    reviews: defineTable({
        productId: v.id("products"),
        rating: v.number(),
        comment: v.string(),
        username: v.string(),
    }).index("by_product", ["productId"]),
    tickets: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
    }).index("by_email", ["email"]),
});