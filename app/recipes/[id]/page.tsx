"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import RecipeView from "@/components/RecipeView";
import LoadingScreen from "@/components/LoadingScreen";

interface Recipe {
  _id?: string;
  recipe_name: string;
  ingredients_list: { ingredient: string; quantity: string }[];
  cooking_steps: { step: string; time: number; utility: string }[];
  nutritional_information?: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

export default function RecipePage() {
  const params = useParams();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const response = await fetch(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Recipe not found");
        }

        const data = await response.json();
        setRecipe(data.recipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!recipe) {
    return null;
  }

  return <RecipeView results={recipe} />;
}
