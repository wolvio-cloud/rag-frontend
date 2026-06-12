import { useCallback, useState } from 'react';

const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

function FileDropzone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const maxSize = 100 * 1024 * 1024;

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return 'Unsupported format. Please upload PDF, JPG, JPEG, or PNG.';
    }

    if (file.size > maxSize) {
      return 'File exceeds the 100 MB limit.';
    }

    return '';
  };

  const handleFile = useCallback(
    (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`card relative overflow-hidden p-10 text-center transition ${
        isDragging ? 'border-zinc-400 bg-surface-subtle' : ''
      } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-ink-secondary">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <h3 className="mt-5 text-base font-medium text-ink">Drop your contract here</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
        PDF, scanned PDF, JPG, JPEG, or PNG up to 100 MB
      </p>

      <label className="btn-primary mt-8 cursor-pointer">
        Choose file
        <input
          type="file"
          className="hidden"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              handleFile(file);
            }
          }}
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default FileDropzone;
