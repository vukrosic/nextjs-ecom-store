import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const newTicketId = await ctx.db.insert("tickets", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            message: args.message,
        });
        return newTicketId;
    },
});