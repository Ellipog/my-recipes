"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RecipeView from "@/components/RecipeView";
import LoadingScreen from "@/components/LoadingScreen";

export default function SharedRecipePage() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const token = decodeURIComponent(params.token as string);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const fetchSharedRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/shared/${token}`);
        if (!response.ok) {
          throw new Error("Recipe not found");
        }
        const data = await response.json();
        setRecipe(data.recipe);
      } catch (error) {
        console.error("Error fetching shared recipe:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedRecipe();
  }, [token, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!recipe) {
    return null;
  }

  return <RecipeView results={recipe} />;
}
