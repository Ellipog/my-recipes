import React, { useState } from "react";
import CookingTimer from "@/components/CookingTimer";
import ShareRecipeModal from "@/components/ShareRecipeModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes } from "@/contexts/RecipesContext";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";

interface RecipeProps {
  results: any;
}

export default function RecipeView({ results }: RecipeProps) {
  const { isAuthenticated } = useAuth();
  const { fetchSavedRecipes } = useRecipes();
  const router = useRouter();
  const recipe_name = results.recipe_name
    ? results.recipe_name
    : results.title
    ? results.title
    : results.name;
  const ingredients = results.ingredients_list
    ? results.ingredients_list
    : results.ingredients;
  const nutritional_information = results.nutritional_information
    ? results.nutritional_information
    : results.nutritional;
  const cooking_steps = results.cooking_steps
    ? results.cooking_steps
    : results.instructions
    ? results.instructions
    : results.steps;

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
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }

      const data = await response.json();
      fetchSavedRecipes();
      setNotification({
        message: "Recipe saved successfully!",
        type: "success",
      });
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 bg-gradient-to-b from-gray-900 to-black shadow-2xl my-4 sm:my-8 rounded-xl">
      <h1 className="mt-[4.25rem] text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        {recipe_name}
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              Ingredients
            </h2>
            <ul className="space-y-4">
              {ingredients.map((ing: any, index: any) => (
                <li key={index} className="flex items-center gap-4 group">
                  <input
                    type="checkbox"
                    checked={checkedIngredients[index]}
                    onChange={() => toggleIngredient(index)}
                    className="w-5 h-5 rounded-lg border-2 border-blue-400 checked:bg-blue-500 
                             checked:border-transparent focus:ring-2 focus:ring-blue-400 
                             transition-all duration-200 cursor-pointer"
                  />
                  <div className="flex justify-between flex-grow pb-2 border-b border-gray-700/50">
                    <span
                      className={`transition-all duration-200 ${
                        checkedIngredients[index]
                          ? "line-through text-gray-500"
                          : "text-gray-100"
                      }`}
                    >
                      {ing.ingredient.charAt(0).toUpperCase() +
                        ing.ingredient.slice(1)}
                    </span>
                    <span
                      className={`text-gray-400 ${
                        checkedIngredients[index] ? "line-through" : ""
                      }`}
                    >
                      {ing.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              Nutritional Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
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

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">
            Cooking Steps
          </h2>
          <ol className="space-y-6">
            {cooking_steps.map((step: any, index: any) => (
              <li
                key={index}
                className="relative pl-12 pb-6 border-b border-gray-700/50 last:border-0"
              >
                <div className="flex items-start gap-4">
                  <span className="absolute left-0 top-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <div className="space-y-3 w-full">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={checkedSteps[index]}
                        onChange={() => toggleStep(index)}
                        className="w-5 h-5 mt-1 rounded-lg border-2 border-blue-400 
                                 checked:bg-blue-500 checked:border-transparent 
                                 focus:ring-2 focus:ring-blue-400 transition-all 
                                 duration-200 cursor-pointer"
                      />
                      <p
                        className={`flex-grow ${
                          checkedSteps[index]
                            ? "line-through text-gray-500"
                            : "text-gray-100"
                        }`}
                      >
                        {step.step}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-9">
                      {step.utility !== "none" && (
                        <span className="px-3 py-1 bg-gray-700/50 text-blue-400 rounded-full text-sm">
                          {step.utility.charAt(0).toUpperCase() +
                            step.utility.slice(1)}
                        </span>
                      )}
                      {step.time > 0 && (
                        <div className="text-gray-300">
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
        <div className="mt-8 space-y-4 mb-12">
          {!results._id ? (
            <button
              onClick={handleSaveRecipe}
              className="w-full py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Save Recipe
            </button>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Delete Recipe
            </button>
          )}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Share Recipe
          </button>
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
      {showShareModal && (
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
