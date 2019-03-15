import CustoJustoAvailability from './providers/custojusto';
import IdealistaAvailability from './providers/idealista';
import ImovirtualAvailability from './providers/imovirtual';
import OlxAvailability from './providers/olx';

import Log from '@config/logger';
import { ensureRealProvider } from '@utils/provider-utils';
import AvailabilityProvider from './availability-provider';

const availability = {
  custojusto: CustoJustoAvailability,
  idealista: IdealistaAvailability,
  imovirtual: ImovirtualAvailability,
  olx: OlxAvailability
};

class AvailabilityBotFactory {
  static getInstance(provider: string, url: string): AvailabilityProvider {
    let logPrefix = `[availability:${provider}]:`;

    try {
      const realProvider = ensureRealProvider(logPrefix, provider, url);
      logPrefix = `[availability:${realProvider}]:`;

      const Availability = availability[realProvider];
      return new Availability(logPrefix);
    } catch (err) {
      Log.error(`${logPrefix} Error to instance availability object`);
      throw err;
    }
  }
}

export default AvailabilityBotFactory;
