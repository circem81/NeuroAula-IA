import * as THREE from "three";

// Adapted from upstream scene.js; procedural textures remain local (MIT, see LICENSE).
export function canvasTex(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D, width: number, height: number) => void,
  { srgb = true }: { srgb?: boolean } = {},
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
