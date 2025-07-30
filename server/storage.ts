import { type Plant, type InsertPlant } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getPlants(): Promise<Plant[]>;
  getPlant(id: string): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
}

export class MemStorage implements IStorage {
  private plants: Map<string, Plant>;

  constructor() {
    this.plants = new Map();
  }

  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: string): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const id = randomUUID();
    const plant: Plant = { ...insertPlant, id };
    this.plants.set(id, plant);
    return plant;
  }
}

export const storage = new MemStorage();
