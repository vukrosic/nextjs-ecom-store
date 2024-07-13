"use client";
import React, { useState, useEffect } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Package, Truck, Star } from "lucide-react";
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

  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (products) {
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white">
      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-6xl font-extrabold mb-6 animate-pulse">
            Welcome to UniQ Store
          </h1>
          <p className="text-2xl mb-10">Discover unique products for your extraordinary lifestyle</p>
          <Button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 text-xl py-3 px-8 rounded-full transform hover:scale-110 transition duration-300">
            Explore Now
          </Button>
        </div>
        <div className="absolute inset-0 z-0">
          <svg className="absolute left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C40,30 60,70 100,100 L100,0 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </section>

      {/* Featured Product */}
      {products && products.length > 0 && (
        <section className="py-16 bg-white text-purple-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Product</h2>
            <div className="flex flex-col md:flex-row items-center justify-center">
              <img src={products[currentProductIndex].imageUrl} alt={products[currentProductIndex].title} className="w-full md:w-1/2 h-96 object-cover rounded-lg shadow-2xl mb-8 md:mb-0 md:mr-8" />
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold mb-4">{products[currentProductIndex].title}</h3>
                <p className="text-xl mb-6">{products[currentProductIndex].description}</p>
                <p className="text-4xl font-bold text-pink-600 mb-6">${products[currentProductIndex].price.toFixed(2)}</p>
                <Button
                  className={`w-full md:w-auto py-3 px-8 text-lg ${isInCart(products[currentProductIndex]._id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full transition duration-300`}
                  onClick={() => isInCart(products[currentProductIndex]._id) ? removeFromCart(products[currentProductIndex]._id) : addToCart(products[currentProductIndex])}
                >
                  {isInCart(products[currentProductIndex]._id) ? 'Remove from Cart' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product List */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products?.map((product: Product) => (
              <Card key={product._id} className="bg-white text-purple-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <CardHeader className="p-0 relative">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 p-2 rounded-bl-lg">
                    <Star className="w-6 h-6" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-3">{product.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-3xl font-bold text-pink-600">${product.price.toFixed(2)}</p>
                  <p className="text-gray-500 mt-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Express Delivery
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full py-3 text-lg ${isInCart(product._id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full transition duration-300`}
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
          <Button className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-purple-900 rounded-full shadow-lg z-50 transform hover:scale-110 transition duration-300">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Cart ({cart.length})
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-purple-900 text-white">
          <SheetHeader>
            <SheetTitle className="text-3xl font-bold text-yellow-400">Your Awesome Cart</SheetTitle>
          </SheetHeader>
          {cart.length === 0 ? (
            <p className="text-xl mt-8 text-center">Your cart is as empty as a black hole!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-4 border-b border-purple-700">
                  <span className="text-lg font-medium">{item.title}</span>
                  <span className="text-xl font-bold text-yellow-400">${item.price.toFixed(2)}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="mt-8">
                <p className="text-3xl font-bold text-yellow-400 mb-6">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-full text-xl transition duration-300 transform hover:scale-105"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}