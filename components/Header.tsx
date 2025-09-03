import React from 'react';
import type { User, UserProgress } from '../types';

interface HeaderProps {
  user: User;
  progress: UserProgress;
}

const Header: React.FC<HeaderProps> = ({ user, progress }) => {
  const rank = progress.xp < 500 ? 'Aprendiz' : progress.xp < 1500 ? 'Diseñador/a' : 'Innovador/a';

  return (
    <header className="bg-black bg-opacity-30 backdrop-blur-md p-4 border-b-2 border-cyan-500/30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-orbitron text-xl md:text-2xl text-cyan-400 tracking-widest">
          MISIÓN UR STEAM
        </div>
        <div className="flex items-center space-x-4 md:space-x-6 text-right">
          <div>
            <div className="text-sm text-gray-400 font-bold">{rank}</div>
            <div className="text-lg text-white font-semibold">{user.username}</div>
          </div>
          <div className="bg-cyan-900/50 border border-cyan-700 rounded-md px-4 py-1">
            <div className="text-xs text-cyan-300 font-orbitron">XP</div>
            <div className="text-lg font-bold text-white">{progress.xp}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;