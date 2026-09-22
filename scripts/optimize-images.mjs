/**
 * scripts/optimize-images.mjs
 * Compresses and converts landing page images to WebP using sharp.
 * Run with: node scripts/optimize-images.mjs
 */

import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const inputDir = join(rootDir, "public", "home");
const outputDir = join(rootDir, "public", "home", "optimized");

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Image processing config: { file, width, quality }
// width: max width in px (height auto-scales preserving aspect ratio)
// quality: WebP quality 1-100 (80 is excellent visual/size balance)
const images = [
  // Hero — LCP image, must be sharp and clear
  { file: "hero.png",      width: 1280, quality: 82 },

  // Carousel slides — full-width, so allow wider
  { file: "slider1.png",   width: 1400, quality: 78 },
  { file: "slider2.png",   width: 1400, quality: 78 },
  { file: "slider3.png",   width: 1400, quality: 78 },
  { file: "slider4.png",   width: 1400, quality: 78 },
  { file: "slider5.png",   width: 1400, quality: 78 },

  // Services — half-width images beside text
  { file: "logistics.png", width: 900, quality: 80 },
  { file: "errand.png",    width: 900, quality: 80 },
  { file: "home.png",      width: 900, quality: 80 },
  { file: "business.png",  width: 900, quality: 80 },

  // Providers / How It Works
  { file: "providers.png", width: 800, quality: 80 },
  { file: "hand.png",      width: 600, quality: 80 },
  { file: "works.png",     width: 600, quality: 80 },

  // Testimonial avatars — small
  { file: "adebayo.png",   width: 120, quality: 82 },
  { file: "funke.png",     width: 120, quality: 82 },
  { file: "emeka.png",     width: 120, quality: 82 },

  // How-it-works icons — already tiny, just convert to WebP
  { file: "request.png",   width: 64,  quality: 85 },
  { file: "matched.png",   width: 64,  quality: 85 },
  { file: "tracked.png",   width: 64,  quality: 85 },
  { file: "completed.png", width: 64,  quality: 85 },
];

async function processImage({ file, width, quality }) {
  const inputPath = join(inputDir, file);
  const outputName = file.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  const outputPath = join(outputDir, outputName);

  if (!existsSync(inputPath)) {
    console.warn(`  WARNING  Skipping ${file} - file not found`);
    return null;
  }

  try {
    const inputBuffer = await sharp(inputPath).toBuffer();
    const originalSizeKB = Math.round(inputBuffer.length / 1024);

    await sharp(inputPath)
      .resize({
        width,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality, effort: 4 })
      .toFile(outputPath);

    const outputBuffer = await sharp(outputPath).toBuffer();
    const optimizedSizeKB = Math.round(outputBuffer.length / 1024);
    const saving = Math.round((1 - optimizedSizeKB / originalSizeKB) * 100);

    console.log(
      `  OK  ${file.padEnd(20)} ${String(originalSizeKB + " KB").padStart(9)} -> ${String(optimizedSizeKB + " KB").padStart(8)} WebP  (-${saving}%)`
    );

    return { file, originalSizeKB, optimizedSizeKB, saving };
  } catch (err) {
    console.error(`  ERROR processing ${file}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("\nSabiGuy Landing Page Image Optimizer");
  console.log("=====================================");
  console.log(`Input:  ${inputDir}`);
  console.log(`Output: ${outputDir}\n`);

  const results = [];

  for (const img of images) {
    const result = await processImage(img);
    if (result) results.push(result);
  }

  if (results.length > 0) {
    const totalBeforeKB = results.reduce((s, r) => s + r.originalSizeKB, 0);
    const totalAfterKB  = results.reduce((s, r) => s + r.optimizedSizeKB, 0);
    const totalSaving   = Math.round((1 - totalAfterKB / totalBeforeKB) * 100);

    console.log("\n=====================================");
    console.log(`Total before: ${Math.round(totalBeforeKB / 1024)} MB`);
    console.log(`Total after:  ${Math.round(totalAfterKB / 1024)} MB`);
    console.log(`Saved:        ${Math.round((totalBeforeKB - totalAfterKB) / 1024)} MB (-${totalSaving}%)`);
    console.log("\nDone. WebP images saved to public/home/optimized/");
  }
}

main();
