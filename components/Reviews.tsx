import React from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { IconStar } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ReviewsProps {
    productId: Id<"products">;
}

interface Review {
    _id: Id<"reviews">;
    productId: Id<"products">;
    rating: number;
    comment: string;
    createdAt: number;
    username: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
                <IconStar
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'fill-current' : 'stroke-current fill-transparent'}`}
                />
            ))}
        </div>
    );
};

export const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
    const reviews = useQuery(api.reviews.getByProduct, { productId });

    if (!reviews) return <div>Loading...</div>;

    return (
        <div className="mt-12" id="reviews">
            {reviews.length > 0 ? (
                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[auto] text-lg">
                    {reviews.map((review, index) => (
                        <BentoGridItem
                            key={review._id}
                            title={review.username}
                            description={review.comment}
                            className={cn(
                                "p-3 flex flex-col",
                                index % 5 === 0 ? "md:col-span-2" : ""
                            )}
                            header={
                                <div className="mb-2">
                                    <StarRating rating={review.rating} />
                                </div>
                            }
                        />
                    ))}
                </BentoGrid>
            ) : (
                <p className="text-gray-600">No reviews yet.</p>
            )}
        </div>
    );
};

export default Reviews;