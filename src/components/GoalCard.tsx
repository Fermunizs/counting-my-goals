import { useState } from 'react';
import { Goal } from '@/types/goal';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import { GoalTips } from '@/components/GoalTips';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const progress = (goal.current / goal.target) * 100;
  const isComplete = goal.current >= goal.target;

  const handleUpdate = (delta: number) => {
    setIsAnimating(true);
    onUpdate(goal.id, delta);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isComplete ? 'ring-2 ring-primary progress-glow' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.emoji}</span>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{goal.name}</h3>
            <p className="text-muted-foreground text-sm">
              Meta: {goal.target}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(goal.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-4xl font-bold transition-all ${isAnimating ? 'animate-count' : ''} ${isComplete ? 'text-primary' : 'text-foreground'}`}>
            {goal.current}
          </span>
          {isComplete && (
            <div className="flex items-center gap-1 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium text-sm">Concluído!</span>
            </div>
          )}
        </div>
        
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <p className="text-right text-sm text-muted-foreground mt-1">
          {progress.toFixed(0)}%
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-xl"
          onClick={() => handleUpdate(-1)}
          disabled={goal.current <= 0}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          variant="default"
          className="flex-1 h-12 rounded-xl text-lg font-semibold"
          onClick={() => handleUpdate(1)}
          disabled={isComplete}
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar
        </Button>
      </div>

      <GoalTips goal={goal} />
    </div>
  );
}
