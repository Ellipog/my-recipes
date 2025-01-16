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
    const recipeData = await req.json();

    // Add the user as owner to the recipe
    const recipe = await Recipe.create({
      ...recipeData,
      users: [
        {
          userId,
          permissions: "owner",
        },
      ],
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
