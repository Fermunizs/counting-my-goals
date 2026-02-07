import { useMarketData, FIIItem } from '@/hooks/useMarketData';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Building2, Lightbulb } from 'lucide-react';
import { FIIsChart } from './FIIsChart';

export function FIIsPanel() {
  const { data, isLoading, error, fetchData } = useMarketData<FIIItem>('fiis');

  if (!data && !isLoading && !error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-2">Fundos Imobiliários</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Explore os FIIs em destaque no mercado
        </p>
        <Button onClick={fetchData} className="rounded-xl gap-2">
          <Building2 className="h-4 w-4" />
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
          <p className="text-muted-foreground text-sm">Analisando FIIs...</p>
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
              <h3 className="font-semibold text-foreground text-lg">Fundos Imobiliários</h3>
              <Button variant="ghost" size="icon" onClick={fetchData} className="text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{data.summary}</p>
          </div>

          <FIIsChart items={data.items} />

          <div className="space-y-3">
            {data.items.map((fii, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-foreground">{fii.ticker}</span>
                    <span className="text-muted-foreground text-sm ml-2">{fii.name}</span>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    DY: {fii.dividendYield}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Segmento: {fii.segment}</p>
                <p className="text-sm text-foreground/80">{fii.analysis}</p>
              </div>
            ))}
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
