import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    // Extract token from URL pattern
    const token = request.url.split("/").pop();
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid share token" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.findOne({ shareToken: token })
      .select("-users -shareToken") // Exclude sensitive fields
      .lean(); // Convert to plain JavaScript object

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or share link expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (error: unknown) {
    console.error("Error fetching shared recipe:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
