import {CreateOrderCommand} from '../../domain/commands/create-order.command';

export interface IOrderCommandHandler {
  handleCreateOrderCommand(cmd: CreateOrderCommand);
}
