import { promises as fs } from 'fs';
import { join } from 'path';

async function main() {
  const outputRoot = join(process.cwd(), 'Output');
  let entries: fs.Dirent[];
  try {
    entries = await fs.readdir(outputRoot, { withFileTypes: true });
  } catch {
    console.log('No Output directory found');
    return;
  }

  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  if (dirs.length === 0) {
    console.log('No layout outputs found');
    return;
  }

  const latest = dirs[dirs.length - 1];
  const latestPath = join(outputRoot, latest);
  console.log(`Latest output directory: ${latestPath}`);

  const files = await fs.readdir(latestPath);
  for (const file of files) {
    console.log(` - ${file}`);
  }
}

main();
