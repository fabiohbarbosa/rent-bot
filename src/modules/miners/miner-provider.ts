import Property from '@models/property';

interface MinerProviderResponse {
  isOnFilter: boolean;
  data?: Property;
}

abstract class MinerProvider {
  constructor(public logPrefix: string) {}
  abstract mine(url: string): Promise<MinerProviderResponse>;
}

export { MinerProviderResponse };
export default MinerProvider;
