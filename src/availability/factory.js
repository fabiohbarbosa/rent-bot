import CustoJustoAvailability from './custojusto';
import IdealistaAvailability from './idealista';
import ImovirtualAvailability from './imovirtual';
import OlxAvailability from './olx';

import Log from '../../config/logger';
import { ensureRealProvider } from '../utils/provider-utils';

const availability = {
  custojusto: CustoJustoAvailability,
  idealista: IdealistaAvailability,
  imovirtual: ImovirtualAvailability,
  olx: OlxAvailability
};

class AvailabilityBotFactory {
  static getInstance(provider, url) {
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
