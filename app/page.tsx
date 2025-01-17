"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import RecipeView from "@/components/RecipeView";
import LoadingScreen from "@/components/LoadingScreen";
import ImageUploadPreview from "@/components/ImageUploadPreview";

interface RecipeResult {
  recipe?: {
    recipe_name: string;
    ingredients_list: { ingredient: string; quantity: string }[];
    cooking_steps: { step: string; time: number; utility: string }[];
    nutritional_information?: {
      calories: number;
      protein: number;
      fat: number;
      carbohydrates: number;
    };
  };
  content?: {
    recipe_name: string;
    ingredients_list: { ingredient: string; quantity: string }[];
    cooking_steps: { step: string; time: number; utility: string }[];
    nutritional_information?: {
      calories: number;
      protein: number;
      fat: number;
      carbohydrates: number;
    };
  };
  tool_calls?: [
    {
      function: {
        arguments: string;
      };
    }
  ];
  error?: string;
}

export default function Home() {
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the form when navigating to the home page
  useEffect(() => {
    if (pathname === "/") {
      setResult(null);
      setLoading(false);
      setShowInput(true);
      setErrorMessage(null);
    }
  }, [pathname]);

  const [key, setKey] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form submission
    if (event.target.files) {
      const newImages = Array.from(event.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const text = formData.get("text");

    // Check if both text and images are empty
    if ((!text || text.toString().trim() === "") && images.length === 0) {
      setErrorMessage(
        "Please write a list of your available ingredients or upload images"
      );
      return;
    }

    setLoading(true);
    setShowInput(false);

    const servings = formData.get("servings");
    const cookNow = formData.get("cookNow");

    const enhancedText = `${text} (People eating: ${servings}, Cook Now: ${
      cookNow === "on" ? "yes" : "no"
    }, Allergies: ${formData.get("allergies") || "none"}, Utilities: ${
      formData.get("utilities") || "oven, stove, microwave"
    })`;
    formData.set("text", enhancedText);

    // Remove existing image entries
    formData.delete("image");

    // Add all images to formData
    images.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setLoading(false);
        return;
      }

      let recipeData;
      if (data.result.tool_calls) {
        // Handle new format
        const functionArgs = JSON.parse(
          data.result.tool_calls[0].function.arguments
        );
        recipeData = functionArgs.recipe_details;
      } else if (data.result.content) {
        // Handle existing format with content
        recipeData = JSON.parse(data.result.content);
      } else if (data.result.recipe) {
        // Handle existing format with recipe
        recipeData = data.result.recipe;
      }

      setResult({ recipe: recipeData });
      setLoading(false);
      setShowInput(false);
    } catch (error) {
      console.error("Error:", error);
      setResult({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      setShowInput(true);
    }
  };

  return (
    <main className="min-h-screen" key={key}>
      {loading && <LoadingScreen />}
      {!result ? (
        <div
          className={`transition-all duration-500 ${
            showInput ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-lg mx-auto p-6 pt-12">
            <h1 className="mt-6 text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Recipe Generator
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="text"
                  className="block text-lg font-medium text-foreground/90"
                >
                  What ingredients do you have?
                </label>
                <textarea
                  id="text"
                  name="text"
                  placeholder="Enter ingredients here..."
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-lg font-medium text-foreground/90"
                >
                  Add photos (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <ImageUploadPreview
                  images={images}
                  onRemove={removeImage}
                  onAddClick={handleAddClick}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="servings"
                  className="block text-lg font-medium text-foreground/90"
                >
                  Servings
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  min="1"
                  defaultValue="1"
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="allergies"
                  className="block text-lg font-medium text-foreground/90"
                >
                  Allergies & Dietary Restrictions
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  placeholder="Enter allergies or dietary restrictions (e.g., nuts, dairy, gluten)..."
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="utilities"
                  className="block text-lg font-medium text-foreground/90"
                >
                  Available Kitchen Utilities
                </label>
                <textarea
                  id="utilities"
                  name="utilities"
                  placeholder="Enter available kitchen utilities (e.g., oven, stove, microwave)..."
                  defaultValue="oven, stove, microwave"
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg bg-gray-800/50">
                <input
                  type="checkbox"
                  id="cookNow"
                  name="cookNow"
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="cookNow" className="text-foreground/90">
                  I want to cook this right now
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating Recipe..." : "Generate Recipe"}
              </button>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-center">{errorMessage}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div
          className={`transition-all duration-500 ${
            !showInput && !loading
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <RecipeView
            results={
              result.recipe ||
              result.content ||
              (result.tool_calls
                ? JSON.parse(result.tool_calls[0].function.arguments)
                    .recipe_details
                : {
                    recipe_name: "Error",
                    ingredients_list: [],
                    cooking_steps: [],
                  })
            }
          />
        </div>
      )}
    </main>
  );
}
