import type { PlantInput } from "../../../shared/schema.ts";

export async function runLayout(plants: PlantInput[]) {
  const res = await fetch("/api/run-layout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plants),
  });
  if (!res.ok) {
    throw new Error("Failed to run layout");
  }
  return res.json();
}
