import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StockItem {
  ticker: string;
  company: string;
  sector: string;
  analysis: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface TreasuryItem {
  name: string;
  type: string;
  yield: string;
  maturity: string;
  recommendation: string;
}

export interface FIIItem {
  ticker: string;
  name: string;
  segment: string;
  dividendYield: string;
  analysis: string;
}

export interface MarketData<T> {
  summary: string;
  items: T[];
  tip: string;
  indexTrend?: string;
  selicRate?: string;
}

type Category = 'stocks' | 'treasury' | 'fiis';

export function useMarketData<T>(category: Category) {
  const [data, setData] = useState<MarketData<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('generate-market-info', {
        body: { category },
      });

      if (fnError) throw fnError;
      if (!result || !result.items) throw new Error('Formato inválido');

      setData(result as MarketData<T>);
    } catch (err) {
      console.error(`Error fetching ${category} data:`, err);
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  return { data, isLoading, error, fetchData };
}
