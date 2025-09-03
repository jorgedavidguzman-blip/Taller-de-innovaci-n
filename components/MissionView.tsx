import React, { useState, useCallback } from 'react';
import type { Mission, PrintParameters, MissionAttempt, UserProgress, IdeationData, User } from '../types';
import { materials } from '../data/materials';
import { generateMissionReport } from '../lib/pdfGenerator';

interface MissionViewProps {
  mission: Mission;
  user: User;
  userProgress: UserProgress;
  onExit: () => void;
  onComplete: (missionId: string, score: number) => void;
}

type MissionStep = 'briefing' | 'ideation' | 'design' | 'parameters' | 'slicing' | 'result';

const STEPS: MissionStep[] = ['briefing', 'ideation', 'design', 'parameters', 'slicing', 'result'];

const ParameterSlider: React.FC<{label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (value: number) => void}> = ({ label, value, min, max, step, unit, onChange }) => (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <label className="font-semibold">{label}</label>
            <span className="text-cyan-400 font-mono">{value}{unit}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
    </div>
);


const MissionView: React.FC<MissionViewProps> = ({ mission, user, userProgress, onExit, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<MissionStep>('briefing');
  const [attempt, setAttempt] = useState<MissionAttempt>({
    missionId: mission.id,
    stlFile: null,
    ideation: {
      userAnalysis: '',
      contextAnalysis: '',
      ideaDescription: '',
      sketchDataUrl: null,
    },
    material: userProgress.inventory[0] || 'PLA',
    layerHeight: 0.2,
    infill: 20,
    printSpeed: 50,
    supports: false,
    bedAdhesion: 'skirt',
    slicingConfirmed: false,
    slicerScreenshotDataUrl: null,
    printSuccessful: false,
    score: 0,
  });
  const [simulating, setSimulating] = useState(false);
  const [simulationResultText, setSimulationResultText] = useState("");

  const updateAttempt = <K extends keyof MissionAttempt,>(key: K, value: MissionAttempt[K]) => {
    setAttempt(prev => ({ ...prev, [key]: value }));
  };

  const updateIdeation = <K extends keyof IdeationData,>(key: K, value: IdeationData[K]) => {
    setAttempt(prev => ({
      ...prev,
      ideation: {
        ...prev.ideation,
        [key]: value
      }
    }));
  };

  const handleFileUpload = (file: File | null | undefined, callback: (dataUrl: string) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        callback(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files?.[0], (dataUrl) => updateIdeation('sketchDataUrl', dataUrl));
  };
  
  const handleSlicerScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files?.[0], (dataUrl) => updateAttempt('slicerScreenshotDataUrl', dataUrl));
  };


  const calculateScore = useCallback(() => {
    let baseScore = 100; // Mission completion
    let feedback = "";
    
    // Material bonus
    if (attempt.material === mission.optimalMaterial) {
      baseScore += 30;
    } else {
      feedback += "El material elegido podría no ser el óptimo para este diseño. ";
    }
  
    // Parameter optimization bonus
    let paramScore = 0;
    if (attempt.infill > 15 && attempt.infill < 40) paramScore += 5;
    if (attempt.layerHeight <= 0.2) paramScore += 5;
    if (attempt.printSpeed > 40 && attempt.printSpeed < 70) paramScore += 10;
    baseScore += paramScore;
    
    const isFirstTimeCompleting = !userProgress.completedMissions.some(m => m.missionId === mission.id);

    // Determine success
    const success = attempt.infill >= 15 && attempt.material.length > 0;
    
    if (success) {
      if (isFirstTimeCompleting) {
        baseScore += 50; // First completion bonus
      }
      feedback = "¡Análisis completado! Tu modelo está listo para fabricación.";
    } else {
      baseScore = 0; // Fail
      feedback += "Análisis fallido. El modelo es demasiado débil debido al bajo relleno y no es apto para fabricación.";
    }

    setSimulationResultText(feedback);
    updateAttempt('printSuccessful', success);
    updateAttempt('score', baseScore);
    
    if (success) {
        onComplete(mission.id, baseScore);
    }
  }, [attempt.material, attempt.infill, attempt.layerHeight, attempt.printSpeed, mission.optimalMaterial, mission.id, onComplete, userProgress.completedMissions]);


  const handleSimulation = () => {
    setSimulating(true);
    setSimulationResultText("Analizando viabilidad del modelo...");
    setTimeout(() => {
      calculateScore();
      setSimulating(false);
      setCurrentStep('result');
    }, 3000);
  };
  
  const handleNextStep = () => {
      const currentIndex = STEPS.indexOf(currentStep);
      if (currentIndex < STEPS.length - 1) {
          setCurrentStep(STEPS[currentIndex + 1]);
      }
  };
  
  const handlePrevStep = () => {
      const currentIndex = STEPS.indexOf(currentStep);
      if (currentIndex > 0) {
          setCurrentStep(STEPS[currentIndex - 1]);
      }
  };

  const StepTitle: React.FC<{icon: string, text: string}> = ({ icon, text }) => (
    <div className="flex items-center gap-4 mb-4">
      <div className="text-cyan-400" dangerouslySetInnerHTML={{ __html: icon }} />
      <h2 className="text-3xl font-orbitron text-cyan-400">{text}</h2>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'briefing':
        return (
          <div>
            <StepTitle icon={`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`} text="DESCRIPCIÓN DEL PROYECTO" />
            <p className="text-lg mb-4">{mission.briefing}</p>
            <h3 className="text-xl font-bold mb-2">Desafío:</h3>
            <p className="mb-4">{mission.problem}</p>
            <h3 className="text-xl font-bold mb-2">Requisitos del Diseño:</h3>
            <ul className="list-disc list-inside space-y-1 text-cyan-200">
              {mission.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>
        );
      case 'ideation':
        return (
          <div>
            <StepTitle icon={`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>`} text="FASE 1: IDEACIÓN Y BOCETO" />
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold mb-2">Análisis del Usuario: ¿A quién va dirigido el proyecto?</label>
                <textarea 
                  value={attempt.ideation.userAnalysis}
                  onChange={(e) => updateIdeation('userAnalysis', e.target.value)}
                  placeholder="Describe las necesidades y características del usuario final..."
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2">Análisis del Contexto: ¿En qué lugares y situaciones se puede implementar?</label>
                <textarea
                  value={attempt.ideation.contextAnalysis}
                  onChange={(e) => updateIdeation('contextAnalysis', e.target.value)}
                  placeholder="Piensa en el entorno, la durabilidad necesaria, la facilidad de uso..."
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
               <div>
                <label className="block text-lg font-bold mb-2">Mi Idea: Escribe tu propuesta</label>
                <textarea
                  value={attempt.ideation.ideaDescription}
                  onChange={(e) => updateIdeation('ideaDescription', e.target.value)}
                  placeholder="Describe tu solución. ¿Qué la hace especial? ¿Cómo resuelve el problema?"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md h-28 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-lg font-bold mb-2">Sube un boceto de tu idea:</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleSketchUpload}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-800 file:text-cyan-200 hover:file:bg-cyan-700"
                  />
                </div>
                {attempt.ideation.sketchDataUrl && (
                  <div className="mt-2">
                    <img src={attempt.ideation.sketchDataUrl} alt="Boceto" className="max-h-40 rounded-md border-2 border-cyan-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'design':
        return (
          <div>
            <StepTitle icon={`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`} text="FASE 2: DISEÑO 3D" />
            <p className="mb-4">Usa una herramienta de diseño CAD para crear el modelo 3D. Te recomendamos Tinkercad por su simplicidad.</p>
            <a href="https://www.tinkercad.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition-colors mb-6">Abrir Tinkercad</a>
            <p className="mb-4">Una vez que hayas diseñado tu pieza cumpliendo los requisitos, expórtala como un archivo <code className="bg-gray-700 p-1 rounded text-cyan-300">.STL</code> y súbelo aquí.</p>
            <div className="mt-4">
              <label className="block text-lg font-bold mb-2">Subir archivo STL:</label>
              <input 
                type="file" 
                accept=".stl"
                onChange={(e) => updateAttempt('stlFile', e.target.files ? e.target.files[0] : null)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-800 file:text-cyan-200 hover:file:bg-cyan-700"
              />
              {attempt.stlFile && <p className="mt-2 text-green-400">Archivo cargado: {attempt.stlFile.name}</p>}
            </div>
          </div>
        );
      case 'parameters':
          const availableMaterials = materials.filter(m => userProgress.inventory.includes(m.id));
        return (
          <div>
            <StepTitle icon={`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 animate-spin" style={{ animationDuration: '3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`} text="FASE 3: PARÁMETROS" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-2">Selección de Material</h3>
                    <select value={attempt.material} onChange={(e) => updateAttempt('material', e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
                        {availableMaterials.map(mat => <option key={mat.id} value={mat.id}>{mat.name}</option>)}
                    </select>
                    <div className="mt-2 p-3 bg-gray-800/50 rounded text-sm text-gray-300">
                        <p><strong>Propiedades:</strong> {materials.find(m => m.id === attempt.material)?.properties}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <ParameterSlider label="Altura de Capa" value={attempt.layerHeight} min={0.1} max={0.4} step={0.02} unit="mm" onChange={(v) => updateAttempt('layerHeight', v)} />
                    <ParameterSlider label="Relleno (Infill)" value={attempt.infill} min={0} max={100} step={5} unit="%" onChange={(v) => updateAttempt('infill', v)} />
                    <ParameterSlider label="Velocidad de Impresión" value={attempt.printSpeed} min={20} max={100} step={5} unit="mm/s" onChange={(v) => updateAttempt('printSpeed', v)} />
                </div>
            </div>
          </div>
        );
      case 'slicing':
        return (
          <div className="w-full">
            <StepTitle icon={`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>`} text="FASE 4: LAMINADO (SLICING)" />
            <p className="mb-4">Carga tu archivo STL en el visor de Kiri:Moto. Configura los parámetros para que coincidan con los que elegiste y visualiza las capas. Esto convierte el modelo 3D en instrucciones (g-code) para la impresora.</p>
            <div className="w-full h-[50vh] bg-gray-800 rounded-lg overflow-hidden border-2 border-cyan-700/50 mb-6">
                <iframe
                    src="https://grid.space/kiri/"
                    className="w-full h-full"
                    title="Kiri:Moto Slicer"
                ></iframe>
            </div>
             <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                <div className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-md">
                    <p className="font-bold text-yellow-300 mb-2">¡Importante! Adjunta una captura de pantalla:</p>
                    <p className="text-sm">Usa la herramienta de recortes de tu sistema operativo (Ej: <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Win+Shift+S</kbd> en Windows, <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Cmd+Shift+4</kbd> en Mac) para capturar la vista del laminado en Kiri:Moto y adjúntala a continuación.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label htmlFor="slicer-screenshot" className="flex-shrink-0 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-500 transition-colors cursor-pointer">
                    Adjuntar Captura del Laminado
                  </label>
                  <input id="slicer-screenshot" type="file" accept="image/*" onChange={handleSlicerScreenshotUpload} className="hidden" />
                  {attempt.slicerScreenshotDataUrl && <img src={attempt.slicerScreenshotDataUrl} alt="Previsualización del laminado" className="max-h-24 rounded border-2 border-purple-500" />}
                </div>

                <label className="flex items-center text-lg mt-4">
                    <input 
                        type="checkbox"
                        checked={attempt.slicingConfirmed}
                        onChange={(e) => updateAttempt('slicingConfirmed', e.target.checked)}
                        className="w-5 h-5 mr-3 accent-cyan-500 bg-gray-700 rounded border-gray-600"
                    />
                    He revisado el laminado y estoy listo para el análisis del modelo.
                </label>
             </div>
          </div>
        );
      case 'result':
        return (
          <div className="text-center">
            <StepTitle icon={`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`} text="RESULTADO DEL ANÁLISIS" />
             {simulating ? (
                  <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="mt-4 text-xl">{simulationResultText}</p>
                  </div>
              ) : (
                <div className={`p-6 rounded-lg my-6 border-2 ${attempt.printSuccessful ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'}`}>
                    <h3 className={`text-2xl font-bold mb-2 ${attempt.printSuccessful ? 'text-green-300' : 'text-red-300'}`}>
                        {attempt.printSuccessful ? 'MODELO APTO' : 'MODELO NO APTO'}
                    </h3>
                    <p className="text-lg">{simulationResultText}</p>
                </div>
              )}
            {!simulating && attempt.printSuccessful && (
                <>
                <p className="text-2xl">Puntos de Innovación: <span className="font-bold text-cyan-400">{attempt.score} PI</span></p>
                 <button onClick={() => generateMissionReport(user, mission, attempt)} className="mt-8 bg-purple-600 text-white font-bold py-3 px-6 rounded-md hover:bg-purple-500 transition-colors">
                    Descargar Reporte PDF
                </button>
                </>
            )}
            {!simulating && !attempt.printSuccessful && (
                 <button onClick={() => setCurrentStep('parameters')} className="mt-4 bg-yellow-600 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors">
                    Revisar Parámetros
                </button>
            )}
          </div>
        );
    }
  };
  
  const isNextDisabled = () => {
      if (currentStep === 'ideation') {
        return !attempt.ideation.userAnalysis.trim() || !attempt.ideation.contextAnalysis.trim() || !attempt.ideation.ideaDescription.trim() || !attempt.ideation.sketchDataUrl;
      }
      if (currentStep === 'design' && !attempt.stlFile) return true;
      if (currentStep === 'slicing' && (!attempt.slicingConfirmed || !attempt.slicerScreenshotDataUrl)) return true;
      if (simulating || currentStep === 'result') return true;
      return false;
  }

  return (
    <div className="bg-black bg-opacity-70 p-8 rounded-lg border-2 border-cyan-800/50 relative">
      <button onClick={onExit} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
      <h1 className="text-4xl font-orbitron mb-6 text-center">{mission.title}</h1>
      
      <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((STEPS.indexOf(currentStep) + 1) / STEPS.length) * 100}%` }}></div>
          </div>
      </div>

      <div className="min-h-[300px] flex items-center justify-center">
        {renderStepContent()}
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t-2 border-gray-700/50">
          <button onClick={handlePrevStep} disabled={currentStep === 'briefing' || simulating} className="bg-gray-600 text-white font-bold py-2 px-5 rounded-md hover:bg-gray-500 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors">
              Anterior
          </button>
          
          {currentStep === 'result' ? (
              <button onClick={onExit} className="bg-green-600 text-white font-bold py-2 px-5 rounded-md hover:bg-green-500 transition-colors">
                  Volver al Dashboard
              </button>
          ) : (
             <button 
                onClick={currentStep === 'slicing' ? handleSimulation : handleNextStep} 
                disabled={isNextDisabled()} 
                className="bg-cyan-700 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors">
                {currentStep === 'slicing' ? 'Analizar Modelo' : 'Siguiente'}
              </button>
          )}

      </div>
    </div>
  );
};

export default MissionView;