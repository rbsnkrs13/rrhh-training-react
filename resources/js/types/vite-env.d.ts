/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    // Añadir más variables de entorno según necesites
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
}
