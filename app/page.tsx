"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/useCartStore';
import ContactPage from './contact/page';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { NewsletterSection } from '@/components/Newsletter';
import TopNavbar from '@/components/TopNavbar';


interface Product {
  _id: string;
  title: string;
  price: number;
  variants: Array<{
    color: string;
    images: string[];
  }>;
  sizes: string[];
  tags: string[];
}

export default function Homepage() {
  const products = useQuery(api.products.getAll);
  const { addItem, removeItem, items } = useCartStore();
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) {
      setHighlightedProduct(product._id);
      setTimeout(() => setHighlightedProduct(null), 1000);
      return;
    }
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.variants[0].images[0],
      size: selectedSize
    });
  };

  const handleRemoveFromCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    removeItem(product._id);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredProducts = products?.filter(product =>
    selectedTags.length === 0 || product.tags.some(tag => selectedTags.includes(tag))
  );

  const allTags = Array.from(new Set(products?.flatMap(product => product.tags) || []));

  return (
    <div className="min-h-screen bg-gray-100 p-8 mt-16">
      {/* <TopNavbar tags={allTags} selectedTags={selectedTags} onTagChange={handleTagChange} /> */}
      <div className="flex" id="products">
        <div className="flex-1 ml-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts?.map((product: Product) => (
              <Link href={`/${product._id}`} key={product._id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
                  <div className="relative w-full h-[350px]">
                    <Image
                      src={product.variants[0].images[0]}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                    />
                    {product.variants[0].images[1] && (
                      <Image
                        src={product.variants[0].images[1]}
                        alt={product.title}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <h2 className="text-md font-semibold mb-1">{product.title}</h2>
                    <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleSizeChange(product._id, size);
                            }}
                            className={`px-3 py-1.5 border rounded-md transition-colors duration-300 ${selectedSizes[product._id] === size
                              ? 'bg-blue-500 text-white'
                              : highlightedProduct === product._id
                                ? 'border-red-500 text-red-500'
                                : 'border-gray-300 hover:bg-gray-100'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    {isInCart(product._id) ? (
                      <button
                        className="w-full bg-red-500 text-white py-1.5 rounded-md hover:bg-red-700 transition-colors duration-300"
                        onClick={(e) => handleRemoveFromCart(e, product)}
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        className="w-full bg-neutral-900 text-white py-1.5 rounded-md hover:bg-black transition-colors duration-300"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div id="faq">
          <FAQSection />
        </div>

        <div id="contact">
          <ContactPage />
        </div>

        <div id="newsletter">
          <NewsletterSection />
        </div>
        <Footer />
      </div>
    </div>
  );
}