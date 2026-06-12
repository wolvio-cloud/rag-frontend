import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentTable from '../components/DocumentTable';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { deleteDocument, getDocuments } from '../services/api';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState('');
  const [error, setError] = useState('');

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (documentId) => {
    if (!window.confirm('Delete this document and its indexed content?')) {
      return;
    }

    try {
      setLoadingId(documentId);
      setError('');
      await deleteDocument(documentId);
      await loadDocuments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Delete failed.');
    } finally {
      setLoadingId('');
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Documents"
        description="Review uploaded contracts, inspect extracted text, and manage processing."
        action={
          <button type="button" onClick={loadDocuments} className="btn-secondary">
            Refresh
          </button>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="card px-6 py-16 text-center text-sm text-ink-secondary">Loading documents...</div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Upload your first contract to begin OCR extraction and AI-powered search."
          action={
            <Link to="/upload" className="btn-primary">
              Upload document
            </Link>
          }
        />
      ) : (
        <DocumentTable documents={documents} onDelete={handleDelete} loadingId={loadingId} />
      )}
    </div>
  );
}

export default Documents;
