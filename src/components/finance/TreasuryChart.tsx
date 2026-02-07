import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TreasuryItem } from '@/hooks/useMarketData';

interface TreasuryChartProps {
  items: (TreasuryItem & { yieldValue?: number })[];
}

function parseYield(yieldStr: string): number {
  const match = yieldStr.match(/(\d+[.,]?\d*)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

export function TreasuryChart({ items }: TreasuryChartProps) {
  const chartData = items.map((item) => ({
    name: item.name.replace('Tesouro ', '').substring(0, 12),
    fullName: item.name,
    yield: item.yieldValue ?? parseYield(item.yield),
    type: item.type,
  }));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-semibold text-foreground text-sm mb-4">📊 Rentabilidade dos Títulos (%)</h4>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value}%`, 'Rentabilidade']}
              labelFormatter={(label: string, payload: any[]) =>
                payload?.[0]?.payload?.fullName || label
              }
            />
            <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
