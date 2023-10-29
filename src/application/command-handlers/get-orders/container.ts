import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {OrderRepository} from '../../../infrastructure/persistence/order-repository';
import {IOrderRepository} from '../../../infrastructure/interfaces/order-repository.interface';
import {IDynamoDBClient} from '../../../infrastructure/interfaces/dynamodb-client.interface';
import {DynamoDBClient} from '../../../infrastructure/adapters/aws/dynamodb-client';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {AppOrderService} from '../../services/app-order-service';
import {IEventBridgeClient} from '../../../infrastructure/interfaces/eventbridge-client.interface';
import {EventBridgeClient} from '../../../infrastructure/adapters/aws/eventbridge-client';
import {IRestApiClient} from '../../../infrastructure/interfaces/restapi-client.interface';
import {RestApiClient} from '../../../infrastructure/adapters/restapi-client';

const container = new Container();

container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository).inSingletonScope();
container.bind<IAppOrderService>(TYPES.IAppOrderService).to(AppOrderService).inSingletonScope();
container.bind<IRestApiClient>(TYPES.IRestApiClient).to(RestApiClient).inSingletonScope();
container.bind<IEventBridgeClient>(TYPES.IEventBridgeClient).to(EventBridgeClient).inSingletonScope();
container.bind<IDynamoDBClient>(TYPES.IDynamoDBClient).to(DynamoDBClient).inSingletonScope();

export default container;
