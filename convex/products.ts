import { title } from "process";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const add = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const newProductId = await ctx.db.insert("products", {
            title: args.title,
            description: args.description,
            price: args.price,
            discountedPrice: args.discountedPrice,
            tags: args.tags,
            variants: args.variants,
            sizes: args.sizes,
        });
        return newProductId;
    },
});


export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }
        await ctx.db.delete(args.id);
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        title: v.string(),
        description: v.string(),
        price: v.number(),
        discountedPrice: v.number(),
        tags: v.array(v.string()),
        variants: v.array(v.object({
            color: v.string(),
            images: v.array(v.string()),
        })),
        sizes: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            title: args.title,
            description: args.description,
            price: args.price,
            discountedPrice: args.discountedPrice,
            tags: args.tags,
            variants: args.variants,
            sizes: args.sizes,
        });
    },
});

export const get = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }
        const product = await ctx.db.get(args.id);
        return product;
    },
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products;
    },
});