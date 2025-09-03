import React, { useState, useMemo } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import MissionView from './components/MissionView';
import { useUserData } from './hooks/useUserData';
import type { Mission, User } from './types';
import { missions as allMissions } from './data/missions';
import Header from './components/Header';

type View = 'onboarding' | 'dashboard' | 'mission';

const App: React.FC = () => {
  const { user, progress, login, completeMission } = useUserData();
  const [currentView, setCurrentView] = useState<View>(user ? 'dashboard' : 'onboarding');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    login(userData);
    setCurrentView('dashboard');
  };

  const handleSelectMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    setCurrentView('mission');
  };

  const handleExitMission = () => {
    setSelectedMissionId(null);
    setCurrentView('dashboard');
  };
  
  const selectedMission = useMemo(
    () => allMissions.find(m => m.id === selectedMissionId),
    [selectedMissionId]
  );

  const renderContent = () => {
    switch (currentView) {
      case 'onboarding':
        return <Onboarding onLogin={handleLogin} />;
      case 'dashboard':
        return user && <Dashboard user={user} progress={progress} onSelectMission={handleSelectMission} />;
      case 'mission':
        return selectedMission && user && (
          <MissionView 
            user={user}
            mission={selectedMission} 
            onExit={handleExitMission} 
            onComplete={completeMission}
            userProgress={progress}
          />
        );
      default:
        return <Onboarding onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-blue-900 text-cyan-100">
      <div className="min-h-screen bg-black bg-opacity-60 backdrop-blur-sm">
        {user && currentView !== 'onboarding' && <Header user={user} progress={progress} />}
        <main className="container mx-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;