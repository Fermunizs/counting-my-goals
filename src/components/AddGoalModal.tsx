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
import { Plus } from 'lucide-react';

const EMOJI_OPTIONS = ['📚', '🎧', '🏃', '💪', '🎯', '✍️', '🎬', '🎮', '🧘', '💰', '🌱', '📱'];

interface AddGoalModalProps {
  onAdd: (name: string, target: number, emoji: string) => void;
}

export function AddGoalModal({ onAdd }: AddGoalModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const targetNum = parseInt(target, 10);
    
    if (trimmedName && targetNum > 0 && targetNum <= 10000) {
      onAdd(trimmedName, targetNum, selectedEmoji);
      setName('');
      setTarget('');
      setSelectedEmoji('🎯');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-xl gap-2 font-semibold">
          <Plus className="h-5 w-5" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Nova Meta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="emoji">Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da meta</Label>
            <Input
              id="name"
              placeholder="Ex: Ouvir podcasts"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Objetivo (quantidade)</Label>
            <Input
              id="target"
              type="number"
              placeholder="Ex: 30"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              min={1}
              max={10000}
              required
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl font-semibold">
            Criar Meta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
