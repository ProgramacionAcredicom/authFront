/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HOST_AUTH_DEV: string
    readonly VITE_APLICATIVO_ID: number
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}