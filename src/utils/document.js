export function getUniformPdfUrl(document) {
  return document?.uniform_pdf_url || document?.file_url || '';
}

export function getOriginalFileUrl(document) {
  return document?.file_url || '';
}

export function hasUniformPdf(document) {
  return Boolean(document?.uniform_pdf_url);
}
