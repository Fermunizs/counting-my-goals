import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FIIItem } from '@/hooks/useMarketData';

interface FIIsChartProps {
  items: (FIIItem & { yieldValue?: number })[];
}

function parseDY(dyStr: string): number {
  const match = dyStr.match(/(\d+[.,]?\d*)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

const SEGMENT_COLORS = [
  'hsl(var(--primary))',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(262, 83%, 58%)',
  'hsl(0, 84%, 60%)',
];

export function FIIsChart({ items }: FIIsChartProps) {
  const barData = items.map((item) => ({
    name: item.ticker,
    dy: item.yieldValue ?? parseDY(item.dividendYield),
    segment: item.segment,
  }));

  // Group by segment for pie chart
  const segmentMap = new Map<string, number>();
  items.forEach((item) => {
    segmentMap.set(item.segment, (segmentMap.get(item.segment) || 0) + 1);
  });
  const pieData = Array.from(segmentMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-semibold text-foreground text-sm mb-4">📊 Dividend Yield dos FIIs (%)</h4>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
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
                formatter={(value: number) => [`${value}%`, 'Dividend Yield']}
              />
              <Bar dataKey="dy" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {pieData.length > 1 && (
        <div className="glass-card rounded-2xl p-5">
          <h4 className="font-semibold text-foreground text-sm mb-4">🏢 Distribuição por Segmento</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
