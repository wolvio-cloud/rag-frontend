const statusConfig = {
  uploaded: { label: 'Ready', className: 'bg-zinc-100 text-zinc-700 ring-zinc-200' },
  uploading: { label: 'Uploading', className: 'bg-blue-50 text-blue-800 ring-blue-200' },
  processing: { label: 'Processing', className: 'bg-amber-50 text-amber-800 ring-amber-200' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700 ring-red-200' },
  idle: { label: 'Ready', className: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
  selected: { label: 'Ready', className: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.uploaded;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;
