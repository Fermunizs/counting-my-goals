import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, ChevronDown, ChevronUp, Sparkles, PiggyBank, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type TipType = 'savings' | 'investments';

interface FinanceTipsProps {
  type: TipType;
  context?: {
    targetAmount?: number;
    dailyGoal?: number;
    progress?: number;
  };
}

export function FinanceTips({ type, context }: FinanceTipsProps) {
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
      const { data, error: fnError } = await supabase.functions.invoke('generate-finance-tips', {
        body: {
          type,
          context,
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
      console.error('Error generating finance tips:', err);
      setError('Não foi possível gerar as dicas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const config = {
    savings: {
      icon: PiggyBank,
      title: 'Dicas para Economizar',
      buttonText: 'Gerar dicas de economia com IA',
    },
    investments: {
      icon: TrendingUp,
      title: 'Melhores Investimentos Hoje',
      buttonText: 'Gerar dicas de investimento com IA',
    },
  };

  const { icon: Icon, title, buttonText } = config[type];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      <Button
        variant="secondary"
        className="w-full justify-between"
        onClick={generateTips}
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="h-4 w-4" />
          )}
          <span>{tips.length > 0 ? title : buttonText}</span>
        </div>
        {tips.length > 0 && (
          isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {error && (
        <p className="text-destructive text-sm mt-2">{error}</p>
      )}

      {isExpanded && tips.length > 0 && (
        <div className="mt-4 space-y-3">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 rounded-xl bg-secondary/50 text-sm"
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
