import { Wallet, Target } from 'lucide-react';
import { useSavingsTrail } from '@/hooks/useSavingsTrail';
import { CreateTrailModal } from '@/components/finance/CreateTrailModal';
import { SavingsTrailCard } from '@/components/finance/SavingsTrailCard';
import { FinanceTips } from '@/components/finance/FinanceTips';
import { MarketDashboard } from '@/components/finance/MarketDashboard';
import { FinanceChatAgent } from '@/components/finance/FinanceChatAgent';

export default function Finance() {
  const { trail, createTrail, toggleDay, resetTrail, totalSaved, progress } = useSavingsTrail();

  return (
    <div className="min-h-screen animated-gradient-bg pb-24">
      <div className="max-w-lg mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Finanças</h1>
          <p className="text-muted-foreground">
            Trilha de economia e dicas financeiras personalizadas
          </p>
        </header>

        <div className="space-y-6">
          {/* Market Dashboard */}
          <section>
            <MarketDashboard />
          </section>

          {/* Savings Trail Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Trilha de Economia</h2>
            </div>

            {trail ? (
              <SavingsTrailCard
                trail={trail}
                totalSaved={totalSaved}
                progress={progress}
                onToggleDay={toggleDay}
                onReset={resetTrail}
              />
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Crie sua trilha de economia
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Defina um objetivo financeiro e acompanhe seu progresso diário
                </p>
                <CreateTrailModal onCreateTrail={createTrail} />
              </div>
            )}
          </section>

          {/* Finance Tips Section */}
          <section className="space-y-4">
            <FinanceTips
              type="savings"
              context={trail ? {
                targetAmount: trail.targetAmount,
                dailyGoal: trail.dailyGoal,
                progress,
              } : undefined}
            />

            <FinanceTips
              type="investments"
              context={trail ? {
                targetAmount: trail.targetAmount,
                progress,
              } : undefined}
            />
          </section>
        </div>

        <FinanceChatAgent />
      </div>
    </div>
  );
}
