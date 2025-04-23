import { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/webviewer';
import { usePdfViewerInstance } from '@/features/pdf-viewer/pdf-viewer-hook';

function PdfViewer() {
  const path = '/lib/webviewer';
  const licenseKey = import.meta.env.VITE_APRYSE_LICENSE_KEY;
  const initialDoc = import.meta.env.VITE_APRYSE_INITIAL_DOC;

  const viewer = useRef(null);
  const hasInitialised = useRef(false);
  const { setInstance } = usePdfViewerInstance();

  useEffect(() => {
    // Notwendig für strict mode, da Webviewer sonst doppelt initialisiert!
    if (hasInitialised.current) return;
    hasInitialised.current = true;

    WebViewer(
      {
        path,
        licenseKey,
        initialDoc,
        fullAPI: true,
      },
      viewer.current!
    ).then(async instance => {
      instance.UI.enableFeatures([
        instance.UI.Feature.FilePicker,
        instance.UI.Feature.ContentEdit,
      ]);

      setInstance(instance);
    });
  }, [licenseKey, initialDoc, viewer, setInstance]);

  return <div className="webviewer h-full flex-1 box-border" ref={viewer} />;
}

export default PdfViewer;
