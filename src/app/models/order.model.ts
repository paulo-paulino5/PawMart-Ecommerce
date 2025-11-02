export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  customerId?: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  orderItems: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus | string;
  orderStatus: OrderStatus | string;
  shippingFullName?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  shippingPhone?: string;
  ewalletProvider?: string;
  referenceNumber?: string;
  shippingAddress?: ShippingAddress;
  orderDate?: Date;
  estimatedDelivery?: Date;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export enum PaymentMethod {
  E_WALLET = 'E_WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}

export enum EWalletProvider {
  PAYMAYA = 'PAYMAYA',
  GCASH = 'GCASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface PaymentDetails {
  method: PaymentMethod;
  ewalletProvider?: EWalletProvider;
  bankName?: string;
  referenceNumber?: string;
}

export interface OrderConfirmation {
  order: Order;
  message: string;
  success: boolean;
}