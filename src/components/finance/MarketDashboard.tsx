import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Landmark, Building2 } from 'lucide-react';
import { StocksPanel } from './StocksPanel';
import { TreasuryPanel } from './TreasuryPanel';
import { FIIsPanel } from './FIIsPanel';

export function MarketDashboard() {
  const [activeTab, setActiveTab] = useState('stocks');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg text-foreground">Dashboard Financeiro</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl">
          <TabsTrigger value="stocks" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4" />
            Bolsa
          </TabsTrigger>
          <TabsTrigger value="treasury" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <Landmark className="h-4 w-4" />
            Tesouro
          </TabsTrigger>
          <TabsTrigger value="fiis" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <Building2 className="h-4 w-4" />
            FIIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stocks" className="mt-4">
          <StocksPanel />
        </TabsContent>
        <TabsContent value="treasury" className="mt-4">
          <TreasuryPanel />
        </TabsContent>
        <TabsContent value="fiis" className="mt-4">
          <FIIsPanel />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center italic">
        ⚠️ Informações educacionais geradas por IA. Não constituem recomendação de investimento.
      </p>
    </div>
  );
}
