const TYPES = {
  IOrderRepository: Symbol('IOrderRepository'),
  IAppOrderService: Symbol('IAppOrderService'),
  IDynamoDBClient: Symbol('IDynamoDBClient'),
  IRestApiClient: Symbol('IRestApiClient'),
  IEventBridgeClient: Symbol('IEventBridgeClient'),
  PaymentApiUrl: Symbol('PaymentApiUrl'),
  OrderTableName: Symbol('OrderTableName'),
  TbsEventBusArn: Symbol('TbsEventBusArn'),
};

export default TYPES;
