import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    await connectDB();
    const { token } = params;

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
  } catch (error: any) {
    console.error("Error fetching shared recipe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
