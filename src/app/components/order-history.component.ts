import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-history-container">
      <div class="header">
        <h1>Order History</h1>
        <p>View all your previous orders and track their status</p>
      </div>

      <div class="content" *ngIf="!loading()">
        <!-- No orders state -->
        <div class="no-orders" *ngIf="orders().length === 0">
          <div class="no-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
          <button class="btn btn-primary" (click)="goToProducts()">
            Start Shopping
          </button>
        </div>

        <!-- Orders list -->
        <div class="orders-list" *ngIf="orders().length > 0">
          <div class="order-card" *ngFor="let order of orders()" (click)="viewOrderDetails(order.orderNumber!)">
            <div class="order-header">
              <div class="order-info">
                <h3>Order #{{ order.orderNumber }}</h3>
                <p class="order-date">{{ formatDate(order.orderDate) }}</p>
              </div>
              <div class="order-status">
                <span class="status-badge" [class]="getStatusClass(order.orderStatus)">
                  {{ order.orderStatus }}
                </span>
              </div>
            </div>

            <div class="order-summary">
              <div class="items-preview">
                <p class="items-count">{{ order.orderItems.length }} item(s)</p>
                <div class="item-names">
                  <span *ngFor="let item of order.orderItems.slice(0, 2); let last = last">
                    {{ item.productName }}{{ !last && order.orderItems.length > 1 ? ', ' : '' }}
                  </span>
                  <span *ngIf="order.orderItems.length > 2">
                    and {{ order.orderItems.length - 2 }} more
                  </span>
                </div>
              </div>
              
              <div class="order-total">
                <span class="total-label">Total:</span>
                <span class="total-amount">₱{{ order.total.toFixed(2) }}</span>
              </div>
            </div>

            <div class="order-actions">
              <div class="payment-info">
                <span class="payment-method">{{ formatPaymentMethod(order.paymentMethod) }}</span>
                <span class="payment-status" [class]="getPaymentStatusClass(order.paymentStatus)">
                  {{ order.paymentStatus }}
                </span>
              </div>
              
              <div class="action-buttons">
                <button class="btn btn-outline btn-sm" (click)="viewOrderDetails(order.orderNumber!); $event.stopPropagation()">
                  View Details
                </button>
                <button 
                  *ngIf="canCancelOrder(order.orderStatus)"
                  class="btn btn-danger btn-sm" 
                  (click)="cancelOrder(order); $event.stopPropagation()">
                  Cancel Order
                </button>
                <button 
                  *ngIf="canDeleteOrder(order.orderStatus)"
                  class="btn btn-danger-outline btn-sm" 
                  (click)="deleteOrder(order); $event.stopPropagation()">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div class="loading" *ngIf="loading()">
        <div class="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>

      <!-- Error state -->
      <div class="error" *ngIf="error()">
        <div class="error-icon">⚠️</div>
        <h2>Unable to Load Orders</h2>
        <p>{{ error() }}</p>
        <button class="btn btn-primary" (click)="loadOrders()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .order-history-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: calc(100vh - 200px);
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .header p {
      color: #666;
      font-size: 1.1rem;
    }

    .no-orders {
      text-align: center;
      padding: 4rem 2rem;
    }

    .no-orders-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-orders h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .no-orders p {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .order-card:hover {
      border-color: #ff6b35;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
      transform: translateY(-2px);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .order-info h3 {
      color: #333;
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
    }

    .order-date {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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

    .order-summary {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .items-preview {
      flex: 1;
    }

    .items-count {
      color: #666;
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .item-names {
      color: #333;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .order-total {
      text-align: right;
    }

    .total-label {
      color: #666;
      font-size: 0.9rem;
      display: block;
    }

    .total-amount {
      color: #ff6b35;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .order-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .payment-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .payment-method {
      color: #333;
      font-size: 0.9rem;
    }

    .payment-status {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .payment-status.pending {
      color: #856404;
    }

    .payment-status.paid {
      color: #155724;
    }

    .payment-status.failed {
      color: #721c24;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .btn-primary {
      background-color: #ff6b35;
      color: white;
    }

    .btn-primary:hover {
      background-color: #e55a2e;
    }

    .btn-outline {
      background-color: transparent;
      color: #ff6b35;
      border: 1px solid #ff6b35;
    }

    .btn-outline:hover {
      background-color: #ff6b35;
      color: white;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.85rem;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .btn-danger-outline {
      background-color: transparent;
      color: #dc3545;
      border: 1px solid #dc3545;
    }

    .btn-danger-outline:hover {
      background-color: #dc3545;
      color: white;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
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

    @media (max-width: 768px) {
      .order-history-container {
        padding: 1rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .order-card {
        padding: 1rem;
      }

      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .order-summary {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .order-total {
        text-align: left;
      }

      .order-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private ordersSignal = signal<Order[]>([]);
  private loadingSignal = signal(true);
  private errorSignal = signal<string>('');

  orders = this.ordersSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const user = this.authService.getCurrentUser()();
      if (!user?.email) {
        this.errorSignal.set('Please sign in to view your order history.');
        this.loadingSignal.set(false);
        return;
      }

      const response = await firstValueFrom(this.orderService.getOrdersByCustomerEmail(user.email));
      
      if (response.success) {
        this.ordersSignal.set(response.orders || []);
      } else {
        this.errorSignal.set(response.message || 'Failed to load orders.');
      }
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      if (error.status === 401) {
        this.errorSignal.set('Please sign in to view your order history.');
      } else {
        this.errorSignal.set('Failed to load orders. Please try again.');
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

  viewOrderDetails(orderNumber: string) {
    this.router.navigate(['/orders', orderNumber]);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  canCancelOrder(status: string | undefined): boolean {
    if (!status) return false;
    const cancelableStatuses = ['PENDING', 'CONFIRMED'];
    return cancelableStatuses.includes(status.toUpperCase());
  }

  canDeleteOrder(status: string | undefined): boolean {
    if (!status) return false;
    const deletableStatuses = ['CANCELLED', 'DELIVERED'];
    return deletableStatuses.includes(status.toUpperCase());
  }

  async cancelOrder(order: Order) {
    if (!order.id) {
      alert('Unable to cancel order: Order ID not found.');
      return;
    }

    if (!confirm(`Are you sure you want to cancel order #${order.orderNumber}?`)) {
      return;
    }

    try {
      const response = await firstValueFrom(
        this.orderService.updateOrderStatus(order.id, 'CANCELLED')
      );

      if (response.success) {
        alert('Order cancelled successfully!');
        await this.loadOrders(); // Reload the orders list
      } else {
        alert(response.message || 'Failed to cancel order.');
      }
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  }

  async deleteOrder(order: Order) {
    if (!order.id) {
      alert('Unable to delete order: Order ID not found.');
      return;
    }

    if (!confirm(`Are you sure you want to delete order #${order.orderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await firstValueFrom(
        this.orderService.deleteOrder(order.id)
      );

      if (response.success) {
        alert('Order deleted successfully!');
        // Remove the order from the list
        const updatedOrders = this.orders().filter(o => o.id !== order.id);
        this.ordersSignal.set(updatedOrders);
      } else {
        alert(response.message || 'Failed to delete order.');
      }
    } catch (error: any) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order. Please try again.');
    }
  }
}