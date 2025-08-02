// Import shared schema so both client and server use the same typing
import type { PlantInput } from "../../shared/schema";

const headers = [
  "scientific_name",
  "kr_name",
  "life_form",
  "max_height_m",
  "root_depth_cm_range",
  "light_requirement_1_5",
  "lifespan_yr",
] as const;

export function selectedPlantsToCsv(plants: PlantInput[]): string {
  const lines = plants.map((p) =>
    headers
      .map((key) => {
        const value = (p as any)[key];
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}
