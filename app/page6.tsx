// if you want to use any other page template just rename this page to page6.tsx for example and rename page2.tsx to page.tsx to use page2 instead of this

"use client";
import React, { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Package, Truck, X } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function Homepage() {
  const products = useQuery(api.products.getAll);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const pay = useAction(api.stripe.pay);
  const router = useRouter();

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const isInCart = (productId: string) => cart.some((item) => item._id === productId);

  const scrollToElement = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = async () => {
    const cartItems = cart.map(item => ({
      _id: item._id,
      title: item.title,
      price: item.price,
      quantity: 1,
    }));

    const { url } = await pay({ cartItems });
    if (!url) return;
    router.push(url);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-background-dark.jpg')" }}>
        <div className="text-center bg-black bg-opacity-60 p-12 rounded-lg">
          <h1 className="text-6xl font-extrabold mb-6 text-white">
            UniQ Store
          </h1>
          <p className="text-2xl mb-10 text-gray-300">Elevate your lifestyle with our unique products</p>
          <Button onClick={scrollToElement} className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3 px-8 rounded-md transition duration-300">
            Explore Collection
          </Button>
        </div>
      </section>

      {/* Product List */}
      <section id="products" className="py-24 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-white">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products?.map((product: Product) => (
              <Card key={product._id} className="bg-gray-700 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border-none">
                <CardHeader className="p-0">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-80 object-cover" />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-3 text-white">{product.title}</CardTitle>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <p className="text-3xl font-bold text-indigo-400">${product.price.toFixed(2)}</p>
                  <p className="text-gray-400 mt-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Fast Delivery: 2-3 Days
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full py-3 text-lg ${isInCart(product._id) ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md transition duration-300`}
                    onClick={() => isInCart(product._id) ? removeFromCart(product._id) : addToCart(product)}
                  >
                    {isInCart(product._id) ? 'Remove from Cart' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4">
            <ShoppingCart className="w-6 h-6" />
            <span className="ml-2">{cart.length}</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-gray-800 text-white border-l border-gray-700">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-white">Your Cart</SheetTitle>
          </SheetHeader>
          {cart.length === 0 ? (
            <p className="text-gray-400 mt-4">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-4 border-b border-gray-700">
                  <span className="text-white font-medium">{item.title}</span>
                  <span className="text-indigo-400 font-bold">${item.price.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              <div className="mt-6">
                <p className="text-2xl font-bold text-white mb-4">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg transition duration-300"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}