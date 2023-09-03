import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {OrderRepository} from '../../../infrastructure/persistence/order-repository';
import {IOrderRepository} from '../../../infrastructure/interfaces/order-repository.interface';
import {IDynamoDBClient} from '../../../infrastructure/interfaces/dynamodb-client.interface';
import {DynamoDBClient} from '../../../infrastructure/adapters/dynamodb-client';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {AppOrderService} from '../../services/app-order-service';
import {IOrderCommandHandler} from '../../handlers/order-command.handler.interface';
import {OrderCommandHandler} from '../../handlers/order-command.handler';
import {IEventBridgeClient} from '../../../infrastructure/interfaces/eventbridge-client.interface';
import {EventBridgeClient} from '../../../infrastructure/adapters/eventbridge-client';
import {IRestApiClient} from '../../../infrastructure/interfaces/restapi-client.interface';
import {RestApiClient} from '../../../infrastructure/adapters/restapi-client';

const container = new Container();

container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository).inSingletonScope();
container.bind<IAppOrderService>(TYPES.IAppOrderService).to(AppOrderService).inSingletonScope();
container.bind<IOrderCommandHandler>(TYPES.IOrderCommandHandler).to(OrderCommandHandler).inSingletonScope();
container.bind<IRestApiClient>(TYPES.IRestApiClient).to(RestApiClient).inSingletonScope();
container.bind<IEventBridgeClient>(TYPES.IEventBridgeClient).to(EventBridgeClient).inSingletonScope();
container.bind<IDynamoDBClient>(TYPES.IDynamoDBClient).to(DynamoDBClient).inSingletonScope();

export default container;
