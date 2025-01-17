import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { verifyAuth } from "@/lib/auth";

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
    const { recipeId } = await req.json();

    // Find the recipe and verify the user has access
    const recipe = await Recipe.findOne({
      _id: recipeId,
      "users.userId": userId,
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Generate a unique share token
    await recipe.save();

    return NextResponse.json({
      success: true,
      shareUrl: `/recipes/shared/${recipe.shareToken}`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
