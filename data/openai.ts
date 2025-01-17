export const recipeFunction = {
  name: "create_recipe",
  description:
    "Creates a recipe based on available ingredients, number of servings, allergies, and available cooking utilities.",
  strict: true,
  parameters: {
    type: "object",
    required: [
      "ingredients",
      "servings",
      "utilities",
      "allergies",
      "recipe_details",
      "cook_now",
    ],
    properties: {
      ingredients: {
        type: "array",
        description: "List of ingredients provided by the user ",
        items: {
          type: "string",
          description: "An ingredient available for cooking",
        },
      },
      servings: {
        type: "number",
        description: "The number of people the meal will serve",
      },
      allergies: {
        type: "array",
        description: "List of allergies to avoid in the recipe",
        items: {
          type: "string",
          description: "An allergy or dietary restriction",
        },
      },
      cook_now: {
        type: "boolean",
        description:
          "Whether the user wants to cook now or not, if true, do not respond with recipes that require prepearation beforehand, or things that take a lot of time, for example soaking for an hour, etc etc",
      },
      utilities: {
        type: "array",
        description: "List of available cooking utilities",
        items: {
          type: "string",
          description: "A kitchen utility available for cooking",
        },
      },
      recipe_details: {
        type: "object",
        description: "Details of the created recipe",
        properties: {
          ingredients_list: {
            type: "array",
            description:
              "List of ingredients used in the recipe with quantities",
            items: {
              type: "object",
              properties: {
                ingredient: {
                  type: "string",
                  description:
                    "Name of the ingredient properly capitalized etc",
                },
                quantity: {
                  type: "string",
                  description: "Quantity of the ingredient needed",
                },
              },
              additionalProperties: false,
              required: ["ingredient", "quantity"],
            },
          },
          nutritional_information: {
            type: "object",
            properties: {
              calories: {
                type: "number",
                description: "Total calories per serving",
              },
              protein: {
                type: "number",
                description: "Total protein content per serving",
              },
              fat: {
                type: "number",
                description: "Total fat content per serving",
              },
              carbohydrates: {
                type: "number",
                description: "Total carbohydrates per serving",
              },
            },
            additionalProperties: false,
            required: ["calories", "protein", "fat", "carbohydrates"],
          },
          cooking_steps: {
            type: "array",
            description: "Step-by-step instructions to prepare the meal",
            items: {
              type: "object",
              properties: {
                step: {
                  type: "string",
                  description:
                    "Instruction for this cooking step, including wait time, utility etc.",
                },
                time: {
                  type: "number",
                  description:
                    "Number of seconds it should be prepeared for(wait time), if any needed, if not, respond with 0, do not respond with a time unless something needs to be prepeared, for example cooked, smoked, etc. Placing food on a plate, or serving it, does not need a time",
                },
                utility: {
                  type: "string",
                  description:
                    "The utility needed, if none respond none, for example: stove, oven, microwave, airfrier, etc",
                },
              },
              additionalProperties: false,
              required: ["step", "time", "utility"],
            },
          },
          recipe_name: {
            type: "string",
            description: "Name of the recipe properly capitalized",
          },
        },
        additionalProperties: false,
        required: [
          "ingredients_list",
          "nutritional_information",
          "cooking_steps",
          "recipe_name",
        ],
      },
    },
    additionalProperties: false,
  },
};
