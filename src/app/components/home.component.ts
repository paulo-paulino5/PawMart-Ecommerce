import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Everything Your Pet Needs</h1>
          <p>Premium quality pet supplies for dogs, cats, and small pets!</p>
          <a routerLink="/products" class="cta-button">Shop Now</a>
        </div>
        <div class="hero-image">
          <!-- Pet icons removed -->
        </div>
      </div>
    </section>

    <!-- Quick Access Section for Logged-in Users -->
    @if (isLoggedIn()) {
      <section class="quick-access">
        <div class="quick-access-content">
          <h2>Welcome back, {{ currentUser()?.firstName }}!</h2>
          <div class="quick-actions">
            <a routerLink="/orders" class="quick-action-card">
              <div class="action-icon">📦</div>
              <h3>My Orders</h3>
              <p>Track your orders and view purchase history</p>
            </a>
            <a routerLink="/cart" class="quick-action-card">
              <div class="action-icon">🛒</div>
              <h3>My Cart</h3>
              <p>{{ cartItemCount() || 'No' }} item{{ cartItemCount() === 1 ? '' : 's' }} in cart</p>
            </a>
            <a routerLink="/products" class="quick-action-card">
              <div class="action-icon">🛍️</div>
              <h3>Continue Shopping</h3>
              <p>Discover more products for your pets</p>
            </a>
          </div>
        </div>
      </section>
    }

    <!-- Product Categories -->
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-grid">
        <a routerLink="/products" [queryParams]="{category: 'dog'}" class="category-card">
          <h3>Dog Supplies</h3>
          <p>Food, toys, beds, and accessories for your furry friend</p>
        </a>
        <a routerLink="/products" [queryParams]="{category: 'cat'}" class="category-card">
          <h3>Cat Supplies</h3>
          <p>Everything your feline companion needs to be happy</p>
        </a>
        <a routerLink="/products" [queryParams]="{category: 'small-pets'}" class="category-card">
          <h3>Small Pets</h3>
          <p>Supplies for rabbits, hamsters, guinea pigs, and more</p>
        </a>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-grid">
        @for (product of featuredProducts; track product.id) {
          <div class="product-card">
            <div class="product-image">
              <img [src]="product.image" [alt]="product.name" />
            </div>
            <h3>{{ product.name }}</h3>
            <p class="price">₱{{ product.price }}</p>
            <button class="add-to-cart" (click)="addToCart(product)">Add to Cart</button>
          </div>
        }
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="features">
      <h2>Why Choose PawMart?</h2>
      <div class="features-grid">
        <div class="feature">
          <div class="feature-icon">🚚</div>
          <h3>Free Shipping</h3>
          <p>Free delivery on orders over ₱1,000</p>
        </div>
        <div class="feature">
          <div class="feature-icon">⭐</div>
          <h3>Quality Products</h3>
          <p>Only the best for your beloved pets</p>
        </div>
        <div class="feature">
          <div class="feature-icon">💬</div>
          <h3>Expert Support</h3>
          <p>Pet care advice from our specialists</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🔄</div>
          <h3>Easy Returns</h3>
          <p>30-day hassle-free return policy</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      background-image: url('/background.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      background-repeat: no-repeat;
      padding: 4rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      position: relative;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .hero-content {
      max-width: 1200px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .hero-text h1 {
      font-size: 3rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-text p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pet-emoji {
      font-size: 8rem;
      text-align: center;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Categories Section */
    .categories {
      padding: 4rem 2rem;
      background: transparent;
    }

    .categories h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .category-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .category-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      text-decoration: none;
      color: inherit;
    }

    .category-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .category-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .category-card p {
      color: #666;
      line-height: 1.6;
    }

    /* Quick Access Section */
    .quick-access {
      padding: 3rem 2rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecf3 100%);
    }

    .quick-access-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .quick-access h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .quick-action-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .quick-action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .quick-action-card h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }

    .quick-action-card p {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* Featured Products */
    .featured-products {
      padding: 4rem 2rem;
      background-image: url('/background3.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      background-repeat: no-repeat;
      position: relative;
    }

    .featured-products::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      z-index: 1;
    }

    .featured-products h2,
    .featured-products .product-grid {
      position: relative;
      z-index: 2;
    }

    .featured-products h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .product-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      width: 100%;
      height: 200px;
      margin-bottom: 1rem;
      overflow: hidden;
      border-radius: 10px;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .product-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .add-to-cart {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      width: 100%;
    }

    .add-to-cart:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    /* Features Section */
    .features {
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: white;
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature {
      text-align: center;
      padding: 2rem;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: white;
    }

    .feature p {
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-text h1 {
        font-size: 2rem;
      }

      .pet-emoji {
        font-size: 5rem;
      }

      .categories h2,
      .featured-products h2,
      .features h2 {
        font-size: 2rem;
      }

      .category-grid,
      .product-grid,
      .features-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .quick-action-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class HomeComponent {
  featuredProducts: any[] = [];
  cartItemCount = computed(() => this.productService.getCartItemCount());
  isLoggedIn = computed(() => this.authService.isLoggedIn()());
  currentUser = computed(() => this.authService.getCurrentUser()());

  constructor(private productService: ProductService, private authService: AuthService) {
    this.featuredProducts = this.productService.getProducts().slice(0, 4);
  }

  addToCart(product: any) {
    this.productService.addToCart(product);
  }
}