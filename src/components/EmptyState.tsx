import { Target } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Target className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Nenhuma meta ainda
      </h3>
      <p className="text-muted-foreground max-w-sm">
        Comece criando sua primeira meta anual e acompanhe seu progresso ao longo do tempo.
      </p>
    </div>
  );
}
