import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { createBook } from "./book.js";

/** Client-only renderer: no learner data, global listeners, storage or network calls. */
export function mountBook(host: HTMLElement, title: string) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.cssText = "position:absolute;inset:0;";
  host.appendChild(renderer.domElement);
  const css = new CSS3DRenderer();
  css.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none;";
  host.appendChild(css.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 50);
  camera.position.set(0, 2.8, 1.9);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x75654d, 2.5));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-2, 4, 2);
  scene.add(light);
  let disposed = false;
  let busy = true;
  let frame = 0;
  const animations = new Set<{
    start: number;
    duration: number;
    update: (value: number) => void;
    ease: (value: number) => number;
    resolve: () => void;
  }>();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tween = (duration: number, update: (v: number) => void, ease = (v: number) => v) =>
    new Promise<void>((resolve) => {
      if (disposed) {
        resolve();
        return;
      }
      if (motion.matches) {
        update(1);
        resolve();
        return;
      }
      animations.add({
        start: performance.now(),
        duration: duration * 1000,
        update,
        ease,
        resolve,
      });
    });
  let book: ReturnType<typeof createBook>;
  const cleanup = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    for (const item of animations) item.resolve();
    animations.clear();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) textures.add(value);
      }
    });
    textures.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    geometries.forEach((item) => item.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    host.replaceChildren();
  };
  try {
    book = createBook(
      { scene },
      {
        colorTapa: "#244c48",
        colorOro: "#e3c478",
        tapa: ["NeuroAula", "Aprender"],
        subtitulo: title,
        ornamento: "onda",
        unidad: "ALG-01",
        pregunta: "Explora y comprueba",
      },
      tween,
    );
  } catch (error) {
    cleanup();
    throw error;
  }
  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    renderer.setSize(width, height);
    css.setSize(width, height);
    camera.aspect = width / height;
    // Fit both pages even on a narrow viewport.
    camera.position.set(0, Math.max(2.8, 2.7 / camera.aspect), Math.max(1.9, 1.8 / camera.aspect));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  const render = (now: number) => {
    if (disposed) return;
    for (const item of animations) {
      const t = motion.matches ? 1 : Math.min(1, (now - item.start) / item.duration);
      item.update(item.ease(t));
      if (t === 1) {
        animations.delete(item);
        item.resolve();
      }
    }
    renderer.render(scene, camera);
    css.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  frame = requestAnimationFrame(render);
  const write = (heading: string, body: string) => {
    for (const [object, text] of [
      [book.cssLeft, heading],
      [book.cssRight, body],
    ] as const) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      object.element.style.cssText +=
        "padding:90px;box-sizing:border-box;color:#263b38;font:46px/1.5 Georgia,serif;white-space:pre-line;";
      object.element.replaceChildren(paragraph);
    }
  };
  let latest = { heading: title, body: "" };
  const opening = book.open().then(() => {
    busy = false;
    if (!disposed) write(latest.heading, latest.body);
  });
  void opening;
  return {
    show(heading: string, body: string) {
      latest = { heading, body };
      if (disposed) return;
      if (busy) {
        write(heading, body);
        return;
      }
      busy = true;
      void book
        .turn(1, () => {
          if (!disposed) write(latest.heading, latest.body);
        })
        .finally(() => {
          busy = false;
        });
    },
    dispose() {
      observer.disconnect();
      cleanup();
    },
  };
}
