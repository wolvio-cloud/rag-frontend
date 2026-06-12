import { useEffect, useRef, useState } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatThinking from '../components/ChatThinking';
import Alert from '../components/ui/Alert';
import PageHeader from '../components/ui/PageHeader';
import { useChatHistory } from '../hooks/useChatHistory';
import { sendChatMessage } from '../services/api';

const SUGGESTIONS = [
  'What are the payment terms?',
  'Who are the parties in this contract?',
  'What is the contract duration?',
];

function Chat() {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (event, presetQuestion) => {
    event?.preventDefault();
    const trimmedQuestion = (presetQuestion || question).trim();
    if (!trimmedQuestion || loading) {
      return;
    }

    setError('');
    setLoading(true);
    addMessage({ role: 'user', content: trimmedQuestion });
    setQuestion('');

    try {
      const response = await sendChatMessage(trimmedQuestion);
      addMessage({
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get a response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Assistant"
        description="Ask natural language questions about your uploaded contracts. Answers include source references."
        action={
          <button type="button" onClick={clearHistory} disabled={loading} className="btn-secondary">
            Clear history
          </button>
        }
      />

      <div className="card flex h-[calc(100vh-280px)] min-h-[520px] flex-col overflow-hidden">
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-ink-secondary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <h3 className="mt-5 text-base font-medium text-ink">How can I help?</h3>
              <p className="mt-2 max-w-md text-sm text-ink-secondary">
                Ask about clauses, dates, obligations, or payment terms from your indexed documents.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={(event) => handleSubmit(event, suggestion)}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-xs text-ink-secondary transition hover:border-zinc-300 hover:text-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {loading && <ChatThinking />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-line bg-surface-subtle/40 p-4 sm:p-5">
          {error && (
            <div className="mb-3">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={loading ? 'Assistant is thinking...' : 'Ask a question about your contracts...'}
              disabled={loading}
              className="input-field"
            />
            <button type="submit" disabled={loading || !question.trim()} className="btn-primary min-w-[108px]">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Wait
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
