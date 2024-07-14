import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByProduct = query({
    args: { productId: v.id("products") },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_product", (q) => q.eq("productId", args.productId))
            .order("desc")
            .collect();

        return reviews;
    },
});