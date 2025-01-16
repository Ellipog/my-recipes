"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes } from "@/contexts/RecipesContext";

export default function SideMenu() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { savedRecipes, fetchSavedRecipes } = useRecipes();
  const router = useRouter();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedRecipes();
    }
  }, [isAuthenticated, fetchSavedRecipes]);

  const handleLogout = () => {
    logout();
    router.push("/auth");
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-2 top-6 z-30 p-3 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 h-full w-80 bg-gray-900/95 shadow-xl z-50 transform transition-transform duration-300 backdrop-blur-sm border-r border-gray-700/50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Recipe Menu
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={() => {
                router.push("/");
                setIsOpen(false);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 mb-6 shadow-lg shadow-blue-500/20"
            >
              New Recipe
            </button>

            {savedRecipes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Saved Recipes
                </h3>
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                  {savedRecipes.map((recipe) => (
                    <button
                      key={recipe._id}
                      onClick={() => {
                        router.push(`/recipes/${recipe._id}`);
                        setIsOpen(false);
                      }}
                      className="w-full p-3 text-left bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors border border-gray-700/50 group"
                    >
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {recipe.recipe_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto p-6 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-500/10 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 border border-red-500/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
