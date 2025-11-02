import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-page">
      <div class="container">
        <h1>Shopping Cart</h1>
        
        @if (cartItems().length === 0) {
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart to get started!</p>
            <button class="continue-shopping-btn" (click)="continueShopping()">
              Continue Shopping
            </button>
          </div>
        } @else {
          <div class="cart-content">
            <div class="cart-items">
              @for (item of cartItems(); track item.product.id) {
                <div class="cart-item">
                  <div class="item-image">
                    <img [src]="item.product.image" [alt]="item.product.name" />
                  </div>
                  <div class="item-details">
                    <h3>{{ item.product.name }}</h3>
                    <p class="item-description">{{ item.product.description }}</p>
                    <div class="item-price">₱{{ item.product.price }}</div>
                  </div>
                  <div class="quantity-controls">
                    <button 
                      class="quantity-btn" 
                      (click)="decreaseQuantity(item.product.id)"
                      [disabled]="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button 
                      class="quantity-btn" 
                      (click)="increaseQuantity(item.product.id)"
                    >
                      +
                    </button>
                  </div>
                  <div class="item-total">
                    ₱{{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                  <button 
                    class="remove-btn" 
                    (click)="removeItem(item.product.id)"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              }
            </div>

            <div class="cart-summary">
              <div class="summary-card">
                <h3>Order Summary</h3>
                <div class="summary-row">
                  <span>Subtotal ({{ totalItems() }} items):</span>
                  <span>₱{{ cartTotal().toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping:</span>
                  <span>{{ cartTotal() >= 1000 ? 'FREE' : '₱100' }}</span>
                </div>
                <div class="summary-row">
                  <span>Tax:</span>
                  <span>₱{{ (cartTotal() * 0.08).toFixed(2) }}</span>
                </div>
                <hr>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>₱{{ finalTotal().toFixed(2) }}</span>
                </div>
                
                @if (cartTotal() < 1000) {
                  <div class="shipping-notice">
                    Add ₱{{ (1000 - cartTotal()).toFixed(2) }} more for free shipping!
                  </div>
                }

                <button class="checkout-btn" (click)="proceedToCheckout()">
                  Proceed to Checkout
                </button>
                
                <button class="continue-shopping-btn" (click)="continueShopping()">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      padding: 2rem 0;
      min-height: 100vh;
      background: transparent;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    h1 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #333;
    }

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .empty-cart-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-cart h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .empty-cart p {
      color: #666;
      margin-bottom: 2rem;
    }

    /* Cart Content */
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: 80px 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
    }

    .item-image {
      width: 80px;
      height: 80px;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .item-description {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .item-price {
      font-weight: 600;
      color: #667eea;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      border-radius: 20px;
      padding: 0.25rem;
    }

    .quantity-btn {
      background: #fff;
      border: 1px solid #e1e8ed;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .quantity-btn:hover:not(:disabled) {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }

    .item-total {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }

    .remove-btn {
      background: #ff6b6b;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .remove-btn:hover {
      background: #ff5252;
      transform: scale(1.1);
    }

    /* Cart Summary */
    .summary-card {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 2rem;
    }

    .summary-card h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .summary-row.total {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
    }

    hr {
      border: none;
      border-top: 1px solid #e1e8ed;
      margin: 1rem 0;
    }

    .shipping-notice {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
      margin: 1rem 0;
    }

    .checkout-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      width: 100%;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .checkout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .continue-shopping-btn {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }

    .continue-shopping-btn:hover {
      background: #667eea;
      color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 60px 1fr;
        gap: 1rem;
      }

      .item-image {
        width: 60px;
        height: 60px;
      }

      .quantity-controls {
        grid-column: 1 / -1;
        justify-self: center;
        margin-top: 0.5rem;
      }

      .item-total {
        grid-column: 1 / -1;
        text-align: center;
        margin-top: 0.5rem;
      }

      .remove-btn {
        grid-column: 1 / -1;
        justify-self: center;
        margin-top: 0.5rem;
      }

      h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CartComponent {
  cartItems = computed(() => this.productService.getCart().items);
  cartTotal = computed(() => this.productService.getCart().total);
  totalItems = computed(() => this.productService.getCartItemCount());
  
  finalTotal = computed(() => {
    const subtotal = this.cartTotal();
    const shipping = subtotal >= 1000 ? 0 : 100;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  });

  constructor(private productService: ProductService, private router: Router) {}

  increaseQuantity(productId: number) {
    const item = this.cartItems().find(item => item.product.id === productId);
    if (item) {
      this.productService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartItems().find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      this.productService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: number) {
    this.productService.removeFromCart(productId);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}