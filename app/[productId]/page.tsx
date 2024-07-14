"use client";

import React, { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import { Id } from '@/convex/_generated/dataModel';
import { useCartStore } from '@/lib/store/useCartStore';
import { Button } from '@/components/ui/button';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice?: number;
    variants: Array<{
        color: string;
        images: string[];
    }>;
    sizes: string[];
}

export default function ProductPage({ params }: { params: { productId: Id<"products"> } }) {
    const product = useQuery(api.products.get, { id: params.productId });
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [highlight, setHighlight] = useState(false);

    const { addItem, items, removeItem } = useCartStore();

    const pay = useAction(api.stripe.pay);

    if (!product) return <div>Loading...</div>;

    const handleBuyNow = async () => {
        try {
            if (!selectedSize) {
                setHighlight(true);
                setTimeout(() => setHighlight(false), 1000);
                return;
            }
            const cartItem = {
                _id: product._id,
                title: product.title,
                price: product.discountedPrice || product.price,
                quantity: quantity,
                size: selectedSize,
            };
            const result = await pay({ cartItems: [cartItem] });
            if (result.url) {
                window.location.href = result.url;
            } else {
                console.error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };


    const handleAddToCart = () => {
        if (!selectedSize) {
            setHighlight(true);
            setTimeout(() => setHighlight(false), 1000);
            return;
        }
        addItem({
            id: product._id,
            title: product.title,
            price: product.discountedPrice || product.price,
            quantity: quantity,
            image: product.variants[selectedVariant].images[0],
            size: selectedSize,
        });
    };

    const handleRemoveFromCart = () => {
        removeItem(product._id);
    };

    const isInCart = (productId: string) => {
        return items.some(item => item.id === productId);
    };


    const handleVariantSelect = (index: number) => {
        setSelectedVariant(index);
        setSelectedImage(0);
    };

    return (
        <div className="min-h-screen  bg-gray-100 p-8">
            <div className="max-w-7xl h-[700px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-8">
                        <div className="relative w-full h-full max-h-[530px]">
                            <Image
                                src={product.variants[selectedVariant].images[selectedImage]}
                                alt={product.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                        <div className="flex space-x-2 mt-4 overflow-x-auto">
                            {product.variants[selectedVariant].images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden ${index === selectedImage ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.title} - Image ${index + 1}`}
                                        width={96}
                                        height={96}
                                        objectFit="cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/3 p-8">
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="mb-4">
                            <span className="text-2xl font-bold">
                                {product.discountedPrice ? (
                                    <>
                                        <span className="line-through text-gray-400">${product.price.toFixed(2)}</span>{' '}
                                        ${product.discountedPrice.toFixed(2)}
                                    </>
                                ) : (
                                    `$${product.price.toFixed(2)}`
                                )}
                            </span>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Variants</h2>
                            <div className="flex space-x-2">
                                {product.variants.map((variant, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleVariantSelect(index)}
                                        className={`w-16 h-16 rounded-full overflow-hidden ${index === selectedVariant ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                    >
                                        <Image
                                            src={variant.images[0]}
                                            alt={`${product.title} - Variant ${index + 1}`}
                                            width={64}
                                            height={64}
                                            objectFit="cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Sizes</h2>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-md transition-colors duration-300 ${selectedSize === size
                                            ? 'bg-blue-500 text-white'
                                            : highlight
                                                ? 'border-red-500 text-red-500'
                                                : 'border-gray-300 hover:bg-gray-100'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Quantity</h2>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                className="w-20 px-2 py-1 border rounded-md"
                            />
                        </div>

                        <div className='space-y-3'>
                            {isInCart(product._id) ? (
                                <button
                                    className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-700 transition-colors duration-300"
                                    onClick={handleRemoveFromCart}
                                >
                                    Remove from Cart
                                </button>
                            ) : (
                                <button
                                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                            )}
                            <button
                                className="w-full bg-white border-blue-500 border-2 text-blue-500 py-3 rounded-md hover:bg-blue-200 transition-colors duration-300"
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}