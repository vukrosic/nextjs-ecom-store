import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

export const NewsletterSection = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast("Thank you for subscribing.")
        setEmail('');
    };

    return (
        <section className="bg-gray-100 py-16">
            <Card className="max-w-2xl mx-auto bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">Subscribe to Our Newsletter</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 text-center mb-6">Stay updated with our latest collections and exclusive offers!</p>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-grow"
                        />
                        <Button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white">
                            Subscribe
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};