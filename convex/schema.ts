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
});