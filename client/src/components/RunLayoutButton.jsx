import { useState } from "react";
import { runLayout } from "../api/runLayout.ts";

export default function RunLayoutButton({ selectedPlants }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const inputs = selectedPlants.map(({ id, ...rest }) => rest);
      await runLayout(inputs);
    } catch (err) {
      console.error("Failed to run layout", err);
      setError("Failed to run layout");
    } finally {
      setLoading(false);
    }
  };

  if (selectedPlants.length === 0) return null;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-2 px-2 py-1 border border-botanical-light text-xs"
      >
        {loading ? "Running..." : "Run Layout"}
      </button>
      {error && (
        <div className="mt-2 text-xs text-red-600">{error}</div>
      )}
    </div>
  );
}
