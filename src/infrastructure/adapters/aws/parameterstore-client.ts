import {SSMClient, GetParameterCommand, GetParameterCommandInput} from '@aws-sdk/client-ssm';
import {injectable} from 'inversify';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {IParameterStoreClient} from '../../interfaces/parameterstore-client.interface';

@injectable()
/**
 * ParameterStoreClient
 */
export class ParameterStoreClient implements IParameterStoreClient {
  private ssmClient = new SSMClient();
  /**
   * getValue
   * @param {string} key
   * @param {boolean} withDecryption
   * @returns {Promise<any>}
   */
  async getValue(key: string, withDecryption: boolean): Promise<any> {
    Logger.info('Entered ParameterStoreClient.getValue()');

    const params: GetParameterCommandInput = {
      Name: key,
      WithDecryption: withDecryption,
    };
    const result = await this.ssmClient.send(new GetParameterCommand(params));
    return result.Parameter?.Value;
  }
}
