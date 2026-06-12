import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FileDropzone from '../components/FileDropzone';
import StatusBadge from '../components/StatusBadge';
import UploadProgress from '../components/UploadProgress';
import Alert from '../components/ui/Alert';
import PageHeader from '../components/ui/PageHeader';
import { processDocument, uploadDocument } from '../services/api';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState('idle');
  const [documentId, setDocumentId] = useState('');
  const [error, setError] = useState('');
  const progressTimerRef = useRef(null);

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  useEffect(() => () => clearProgressTimer(), []);

  const startProcessingProgress = () => {
    clearProgressTimer();
    setActiveStep(1);
    setOverallProgress(28);

    progressTimerRef.current = setInterval(() => {
      setOverallProgress((current) => (current >= 92 ? current : current + 1));
    }, 450);
  };

  useEffect(() => {
    if (status !== 'processing') {
      return;
    }

    if (overallProgress >= 38 && activeStep < 2) {
      setActiveStep(2);
    }
    if (overallProgress >= 52 && activeStep < 3) {
      setActiveStep(3);
    }
    if (overallProgress >= 68 && activeStep < 4) {
      setActiveStep(4);
    }
  }, [overallProgress, activeStep, status]);

  const resetProgress = () => {
    clearProgressTimer();
    setUploadProgress(0);
    setOverallProgress(0);
    setActiveStep(0);
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setError('');
    resetProgress();
    setStatus('selected');
    setDocumentId('');

    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    try {
      setStatus('uploading');
      setError('');
      setActiveStep(0);
      setOverallProgress(0);

      const uploadResult = await uploadDocument(selectedFile, (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
          setOverallProgress(Math.max(8, Math.round(percent * 0.25)));
        }
      });

      setDocumentId(uploadResult.document_id);
      setUploadProgress(100);
      setOverallProgress(25);
      setStatus('processing');
      startProcessingProgress();

      await processDocument(uploadResult.document_id);

      clearProgressTimer();
      setActiveStep(4);
      setOverallProgress(100);
      setStatus('completed');
    } catch (err) {
      clearProgressTimer();
      setStatus('failed');
      setError(err.response?.data?.detail || 'Upload or processing failed.');
    }
  };

  const isBusy = status === 'uploading' || status === 'processing';
  const showProgress = ['uploading', 'processing', 'completed', 'failed'].includes(status);

  return (
    <div className="page-shell">
      <PageHeader
        title="Upload"
        description="Add contracts or scanned images. Text will be extracted, indexed, and made searchable."
      />

      <FileDropzone onFileSelected={handleFileSelected} disabled={isBusy} />

      {selectedFile && (
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-base font-medium text-ink">{selectedFile.name}</p>
              <p className="mt-1 text-sm text-ink-secondary">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <StatusBadge status={status === 'selected' ? 'uploaded' : status} />
          </div>

          {showProgress && (
            <UploadProgress
              status={status}
              activeStep={activeStep}
              overallProgress={overallProgress}
            />
          )}

          {previewUrl && !isBusy && status !== 'completed' && (
            <div className="mt-5 rounded-xl border border-line bg-surface-subtle p-4">
              <img src={previewUrl} alt="Preview" className="mx-auto max-h-72 object-contain" />
            </div>
          )}

          {status === 'selected' && (
            <div className="mt-6">
              <button type="button" onClick={handleUpload} className="btn-primary">
                Upload and process
              </button>
            </div>
          )}

          {status === 'completed' && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/documents" className="btn-primary">
                View documents
              </Link>
              <Link to="/chat" className="btn-secondary">
                Open assistant
              </Link>
              {documentId && (
                <Link to={`/documents/${documentId}`} className="btn-secondary">
                  View details
                </Link>
              )}
            </div>
          )}

          {status === 'failed' && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setStatus('selected');
                  resetProgress();
                }}
                className="btn-secondary"
              >
                Try again
              </button>
            </div>
          )}

          {documentId && status !== 'selected' && (
            <p className="mt-4 text-xs text-ink-muted">Document ID: {documentId}</p>
          )}

          {error && (
            <div className="mt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload;
