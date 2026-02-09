import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Trash2, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinanceChat } from '@/hooks/useFinanceChat';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import ReactMarkdown from 'react-markdown';

export function FinanceChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const { messages, isLoading, sendMessage, clearChat } = useFinanceChat();
  const {
    isListening, isSpeaking, transcript,
    supportsRecognition, supportsSynthesis,
    startListening, stopListening, speak, stopSpeaking,
  } = useVoiceChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMsgCountRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Update input with live transcript
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Auto-speak new assistant messages
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    if (messages.length > lastMsgCountRef.current && !isLoading) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        speak(last.content);
      }
    }
    lastMsgCountRef.current = messages.length;
  }, [messages, isLoading, autoSpeak, speak]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInput('');
        sendMessage(text);
      });
    }
  };

  const suggestions = [
    'O que é Tesouro Direto?',
    'Como começar a investir?',
    'O que são FIIs?',
    'Dicas para economizar',
  ];

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          aria-label="Abrir chat financeiro"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm h-[28rem] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-primary/5">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">FinBot</h3>
              <p className="text-xs text-muted-foreground">
                {isListening ? '🎙️ Ouvindo...' : isSpeaking ? '🔊 Falando...' : 'Seu assistente financeiro'}
              </p>
            </div>
            {supportsSynthesis && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${autoSpeak ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => { setAutoSpeak(!autoSpeak); if (isSpeaking) stopSpeaking(); }}
                title={autoSpeak ? 'Desativar voz' : 'Ativar voz automática'}
              >
                {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => { clearChat(); stopSpeaking(); }} title="Limpar conversa">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => { setIsOpen(false); stopSpeaking(); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <Bot className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Olá! Sou o FinBot 🤖<br />Pergunte-me sobre finanças!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted/60 text-foreground rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                  {msg.role === 'assistant' && supportsSynthesis && !isLoading && (
                    <button
                      onClick={() => speak(msg.content)}
                      className="mt-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      title="Ouvir resposta"
                    >
                      🔊 Ouvir
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-background">
            <div className="flex items-center gap-2">
              {supportsRecognition && (
                <Button
                  variant={isListening ? 'default' : 'ghost'}
                  size="icon"
                  className={`h-10 w-10 rounded-xl shrink-0 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''}`}
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  title={isListening ? 'Parar de ouvir' : 'Falar'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Ouvindo...' : 'Pergunte sobre finanças...'}
                className="flex-1 h-10 px-4 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="h-10 w-10 rounded-xl shrink-0"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1.5">
              ⚠️ Informações educacionais. Consulte um profissional para investir.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
