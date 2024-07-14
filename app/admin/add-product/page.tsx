import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Form } from "../_components/form";

const AddProduct = () => {

    const { sessionClaims } = auth();

    if (sessionClaims?.metadata.role !== "admin") {
        redirect("/");
    }

    return (
        <>
            <Form />
        </>
    );

}

export default AddProduct;







// "use client";

// import React, { useState, useEffect } from 'react';
// import { FileUpload } from "@/components/FileUpload";
// import { api } from "@/convex/_generated/api";
// import { useMutation, useQuery } from "convex/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface Variant {
//     color: string;
//     images: string[];
// }

// interface ProductData {
//     title: string;
//     description: string;
//     price: number;
//     discountedPrice?: number;
//     tags: string[];
//     variants: Variant[];
//     sizes: string[];
// }

// const Form: React.FC = () => {
//     const [productData, setProductData] = useState<ProductData>({
//         title: '',
//         description: '',
//         price: 0,
//         discountedPrice: undefined,
//         tags: [],
//         variants: [{ color: '', images: [] }],
//         sizes: [],
//     });

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isFormValid, setIsFormValid] = useState(false);
//     const [newTag, setNewTag] = useState('');
//     const [newSize, setNewSize] = useState('');

//     const addProduct = useMutation(api.products.add);
//     const tags = useQuery(api.tags.list) || [];

//     useEffect(() => {
//         const { title, description, price, variants, sizes } = productData;
//         setIsFormValid(
//             title.trim() !== '' &&
//             description.trim() !== '' &&
//             price > 0 &&
//             variants.length > 0 &&
//             variants.every(v => v.color !== '' && v.images.length > 0) &&
//             sizes.length > 0
//         );
//     }, [productData]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setProductData(prev => ({
//             ...prev,
//             [name]: name === 'price' || name === 'discountedPrice' ? parseFloat(value) : value,
//         }));
//     };

//     const handleVariantChange = (variantIndex: number, field: string, value: string) => {
//         setProductData(prev => ({
//             ...prev,
//             variants: prev.variants.map((v, i) =>
//                 i === variantIndex ? { ...v, [field]: value } : v
//             ),
//         }));
//     };

//     const handleImageUpload = (variantIndex: number, url: string) => {
//         setProductData(prev => ({
//             ...prev,
//             variants: prev.variants.map((v, i) =>
//                 i === variantIndex
//                     ? { ...v, images: [...v.images, url].slice(0, 4) }
//                     : v
//             ),
//         }));
//     };

//     const addVariant = () => {
//         setProductData(prev => ({
//             ...prev,
//             variants: [...prev.variants, { color: '', images: [] }],
//         }));
//     };

//     const removeVariant = (index: number) => {
//         setProductData(prev => ({
//             ...prev,
//             variants: prev.variants.filter((_, i) => i !== index),
//         }));
//     };

//     const handleTagChange = (tag: string) => {
//         setProductData(prev => ({
//             ...prev,
//             tags: prev.tags.includes(tag)
//                 ? prev.tags.filter(t => t !== tag)
//                 : [...prev.tags, tag],
//         }));
//     };

//     const addNewTag = () => {
//         if (newTag && !productData.tags.includes(newTag)) {
//             setProductData(prev => ({
//                 ...prev,
//                 tags: [...prev.tags, newTag],
//             }));
//             setNewTag('');
//         }
//     };

//     const addNewSize = () => {
//         if (newSize && !productData.sizes.includes(newSize)) {
//             setProductData(prev => ({
//                 ...prev,
//                 sizes: [...prev.sizes, newSize],
//             }));
//             setNewSize('');
//         }
//     };

