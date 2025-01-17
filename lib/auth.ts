import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function verifyAuth(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JWTPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}
