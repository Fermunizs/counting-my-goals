import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StockItem } from '@/hooks/useMarketData';

interface StocksChartProps {
  items: (StockItem & { score?: number })[];
}

const trendColors: Record<string, string> = {
  up: 'hsl(142, 71%, 45%)',
  down: 'hsl(0, 84%, 60%)',
  neutral: 'hsl(220, 9%, 46%)',
};

export function StocksChart({ items }: StocksChartProps) {
  const chartData = items.map((item) => ({
    name: item.ticker,
    score: item.score ?? (item.trend === 'up' ? 80 : item.trend === 'down' ? 30 : 50),
    trend: item.trend,
    sector: item.sector,
  }));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-semibold text-foreground text-sm mb-4">📊 Score das Ações</h4>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, _name: string, props: any) => [
                `${value}/100`,
                `Score (${props.payload.sector})`,
              ]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={trendColors[entry.trend] || trendColors.neutral} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: trendColors.up }} /> Alta</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: trendColors.down }} /> Baixa</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: trendColors.neutral }} /> Neutro</span>
      </div>
    </div>
  );
}
