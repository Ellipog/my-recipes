import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SideMenu from "@/components/SideMenu";
import { RecipesProvider } from "@/contexts/RecipesContext";

export const metadata: Metadata = {
  title: "Recipe Generator",
  description: "AI-powered recipe generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
