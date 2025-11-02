import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OrderService } from '../services/order.service';
import { Order, OrderStatus, PaymentStatus } from '../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-details-container">
      <!-- Loading State -->
      <div class="loading" *ngIf="loading()">
        <div class="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>

      <!-- Error State -->
      <div class="error" *ngIf="error()">
        <div class="error-icon">⚠️</div>
        <h2>Order Not Found</h2>
        <p>{{ error() }}</p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="goToOrderHistory()">
            View Order History
          </button>
          <button class="btn btn-secondary" (click)="goToProducts()">
            Continue Shopping
          </button>
        </div>
      </div>

      <!-- Order Details Content -->
      <div class="order-content" *ngIf="order() && !loading() && !error()">
        <!-- Header -->
        <div class="order-header">
          <div class="header-content">
            <button class="back-btn" (click)="goBack()">
              <span class="back-icon">←</span>
              Back
            </button>
            <div class="order-title">
              <h1>Order #{{ order()!.orderNumber }}</h1>
              <p class="order-date">Placed on {{ formatDate(order()!.orderDate) }}</p>
            </div>
          </div>
          
          <div class="status-section">
            <div class="status-item">
              <span class="status-label">Order Status</span>
              <span class="status-badge" [class]="getStatusClass(order()!.orderStatus)">
                {{ order()!.orderStatus }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Payment Status</span>
              <span class="status-badge" [class]="getPaymentStatusClass(order()!.paymentStatus)">
                {{ order()!.paymentStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Timeline -->
        <div class="progress-timeline">
          <div class="timeline-item" [class.completed]="isStatusCompleted('PENDING')" [class.active]="order()!.orderStatus === 'PENDING'">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Order Placed</h4>
              <p>Your order has been received</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStatusCompleted('CONFIRMED')" [class.active]="order()!.orderStatus === 'CONFIRMED'">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Confirmed</h4>
              <p>Order confirmed and being prepared</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStatusCompleted('PROCESSING')" [class.active]="order()!.orderStatus === 'PROCESSING'">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Processing</h4>
              <p>Your items are being prepared</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStatusCompleted('SHIPPED')" [class.active]="order()!.orderStatus === 'SHIPPED'">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Shipped</h4>
              <p>Your order is on the way</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStatusCompleted('DELIVERED')" [class.active]="order()!.orderStatus === 'DELIVERED'">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Delivered</h4>
              <p>Order delivered successfully</p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-section">
          <h2>Order Items</h2>
          <div class="items-list">
            <div class="item-card" *ngFor="let item of order()!.orderItems">
              <div class="item-info">
                <h3>{{ item.productName }}</h3>
                <p class="item-price">₱{{ item.price.toFixed(2) }} each</p>
              </div>
              <div class="item-quantity">
                <span class="quantity-label">Qty:</span>
                <span class="quantity-value">{{ item.quantity }}</span>
              </div>
              <div class="item-subtotal">
                <span class="subtotal-label">Subtotal:</span>
                <span class="subtotal-value">₱{{ item.subtotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-section">
          <h2>Order Summary</h2>
          <div class="summary-card">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">₱{{ order()!.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Shipping Fee</span>
              <span class="summary-value">₱{{ order()!.shippingFee.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Total</span>
              <span class="summary-value">₱{{ order()!.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Information -->
        <div class="order-section">
          <h2>Shipping Information</h2>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Full Name:</span>
              <span class="info-value">{{ order()!.shippingFullName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">
                {{ order()!.shippingAddressLine1 }}
                <span *ngIf="order()!.shippingAddressLine2">, {{ order()!.shippingAddressLine2 }}</span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">City:</span>
              <span class="info-value">{{ order()!.shippingCity }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Province:</span>
              <span class="info-value">{{ order()!.shippingProvince }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Postal Code:</span>
              <span class="info-value">{{ order()!.shippingPostalCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">{{ order()!.shippingPhone }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="order-section">
          <h2>Payment Information</h2>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">{{ formatPaymentMethod(order()!.paymentMethod) }}</span>
            </div>
            <div class="info-row" *ngIf="order()!.ewalletProvider">
              <span class="info-label">E-Wallet Provider:</span>
              <span class="info-value">{{ order()!.ewalletProvider }}</span>
            </div>
            <div class="info-row" *ngIf="order()!.referenceNumber">
              <span class="info-label">Reference Number:</span>
              <span class="info-value">{{ order()!.referenceNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="order-section">
          <h2>Customer Information</h2>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ order()!.customerName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ order()!.customerEmail }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">{{ order()!.customerPhone }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="order-actions">
          <button class="btn btn-primary" (click)="goToProducts()">
            Continue Shopping
          </button>
          <button class="btn btn-secondary" (click)="goToOrderHistory()">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-details-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: calc(100vh - 200px);
    }

    .loading, .error {
      text-align: center;
      padding: 4rem 2rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #ff6b35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .error h2 {
      color: #721c24;
      margin-bottom: 1rem;
    }

    .error p {
      color: #666;
      margin-bottom: 2rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .order-header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .back-btn {
      background: none;
      border: none;
      color: #ff6b35;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      margin-right: 1rem;
      border-radius: 6px;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .back-btn:hover {
      background-color: #f8f9fa;
    }

    .back-icon {
      font-size: 1.2rem;
    }

    .order-title h1 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .order-date {
      color: #666;
      margin: 0;
    }

    .status-section {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .status-label {
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }

    .status-badge.pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.confirmed {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .status-badge.processing {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.shipped {
      background-color: #cce5ff;
      color: #004085;
    }

    .status-badge.delivered {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.cancelled {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-badge.paid {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.failed {
      background-color: #f8d7da;
      color: #721c24;
    }

    .progress-timeline {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      position: relative;
      padding-bottom: 2rem;
    }

    .timeline-item:last-child {
      padding-bottom: 0;
    }

    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 15px;
      top: 32px;
      bottom: 0;
      width: 2px;
      background-color: #e0e0e0;
    }

    .timeline-item.completed:not(:last-child)::after {
      background-color: #28a745;
    }

    .timeline-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #e0e0e0;
      margin-right: 1rem;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .timeline-item.completed .timeline-dot {
      background-color: #28a745;
    }

    .timeline-item.active .timeline-dot {
      background-color: #ff6b35;
    }

    .timeline-content h4 {
      color: #333;
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
    }

    .timeline-content p {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }

    .order-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .order-section h2 {
      color: #333;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .item-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      align-items: center;
    }

    .item-info h3 {
      color: #333;
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
    }

    .item-price {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }

    .item-quantity {
      text-align: right;
    }

    .quantity-label {
      color: #666;
      font-size: 0.9rem;
      display: block;
    }

    .quantity-value {
      color: #333;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .item-subtotal {
      text-align: right;
    }

    .subtotal-label {
      color: #666;
      font-size: 0.9rem;
      display: block;
    }

    .subtotal-value {
      color: #ff6b35;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .summary-card, .info-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .summary-row, .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .summary-row:last-child,
    .info-row:last-child {
      border-bottom: none;
    }

    .summary-row.total {
      border-top: 2px solid #e0e0e0;
      margin-top: 0.5rem;
      padding-top: 1rem;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .summary-label, .info-label {
      color: #666;
    }

    .summary-value, .info-value {
      color: #333;
      font-weight: 500;
    }

    .summary-row.total .summary-value {
      color: #ff6b35;
    }

    .order-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .btn-primary {
      background-color: #ff6b35;
      color: white;
    }

    .btn-primary:hover {
      background-color: #e55a2e;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    @media (max-width: 768px) {
      .order-details-container {
        padding: 1rem;
      }

      .order-header,
      .progress-timeline,
      .order-section {
        padding: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .back-btn {
        margin-right: 0;
      }

      .status-section {
        flex-direction: column;
        gap: 1rem;
      }

      .item-card {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        text-align: left;
      }

      .item-quantity,
      .item-subtotal {
        text-align: left;
      }

      .timeline-content {
        margin-left: 0.5rem;
      }

      .order-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class OrderDetailsComponent implements OnInit {
  private orderSignal = signal<Order | null>(null);
  private loadingSignal = signal(true);
  private errorSignal = signal<string>('');

  order = this.orderSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  private orderNumber: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderNumber = params['orderNumber'];
      if (this.orderNumber) {
        this.loadOrderDetails();
      } else {
        this.errorSignal.set('Invalid order number.');
        this.loadingSignal.set(false);
      }
    });
  }

  async loadOrderDetails() {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const response = await firstValueFrom(this.orderService.getOrderByNumber(this.orderNumber));
      
      if (response.success && response.order) {
        this.orderSignal.set(response.order);
      } else {
        this.errorSignal.set(response.message || 'Order not found.');
      }
    } catch (error: any) {
      console.error('Failed to load order details:', error);
      if (error.status === 404) {
        this.errorSignal.set('Order not found. Please check the order number.');
      } else {
        this.errorSignal.set('Failed to load order details. Please try again.');
      }
    } finally {
      this.loadingSignal.set(false);
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Unknown date';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPaymentMethod(method: string): string {
    switch (method) {
      case 'E_WALLET':
        return 'E-Wallet';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'CASH_ON_DELIVERY':
        return 'Cash on Delivery';
      default:
        return method;
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    return status.toLowerCase();
  }

  getPaymentStatusClass(status: string | undefined): string {
    if (!status) return '';
    return status.toLowerCase();
  }

  isStatusCompleted(status: string): boolean {
    const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentOrder = this.order()?.orderStatus || '';
    const currentIndex = statusOrder.indexOf(currentOrder);
    const targetIndex = statusOrder.indexOf(status);
    
    return targetIndex <= currentIndex;
  }

  goBack() {
    window.history.back();
  }

  goToOrderHistory() {
    this.router.navigate(['/orders']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}