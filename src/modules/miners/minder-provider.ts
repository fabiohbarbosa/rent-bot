import Property from '@models/property';

interface MinderProviderResponse {
  isOnFilter: boolean;
  data?: Property;
}

abstract class MinderProvider {
  constructor(public logPrefix: string) {}
  abstract mine(url: string): Promise<MinderProviderResponse>;
}

export { MinderProviderResponse };
export default MinderProvider;
