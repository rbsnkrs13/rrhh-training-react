// Tipos específicos para Inertia.js

import { PageProps as BasePageProps } from '@inertiajs/core';
import { PageProps as AppPageProps } from './index';

declare module '@inertiajs/core' {
  interface PageProps extends AppPageProps {}
}

declare module '@inertiajs/react' {
  interface PageProps extends AppPageProps {}
}