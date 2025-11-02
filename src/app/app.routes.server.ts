import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'products',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'cart',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sign-in',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sign-up',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'orders',
    renderMode: RenderMode.Server // Dynamic route should not be prerendered
  },
  {
    path: 'orders/**',
    renderMode: RenderMode.Server // Dynamic route should not be prerendered
  },
  {
    path: '**',
    renderMode: RenderMode.Server // Catch-all for all other routes
  }
];
