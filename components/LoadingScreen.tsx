import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-foreground/80 text-lg mt-4 mb-1">
          Creating your recipe...
        </p>
        <p className="text-foreground/80 text-sm">This might take a while</p>
      </div>
    </div>
  );
}
