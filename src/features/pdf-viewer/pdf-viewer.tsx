import { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/webviewer';
import { usePdfViewerInstance } from '@/features/pdf-viewer/pdf-viewer-hook';

function PdfViewer() {
  const path = '/lib/webviewer';
  const licenseKey =
    'demo:1744730630292:610dc9bb0300000000aa0ed34588c67b5ce278a20f9109a9f8b0e1c37b';
  const initialDoc =
    'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';

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
