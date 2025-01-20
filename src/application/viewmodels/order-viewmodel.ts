import {IStripePaymentIntentEvent} from "../../infrastructure/interfaces/stripe-payment-intent-event";

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
  paymentIntent?: IStripePaymentIntentEvent;
}

export interface OrderItemViewModel {
  quantity: number;
  productId: string;
  productName: string;
  price: number;
}