//     const removeSize = (size: string) => {
//         setProductData(prev => ({
//             ...prev,
//             sizes: prev.sizes.filter(s => s !== size),
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);
//         // try {
//         //     await addProduct(productData);
//         //     setProductData({
//         //         title: '',
//         //         description: '',
//         //         price: 0,
//         //         discountedPrice: undefined,
//         //         tags: [],
//         //         variants: [{ color: '', images: [] }],
//         //         sizes: [],
//         //     });
//         //     alert('Product added successfully!');
//         // } catch (err) {
//         //     setError('Failed to add product. Please try again.');
//         //     console.error(err);
//         // } finally {
//         //     setIsSubmitting(false);
//         // }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//             <Card className="w-full max-w-2xl bg-white text-gray-900 shadow-lg">
//                 <CardHeader>
//                     <CardTitle className="text-2xl font-bold text-center text-gray-800">Add New Product</CardTitle>
//                     <CardDescription className="text-center text-gray-600">Fill in the details to add a new product</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="space-y-2">
//                             <Label htmlFor="title" className="text-gray-700">Title</Label>
//                             <Input
//                                 type="text"
//                                 id="title"
//                                 name="title"
//                                 value={productData.title}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="description" className="text-gray-700">Description</Label>
//                             <Textarea
//                                 id="description"
//                                 name="description"
//                                 value={productData.description}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                             />
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="price" className="text-gray-700">Price</Label>
//                                 <Input
//                                     type="number"
//                                     id="price"
//                                     name="price"
//                                     value={productData.price}
//                                     onChange={handleInputChange}
//                                     required
//                                     min="0"
//                                     step="0.01"
//                                     className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="discountedPrice" className="text-gray-700">Discounted Price (Optional)</Label>
//                                 <Input
//                                     type="number"
//                                     id="discountedPrice"
//                                     name="discountedPrice"
//                                     value={productData.discountedPrice || ''}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     step="0.01"
//                                     className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <Label className="text-gray-700">Tags</Label>
//                             <div className="flex flex-wrap gap-2">
//                                 {tags.map((tag) => (
//                                     <Button
//                                         key={tag._id}
//                                         type="button"
//                                         onClick={() => handleTagChange(tag.name)}
//                                         variant={productData.tags.includes(tag.name) ? "default" : "outline"}
//                                         size="sm"
//                                         className="bg-gray-200 text-gray-800 hover:bg-gray-300"
//                                     >
//                                         {tag.name}
//                                     </Button>
//                                 ))}
//                             </div>
//                             <div className="flex gap-2">
//                                 <Input
//                                     type="text"
//                                     value={newTag}
//                                     onChange={(e) => setNewTag(e.target.value)}
//                                     placeholder="New tag"
//                                     className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                                 />
//                                 <Button type="button" onClick={addNewTag} className="bg-gray-600 hover:bg-gray-700 text-white">
//                                     Add Tag
//                                 </Button>
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <Label className="text-gray-700">Sizes</Label>
//                             <div className="flex flex-wrap gap-2">
//                                 {productData.sizes.map((size) => (
//                                     <Button
//                                         key={size}
//                                         type="button"
//                                         onClick={() => removeSize(size)}
//                                         variant="outline"
//                                         size="sm"
//                                         className="bg-gray-200 text-gray-800 hover:bg-gray-300"
//                                     >
//                                         {size} <X className="h-4 w-4 ml-1" />
//                                     </Button>
//                                 ))}
//                             </div>
//                             <div className="flex gap-2">
//                                 <Input
//                                     type="text"
//                                     value={newSize}
//                                     onChange={(e) => setNewSize(e.target.value)}
//                                     placeholder="New size"
//                                     className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                                 />
//                                 <Button type="button" onClick={addNewSize} className="bg-gray-600 hover:bg-gray-700 text-white">
//                                     Add Size
//                                 </Button>
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <Label className="text-gray-700">Variants</Label>
//                             {productData.variants.map((variant, variantIndex) => (
//                                 <Card key={variantIndex} className="bg-gray-100 border-gray-300">
//                                     <CardContent className="pt-6">
//                                         <div className="flex justify-between items-center mb-4">
//                                             <Input
//                                                 type="text"
//                                                 value={variant.color}
//                                                 onChange={(e) => handleVariantChange(variantIndex, 'color', e.target.value)}
//                                                 placeholder="Color"
//                                                 className="bg-white border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
//                                             />
//                                             <Button type="button" onClick={() => removeVariant(variantIndex)} variant="destructive" size="sm">
//                                                 <X className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-2 mb-2">
//                                             {variant.images.map((img, imgIndex) => (
//                                                 <img key={imgIndex} src={img} alt={`Product ${imgIndex + 1}`} className="w-full h-32 object-cover rounded" />
//                                             ))}
//                                         </div>
//                                         {variant.images.length < 4 && (
//                                             <FileUpload onUpload={(url) => handleImageUpload(variantIndex, url)} />
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             ))}
//                             <Button type="button" onClick={addVariant} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
//                                 Add Variant
//                             </Button>
//                         </div>

//                         {error && (
//                             <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-800">
//                                 <AlertCircle className="h-4 w-4" />
//                                 <AlertDescription>{error}</AlertDescription>
//                             </Alert>
//                         )}
//                         <Button
//                             type="submit"
//                             disabled={!isFormValid || isSubmitting}
//                             className="w-full bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500 disabled:bg-gray-400 disabled:text-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
//                         >
//                             {isSubmitting ? 'Adding Product...' : 'Add Product'}
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default Form;