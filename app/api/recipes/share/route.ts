import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
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
    const { recipeId, userEmail, permissions } = await req.json();

    // Find the recipe and verify the user has owner permissions
    const recipe = await Recipe.findOne({
      _id: recipeId,
      "users.userId": userId,
      "users.permissions": "owner",
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or insufficient permissions" },
        { status: 404 }
      );
    }

    // Find the user to share with
    const shareUser = await User.findOne({ email: userEmail });
    if (!shareUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the user to the recipe's users array if not already present
    const userExists = recipe.users.some(
      (u: any) => u.userId.toString() === shareUser._id.toString()
    );
    if (!userExists) {
      recipe.users.push({
        userId: shareUser._id,
        permissions: permissions || "viewer",
      });
      await recipe.save();
    }

    return NextResponse.json({ success: true, recipe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
