import { Goal } from '@/types/goal';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface StatsHeaderProps {
  goals: Goal[];
}

export function StatsHeader({ goals }: StatsHeaderProps) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.current >= g.target).length;
  const totalProgress = goals.length > 0
    ? goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length
    : 0;

  const stats = [
    {
      icon: Target,
      label: 'Metas',
      value: totalGoals,
    },
    {
      icon: Trophy,
      label: 'Concluídas',
      value: completedGoals,
    },
    {
      icon: TrendingUp,
      label: 'Progresso',
      value: `${totalProgress.toFixed(0)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-xl p-4 text-center"
        >
          <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
