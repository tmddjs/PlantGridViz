import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { PlantInput } from "../shared/schema";
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
    let outputPath: string | undefined;
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

        proc.stderr.on("data", (d: Buffer) => {
          console.error(d.toString());
        });

        proc.on("error", reject);
        proc.on("close", (code: number | null) => {
          code === 0 ? resolve() : reject(new Error(`exit code ${code}`));
        });
      });

      // The Python script above generates a placement.json file that can be
      // returned directly. If a VLA executable is provided via the VLA env
      // variable, run it with the generated layout. Otherwise skip this step so
      // the route still works without the external dependency.
      const layoutPath = join(dir, "layout.csv");
      const placementPath = join(dir, "placement.json");
      const outputRoot = join(process.cwd(), "Output");
      outputPath = join(outputRoot, Date.now().toString());

      const vla = process.env.VLA;
      if (vla) {
        console.log(`Running VLA: ${vla} ${layoutPath}`);
        await new Promise<void>((resolve, reject) => {
          const proc = spawn(vla, [layoutPath]);

          proc.stdout.on("data", (d: Buffer) => {
            console.log(d.toString());
          });

          proc.stderr.on("data", (d: Buffer) => {
            console.error(d.toString());
          });

          proc.on("error", reject);
          proc.on("close", (code: number | null) => {
            if (code === 0) {
              console.log("VLA finished successfully");
              resolve();
            } else {
              console.error(`VLA exited with code ${code}`);
              reject(new Error(`VLA exit code ${code}`));
            }
          });
        });
      } else {
        console.log("VLA environment variable not set; skipping VLA execution");
      }

      const placement = JSON.parse(await fs.readFile(placementPath, "utf8"));

      res.status(200).json({ placement, outputPath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to run layout" });
    } finally {
      if (dir) {
        const outputRoot = join(process.cwd(), "Output");
        try {
          await fs.mkdir(outputRoot, { recursive: true });
          outputPath ??= join(outputRoot, Date.now().toString());
          await fs.cp(dir, outputPath, { recursive: true });
        } catch (copyErr) {
          console.error(`Failed to copy layout results to ${outputPath}:`, copyErr);
        }
        await fs.rm(dir, { recursive: true, force: true });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
