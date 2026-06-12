const STEPS = [
  { key: 'upload', label: 'Upload file', mobileLabel: 'Upload', description: 'Sending document to storage' },
  { key: 'standardize', label: 'Standardize PDF', mobileLabel: 'PDF', description: 'Converting to uniform PDF format' },
  { key: 'extract', label: 'Extract text', mobileLabel: 'Extract', description: 'Running OCR and PDF parsing' },
  { key: 'embed', label: 'Generate embeddings', mobileLabel: 'Embed', description: 'Creating searchable vectors' },
  { key: 'index', label: 'Index document', mobileLabel: 'Index', description: 'Saving to knowledge base' },
];

function StepIndicator({ index, isComplete, isActive, isFailed }) {
  return (
    <div
      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
        isComplete
          ? 'bg-emerald-600 text-white'
          : isFailed
            ? 'bg-red-500 text-white'
            : isActive
              ? 'border-2 border-accent bg-surface text-accent shadow-sm'
              : 'border border-line bg-surface text-ink-muted'
      }`}
    >
      {isComplete ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ) : isActive ? (
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
      ) : (
        index + 1
      )}
    </div>
  );
}

function UploadProgress({ status, activeStep, overallProgress }) {
  const currentIndex =
    {
      idle: -1,
      selected: -1,
      uploading: 0,
      processing: activeStep,
      completed: STEPS.length,
      failed: activeStep,
    }[status] ?? -1;

  const statusTitle =
    status === 'completed'
      ? 'Processing complete'
      : status === 'failed'
        ? 'Processing failed'
        : 'Processing document';

  const statusDescription =
    status === 'uploading'
      ? 'Uploading your file securely...'
      : status === 'processing'
        ? STEPS[activeStep]?.description
        : status === 'completed'
          ? 'Your document is ready for search and chat.'
          : 'Something went wrong during processing.';

  return (
    <div className="mt-6 rounded-xl border border-line bg-surface-subtle/50 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">{statusTitle}</p>
          <p className="mt-1 text-xs text-ink-muted">{statusDescription}</p>
        </div>
        {(status === 'uploading' || status === 'processing') && (
          <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold tabular-nums text-ink ring-1 ring-line">
            {overallProgress}%
          </span>
        )}
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            status === 'failed' ? 'bg-red-500' : status === 'completed' ? 'bg-emerald-600' : 'bg-accent'
          }`}
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="overflow-x-auto">
        <ol className="flex min-w-[560px] items-start">
          {STEPS.map((step, index) => {
            const isComplete = currentIndex > index || status === 'completed';
            const isActive = currentIndex === index && status !== 'completed' && status !== 'failed';
            const isFailed = status === 'failed' && currentIndex === index;
            const lineComplete = currentIndex > index || status === 'completed';

            return (
              <li key={step.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      index === 0 ? 'bg-transparent' : lineComplete ? 'bg-emerald-600' : 'bg-line'
                    }`}
                  />
                  <StepIndicator
                    index={index}
                    isComplete={isComplete}
                    isActive={isActive}
                    isFailed={isFailed}
                  />
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      index === STEPS.length - 1
                        ? 'bg-transparent'
                        : lineComplete
                          ? 'bg-emerald-600'
                          : 'bg-line'
                    }`}
                  />
                </div>

                <div className="mt-3 px-2 text-center">
                  <p
                    className={`text-xs font-medium sm:text-sm ${
                      isComplete || isActive ? 'text-ink' : 'text-ink-muted'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.mobileLabel}</span>
                  </p>
                  {isActive && <p className="mt-1 text-[11px] text-ink-secondary">In progress</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default UploadProgress;
