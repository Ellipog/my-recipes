"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Recipe {
  _id: string;
  recipe_name: string;
}

interface RecipesContextType {
  savedRecipes: Recipe[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  fetchSavedRecipes: () => Promise<void>;
}

const RecipesContext = createContext<RecipesContextType>({
  savedRecipes: [],
  setSavedRecipes: () => {},
  fetchSavedRecipes: async () => {},
});

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const fetchSavedRecipes = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/recipes/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSavedRecipes(data.recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, []);

  return (
    <RecipesContext.Provider
      value={{ savedRecipes, setSavedRecipes, fetchSavedRecipes }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export const useRecipes = () => useContext(RecipesContext);
