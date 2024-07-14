"use client";

import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContactPage() {
    const addTicket = useMutation(api.tickets.add);

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            await addTicket(formData);
            alert("Ticket submitted successfully!");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Error submitting ticket:", error);
            setError("Failed to submit ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white text-gray-900 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">Contact Us</CardTitle>
                    <CardDescription className="text-center text-gray-600">Fill in the details to submit a ticket</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700">Phone (optional)</Label>
                            <Input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-gray-700">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                                rows={4}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500 disabled:bg-gray-400 disabled:text-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}