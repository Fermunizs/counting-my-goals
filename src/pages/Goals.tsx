import { useGoals } from '@/hooks/useGoals';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalModal } from '@/components/AddGoalModal';
import { EmptyState } from '@/components/EmptyState';

const Goals = () => {
  const { goals, addGoal, updateProgress, deleteGoal } = useGoals();

  return (
    <div className="min-h-screen animated-gradient-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Todas as Metas</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie suas metas e acompanhe o progresso
          </p>
        </header>

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

export default Goals;
