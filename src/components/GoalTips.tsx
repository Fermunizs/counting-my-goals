import { useState } from 'react';
import { Goal } from '@/types/goal';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoalTipsProps {
  goal: Goal;
}

export function GoalTips({ goal }: GoalTipsProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTips = async () => {
    if (tips.length > 0) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-goal-tips', {
        body: {
          goalName: goal.name,
          goalEmoji: goal.emoji,
          goalTarget: goal.target,
          goalCurrent: goal.current,
        },
      });

      if (fnError) throw fnError;

      if (data?.tips && Array.isArray(data.tips)) {
        setTips(data.tips);
        setIsExpanded(true);
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (err) {
      console.error('Error generating tips:', err);
      setError('Não foi possível gerar as dicas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-muted-foreground hover:text-foreground"
        onClick={generateTips}
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="h-4 w-4" />
          )}
          <span>{tips.length > 0 ? 'Dicas para atingir a meta' : 'Gerar dicas com IA'}</span>
        </div>
        {tips.length > 0 && (
          isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {error && (
        <p className="text-destructive text-sm mt-2 px-2">{error}</p>
      )}

      {isExpanded && tips.length > 0 && (
        <div className="mt-3 space-y-2">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex gap-2 p-3 rounded-lg bg-secondary/50 text-sm"
            >
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-foreground/90">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
