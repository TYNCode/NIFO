"use client";
import React, { useState } from "react";
import axios from "axios";

interface Template {
    id: number;
    name: string;
    thumbnail: string;
    layout: string;
}

const Page: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [slideImages, setSlideImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Template list (can be fetched from the backend)
    const templates: Template[] = [
        {
            id: 1,
            name: "Business Pitch",
            thumbnail: "/thumbnails/business_thumbnail.png",
            layout: "/templates/bayertemplate.pptx",
        },
        {
            id: 2,
            name: "Marketing Plan",
            thumbnail: "/thumbnails/marketing_thumbnail.png",
            layout: "/templates/marketingtemplate.pptx",
        },
    ];

    // Handle Template Click
    const handleTemplateSelect = async (template: Template) => {
        setSelectedTemplate(template);
        setLoading(true);
        try {
            // Call backend to generate slide images
            const response = await axios.post("http://localhost:8000/api/get-pptx-preview/", {
                layout: template.layout,
            });
            setSlideImages(response.data.slides);
        } catch (error) {
            console.error("Error fetching slides:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 py-16">
            <h1 className="text-3xl font-bold">Select a Template</h1>

            {/* Template Thumbnails */}
            <div className="grid grid-cols-2 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="cursor-pointer border rounded-lg"
                        onClick={() => handleTemplateSelect(template)}
                    >
                        <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <p className="text-center font-medium py-2">{template.name}</p>
                    </div>
                ))}
            </div>

            {/* Preview Slides */}
            {loading ? (
                <p className="mt-6">Loading slides...</p>
            ) : (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {slideImages.map((slide, index) => (
                        <img
                            key={index}
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            className="rounded-md"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
