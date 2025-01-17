import React, { useState } from "react";
import CookingTimer from "@/components/CookingTimer";
import ShareRecipeModal from "@/components/ShareRecipeModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes } from "@/contexts/RecipesContext";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";

interface Ingredient {
  ingredient: string;
  quantity: string;
}

interface NutritionalInfo {
  calories: string;
  protein: string;
  fat: string;
  carbohydrates: string;
}

interface Step {
  step: string;
  utility: string;
  time: number;
}

interface Recipe {
  _id?: string;
  recipe_name?: string;
  title?: string;
  name?: string;
  ingredients_list?: Ingredient[];
  ingredients?: Ingredient[];
  nutritional_information?: NutritionalInfo;
  nutritional?: NutritionalInfo;
  cooking_steps?: Step[];
  instructions?: Step[];
  steps?: Step[];
}

interface RecipeProps {
  results: Recipe;
}

export default function RecipeView({ results }: RecipeProps) {
  const { isAuthenticated } = useAuth();
  const { fetchSavedRecipes, savedRecipes } = useRecipes();
  const router = useRouter();
  const recipe_name =
    results.recipe_name || results.title || results.name || "Untitled Recipe";
  const ingredients = results.ingredients_list || results.ingredients || [];
  const nutritional_information = results.nutritional_information ||
    results.nutritional || {
      calories: "0",
      protein: "0",
      fat: "0",
      carbohydrates: "0",
    };
  const cooking_steps =
    results.cooking_steps || results.instructions || results.steps || [];

  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    new Array(ingredients.length).fill(false)
  );
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(cooking_steps.length).fill(false)
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const recipeId = results._id;
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const handleSaveRecipe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotification({
        message: "Please log in to save recipes",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          results._id
            ? { recipeId: results._id }
            : {
                recipe_name,
                ingredients_list: ingredients,
                nutritional_information,
                cooking_steps,
              }
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }

      const data = await response.json();
      await fetchSavedRecipes();
      setNotification({
        message: "Recipe saved successfully!",
        type: "success",
      });

      // Navigate to the saved recipe
      router.push(`/recipes/${data.recipe._id}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
      setNotification({
        message: "Failed to save recipe",
        type: "error",
      });
    }
  };

  const handleDeleteRecipe = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`/api/recipes/${results._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      await fetchSavedRecipes();
      router.push("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe");
    }
  };

  // Check if this recipe is already saved by the current user
  const isRecipeSaved = savedRecipes.some(
    (recipe) => recipe.recipe_name === results.recipe_name
  );

  // A recipe should show the save button if:
  // 1. It's a shared recipe (no _id) OR
  // 2. It's not already saved by the current user
  const shouldShowSaveButton = !results._id || !isRecipeSaved;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-8 overflow-x-hidden">
      <h1 className="mt-[4.25rem] text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        {recipe_name}
      </h1>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-700/50">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-400">
              Ingredients
            </h2>
            <ul className="space-y-3 sm:space-y-4">
              {ingredients.map((ing: Ingredient, index: number) => (
                <li key={index} className="group">
                  <label className="flex items-center gap-2 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-gray-700/30 transition-colors">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={checkedIngredients[index]}
                        onChange={() => toggleIngredient(index)}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg appearance-none border-2 border-blue-400 
                                 checked:bg-blue-500 checked:border-transparent 
                                 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      />
                      <svg
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2.5 w-3 h-3 pointer-events-none transition-opacity ${
                          checkedIngredients[index]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between flex-grow pb-2 border-b border-gray-700/50 min-w-0">
                      <span
                        className={`transition-all duration-200 truncate mr-2 ${
                          checkedIngredients[index]
                            ? "line-through text-gray-500"
                            : "text-gray-100"
                        }`}
                      >
                        {ing.ingredient.charAt(0).toUpperCase() +
                          ing.ingredient.slice(1)}
                      </span>
                      <span
                        className={`text-gray-400 flex-shrink-0 ${
                          checkedIngredients[index] ? "line-through" : ""
                        }`}
                      >
                        {ing.quantity}
                      </span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-700/50">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-400">
              Nutritional Information
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-gray-700/30 p-4 rounded-xl">
                <div className="text-sm text-gray-400">Calories</div>
                <div className="text-2xl font-semibold text-white">
                  {nutritional_information.calories}
                </div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-xl">
                <div className="text-sm text-gray-400">Protein</div>
                <div className="text-2xl font-semibold text-white">
                  {nutritional_information.protein}g
                </div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-xl">
                <div className="text-sm text-gray-400">Fat</div>
                <div className="text-2xl font-semibold text-white">
                  {nutritional_information.fat}g
                </div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-xl">
                <div className="text-sm text-gray-400">Carbs</div>
                <div className="text-2xl font-semibold text-white">
                  {nutritional_information.carbohydrates}g
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-700/50">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-400">
            Cooking Steps
          </h2>
          <ol className="space-y-4 sm:space-y-6">
            {cooking_steps.map((step: Step, index: number) => (
              <li
                key={index}
                className="relative pl-10 sm:pl-12 pb-4 sm:pb-6 border-b border-gray-700/50 last:border-0"
              >
                <div
                  className="flex items-start gap-4 cursor-pointer group"
                  onClick={(e) => {
                    // Prevent toggling if clicking the timer
                    if (!(e.target as HTMLElement).closest(".timer-control")) {
                      toggleStep(index);
                    }
                  }}
                >
                  <button
                    className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                      checkedSteps[index]
                        ? "bg-green-500 text-white ring-2 ring-green-500/20 ring-offset-2 ring-offset-gray-800"
                        : "bg-blue-500 text-white group-hover:bg-blue-600"
                    }`}
                  >
                    {checkedSteps[index] ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </button>
                  <div className="flex-1 ml-1">
                    <p
                      className={`transition-all duration-200 ${
                        checkedSteps[index]
                          ? "text-gray-500 line-through"
                          : "text-gray-100"
                      }`}
                    >
                      {step.step}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {step.utility !== "none" && (
                        <span className="px-3 py-1 bg-gray-700/50 text-blue-400 rounded-full text-sm">
                          {step.utility.charAt(0).toUpperCase() +
                            step.utility.slice(1)}
                        </span>
                      )}
                      {step.time > 0 && (
                        <div className="timer-control">
                          <CookingTimer duration={step.time} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {isAuthenticated && (
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          {shouldShowSaveButton ? (
            <button
              onClick={handleSaveRecipe}
              className="w-full py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Save Recipe
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete Recipe
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Share Recipe
              </button>
            </>
          )}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Recipe</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteRecipe();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showShareModal && recipeId && (
        <ShareRecipeModal
          recipeId={recipeId}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
