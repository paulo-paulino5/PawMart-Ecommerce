import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Order, OrderConfirmation } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  /**
   * Create a new order
   */
  async createOrder(order: Order): Promise<OrderConfirmation> {
    try {
      console.log('Creating order with data:', order);
      console.log('API URL:', this.apiUrl);
      
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, order)
      );

      console.log('Order creation response:', response);
      return {
        success: response.success,
        message: response.message,
        order: response.order
      };
    } catch (error: any) {
      console.error('Failed to create order:', error);
      console.error('Error details:', {
        status: error?.status,
        statusText: error?.statusText,
        message: error?.message,
        error: error?.error
      });
      
      let errorMessage = 'Failed to create order. Please try again.';
      if (error?.status === 0) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error?.status >= 400 && error?.status < 500) {
        errorMessage = error?.error?.message || 'Invalid request data.';
      } else if (error?.status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      
      return {
        success: false,
        message: errorMessage,
        order: order
      };
    }
  }

  /**
   * Get order by order number
   */
  getOrderByNumber(orderNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/number/${orderNumber}`);
  }

  /**
   * Get orders by customer email
   */
  getOrdersByCustomerEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer/email/${email}`);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(orderId: number, paymentStatus: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/payment-status`, { paymentStatus });
  }

  /**
   * Delete order by ID
   */
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${orderId}`);
  }
}