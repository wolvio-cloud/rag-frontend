import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { getUniformPdfUrl, hasUniformPdf } from '../utils/document';

function DocumentTable({ documents, onDelete, loadingId }) {
  if (!documents.length) {
    return null;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-line bg-surface-subtle/60">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Document</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Uploaded</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {documents.map((document) => (
              <tr key={document.id} className="transition hover:bg-surface-subtle/40">
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-ink">{document.file_name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{document.file_type.toUpperCase()}</p>
                </td>
                <td className="px-5 py-4 text-sm text-ink-secondary">
                  {new Date(document.created_at).toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={document.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link to={`/documents/${document.id}`} className="btn-ghost">
                      View
                    </Link>
                    <a
                      href={getUniformPdfUrl(document)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost"
                    >
                      {hasUniformPdf(document) ? 'View PDF' : 'View original'}
                    </a>
                    <button
                      type="button"
                      disabled={loadingId === document.id}
                      onClick={() => onDelete(document.id)}
                      className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentTable;
