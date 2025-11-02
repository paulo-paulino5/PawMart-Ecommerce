import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ProductRxjsService } from '../services/product-rxjs.service';
import { Product, ProductCategory, Cart } from '../models/product.model';

/**
 * Example component demonstrating RxJS concepts
 * 
 * Key RxJS Patterns Demonstrated:
 * 1. Observable subscription
 * 2. Async pipe for automatic subscription management
 * 3. Multiple subscriptions with proper cleanup
 * 4. Event-driven programming
 */
@Component({
  selector: 'app-rxjs-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rxjs-example-container">
      <h1>🔄 RxJS Concepts Demo</h1>
      
      <!-- ============================================ -->
      <!-- OBSERVABLE SUBSCRIPTION Example -->
      <!-- ============================================ -->
      <section class="demo-section">
        <h2>1️⃣ Observable: Products Stream</h2>
        <p class="description">
          Products are loaded from an Observable stream. 
          The component subscribes to get updates automatically.
        </p>
        
        <div class="products-grid">
          <!-- Using Async Pipe - Auto subscription/unsubscription -->
          @for (product of products$ | async; track product.id) {
            <div class="product-card">
              <img [src]="product.image" [alt]="product.name">
              <h3>{{ product.name }}</h3>
              <p class="price">₱{{ product.price }}</p>
              <button (click)="addToCart(product)" class="btn-add">
                Add to Cart
              </button>
            </div>
          }
        </div>
      </section>

      <!-- ============================================ -->
      <!-- OPERATORS: Debounced Search -->
      <!-- ============================================ -->
      <section class="demo-section">
        <h2>2️⃣ Operators: Debounced Search</h2>
        <p class="description">
          Search uses <code>debounceTime</code> and <code>distinctUntilChanged</code> 
          operators to wait 300ms after typing stops before searching.
        </p>
        
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            placeholder="Type to search products..."
            class="search-input">
          
          <div class="search-results">
            <p>Search results: {{ (searchResults$ | async)?.length || 0 }} products</p>
            @for (product of searchResults$ | async; track product.id) {
              <div class="search-result-item">
                {{ product.name }} - ₱{{ product.price }}
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- PURITY: State Isolation with Scan -->
      <!-- ============================================ -->
      <section class="demo-section">
        <h2>3️⃣ Purity: Isolated State with Scan Operator</h2>
        <p class="description">
          Click count is managed with <code>scan</code> operator. 
          State is isolated and pure - no external variables modified.
        </p>
        
        <div class="click-counter">
          <p>Add to Cart Clicks: <strong>{{ addToCartClickCount }}</strong></p>
          <p class="hint">Try adding products - clicks are throttled to max 1 per second</p>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- FLOW: Cart with Reactive Updates -->
      <!-- ============================================ -->
      <section class="demo-section">
        <h2>4️⃣ Flow: Reactive Cart Updates</h2>
        <p class="description">
          Cart uses observables with <code>map</code> operator to derive 
          item count and total automatically when cart changes.
        </p>
        
        <div class="cart-summary">
          <div class="cart-stat">
            <span class="label">Items:</span>
            <span class="value">{{ cartItemCount$ | async }}</span>
          </div>
          <div class="cart-stat">
            <span class="label">Total:</span>
            <span class="value">₱{{ (cartTotal$ | async)?.toFixed(2) }}</span>
          </div>
          
          <div class="cart-items">
            @for (item of (cart$ | async)?.items; track item.product.id) {
              <div class="cart-item">
                <span>{{ item.product.name }}</span>
                <span>x{{ item.quantity }}</span>
                <span>₱{{ (item.product.price * item.quantity).toFixed(2) }}</span>
                <button (click)="removeFromCart(item.product.id)" class="btn-remove">
                  Remove
                </button>
              </div>
            }
          </div>
          
          @if ((cartItemCount$ | async) === 0) {
            <p class="empty-cart">Cart is empty</p>
          }
          
          <button (click)="clearCart()" class="btn-clear" 
            [disabled]="(cartItemCount$ | async) === 0">
            Clear Cart
          </button>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SUBJECT: Multiple Observers -->
      <!-- ============================================ -->
      <section class="demo-section">
        <h2>5️⃣ Subject: Multicasting to Multiple Observers</h2>
        <p class="description">
          The cart observable (BehaviorSubject) multicasts to multiple 
          subscribers. Changes notify all components automatically.
        </p>
        
        <div class="observer-demo">
          <div class="observer">
            <h4>Observer 1: Cart Count</h4>
            <p>Items: {{ cartItemCount$ | async }}</p>
          </div>
          <div class="observer">
            <h4>Observer 2: Cart Total</h4>
            <p>Total: ₱{{ (cartTotal$ | async)?.toFixed(2) }}</p>
          </div>
          <div class="observer">
            <h4>Observer 3: Cart Changes</h4>
            <p>Modified: {{ cartChangeCount }} times</p>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SUBSCRIPTION MANAGEMENT -->
      <!-- ============================================ -->
      <section class="demo-section">
        <h2>6️⃣ Subscription: Proper Cleanup</h2>
        <p class="description">
          All manual subscriptions are tracked and unsubscribed in 
          <code>ngOnDestroy</code> to prevent memory leaks.
        </p>
        
        <div class="subscription-info">
          <p>Active subscriptions: {{ subscriptions.length }}</p>
          <p class="hint">
            When component is destroyed, all subscriptions are automatically cleaned up
          </p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .rxjs-example-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h1 {
      text-align: center;
      color: #667eea;
      margin-bottom: 3rem;
      font-size: 2.5rem;
    }

    .demo-section {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .demo-section h2 {
      color: #333;
      margin-bottom: 1rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 0.5rem;
    }

    .description {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      color: #555;
    }

    .description code {
      background: #e9ecef;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #667eea;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 1rem;
      text-align: center;
      transition: transform 0.3s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .product-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .product-card h3 {
      font-size: 0.9rem;
      margin: 0.5rem 0;
      color: #333;
    }

    .price {
      color: #667eea;
      font-weight: bold;
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .btn-add {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-add:hover {
      background: #5568d3;
    }

    /* Search Box */
    .search-box {
      margin-top: 1rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-results {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }

    .search-result-item {
      padding: 0.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    /* Click Counter */
    .click-counter {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
    }

    .click-counter strong {
      font-size: 2rem;
      display: block;
      margin: 0.5rem 0;
    }

    .hint {
      font-size: 0.9rem;
      opacity: 0.8;
      font-style: italic;
    }

    /* Cart Summary */
    .cart-summary {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
    }

    .cart-stat {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 1.1rem;
    }

    .cart-stat .label {
      font-weight: 600;
      color: #666;
    }

    .cart-stat .value {
      font-weight: bold;
      color: #667eea;
    }

    .cart-items {
      margin: 1rem 0;
      max-height: 300px;
      overflow-y: auto;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .btn-remove {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .btn-remove:hover {
      background: #c82333;
    }

    .empty-cart {
      text-align: center;
      color: #999;
      padding: 2rem;
    }

    .btn-clear {
      width: 100%;
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-clear:hover:not(:disabled) {
      background: #ee5a52;
    }

    .btn-clear:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Observer Demo */
    .observer-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .observer {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
    }

    .observer h4 {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .observer p {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }

    /* Subscription Info */
    .subscription-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
    }

    .subscription-info p {
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }
  `]
})
export class RxjsExampleComponent implements OnInit, OnDestroy {
  // ============================================
  // RXJS: Observables from service
  // ============================================
  products$!: Observable<Product[]>;
  cart$!: Observable<Cart>;
  cartItemCount$!: Observable<number>;
  cartTotal$!: Observable<number>;
  searchResults$!: Observable<Product[]>;

  // Component state
  searchQuery = '';
  addToCartClickCount = 0;
  cartChangeCount = 0;

  // ============================================
  // RXJS: Subscription management
  // ============================================
  subscriptions: Subscription[] = [];

  constructor(private productService: ProductRxjsService) {
    // Initialize observables in constructor
    this.products$ = this.productService.products$;
    this.cart$ = this.productService.cart$;
    this.cartItemCount$ = this.productService.cartItemCount$;
    this.cartTotal$ = this.productService.cartTotal$;
    this.searchResults$ = this.productService.searchResults$;
  }

  ngOnInit(): void {
    // Subscribe to add to cart clicks
    const clicksSub = this.productService.addToCartClicks$.subscribe(
      count => this.addToCartClickCount = count
    );
    this.subscriptions.push(clicksSub);

    // Subscribe to cart changes tracking
    const cartTrackSub = this.productService.trackCartChanges().subscribe(
      changes => this.cartChangeCount = changes
    );
    this.subscriptions.push(cartTrackSub);

    console.log('RxJS Example Component initialized with', this.subscriptions.length, 'subscriptions');
  }

  // ============================================
  // RXJS: Cleanup subscriptions to prevent memory leaks
  // ============================================
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('All subscriptions cleaned up');
  }

  // ============================================
  // Component methods
  // ============================================
  onSearchInput(): void {
    this.productService.search(this.searchQuery);
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
  }

  clearCart(): void {
    this.productService.clearCart();
  }
}
