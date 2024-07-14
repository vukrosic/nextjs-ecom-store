"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function CartSheet() {
    const { items, removeItem, updateQuantity, updateSize, clearCart } = useCartStore();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const pay = useAction(api.stripe.pay);

    const handleCheckout = async () => {
        try {
            const cartItems = items.map(item => ({
                _id: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
            }));
            const result = await pay({ cartItems });
            if (result.url) {
                window.location.href = result.url;
            } else {
                console.error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild className='bg-inherit'>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-start space-x-4">
                            <Image src={item.image} alt={item.title} width={70} height={70} className="rounded-md" />
                            <div className='space-y-3'>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-md">{item.title}</h3>
                                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                                </div>
                                <div className='flex space-x-3'>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {items.length > 0 ? (
                    <>
                        <div className="mt-8 flex justify-between items-center">
                            <span className="font-semibold">Total:</span>
                            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="mt-8 space-y-4">
                            <Button className="w-full" onClick={handleCheckout}>Checkout</Button>
                            <Button variant="outline" className="w-full" onClick={clearCart}>
                                Clear Cart
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="text-center mt-8">Your cart is empty</p>
                )}
            </SheetContent>
        </Sheet>
    );
}