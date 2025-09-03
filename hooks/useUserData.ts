import { useState, useEffect, useCallback } from 'react';
import type { User, UserProgress, MissionCompletion } from '../types';

const USER_KEY = 'prototypia_user';
const PROGRESS_KEY = 'prototypia_progress';

const initialProgress: UserProgress = {
  completedMissions: [],
  xp: 0,
  inventory: ['PLA', 'ABS', 'PETG'],
};

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    return savedProgress ? JSON.parse(savedProgress) : initialProgress;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const login = (userData: User) => {
    setUser(userData);
    // Reset progress for new login in this simple setup
    setProgress(initialProgress);
  };

  const logout = () => {
    setUser(null);
    setProgress(initialProgress);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROGRESS_KEY);
  };

  const completeMission = useCallback((missionId: string, score: number) => {
    setProgress(prevProgress => {
      const newCompletion: MissionCompletion = { missionId, score, timestamp: Date.now() };
      
      const missionAlreadyCompleted = prevProgress.completedMissions.find(m => m.missionId === missionId);

      // If mission was already completed, update score only if new score is higher
      if (missionAlreadyCompleted) {
        if (score > missionAlreadyCompleted.score) {
          const xpGained = score - missionAlreadyCompleted.score;
          return {
            ...prevProgress,
            xp: prevProgress.xp + xpGained,
            completedMissions: prevProgress.completedMissions.map(m => 
              m.missionId === missionId ? { ...m, score } : m
            )
          };
        }
        return prevProgress; // No change if score is not higher
      } else {
        // First time completion
        const xpGained = score;
        return {
          ...prevProgress,
          xp: prevProgress.xp + xpGained,
          completedMissions: [...prevProgress.completedMissions, newCompletion],
        };
      }
    });
  }, []);

  return { user, progress, login, logout, completeMission };
};