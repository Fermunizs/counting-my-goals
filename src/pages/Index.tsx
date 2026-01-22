import { useGoals } from '@/hooks/useGoals';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalModal } from '@/components/AddGoalModal';
import { EmptyState } from '@/components/EmptyState';
import { StatsHeader } from '@/components/StatsHeader';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const { goals, addGoal, updateProgress, deleteGoal } = useGoals();

  return (
    <div className="min-h-screen animated-gradient-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            2025
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Minhas Metas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e conquiste seus objetivos
          </p>
        </header>

        {goals.length > 0 && <StatsHeader goals={goals} />}

        <div className="flex justify-end mb-6">
          <AddGoalModal onAdd={addGoal} />
        </div>

        {goals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={updateProgress}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
