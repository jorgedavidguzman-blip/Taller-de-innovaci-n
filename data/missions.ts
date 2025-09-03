import type { Mission } from '../types';

export const missions: Mission[] = [
  {
    id: 'm01',
    title: 'Adaptador para Cubiertos',
    briefing: '¡Hola! Un usuario con artritis necesita ayuda para sostener sus cubiertos. Diseñaremos un adaptador ergonómico que se ajuste a su mano y a un tenedor o cuchara estándar.',
    problem: 'El objetivo es crear un mango grueso y de fácil agarre que reduzca la necesidad de una motricidad fina precisa. El diseño debe ser cómodo y funcional para el uso diario.',
    requirements: [
      'Debe tener una forma ergonómica que se ajuste a la mano, con un diámetro aproximado de 40-50mm.',
      'Debe tener una ranura para insertar un cubierto estándar (aprox. 20mm x 2.5mm).',
      'La superficie debe ser lisa para facilitar la limpieza, pero con una forma que evite que resbale.'
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-cyan-400"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.362-1.44m0 0c-1.378.562-2.813 1.002-4.362 1.002a7.497 7.497 0 0 1-4.25-1.25m4.25 1.25c-1.032.095-2.096.18-3.19.257m0 0c1.378-.562 2.813-1.002 4.362-1.002a7.497 7.497 0 0 1 4.25 1.25M15.362 5.214C14.01 4.6 12.564 4.2 11.1 4.2s-2.91.4-4.262 1.014" /></svg>`,
    xp: 100,
    optimalMaterial: 'PLA'
  },
  {
    id: 'm02',
    title: 'Pulsador de Botón Grande',
    briefing: 'Algunos dispositivos electrónicos tienen botones pequeños y difíciles de presionar para personas con dificultades motoras. Tu misión es crear un pulsador grande que facilite esta interacción.',
    problem: 'Diseña una extensión que se coloque sobre un botón existente (como el de un interruptor de luz o un electrodoméstico) para aumentar la superficie de contacto. Debe ser robusto y fácil de instalar.',
    requirements: [
        'Superficie de pulsación de al menos 50mm x 50mm.',
        'Mecanismo de fijación simple (a presión o con cinta adhesiva de doble cara).',
        'Debe transmitir la fuerza eficientemente al botón original sin romperse.'
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-cyan-400"><path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.588 8.188a15.048 15.048 0 0 1-3.478 2.555c-1.028.64-2.279.998-3.566.998s-2.538-.358-3.566-.998a15.049 15.049 0 0 1-3.478-2.555A7.5 7.5 0 0 1 7.864 4.243z" /></svg>`,
    xp: 150,
    optimalMaterial: 'ABS'
  },
  {
    id: 'm03',
    title: 'Soporte para Lápiz Personalizado',
    briefing: 'Un estudiante con dificultades para la escritura necesita un soporte que le ayude a sujetar un lápiz o bolígrafo de forma estable. Vamos a crear una solución a medida.',
    problem: 'Diseña un soporte para lápiz que se adapte a una forma de agarre específica (por ejemplo, agarre de puño). Debe ser ligero y no interferir con la escritura, proporcionando estabilidad.',
    requirements: [
        'Debe tener un orificio para un lápiz o bolígrafo estándar (aprox. 8mm de diámetro).',
        'La forma externa debe ser personalizada para un agarre cómodo y estable.',
        'Debe tener cierta flexibilidad para insertar y quitar el lápiz, pero ser lo suficientemente firme.'
    ],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-cyan-400"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>`,
    xp: 200,
    optimalMaterial: 'PETG'
  }
];