export interface User {
  username: string;
  email: string;
  major: string; // Carrera
  course: string; // Asignatura
}

export interface Mission {
  id: string;
  title: string;
  briefing: string;
  problem: string;
  requirements: string[];
  icon: string;
  xp: number;
  optimalMaterial: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  properties: string;
}

export interface PrintParameters {
  material: string;
  layerHeight: number; // in mm
  infill: number; // in %
  printSpeed: number; // in mm/s
  supports: boolean;
  bedAdhesion: 'none' | 'skirt' | 'brim' | 'raft';
}

export interface IdeationData {
  userAnalysis: string;
  contextAnalysis: string;
  ideaDescription: string;
  sketchDataUrl: string | null;
}


export interface MissionAttempt extends PrintParameters {
  missionId: string;
  stlFile: File | null;
  ideation: IdeationData;
  slicingConfirmed: boolean;
  slicerScreenshotDataUrl: string | null;
  printSuccessful: boolean;
  score: number;
}

export interface MissionCompletion {
  missionId: string;
  score: number;
  timestamp: number;
}

export interface UserProgress {
  completedMissions: MissionCompletion[];
  xp: number;
  inventory: string[]; // unlocked materials, tools
}