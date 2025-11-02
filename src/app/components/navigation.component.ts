import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <a routerLink="/home">
            <h1>🐾 PawMart</h1>
            <span>Pet Supplies</span>
          </a>
        </div>
        <div class="nav-links">
          <a routerLink="/home" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/products" class="nav-link" routerLinkActive="active">Products</a>
          @if (isLoggedIn()) {
            <a routerLink="/orders" class="nav-link" routerLinkActive="active">My Orders</a>
          }
          <a routerLink="/about" class="nav-link" routerLinkActive="active">About</a>
          <a routerLink="/contact" class="nav-link" routerLinkActive="active">Contact</a>
          
          <!-- Authentication Links -->
          @if (!isLoggedIn()) {
            <a routerLink="/sign-in" class="nav-link" routerLinkActive="active">Sign In</a>
            <a routerLink="/sign-up" class="nav-link sign-up-btn" routerLinkActive="active">Sign Up</a>
          } @else {
            <div class="user-menu">
              <span class="user-greeting">Hi, {{ currentUser()?.firstName }}!</span>
              <button (click)="onSignOut()" class="sign-out-btn">Sign Out</button>
            </div>
          }
          
          <a routerLink="/cart" class="cart-icon">
            <span>🛒</span>
            @if (cartItemCount() > 0) {
              <span class="cart-count">{{ cartItemCount() }}</span>
            }
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    /* Navigation */
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo a {
      text-decoration: none;
      color: inherit;
    }

    .nav-logo h1 {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0;
    }

    .nav-logo span {
      font-size: 0.9rem;
      opacity: 0.9;
      display: block;
      margin-top: -5px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.3s ease;
      padding: 0.5rem 0;
      border-bottom: 2px solid transparent;
    }

    .nav-link:hover {
      opacity: 0.8;
    }

    .nav-link.active {
      border-bottom-color: white;
    }

    .cart-icon {
      position: relative;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.3s ease;
      text-decoration: none;
      color: white;
    }

    .cart-icon:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff6b6b;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
    }

    /* Authentication Styles */
    .sign-up-btn {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 25px;
      font-weight: 600;
    }

    .sign-up-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-greeting {
      font-weight: 500;
      opacity: 0.9;
    }

    .sign-out-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .sign-out-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class NavigationComponent {
  cartItemCount = computed(() => this.productService.getCartItemCount());
  isLoggedIn = computed(() => this.authService.isLoggedIn()());
  currentUser = computed(() => this.authService.getCurrentUser()());

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  onSignOut(): void {
    this.authService.signOut();
  }
}