import { PdfViewerProvider } from './features/pdf-viewer/pdf-viewer-provider';
import PdfViewer from './features/pdf-viewer/pdf-viewer';

function App() {
  return (
    <PdfViewerProvider>
      <PdfViewer />
    </PdfViewerProvider>
  );
}

export default App;
