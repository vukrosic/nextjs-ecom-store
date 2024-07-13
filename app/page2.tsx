"use client";
import React, { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Package, Truck, Star, X } from "lucide-react";
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
    <div className="min-h-screen bg-yellow-100 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden bg-blue-400">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundSize: '30px 30px'
        }}></div>
        <div className="relative z-10">
          <h1 className="text-7xl font-extrabold mb-6 text-white drop-shadow-lg" style={{
            textShadow: '3px 3px 0 #ff9800, 6px 6px 0 #ff5722'
          }}>
            UniQ Store
          </h1>
          <p className="text-3xl mb-10 text-white font-bold">Where fun meets fantastic finds!</p>
          <Button onClick={scrollToElement} className="bg-green-500 hover:bg-green-600 text-white text-xl py-4 px-10 rounded-full transition duration-300 transform hover:scale-110 shadow-lg border-4 border-white">
            Start Shopping!
          </Button>
        </div>
        {/* Decorative elements */}
        <div className="absolute left-10 top-20 animate-bounce">
          <Star size={60} color="#FFD700" fill="#FFD700" />
        </div>
        <div className="absolute right-10 bottom-20 animate-pulse">
          <Package size={80} color="#FF6B6B" />
        </div>
      </section>

      {/* Product List */}
      <section id="products" className="py-24 bg-green-200">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center text-purple-600" style={{
            textShadow: '2px 2px 0 #fff'
          }}>Our Awesome Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products?.map((product: Product) => (
              <Card key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border-8 border-purple-400 transform hover:rotate-2">
                <CardHeader className="p-0 relative">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-80 object-cover" />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-purple-600 font-bold py-2 px-4 rounded-full transform rotate-12 text-xl border-4 border-purple-400">
                    ${product.price.toFixed(2)}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-extrabold mb-3 text-purple-600">{product.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-green-500 mt-3 flex items-center font-bold">
                    <Truck className="w-6 h-6 mr-2" />
                    Super Fast Delivery!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full py-3 text-xl ${isInCart(product._id) ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full transition duration-300 transform hover:scale-105 border-4 border-white`}
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
          <Button className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg p-6 transform hover:scale-110 transition duration-300 border-4 border-white">
            <ShoppingCart className="w-8 h-8" />
            <span className="ml-2 text-2xl font-bold">{cart.length}</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-yellow-100 text-gray-800 border-l-8 border-purple-400">
          <SheetHeader>
            <SheetTitle className="text-4xl font-extrabold text-purple-600" style={{
              textShadow: '2px 2px 0 #fff'
            }}>Your Awesome Cart</SheetTitle>
          </SheetHeader>
          {cart.length === 0 ? (
            <p className="text-gray-600 mt-4 text-xl font-bold">Your cart is as empty as a clown's pockets!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-4 border-b-4 border-purple-300">
                  <span className="text-purple-600 font-bold text-xl">{item.title}</span>
                  <span className="text-green-500 font-extrabold text-2xl">${item.price.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600 border-4 border-red-400 hover:border-red-500 rounded-full p-2"
                  >
                    <X size={24} />
                  </Button>
                </div>
              ))}
              <div className="mt-6">
                <p className="text-3xl font-extrabold text-purple-600 mb-4" style={{
                  textShadow: '2px 2px 0 #fff'
                }}>
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-full text-2xl font-bold transition duration-300 transform hover:scale-105 border-4 border-white"
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