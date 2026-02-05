import { useState, useEffect } from 'react';
import { SavingsTrail, DailySaving } from '@/types/finance';

const STORAGE_KEY = 'savings-trail-data';

export function useSavingsTrail() {
  const [trail, setTrail] = useState<SavingsTrail | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (trail) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trail));
    }
  }, [trail]);

  const createTrail = (name: string, targetAmount: number, days: number) => {
    const dailyGoal = Math.ceil(targetAmount / days);
    const savings: DailySaving[] = Array.from({ length: days }, (_, i) => ({
      id: crypto.randomUUID(),
      day: i + 1,
      amount: dailyGoal,
      completed: false,
    }));

    const newTrail: SavingsTrail = {
      id: crypto.randomUUID(),
      name,
      targetAmount,
      dailyGoal,
      daysTotal: days,
      savings,
      createdAt: new Date(),
    };
    setTrail(newTrail);
  };

  const toggleDay = (dayId: string) => {
    if (!trail) return;
    setTrail({
      ...trail,
      savings: trail.savings.map((s) =>
        s.id === dayId
          ? { ...s, completed: !s.completed, completedAt: s.completed ? undefined : new Date() }
          : s
      ),
    });
  };

  const resetTrail = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTrail(null);
  };

  const totalSaved = trail?.savings.filter((s) => s.completed).reduce((acc, s) => acc + s.amount, 0) || 0;
  const progress = trail ? (totalSaved / trail.targetAmount) * 100 : 0;

  return { trail, createTrail, toggleDay, resetTrail, totalSaved, progress };
}
