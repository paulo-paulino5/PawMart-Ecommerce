import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products.component';
import { CartComponent } from './components/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home.component').then(m => m.HomeComponent) },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', loadComponent: () => import('./components/order-history.component').then(m => m.OrderHistoryComponent) },
  { path: 'orders/:orderNumber', loadComponent: () => import('./components/order-details.component').then(m => m.OrderDetailsComponent) },
  { path: 'about', loadComponent: () => import('./components/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact.component').then(m => m.ContactComponent) },
  { path: 'sign-in', loadComponent: () => import('./components/signin.component').then(m => m.SignInComponent) },
  { path: 'sign-up', loadComponent: () => import('./components/signup.component').then(m => m.SignUpComponent) },
  { path: '**', redirectTo: '/home' }
];
