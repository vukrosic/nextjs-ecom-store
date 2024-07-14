import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
    tags: string[];
    selectedTags: string[];
    onTagChange: (tag: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ tags, selectedTags, onTagChange }) => {
    return (
        <nav className="bg-white shadow-md py-2 mb-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-2 overflow-auto">
                    {tags.map((tag) => (
                        <Button
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            onClick={() => onTagChange(tag)}
                            className="text-sm px-4 py-2"
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;
