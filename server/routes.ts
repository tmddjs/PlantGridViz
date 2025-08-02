import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { PlantInput } from "@shared/schema";
import { selectedPlantsToCsv } from "./utils/serialize";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawn } from "child_process";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all plants
  app.get("/api/plants", async (req, res) => {
    try {
      const plants = await storage.getPlants();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plants" });
    }
  });

  // Get single plant
  app.get("/api/plants/:id", async (req, res) => {
    try {
      const plant = await storage.getPlant(req.params.id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      res.json(plant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant" });
    }
  });

  // Create new plant
  app.post("/api/plants", async (req, res) => {
    try {
      const plant = await storage.createPlant(req.body as PlantInput);
      res.status(201).json(plant);
    } catch (error) {
      res.status(400).json({ message: "Invalid plant data" });
    }
  });

  // Run Python layout
  app.post("/api/run-layout", async (req, res) => {
    let dir: string | undefined;
    try {
      const plants = req.body as PlantInput[];
      const csv = selectedPlantsToCsv(plants);

      // create temporary working directory and input file
      dir = await fs.mkdtemp(join(tmpdir(), "layout-"));
      const csvPath = join(dir, "input.csv");
      await fs.writeFile(csvPath, csv);

      const python = process.env.PYTHON || "python3";
      const width = 10;
      const height = 10;

      await new Promise<void>((resolve, reject) => {
        const proc = spawn(python, [
          "-m",
          "plant_layout.main",
          String(width),
          String(height),
          csvPath,
          "--out",
          dir!,
        ]);

        const stderr: string[] = [];
        proc.stderr.on("data", (d: Buffer) => {
          const msg = d.toString();
          stderr.push(msg);
          console.error(msg);
        });

        proc.on("error", reject);
        proc.on("close", (code: number | null) => {
          code === 0
            ? resolve()
            : reject(new Error(stderr.join("") || `exit code ${code}`));
        });
      });

      const placement = JSON.parse(
        await fs.readFile(join(dir, "placement.json"), "utf-8")
      );
      res.json(placement);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to run layout";
      res.status(500).json({ message });
    } finally {
      if (dir) {
        await fs.rm(dir, { recursive: true, force: true });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
