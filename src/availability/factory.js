import CustoJustoAvailability from './custojusto';
import IdealistaAvailability from './idealista';
import ImovirtualAvailability from './imovirtual';
import OlxAvailability from './olx';

import Log from '../../config/logger';

const availability = {
  custojusto: CustoJustoAvailability,
  idealista: IdealistaAvailability,
  imovirtual: ImovirtualAvailability,
  olx: OlxAvailability
};

class AvailabilityBotFactory {
  static getInstance(provider, url) {
    const logPrefix = `[availability:${provider}]:`;
    let realProvider = provider;

    if (realProvider === 'olx') {
      if (url.includes('https://www.imovirtual.com')) {
        realProvider = 'imovirtual';
        Log.info(`${logPrefix} Changing availability class from '${provider}' to '${realProvider}' for ${url}`);
      } else if (url.includes('https://www.olx.pt')) {
        realProvider = provider;
      } else {
        Log.warn(`${logPrefix} Cannot find availability class to url ${url} and provider ${provider}`);
      }
    }

    try {
      const Availability = availability[realProvider];
      return new Availability(`[availability:${realProvider}]:`);
    } catch (err) {
      Log.error(`${logPrefix} Error to instance availability object`);
      throw err;
    }
  }
}

export default AvailabilityBotFactory;
