import CustoJustoMiner from './custojusto';
import IdealistaMiner from './idealista';
import ImovirtualMiner from './imovirtual';
import OlxMiner from './olx';

import Log from '../../config/logger';
import { ensureRealProvider } from '../utils/provider-utils';

const miner = {
  custojusto: CustoJustoMiner,
  idealista: IdealistaMiner,
  imovirtual: ImovirtualMiner,
  olx: OlxMiner
};

class MinerBotFactory {
  static getInstance(provider, url) {
    let logPrefix = `[miner:${provider}]:`;

    try {
      const realProvider = ensureRealProvider(logPrefix, provider, url);
      logPrefix = `[miner:${realProvider}]:`;

      const Miner = miner[realProvider];
      return new Miner(logPrefix);
    } catch (err) {
      Log.error(`${logPrefix} Error to instance miner object`);
      throw err;
    }
  }
}

export default MinerBotFactory;
