"use client";
import React, { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Package, Truck } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800">
      {/* Hero Section */}
      <section className="py-24 text-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-background.jpg')" }}>
        <div className="bg-black bg-opacity-50 py-16">
          <h1 className="text-6xl font-bold mb-6 text-white">
            Welcome to UniQ Store
          </h1>
          <p className="text-2xl mb-10 text-gray-200">Discover unique products for your lifestyle</p>
          <Button onClick={scrollToElement} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg py-3 px-8 rounded-full transition duration-300">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Product List */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products?.map((product: Product) => (
              <Card key={product._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
                <CardHeader className="p-0">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-80 object-cover" />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-3 text-gray-800">{product.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-3xl font-bold text-yellow-600">${product.price.toFixed(2)}</p>
                  <p className="text-gray-500 mt-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Delivery: 2-3 Days
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full py-3 text-lg ${isInCart(product._id) ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-full transition duration-300`}
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
          <Button className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full shadow-lg">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Cart ({cart.length})
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white text-gray-800">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-800">Your Cart</SheetTitle>
          </SheetHeader>
          {cart.length === 0 ? (
            <p className="text-gray-600 mt-4">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-800 font-medium">{item.title}</span>
                  <span className="text-yellow-600 font-bold">${item.price.toFixed(2)}</span>
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
              <div className="mt-6">
                <p className="text-2xl font-bold text-gray-800 mb-4">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full text-lg transition duration-300"
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