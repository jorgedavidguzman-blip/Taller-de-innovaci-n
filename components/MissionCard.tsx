import React from 'react';
import type { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  isCompleted: boolean;
  onSelect: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isCompleted, onSelect }) => {
  return (
    <div className={`bg-black bg-opacity-60 p-6 rounded-lg border-2 ${isCompleted ? 'border-green-500/70' : 'border-cyan-700/70'} flex flex-col justify-between transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:-translate-y-1`}>
      <div>
        <div className="flex justify-between items-start">
            <h3 className="text-2xl font-orbitron mb-2 pr-4">{mission.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: mission.icon }} />
        </div>
        <p className="text-gray-400 mb-4 h-24 overflow-hidden">{mission.briefing}</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold text-lg text-cyan-400">{mission.xp} PI</span>
        <button 
          onClick={onSelect}
          className="bg-cyan-700 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 transition-colors"
        >
          {isCompleted ? 'Revisar' : 'Comenzar'}
        </button>
      </div>
    </div>
  );
};

export default MissionCard;