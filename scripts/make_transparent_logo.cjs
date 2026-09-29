const sharp = require('sharp');
const fs = require('fs');

async function createTransparentLogo() {
  const inputPath = './public/college_logo.jpg';
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const numPixels = width * height;

  // We will create an RGBA buffer (4 channels)
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  // Background map: 0 = unvisited, 1 = background, 2 = foreground
  const isBg = new Uint8Array(numPixels);
  const queue = new Int32Array(numPixels);
  let head = 0;
  let tail = 0;

  // Helper to check if a pixel is near-white background
  const isWhiteIsh = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Background is near white (JPEG artifacts can have subtle tints)
    return r > 220 && g > 218 && b > 218;
  };

  // Seed with all border pixels that are near-white
  for (let x = 0; x < width; x++) {
    // Top border
    let idx0 = x * channels;
    if (isWhiteIsh(idx0)) {
      isBg[x] = 1;
      queue[tail++] = x;
    }
    // Bottom border
    let idxB = ((height - 1) * width + x) * channels;
    let pB = (height - 1) * width + x;
    if (isWhiteIsh(idxB)) {
      isBg[pB] = 1;
      queue[tail++] = pB;
    }
  }

  for (let y = 0; y < height; y++) {
    // Left border
    let pL = y * width;
    let idxL = pL * channels;
    if (!isBg[pL] && isWhiteIsh(idxL)) {
      isBg[pL] = 1;
      queue[tail++] = pL;
    }
    // Right border
    let pR = y * width + (width - 1);
    let idxR = pR * channels;
    if (!isBg[pR] && isWhiteIsh(idxR)) {
      isBg[pR] = 1;
      queue[tail++] = pR;
    }
  }

  // BFS Flood Fill 4-connected
  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    const y = Math.floor(p / width);

    // Neighbors: Up, Down, Left, Right
    const neighbors = [];
    if (x > 0) neighbors.push(p - 1);
    if (x < width - 1) neighbors.push(p + 1);
    if (y > 0) neighbors.push(p - width);
    if (y < height - 1) neighbors.push(p + width);

    for (let i = 0; i < neighbors.length; i++) {
      const np = neighbors[i];
      if (isBg[np] === 0) {
        const nIdx = np * channels;
        if (isWhiteIsh(nIdx)) {
          isBg[np] = 1;
          queue[tail++] = np;
        }
      }
    }
  }

  console.log(`Flood-fill complete. Background pixels identified: ${tail} of ${numPixels} (${Math.round((tail / numPixels) * 100)}%)`);

  // Now construct RGBA buffer with edge anti-aliasing & de-matting
  for (let i = 0; i < numPixels; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;
    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    if (isBg[i] === 1) {
      // Pure background -> completely transparent
      rgbaBuffer[dstIdx] = 0;
      rgbaBuffer[dstIdx + 1] = 0;
      rgbaBuffer[dstIdx + 2] = 0;
      rgbaBuffer[dstIdx + 3] = 0;
    } else {
      // Check if it neighbors any background pixel (anti-aliasing edge)
      const x = i % width;
      const y = Math.floor(i / width);
      let bgNeighborCount = 0;
      let totalNeighbors = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            totalNeighbors++;
            if (isBg[ny * width + nx] === 1) {
              bgNeighborCount++;
            }
          }
        }
      }

      if (bgNeighborCount > 0) {
        // Transitional edge pixel
        // Calculate brightness
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        let alpha = 255;
        if (brightness > 210) {
          // Fade alpha smoothly from brightness 210 to 255
          alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) * (255 / 45))));
        }

        // De-matte white fringe: clamp color to avoid white halo
        const factor = alpha / 255;
        rgbaBuffer[dstIdx] = Math.round(r * factor);
        rgbaBuffer[dstIdx + 1] = Math.round(g * factor);
        rgbaBuffer[dstIdx + 2] = Math.round(b * factor);
        rgbaBuffer[dstIdx + 3] = alpha;
      } else {
        // Solid foreground pixel inside the shield
        rgbaBuffer[dstIdx] = r;
        rgbaBuffer[dstIdx + 1] = g;
        rgbaBuffer[dstIdx + 2] = b;
        rgbaBuffer[dstIdx + 3] = 255;
      }
    }
  }

  // Save as high quality PNG in multiple public/assets paths
  const outputPaths = [
    './public/college_logo.png',
    './public/assets/college_logo.png',
    './src/assets/images/college_logo.png',
  ];

  for (const outPath of outputPaths) {
    const dir = outPath.substring(0, outPath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await sharp(rgbaBuffer, {
      raw: {
        width,
        height,
        channels: 4,
      },
    })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(outPath);

    console.log(`Saved transparent logo to ${outPath}`);
  }
}

createTransparentLogo().catch((err) => {
  console.error('Error creating transparent logo:', err);
  process.exit(1);
});
