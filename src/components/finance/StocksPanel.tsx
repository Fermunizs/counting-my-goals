import { useMarketData, StockItem } from '@/hooks/useMarketData';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Alta' },
  down: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Baixa' },
  neutral: { icon: Minus, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Neutro' },
};

export function StocksPanel() {
  const { data, isLoading, error, fetchData } = useMarketData<StockItem>('stocks');

  if (!data && !isLoading && !error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <TrendingUp className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-2">Mercado de Ações</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Veja ações em destaque e tendências do mercado
        </p>
        <Button onClick={fetchData} className="rounded-xl gap-2">
          <TrendingUp className="h-4 w-4" />
          Carregar Dados
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Analisando o mercado...</p>
        </div>
      )}

      {error && (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-destructive text-sm mb-3">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchData}>Tentar novamente</Button>
        </div>
      )}

      {data && !isLoading && (
        <>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground text-lg">Ibovespa</h3>
                <div className="flex items-center gap-2 mt-1">
                  {(() => {
                    const t = trendConfig[data.indexTrend as keyof typeof trendConfig] || trendConfig.neutral;
                    const Icon = t.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${t.bg} ${t.color}`}>
                        <Icon className="h-3 w-3" />
                        {t.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={fetchData} className="text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{data.summary}</p>
          </div>

          <div className="space-y-3">
            {data.items.map((stock, i) => {
              const t = trendConfig[stock.trend] || trendConfig.neutral;
              const Icon = t.icon;
              return (
                <div key={i} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-foreground">{stock.ticker}</span>
                      <span className="text-muted-foreground text-sm ml-2">{stock.company}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${t.bg} ${t.color}`}>
                      <Icon className="h-3 w-3" />
                      {t.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Setor: {stock.sector}</p>
                  <p className="text-sm text-foreground/80">{stock.analysis}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-xl p-4 border-l-4 border-primary">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/90">{data.tip}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
