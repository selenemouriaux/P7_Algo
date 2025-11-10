/**
 * Script de génération de thumbnails optimisés en WebP avec sharp
 * Réduit les images de ~1/20 Mo (3731×5517) à ~30-50 Ko (800×600) en WebP
 * WebP > JPEG (~30% de réduction supplémentaire à qualité équivalente)
 *
 * Usage: node scripts/generate-thumbnails.js
 */

import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = {
  inputDir: join(__dirname, "../public/images"),
  outputDir: join(__dirname, "../public/images/thumbnails"),
  thumbnailWidth: 800,
  thumbnailHeight: 600,
  quality: 80,
  pattern: /^Recette\d+\.jpg$/i,
};

async function ensureOutputDir() {
  if (!existsSync(CONFIG.outputDir)) {
    await mkdir(CONFIG.outputDir, { recursive: true });
    console.log(`Dossier créé: ${CONFIG.outputDir}`);
  }
}

async function getImageFiles() {
  const files = await readdir(CONFIG.inputDir);
  return files.filter((file) => CONFIG.pattern.test(file));
}

async function generateThumbnail(filename) {
  const inputPath = join(CONFIG.inputDir, filename);
  const outputFilename = filename.replace(/\.jpg$/i, ".webp");
  const outputPath = join(CONFIG.outputDir, outputFilename);

  try {
    const info = await sharp(inputPath)
      .resize(CONFIG.thumbnailWidth, CONFIG.thumbnailHeight, {
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .webp({
        quality: CONFIG.quality,
        effort: 6,
      })
      .toFile(outputPath);

    return {
      filename: outputFilename,
      success: true,
      dimensions: `${info.width}×${info.height}`,
      size: `${(info.size / 1024).toFixed(1)} Ko`,
    };
  } catch (error) {
    return {
      filename,
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  await ensureOutputDir();

  const imageFiles = await getImageFiles();
  if (imageFiles.length === 0) {
    return;
  }

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  for (const [i, filename] of imageFiles.entries()) {
    const result = await generateThumbnail(filename);

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
}

main().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
