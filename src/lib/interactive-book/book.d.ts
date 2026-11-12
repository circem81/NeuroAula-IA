import type { Group, Scene } from "three";
import type { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
export function createBook(
  stage: { scene: Scene },
  config: {
    colorTapa: string;
    colorOro: string;
    tapa: string[];
    subtitulo: string;
    ornamento: string;
    unidad: string;
    pregunta: string;
  },
  tween: (
    duration: number,
    update: (value: number) => void,
    ease?: (value: number) => number,
  ) => Promise<void>,
): {
  group: Group;
  cssLeft: CSS3DObject;
  cssRight: CSS3DObject;
  open(): Promise<void>;
  turn(direction: number, onMid: () => void): Promise<void>;
};
