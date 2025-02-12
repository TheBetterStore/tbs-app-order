import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {SQSEvent} from 'aws-lambda';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IStripePaymentIntentEvent} from "../../../infrastructure/interfaces/stripe-payment-intent-event";
import {IAppOrderService} from "../../services/app-order-service.interface";

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: SQSEvent) => {
  Logger.info('Entered confirm-order handler', event);

  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);

  const recs = event.Records;
  for(let i = 0; i < recs.length; i++) {
    const rec = recs[i];

    Logger.debug(rec.body);
    const o: IStripePaymentIntentEvent = JSON.parse(rec.body);

    const mappedEvent: IStripePaymentIntentEvent = {
      id: o.id,
      api_version: o.api_version,
      created: o.created,
      data: {
        object: {
          Id: o.data.object.Id,
          object: o.data.object.object,
          amount: o.data.object.amount,
          amount_received: o.data.object.amount_received,
          canceled_at: o.data.object.canceled_at,
          client_secret: o.data.object.client_secret,
          created: o.data.object.created,
          currency: o.data.object.currency,
          customer: o.data.object.customer,
          description: o.data.object.description,
          last_payment_error: o.data.object.last_payment_error,
          metadata: o.data.object.metadata,
          statement_descriptor: o.data.object.statement_descriptor,
          status: o.data.object.status,
        }
      },
      request: o.request,
      type: o.type
    }

    Logger.debug(`Received event type: ${mappedEvent?.type}`);

    switch(mappedEvent?.type) {
      case 'payment_intent.succeeded':
        const customerId = mappedEvent?.data?.object?.metadata.customerId;
        const orderId = mappedEvent?.data?.object?.metadata.orderId;
        await svc.confirmOrder(customerId, orderId,  mappedEvent.data.object.status);
        break;
    }
  }
  Logger.info('Exiting handler');
};