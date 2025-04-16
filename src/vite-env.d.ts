/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APRYSE_LICENSE_KEY: string;
  readonly VITE_APRYSE_INITIAL_DOC: string;
}

declare const __APP_TITLE__: string;
