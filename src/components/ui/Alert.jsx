function Alert({ variant = 'error', children }) {
  const styles = {
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    info: 'border-line bg-surface-subtle text-ink-secondary',
  };

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}

export default Alert;
