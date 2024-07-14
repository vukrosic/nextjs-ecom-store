import { query } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("tags").collect();
        return products;
    },
});