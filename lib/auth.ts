import jwt from "jsonwebtoken";

export async function verifyAuth(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    return (decoded as any).userId;
  } catch (error) {
    return null;
  }
}
