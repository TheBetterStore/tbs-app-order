import {PaymentIntentResult} from "@stripe/stripe-js";

export interface OrderViewModel {
  customerId: string;
  orderId: string,
  receiptEmail?: string;
  stripeClientSecret?: string;
  netTotal: number;
  grossTotal: number;
  taxRate: number;
  taxTotal: number;
  orderItems: OrderItemViewModel[];
  createdTime: string;
  lastUpdatedTime: string;
  paymentIntent?: PaymentIntentResult;
}

export interface OrderItemViewModel {
  quantity: number;
  productId: string;
  productName: string;
  price: number;
}
