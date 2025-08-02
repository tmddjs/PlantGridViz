import { randomUUID } from "crypto";
import type { PlantInput } from "@shared/schema";
import plantsData from "@shared/plantsData";

export interface Plant extends PlantInput {
  id: string;
}

export interface IStorage {
  getPlants(): Promise<Plant[]>;
  getPlant(id: string): Promise<Plant | undefined>;
  createPlant(plant: PlantInput): Promise<Plant>;
}

export class MemStorage implements IStorage {
  private plants: Map<string, Plant>;

  constructor(initial: PlantInput[] = []) {
    this.plants = new Map();
    initial.forEach((p) => {
      const id = randomUUID();
      this.plants.set(id, { id, ...p });
    });
  }

  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: string): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(insertPlant: PlantInput): Promise<Plant> {
    const id = randomUUID();
    const plant: Plant = { id, ...insertPlant };
    this.plants.set(id, plant);
    return plant;
  }
}

export const storage = new MemStorage(plantsData);
