import type { Material } from '../types';

export const materials: Material[] = [
  {
    id: 'PLA',
    name: 'PLA (Ácido Poliláctico)',
    description: 'Fácil de imprimir, biodegradable y rígido. Ideal para prototipos rápidos y piezas que no requieren alta resistencia térmica o mecánica.',
    properties: 'Baja contracción, baja temperatura de impresión, buena adhesión entre capas. Frágil.'
  },
  {
    id: 'ABS',
    name: 'ABS (Acrilonitrilo Butadieno Estireno)',
    description: 'Resistente, duradero y con buena resistencia a la temperatura. Común en piezas de automóviles y juguetes como LEGO.',
    properties: 'Requiere cama caliente, emite olores al imprimir, propenso a warping. Alta resistencia al impacto.'
  },
  {
    id: 'PETG',
    name: 'PETG (Glicol de Tereftalato de Polietileno)',
    description: 'Un buen equilibrio entre PLA y ABS. Más fuerte y flexible que el PLA, y más fácil de imprimir que el ABS.',
    properties: 'Baja contracción, resistente a químicos, aprobado para contacto con alimentos. Puede ser pegajoso al imprimir ("stringing").'
  }
];
