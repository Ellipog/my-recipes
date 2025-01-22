import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SideMenu from "@/components/SideMenu";
import { RecipesProvider } from "@/contexts/RecipesContext";

export const metadata: Metadata = {
  title: "My Recipes",
  description:
    "AI-powered recipe generator that creates personalized recipes based on your available ingredients",
  keywords: ["recipe", "AI", "cooking", "food", "meal planner"],
  authors: [{ name: "Elliot Strand Aaen" }],
  openGraph: {
    title: "My Recipes",
    description:
      "AI-powered recipe generator that creates personalized recipes",
    type: "website",
    locale: "en_US",
    siteName: "My Recipes",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Recipes",
    description:
      "AI-powered recipe generator that creates personalized recipes",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.png" />
      <body className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <AuthProvider>
          <RecipesProvider>
            <SideMenu />
            <div className="antialiased">{children}</div>
          </RecipesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
