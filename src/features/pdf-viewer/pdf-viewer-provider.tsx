import { PropsWithChildren, useMemo, useState } from 'react';
import { WebViewerInstance } from '@pdftron/webviewer';

import { WebViewerContext } from './pdf-viewer-context';

export function PdfViewerProvider({ children }: Readonly<PropsWithChildren>) {
  const [instance, setInstance] = useState<WebViewerInstance | undefined>(
    undefined
  );

  const value = useMemo(
    () => ({ instance, setInstance }),
    [instance, setInstance]
  );

  return (
    <WebViewerContext.Provider value={value}>
      {children}
    </WebViewerContext.Provider>
  );
}
