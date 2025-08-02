import { useState } from "react";
import { runLayout } from "../api/runLayout";

export default function RunLayoutButton({ selectedPlants }) {
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    try {
      const inputs = selectedPlants.map(({ id, ...rest }) => rest);
      const res = await runLayout(inputs);
      setResult(res);
      console.log("Layout result", res);
    } catch (err) {
      console.error("Failed to run layout", err);
    }
  };

  if (selectedPlants.length === 0) return null;

  return (
    <div>
      <button
        onClick={handleClick}
        className="mt-2 px-2 py-1 border border-botanical-light text-xs"
      >
        Run Layout
      </button>
      {result && (
        <pre className="mt-2 p-2 text-xs border border-botanical-light bg-white overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
