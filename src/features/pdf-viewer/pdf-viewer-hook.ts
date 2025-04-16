import { useContext } from 'react';
import { WebViewerContext } from './pdf-viewer-context';

export const usePdfViewerInstance = () => {
  const context = useContext(WebViewerContext);

  if (context === undefined) {
    throw new Error(
      'usePdfViewerInstance must be used within a PdfViewerProvider.'
    );
  }

  return context;
};
