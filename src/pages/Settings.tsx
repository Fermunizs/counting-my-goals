import { ThemeToggle } from '@/components/ThemeToggle';
import { Palette, Info, Heart } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen animated-gradient-bg">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Ajustes</h1>
          <p className="text-muted-foreground text-sm">
            Personalize sua experiência
          </p>
        </header>

        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Tema</h3>
                  <p className="text-sm text-muted-foreground">Alternar entre claro e escuro</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Info className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Sobre</h3>
                <p className="text-sm text-muted-foreground">Minhas Metas v1.0</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Heart className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Feito com amor</h3>
                <p className="text-sm text-muted-foreground">Para ajudar você a alcançar seus objetivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
