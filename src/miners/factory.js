import CustoJustoMiner from './custojusto';
import IdealistaMiner from './idealista';
import ImovirtualMiner from './imovirtual';
import OlxMiner from './olx';

import Log from '../../config/logger';

const miner = {
  custojusto: CustoJustoMiner,
  idealista: IdealistaMiner,
  imovirtual: ImovirtualMiner,
  olx: OlxMiner
};

class MinerBotFactory {
  static getInstance(provider, url) {
    const logPrefix = `[miner:${provider}]:`;
    let realProvider = provider;

    if (realProvider === 'olx') {
      if (url.includes('https://www.imovirtual.com')) {
        realProvider = 'imovirtual';
        Log.info(`${logPrefix} Changing miner class from '${provider}' to '${realProvider}' for ${url}`);
      } else if (url.includes('https://www.olx.pt')) {
        realProvider = provider;
      } else {
        Log.warn(`${logPrefix} Cannot find miner class to url ${url} and provider ${provider}`);
      }
    }

    try {
      const Miner = miner[realProvider];
      return new Miner(`[miner:${realProvider}]:`);
    } catch (err) {
      Log.error(`${logPrefix} Error to instance miner object`);
      throw err;
    }
  }
}

export default MinerBotFactory;
