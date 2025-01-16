import { useState } from "react";
import Notification from "./Notification";

interface ShareRecipeModalProps {
  recipeId: string;
  onClose: () => void;
}

export default function ShareRecipeModal({
  recipeId,
  onClose,
}: ShareRecipeModalProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/recipes/share/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const fullUrl = `${window.location.origin}${data.shareUrl}`;
      setShareUrl(fullUrl);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setNotification({
        message: "Link copied to clipboard!",
        type: "success",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">Share Recipe</h2>
        <div className="space-y-4">
          {!shareUrl ? (
            <button
              onClick={generateShareLink}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Generating Link..." : "Generate Share Link"}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 rounded bg-gray-700 text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Share this link with anyone to give them access to the recipe
              </p>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
