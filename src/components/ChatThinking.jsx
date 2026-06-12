import { useEffect, useState } from 'react';

const THINKING_STEPS = [
  'Searching your contracts...',
  'Finding relevant sections...',
  'Analyzing context...',
  'Preparing response...',
];

function ChatThinking() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => (current + 1) % THINKING_STEPS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="mr-8 max-w-md">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">Assistant</p>
        <div className="rounded-2xl border border-line bg-surface px-4 py-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-subtle">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Thinking</p>
              <p className="text-xs text-ink-secondary">{THINKING_STEPS[stepIndex]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatThinking;
