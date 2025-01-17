import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { verifyAuth } from "@/lib/auth";
import crypto from "crypto";

const generateShareToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const { recipeId, ...recipeData } = await req.json();

    let recipe;
    if (recipeId) {
      // If recipeId exists, add the user to the existing recipe
      recipe = await Recipe.findOneAndUpdate(
        { _id: recipeId },
        {
          $addToSet: {
            users: {
              userId,
              permissions: "viewer",
            },
          },
        },
        { new: true }
      );
    } else {
      // If no recipeId, create a new recipe
      recipe = await Recipe.create({
        ...recipeData,
        users: [
          {
            userId,
            permissions: "owner",
          },
        ],
        shareToken: generateShareToken(),
      });
    }

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, recipe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
