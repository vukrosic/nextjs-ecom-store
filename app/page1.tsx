"use client";
import React, { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Package, Truck, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-300 transform -skew-y-6 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-7xl font-extrabold mb-6 text-purple-600 drop-shadow-lg">
            UniQ Store
          </h1>
          <p className="text-3xl mb-10 text-indigo-600 font-semibold">Groove with our funky fresh products!</p>
          <Button onClick={scrollToElement} className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-xl py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
            Get Groovy!
          </Button>
        </div>
      </section>

      {/* Product List */}
      <section id="products" className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center text-indigo-600 drop-shadow-md">Our Rad Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products?.map((product: Product) => (
              <Card key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border-4 border-pink-300 transform hover:rotate-1">
                <CardHeader className="p-0 relative">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-80 object-cover" />
                  <div className="absolute top-4 right-4 bg-yellow-300 text-purple-600 font-bold py-2 px-4 rounded-full transform rotate-12">
                    ${product.price.toFixed(2)}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-extrabold mb-3 text-purple-600">{product.title}</CardTitle>
                  <p className="text-indigo-500 mb-4">{product.description}</p>
                  <p className="text-orange-500 mt-3 flex items-center font-semibold">
                    <Zap className="w-5 h-5 mr-2" />
                    Express Delivery: 1-2 Days
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full py-3 text-lg ${isInCart(product._id) ? 'bg-red-400 hover:bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} text-white rounded-full transition duration-300 transform hover:scale-105`}
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
          <Button className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full shadow-lg p-6 transform hover:scale-110 transition duration-300">
            <ShoppingCart className="w-8 h-8" />
            <span className="ml-2 text-xl font-bold">{cart.length}</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-gradient-to-br from-indigo-200 to-pink-200 text-gray-800 border-l-4 border-purple-400">
          <SheetHeader>
            <SheetTitle className="text-3xl font-extrabold text-purple-600">Your Groovy Cart</SheetTitle>
          </SheetHeader>
          {cart.length === 0 ? (
            <p className="text-indigo-600 mt-4 text-xl">Your cart is empty, dude!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-4 border-b-2 border-purple-300">
                  <span className="text-indigo-600 font-bold text-lg">{item.title}</span>
                  <span className="text-orange-500 font-extrabold text-xl">${item.price.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600 border-2 border-red-400 hover:border-red-500 rounded-full p-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="mt-6">
                <p className="text-3xl font-extrabold text-purple-600 mb-4">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-4 rounded-full text-xl font-bold transition duration-300 transform hover:scale-105"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout Now!'}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}