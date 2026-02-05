import { SavingsTrail } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, RotateCcw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsTrailCardProps {
  trail: SavingsTrail;
  totalSaved: number;
  progress: number;
  onToggleDay: (dayId: string) => void;
  onReset: () => void;
}

export function SavingsTrailCard({
  trail,
  totalSaved,
  progress,
  onToggleDay,
  onReset,
}: SavingsTrailCardProps) {
  const completedDays = trail.savings.filter((s) => s.completed).length;
  const currentDay = completedDays + 1;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-xl text-foreground">{trail.name}</h3>
          <p className="text-muted-foreground text-sm">
            Meta: R$ {trail.targetAmount.toLocaleString('pt-BR')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onReset} className="text-muted-foreground hover:text-destructive">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-semibold text-primary">
            R$ {totalSaved.toLocaleString('pt-BR')} / R$ {trail.targetAmount.toLocaleString('pt-BR')}
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="text-right text-xs text-muted-foreground">{progress.toFixed(0)}%</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Trilha Diária (R$ {trail.dailyGoal}/dia)</span>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {trail.savings.slice(0, 35).map((saving) => (
            <button
              key={saving.id}
              onClick={() => onToggleDay(saving.id)}
              className={cn(
                'aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all',
                saving.completed
                  ? 'bg-primary text-primary-foreground'
                  : saving.day === currentDay
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              )}
            >
              {saving.completed ? <Check className="h-3 w-3" /> : saving.day}
            </button>
          ))}
        </div>
        
        {trail.savings.length > 35 && (
          <p className="text-xs text-muted-foreground text-center">
            +{trail.savings.length - 35} dias restantes
          </p>
        )}
      </div>

      <div className="bg-secondary/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">Dia {currentDay > trail.daysTotal ? trail.daysTotal : currentDay}</p>
        <p className="text-2xl font-bold text-foreground">
          {completedDays}/{trail.daysTotal} dias
        </p>
      </div>
    </div>
  );
}
