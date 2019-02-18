import Property from '@models/property';

interface MinderProviderRespose {
  isOnFilter: boolean;
  data?: Property;
}

abstract class MinderProvider {
  constructor(public logPrefix: string) {}
  abstract mine(url: string): Promise<MinderProviderRespose>;
}

export { MinderProviderRespose };
export default MinderProvider;
