import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../public/home');
const OUTPUT_DIR = path.join(__dirname, '../public/home/optimized');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const optimizeImages = async () => {
  console.log(' Starting image optimization...');

  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(file =>
    /\.(png|jpe?g|webp)$/i.test(file) &&
    !fs.lstatSync(path.join(INPUT_DIR, file)).isDirectory()
  );

  console.log(`Found ${imageFiles.length} images to optimize.`);

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const fileName = path.parse(file).name;
    const outputPath = path.join(OUTPUT_DIR, `${fileName}.webp`);

    try {
      console.log(`Processing: ${file}...`);

      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if too large (max width 1920px for hero/sliders)
      let pipeline = image;
      if (metadata.width > 1920) {
        pipeline = pipeline.resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      await pipeline
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      const inputSize = fs.statSync(inputPath).size / (1024 * 1024);
      const outputSize = fs.statSync(outputPath).size / (1024 * 1024);
      const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(2);

      console.log(` ${file} -> ${fileName}.webp (${reduction}% smaller: ${outputSize.toFixed(2)}MB)`);
    } catch (err) {
      console.error(` Error processing ${file}:`, err.message);
    }
  }

  console.log('\n Optimization complete! Optimized images are in public/home/optimized');
  console.log('Update your components to use the .webp versions from the optimized folder.');
};

optimizeImages();
