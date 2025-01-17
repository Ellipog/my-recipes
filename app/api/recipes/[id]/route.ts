import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { verifyAuth } from "@/lib/auth";

const withAuth = async (request: NextRequest) => {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) return { error: "Unauthorized", status: 401 };

  const userId = await verifyAuth(token);
  if (!userId) return { error: "Invalid token", status: 401 };

  return { userId };
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await withAuth(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Extract ID from URL pattern
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    await connectDB();
    const recipe = await Recipe.findOne({
      _id: id,
      "users.userId": auth.userId,
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await withAuth(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Extract ID from URL pattern
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    await connectDB();
    const recipe = await Recipe.findOneAndDelete({
      _id: id,
      "users.userId": auth.userId,
      "users.permissions": "owner",
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or insufficient permissions" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
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
