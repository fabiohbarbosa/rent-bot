import CustoJustoMiner from './providers/custojusto';
import IdealistaMiner from './providers/idealista';
import ImovirtualMiner from './providers/imovirtual';
import OlxMiner from './providers/olx';

import Log from '@config/logger';
import { ensureRealProvider } from '@utils/provider-utils';
import MinerProvider from './miner-provider';

const miner = {
  custojusto: CustoJustoMiner,
  idealista: IdealistaMiner,
  imovirtual: ImovirtualMiner,
  olx: OlxMiner
};

class MinerBotFactory {
  static getInstance(provider, url): MinerProvider {
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
