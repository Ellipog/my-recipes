"use client";

import { useState } from "react";
import RecipeView from "@/components/RecipeView";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const text = formData.get("text");
    const image = formData.get("image") as File;

    // Check if both text and image are empty
    if (
      (!text || text.toString().trim() === "") &&
      (!image || image.size === 0)
    ) {
      setErrorMessage(
        "Please write a list of your available ingredients or upload an image"
      );
      return;
    }

    setLoading(true);
    setShowInput(false);

    const servings = formData.get("servings");
    const cookNow = formData.get("cookNow");

    const enhancedText = `${text} (People eating: ${servings}, Cook Now: ${
      cookNow === "on" ? "yes" : "no"
    })`;
    formData.set("text", enhancedText);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      try {
        let recipeData;
        if (data.result?.tool_calls?.[0]?.function?.arguments) {
          // Handle the first response format
          const parsedArguments = JSON.parse(
            data.result.tool_calls[0].function.arguments
          );
          recipeData = parsedArguments.recipe_details;
        } else if (data.result?.content?.[0]?.text?.value) {
          // Handle the second response format
          recipeData = JSON.parse(data.result.content[0].text.value);
        } else {
          throw new Error("Unexpected response format");
        }

        setResult(recipeData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error("Raw data:", data);
        setResult({ error: "Failed to parse response data" });
      }
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: (error as any).message });
      setShowInput(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
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
                  Add a photo (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
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
                  defaultValue="2"
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              result.recipe
                ? result.recipe
                : result.content
                ? result.content
                : result
            }
          />
        </div>
      )}
    </main>
  );
}
