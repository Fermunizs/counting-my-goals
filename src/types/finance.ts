export interface DailySaving {
  id: string;
  day: number;
  amount: number;
  completed: boolean;
  completedAt?: Date;
}

export interface SavingsTrail {
  id: string;
  name: string;
  targetAmount: number;
  dailyGoal: number;
  daysTotal: number;
  savings: DailySaving[];
  createdAt: Date;
}
