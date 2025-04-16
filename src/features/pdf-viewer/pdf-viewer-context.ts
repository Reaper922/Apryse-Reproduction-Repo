import { WebViewerInstance } from '@pdftron/webviewer';
import { createContext } from 'react';

type WebViewerContextType = {
  instance: WebViewerInstance | undefined;
  setInstance: React.Dispatch<
    React.SetStateAction<WebViewerInstance | undefined>
  >;
};

export const WebViewerContext = createContext<WebViewerContextType | undefined>(
  undefined
);
