import { useGoals } from '@/hooks/useGoals';
import { Trophy, Target, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

const Stats = () => {
  const { goals } = useGoals();

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.current >= g.target).length;
  const inProgressGoals = goals.filter((g) => g.current > 0 && g.current < g.target).length;
  const notStartedGoals = goals.filter((g) => g.current === 0).length;
  const totalProgress = goals.length > 0
    ? goals.reduce((acc, g) => acc + Math.min((g.current / g.target) * 100, 100), 0) / goals.length
    : 0;

  const stats = [
    {
      icon: Target,
      label: 'Total de Metas',
      value: totalGoals,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'Concluídas',
      value: completedGoals,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Em Progresso',
      value: inProgressGoals,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: Clock,
      label: 'Não Iniciadas',
      value: notStartedGoals,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
    },
  ];

  return (
    <div className="min-h-screen animated-gradient-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Estatísticas</h1>
          <p className="text-muted-foreground text-sm">
            Veja seu desempenho geral
          </p>
        </header>

        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Progresso Geral</h2>
            <span className="text-3xl font-bold text-primary">{totalProgress.toFixed(0)}%</span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-4"
            >
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {goals.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Metas por Status</h2>
            <div className="space-y-3">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const isComplete = goal.current >= goal.target;
                
                return (
                  <div key={goal.id} className="flex items-center gap-3">
                    <span className="text-xl">{goal.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{goal.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>
                    {isComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
