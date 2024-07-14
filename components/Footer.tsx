import React from 'react';

export const Footer = () => {

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        const offset = 75;
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-gray-400">We're passionate about delivering quality fashion that empowers you to express your unique style.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li onClick={() => scrollToSection('products')} className="text-gray-400 hover:text-white cursor-pointer">Products</li>

                            <li onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-white cursor-pointer">FAQ</li>

                            <li onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white cursor-pointer">Contact Us</li>

                            <li onClick={() => scrollToSection('newsletter')} className="text-gray-400 hover:text-white cursor-pointer">Newsletter</li>
                        </ul>
                    </div>
                    <div className='space-y-6'>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
                            <p className="text-gray-400">To inspire confidence and self-expression through fashion, one outfit at a time.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Our Core Values</h3> <p className="text-gray-400">Excellence, Respect, and Enjoyment.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>&copy; 2024 UniQ. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};