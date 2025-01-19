export interface IStripePaymentIntentEvent {
  id: string;
  api_version: string;
  created: number;
  data: {
    object: {
      Id: string;
      object: string;
      amount: number;
      amount_received: number;
      canceled_at: any;
      client_secret: string;
      created: number;
      currency: string;
      customer: string;
      description: string;
      last_payment_error: any;
      metadata: any;
      statement_descriptor: any;
      status: string
    }
  }
  request: any;
  type: string;  // "payment_intent.succeeded"
}