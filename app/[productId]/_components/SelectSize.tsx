import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

interface Size {
    name: string;
    description: string;
    measurements: {
        chest: string;
        waist: string;
        hips: string;
    };
}

interface SizeSelectProps {
    sizes: string[];
    onSizeSelect: (size: string) => void;
    highlight: boolean;
    setHighlight: (highlight: boolean) => void;
}

const sizeGuide: Size[] = [
    {
        name: "S",
        description: "Small",
        measurements: { chest: "36-38", waist: "28-30", hips: "35-37" }
    },
    {
        name: "M",
        description: "Medium",
        measurements: { chest: "38-40", waist: "30-32", hips: "37-39" }
    },
    {
        name: "L",
        description: "Large",
        measurements: { chest: "40-42", waist: "32-34", hips: "39-41" }
    },
    {
        name: "XL",
        description: "Extra Large",
        measurements: { chest: "42-44", waist: "34-36", hips: "41-43" }
    }
];

export const SizeSelect: React.FC<SizeSelectProps> = ({ sizes, onSizeSelect, highlight, setHighlight }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        onSizeSelect(size);
        setHighlight(false);
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Sizes</h2>

            </div>
            <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-9 gap-2">
                <div className='flex space-x-1'>
                    {sizes.map((size, index) => (
                        <button
                            key={index}
                            onClick={() => handleSizeSelect(size)}
                            className={`px-4 py-2 border rounded-md transition-colors duration-300 ${selectedSize === size
                                ? 'bg-gray-800 text-white'
                                : highlight
                                    ? 'border-red-500 text-red-500'
                                    : 'border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 max-w-36">
                            <Ruler className="w-4 h-4" />
                            Find My Size
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='sm:max-w-[540px] md:max-w-[720px] lg:max-w-[900px] overflow-scroll'>
                        <SheetHeader>
                            <SheetTitle>Size Guide</SheetTitle>
                            <SheetDescription>
                                Find the perfect fit with our comprehensive size guide.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <img src="/body-sizes.jpg" alt="Size Chart" className="w-full mb-4 rounded-lg" />
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Size</th>
                                        <th className="border p-2">Chest (inches)</th>
                                        <th className="border p-2">Waist (inches)</th>
                                        <th className="border p-2">Hips (inches)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizeGuide.map((size) => (
                                        <tr key={size.name}>
                                            <td className="border p-2 font-semibold">{size.name} ({size.description})</td>
                                            <td className="border p-2">{size.measurements.chest}</td>
                                            <td className="border p-2">{size.measurements.waist}</td>
                                            <td className="border p-2">{size.measurements.hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="mt-4 text-sm text-gray-600">
                                To find your perfect fit, measure your chest, waist, and hips, and compare them to the chart above. If you&apos;re between sizes, we recommend choosing the larger size for a more comfortable fit.
                            </p>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div >
    );
};