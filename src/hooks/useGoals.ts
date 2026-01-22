import { useState, useEffect } from 'react';
import { Goal } from '@/types/goal';

const STORAGE_KEY = 'goal-tracker-goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (name: string, target: number, emoji: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      target,
      current: 0,
      emoji,
      createdAt: new Date(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateProgress = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, current: Math.max(0, Math.min(goal.target, goal.current + delta)) }
          : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  return { goals, addGoal, updateProgress, deleteGoal };
}
