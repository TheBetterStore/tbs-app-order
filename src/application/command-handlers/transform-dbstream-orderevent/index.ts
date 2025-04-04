import {DdbOrderDto, DdbOrderItemDto} from "../../../infrastructure/persistence/ddb-order-dto";
import {OrderDto, OrderItemDto} from "../../../infrastructure/persistence/order.dto";

console.log('INFO - lambda is cold-starting.');
exports.handler = async (events: any) => {
  console.info('Entered confirm-order handler');
  console.info(JSON.stringify(events, null, 2));

  const mappedEvents: any = []

  for(let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.eventName == 'INSERT' || event.eventName == 'MODIFY') {
      event.order = mapDdbOrder(event.dynamodb.NewImage);
      event.dynamodb = undefined;
    }
    else {
      console.log('Deleting event');
    }
  }
  console.info('Exiting handler, returning...', mappedEvents);
  return events;
};

function mapDdbOrder(i: DdbOrderDto, isDelete: boolean = false): any {
  const r: any = {
    CustomerId: i.CustomerId.S,
    OrderId: i.OrderId.S,
    ReceiptEmail: i.ReceiptEmail.S,
    AmountCharged: i.AmountCharged.N,
    NetTotal: i.NetTotal.N,
    GrossTotal: i.GrossTotal.N,
    TaxRate: i.TaxRate.N,
    TaxTotal: i.TaxTotal.N,
    OrderItems: i.OrderItems.L.map(mapDdbOrderItem),
    CreatedTime: i.CreatedTime.S,
    LastUpdatedTime: i.LastUpdatedTime.S,
    Status: (isDelete == true) ? 'CANCELLED' : i.Status.S,
    StripePaymentIntent: {
      Id: i.StripePaymentIntent.M.Id.S,
      Status: i.StripePaymentIntent.M?.Status?.S || '',
    }
  }
  return r;
}

function mapDdbOrderItem(i: DdbOrderItemDto): OrderItemDto {
  const r: OrderItemDto = {
    Quantity: i.M.Quantity.N,
    ProductId: i.M.ProductId.S,
    ProductName: i.M.ProductName.S,
    Price: Number(i.M.Price.S)
  }
  return r;
}