import { Component, computed, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { 
  Order, 
  OrderItem, 
  ShippingAddress, 
  PaymentMethod, 
  EWalletProvider, 
  PaymentStatus, 
  OrderStatus 
} from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <div class="checkout-header">
        <h1>Checkout</h1>
        <div class="progress-steps">
          <div class="step" [class.active]="currentStep() === 1">
            <span class="step-number">1</span>
            <span class="step-label">Shipping</span>
          </div>
          <div class="step" [class.active]="currentStep() === 2">
            <span class="step-number">2</span>
            <span class="step-label">Payment</span>
          </div>
          <div class="step" [class.active]="currentStep() === 3">
            <span class="step-number">3</span>
            <span class="step-label">Confirmation</span>
          </div>
        </div>
      </div>

      <!-- Step 1: Shipping Information -->
      <div class="checkout-section" *ngIf="currentStep() === 1">
        <h2>Shipping Information</h2>
        <form class="shipping-form">
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input 
                type="text" 
                id="fullName" 
                [(ngModel)]="shippingAddress.fullName"
                name="fullName"
                required>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input 
                type="tel" 
                id="phone" 
                [(ngModel)]="shippingAddress.phone"
                name="phone"
                required>
            </div>
          </div>

          <div class="form-group">
            <label for="address1">Address Line 1 *</label>
            <input 
              type="text" 
              id="address1" 
              [(ngModel)]="shippingAddress.addressLine1"
              name="address1"
              placeholder="Street address, P.O. box, company name"
              required>
          </div>

          <div class="form-group">
            <label for="address2">Address Line 2 (Optional)</label>
            <input 
              type="text" 
              id="address2" 
              [(ngModel)]="shippingAddress.addressLine2"
              name="address2"
              placeholder="Apartment, suite, unit, building, floor, etc.">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">City *</label>
              <input 
                type="text" 
                id="city" 
                [(ngModel)]="shippingAddress.city"
                name="city"
                required>
            </div>
            <div class="form-group">
              <label for="province">Province *</label>
              <select 
                id="province" 
                [(ngModel)]="shippingAddress.province"
                name="province"
                required>
                <option value="">Select Province</option>
                <option value="Metro Manila">Metro Manila</option>
                <option value="Cebu">Cebu</option>
                <option value="Davao">Davao</option>
                <option value="Laguna">Laguna</option>
                <option value="Cavite">Cavite</option>
                <option value="Bulacan">Bulacan</option>
                <option value="Rizal">Rizal</option>
              </select>
            </div>
            <div class="form-group">
              <label for="postal">Postal Code *</label>
              <input 
                type="text" 
                id="postal" 
                [(ngModel)]="shippingAddress.postalCode"
                name="postal"
                required>
            </div>
          </div>
        </form>

        <div class="step-actions">
          <button class="btn btn-primary" (click)="nextStep()" [disabled]="!isShippingValid()">
            Continue to Payment
          </button>
        </div>
      </div>

      <!-- Step 2: Payment Method -->
      <div class="checkout-section" *ngIf="currentStep() === 2">
        <h2>Payment Method</h2>
        
        <div class="payment-methods">
          <div class="payment-option" 
               [class.selected]="selectedPayment() === 'E_WALLET'"
               (click)="selectPayment('E_WALLET')">
            <div class="payment-header">
              <input type="radio" 
                     [checked]="selectedPayment() === 'E_WALLET'"
                     name="payment">
              <label>E-Wallet</label>
            </div>
            <div class="payment-details" *ngIf="selectedPayment() === 'E_WALLET'">
              <div class="ewallet-options">
                <label class="ewallet-option">
                  <input type="radio" 
                         value="GCASH" 
                         [(ngModel)]="selectedEWallet"
                         name="ewallet">
                  <img src="/gcash-logo.png" alt="GCash" class="payment-logo">
                  <span>GCash</span>
                </label>
                <label class="ewallet-option">
                  <input type="radio" 
                         value="PAYMAYA" 
                         [(ngModel)]="selectedEWallet"
                         name="ewallet">
                  <img src="/paymaya-logo.png" alt="PayMaya" class="payment-logo">
                  <span>PayMaya</span>
                </label>
              </div>
            </div>
          </div>

          <div class="payment-option" 
               [class.selected]="selectedPayment() === 'BANK_TRANSFER'"
               (click)="selectPayment('BANK_TRANSFER')">
            <div class="payment-header">
              <input type="radio" 
                     [checked]="selectedPayment() === 'BANK_TRANSFER'"
                     name="payment">
              <label>Bank Transfer</label>
            </div>
            <div class="payment-details" *ngIf="selectedPayment() === 'BANK_TRANSFER'">
              <p>Transfer to our bank account and upload receipt.</p>
              <div class="bank-details">
                <strong>Bank Name:</strong> BPI<br>
                <strong>Account Number:</strong> 1234-5678-90<br>
                <strong>Account Name:</strong> Pet Supply Co.
              </div>
            </div>
          </div>

          <div class="payment-option" 
               [class.selected]="selectedPayment() === 'CASH_ON_DELIVERY'"
               (click)="selectPayment('CASH_ON_DELIVERY')">
            <div class="payment-header">
              <input type="radio" 
                     [checked]="selectedPayment() === 'CASH_ON_DELIVERY'"
                     name="payment">
              <label>Cash on Delivery</label>
            </div>
            <div class="payment-details" *ngIf="selectedPayment() === 'CASH_ON_DELIVERY'">
              <p>Pay in cash when your order is delivered. Additional ₱50 COD fee applies.</p>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" (click)="previousStep()">
            Back to Shipping
          </button>
          <button class="btn btn-primary" (click)="nextStep()" [disabled]="!isPaymentValid()">
            Review Order
          </button>
        </div>
      </div>

      <!-- Step 3: Order Confirmation -->
      <div class="checkout-section" *ngIf="currentStep() === 3">
        <h2>Order Confirmation</h2>
        
        <div class="confirmation-content">
          <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of cart().items">
                <div class="item-info">
                  <img [src]="item.product.image" [alt]="item.product.name" class="item-image">
                  <div class="item-details">
                    <h4>{{ item.product.name }}</h4>
                    <p>Quantity: {{ item.quantity }}</p>
                  </div>
                </div>
                <div class="item-price">
                  ₱{{ (item.product.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
            
            <div class="order-totals">
              <div class="total-line">
                <span>Subtotal:</span>
                <span>₱{{ cart().total.toFixed(2) }}</span>
              </div>
              <div class="total-line">
                <span>Shipping:</span>
                <span>₱{{ shippingFee().toFixed(2) }}</span>
              </div>
              <div class="total-line" *ngIf="selectedPayment() === 'CASH_ON_DELIVERY'">
                <span>COD Fee:</span>
                <span>₱50.00</span>
              </div>
              <div class="total-line final-total">
                <span>Total:</span>
                <span>₱{{ grandTotal().toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="shipping-summary">
            <h3>Shipping Address</h3>
            <div class="address-info">
              <p><strong>{{ shippingAddress.fullName }}</strong></p>
              <p>{{ shippingAddress.addressLine1 }}</p>
              <p *ngIf="shippingAddress.addressLine2">{{ shippingAddress.addressLine2 }}</p>
              <p>{{ shippingAddress.city }}, {{ shippingAddress.province }} {{ shippingAddress.postalCode }}</p>
              <p>{{ shippingAddress.phone }}</p>
            </div>
          </div>

          <div class="payment-summary">
            <h3>Payment Method</h3>
            <div class="payment-info">
              <p *ngIf="selectedPayment() === 'E_WALLET'">
                E-Wallet: {{ selectedEWallet === 'GCASH' ? 'GCash' : 'PayMaya' }}
              </p>
              <p *ngIf="selectedPayment() === 'BANK_TRANSFER'">
                Bank Transfer
              </p>
              <p *ngIf="selectedPayment() === 'CASH_ON_DELIVERY'">
                Cash on Delivery
              </p>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" (click)="previousStep()">
            Back to Payment
          </button>
          <button class="btn btn-primary btn-large" (click)="placeOrder()" [disabled]="isProcessing()">
            {{ isProcessing() ? 'Processing...' : 'Place Order' }}
          </button>
        </div>
      </div>

      <!-- Order Success -->
      <div class="checkout-section success-section" *ngIf="orderPlaced()">
        <div class="success-content">
          <div class="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
          
          <div class="order-details">
            <p><strong>Order Number:</strong> {{ orderNumber() }}</p>
            <p><strong>Estimated Delivery:</strong> {{ estimatedDelivery() }}</p>
          </div>

          <div class="success-actions">
            <button class="btn btn-primary" (click)="goToHome()">
              Continue Shopping
            </button>
            <button class="btn btn-secondary" (click)="viewOrder()">
              View Order Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private currentStepSignal = signal(1);
  private selectedPaymentSignal = signal<PaymentMethod | null>(null);
  private isProcessingSignal = signal(false);
  private orderPlacedSignal = signal(false);
  private orderNumberSignal = signal<string>('');

  selectedEWallet: EWalletProvider = EWalletProvider.GCASH;
  
  shippingAddress: ShippingAddress = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phone: ''
  };

  currentStep = this.currentStepSignal.asReadonly();
  selectedPayment = this.selectedPaymentSignal.asReadonly();
  isProcessing = this.isProcessingSignal.asReadonly();
  orderPlaced = this.orderPlacedSignal.asReadonly();
  orderNumber = this.orderNumberSignal.asReadonly();

  // Service references - initialized in constructor
  cart!: Signal<any>;
  user!: Signal<any>;

  // Computed values - initialized in constructor
  shippingFee!: Signal<number>;
  grandTotal!: Signal<number>;
  estimatedDelivery!: Signal<string>;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {
    // Initialize service-dependent properties
    this.cart = this.productService.getCartSignal();
    this.user = this.authService.getCurrentUser();

    // Initialize computed values
    this.shippingFee = computed(() => {
      const province = this.shippingAddress.province.toLowerCase();
      if (province === 'metro manila') return 100;
      if (['cebu', 'davao', 'laguna', 'cavite', 'bulacan', 'rizal'].includes(province)) return 150;
      return 200;
    });

    this.grandTotal = computed(() => {
      let total = this.cart().total + this.shippingFee();
      if (this.selectedPayment() === PaymentMethod.CASH_ON_DELIVERY) {
        total += 50; // COD fee
      }
      return total;
    });

    this.estimatedDelivery = computed(() => {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3); // 3-5 business days
      return deliveryDate.toLocaleDateString();
    });

    // Pre-fill user info if logged in
    const currentUser = this.user();
    if (currentUser) {
      this.shippingAddress.fullName = `${currentUser.firstName} ${currentUser.lastName}`;
      this.shippingAddress.phone = currentUser.phone || '';
    }
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStepSignal.update(step => step + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStepSignal.update(step => step - 1);
    }
  }

  selectPayment(method: string): void {
    this.selectedPaymentSignal.set(method as PaymentMethod);
  }

  isShippingValid(): boolean {
    return !!(
      this.shippingAddress.fullName &&
      this.shippingAddress.phone &&
      this.shippingAddress.addressLine1 &&
      this.shippingAddress.city &&
      this.shippingAddress.province &&
      this.shippingAddress.postalCode
    );
  }

  isPaymentValid(): boolean {
    const payment = this.selectedPayment();
    if (!payment) return false;
    
    if (payment === PaymentMethod.E_WALLET) {
      return !!this.selectedEWallet;
    }
    
    return true;
  }

  async placeOrder(): Promise<void> {
    this.isProcessingSignal.set(true);
    
    try {
      const currentUser = this.user();
      const cart = this.cart();
      
      // Convert cart items to order items
      const orderItems: OrderItem[] = cart.items.map((item: any) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      }));

      // Create order object
      const order: Order = {
        customerId: currentUser?.id,
        customerEmail: currentUser?.email || 'guest@example.com',
        customerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : this.shippingAddress.fullName,
        customerPhone: currentUser?.phone || this.shippingAddress.phone,
        orderItems: orderItems,
        subtotal: cart.total,
        shippingFee: this.shippingFee(),
        total: this.grandTotal(),
        paymentMethod: this.selectedPayment()!,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        shippingFullName: this.shippingAddress.fullName,
        shippingAddressLine1: this.shippingAddress.addressLine1,
        shippingAddressLine2: this.shippingAddress.addressLine2,
        shippingCity: this.shippingAddress.city,
        shippingProvince: this.shippingAddress.province,
        shippingPostalCode: this.shippingAddress.postalCode,
        shippingPhone: this.shippingAddress.phone,
        ewalletProvider: this.selectedPayment() === PaymentMethod.E_WALLET ? this.selectedEWallet.toString() : undefined,
        referenceNumber: undefined
      };

      // Call the API to create order
      const result = await this.orderService.createOrder(order);
      
      if (result.success) {
        // Set order number and show success
        this.orderNumberSignal.set(result.order.orderNumber || '');
        
        // Clear cart
        this.productService.clearCart();
        
        // Show success
        this.orderPlacedSignal.set(true);
      } else {
        alert(result.message || 'Failed to place order. Please try again.');
      }
      
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      this.isProcessingSignal.set(false);
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  viewOrder(): void {
    // Navigate to order details page
    this.router.navigate(['/orders', this.orderNumber()]);
  }
}