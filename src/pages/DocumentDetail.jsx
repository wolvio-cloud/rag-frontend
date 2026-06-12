import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/ui/Alert';
import PageHeader from '../components/ui/PageHeader';
import { deleteDocument, getDocument } from '../services/api';
import { getOriginalFileUrl, getUniformPdfUrl, hasUniformPdf } from '../utils/document';

function DocumentDetail() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDocument(documentId);
        setDocument(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load document.');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this document and its indexed content?')) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      await deleteDocument(documentId);
      navigate('/documents');
    } catch (err) {
      setError(err.response?.data?.detail || 'Delete failed.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card px-6 py-16 text-center text-sm text-ink-secondary">Loading document...</div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="page-shell">
        <Alert variant="error">{error}</Alert>
        <Link to="/documents" className="btn-secondary mt-4 inline-flex">
          Back to documents
        </Link>
      </div>
    );
  }

  const uniformUrl = getUniformPdfUrl(document);
  const originalUrl = getOriginalFileUrl(document);

  return (
    <div className="page-shell">
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary transition hover:text-ink"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3.75 12l6.75-7.5M3.75 12h16.5" />
        </svg>
        Back to documents
      </Link>

      <PageHeader
        title={document.file_name}
        description={`Uploaded ${new Date(document.created_at).toLocaleString()} · ${document.file_type.toUpperCase()}`}
        action={
          <div className="flex flex-wrap gap-2">
            <a href={uniformUrl} target="_blank" rel="noreferrer" className="btn-primary">
              {hasUniformPdf(document) ? 'Download uniform PDF' : 'View file'}
            </a>
            {hasUniformPdf(document) && (
              <a href={originalUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                View original
              </a>
            )}
            <button type="button" onClick={handleDelete} disabled={deleting} className="btn-secondary text-red-600 hover:bg-red-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="card p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Status</p>
            <div className="mt-2">
              <StatusBadge status={document.status} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Original type</p>
            <p className="mt-2 text-sm text-ink">{document.file_type}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Uniform PDF</p>
            <p className="mt-2 text-sm text-ink">{document.uniform_pdf_name || 'Not generated yet'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Document ID</p>
            <p className="mt-2 break-all text-sm text-ink-secondary">{document.id}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-ink">Extracted text</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Text extracted from the standardized PDF for search and AI assistant responses.
        </p>
        <pre className="mt-4 max-h-[560px] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-surface-subtle p-5 text-sm leading-relaxed text-ink-secondary">
          {document.extracted_text || 'No extracted text available yet.'}
        </pre>
      </div>
    </div>
  );
}

export default DocumentDetail;
