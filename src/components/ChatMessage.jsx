import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatMessage({ message, onFollowupClick }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isUser ? 'ml-8' : 'mr-8'}`}>
        {!isUser && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">Assistant</p>
        )}

        <div
          className={`rounded-2xl px-4 py-3.5 ${
            isUser
              ? 'bg-accent text-white'
              : 'border border-line bg-surface text-ink shadow-card'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-table:table-auto prose-th:border prose-th:border-line prose-th:bg-surface prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-line prose-td:px-4 prose-td:py-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}

          {!isUser && message.sources?.length > 0 && (
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Sources</p>
              <ul className="mt-2 space-y-1.5">
                {message.sources.map((source, index) => (
                  <li key={`${source.document_name}-${source.page}-${index}`} className="text-xs text-ink-secondary">
                    {source.document_name}
                    {source.page ? ` · Page ${source.page}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isUser && message.followup_questions?.length > 0 && (
            <div className="mt-4 border-t border-line pt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">Follow-up Questions</p>
              <div className="flex flex-wrap gap-2">
                {message.followup_questions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => onFollowupClick && onFollowupClick(q)}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-secondary transition hover:border-zinc-300 hover:text-ink text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
