const TYPES = {
  IOrderRepository: Symbol('IOrderRepository'),
  IAppOrderService: Symbol('IAppOrderService'),
  IDynamoDBClient: Symbol('IDynamoDBClient'),
  IRestApiClient: Symbol('IRestApiClient'),
  IEventBridgeClient: Symbol('IEventBridgeClient'),
  IParameterStoreClient: Symbol('IParameterStoreClient'),
};

export default TYPES;
