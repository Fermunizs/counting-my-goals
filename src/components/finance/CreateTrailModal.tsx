import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Target } from 'lucide-react';

interface CreateTrailModalProps {
  onCreateTrail: (name: string, targetAmount: number, days: number) => void;
}

export function CreateTrailModal({ onCreateTrail }: CreateTrailModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [days, setDays] = useState('30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || !days) return;
    
    onCreateTrail(name.trim(), Number(targetAmount), Number(days));
    setName('');
    setTargetAmount('');
    setDays('30');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl text-lg font-semibold gap-2">
          <Plus className="h-5 w-5" />
          Criar Trilha de Economia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Nova Trilha de Economia
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do objetivo</Label>
            <Input
              id="name"
              placeholder="Ex: Viagem, Reserva de emergência..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Valor total (R$)</Label>
            <Input
              id="target"
              type="number"
              min="1"
              placeholder="1000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days">Quantidade de dias</Label>
            <Input
              id="days"
              type="number"
              min="7"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
            {targetAmount && days && (
              <p className="text-sm text-muted-foreground">
                Meta diária: R$ {Math.ceil(Number(targetAmount) / Number(days)).toFixed(2)}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim() || !targetAmount || !days}>
            Criar Trilha
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
