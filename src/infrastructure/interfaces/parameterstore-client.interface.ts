export interface IParameterStoreClient {
  getValue(key: string, withDecryption: boolean): Promise<any>;
}
