import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ShoppingCart, Package, Home, Plus } from "lucide-react";

export const Header = () => {
    const { sessionClaims } = auth();

    return (
        <header className="bg-neutral-950 text-neutral-100 p-4 shadow-lg shadow-neutral-500/50 bg-">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-neutral-300 hover:text-neutral-100 transition-colors">
                    <Package className="w-8 h-8" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200">UniQ</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link href="/" className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center">
                        <Home className="w-5 h-5 mr-1" />
                        Home
                    </Link>
                    {sessionClaims?.metadata.role === "admin" && (
                        <>
                            <Link href="/admin/manage-products" className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-1" />
                                Manage Products
                            </Link>
                            <Link href="/admin/add-product" className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center">
                                <Plus className="w-5 h-5 mr-1" />
                                Add Product
                            </Link>
                        </>
                    )}
                    <UserButton />
                </nav>
            </div>
        </header>
    );
};