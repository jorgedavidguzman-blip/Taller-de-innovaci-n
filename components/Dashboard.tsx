import React from 'react';
import type { User, UserProgress, Mission } from '../types';
import { missions } from '../data/missions';
import MissionCard from './MissionCard';

interface DashboardProps {
  user: User;
  progress: UserProgress;
  onSelectMission: (missionId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, onSelectMission }) => {
  const completedMissionIds = new Set(progress.completedMissions.map(m => m.missionId));

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-orbitron mb-2">Taller de Innovación - Dashboard</h1>
      <p className="text-lg text-gray-400 mb-8">Bienvenido de nuevo, {user.username}. Tus ideas pueden marcar la diferencia.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-800/50 flex justify-between items-center">
            <div>
              <h3 className="font-orbitron text-cyan-400 text-lg">Puntos de Innovación (PI)</h3>
              <p className="text-4xl font-bold">{progress.xp}</p>
            </div>
            <div className="pulse-glow text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M17 3l-1.17.585A10.014 10.014 0 0012 5.25c-1.83 0-3.535-.5-5-1.33L4 5m14 0l-1.17-.585A10.014 10.014 0 0012 2.75c-1.83 0-3.535.5-5 1.33L4 5" /></svg>
            </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-800/50 flex justify-between items-center">
            <div>
              <h3 className="font-orbitron text-cyan-400 text-lg">Proyectos Completados</h3>
              <p className="text-4xl font-bold">{progress.completedMissions.length} / {missions.length}</p>
            </div>
            <div className="pulse-glow text-cyan-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-800/50 flex justify-between items-center">
            <div>
              <h3 className="font-orbitron text-cyan-400 text-lg">Inventario de Materiales</h3>
              <p className="text-2xl font-semibold">{progress.inventory.join(', ')}</p>
            </div>
             <div className="pulse-glow text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-orbitron mb-4">Proyectos Disponibles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {missions.map(mission => (
            <MissionCard 
              key={mission.id} 
              mission={mission}
              isCompleted={completedMissionIds.has(mission.id)}
              onSelect={() => onSelectMission(mission.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;