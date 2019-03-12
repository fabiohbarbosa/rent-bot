import { Db } from 'mongodb';

import Log from '@config/logger';
import allProps from '@config/props';

import { batchProperties } from '@utils/batch-utils';

import Property from '@models/property';
import PropertyCache from '@lib/property-cache';

import MinerBotFactory from '@modules/miners/factory';
import MinerHandler from '@modules/miners/miner-handler';

/**
 * Fetch data from database and start the data mining process
 * after that the result will be send to handler
 */
class MinerBot {
  private props;
  private idealistaCounterCycle;
  private handler: MinerHandler;

  constructor(private db: Db, cache: PropertyCache) {
    this.handler = new MinerHandler(db, cache);
    this.props = allProps.bots.dataMining;
    this.idealistaCounterCycle = this.props.intervalIdealistaCounter;
  }

  async mine(property: Property) {
    const miner = MinerBotFactory.getInstance(property.provider, property.url);

    miner.mine(property.url).then(response => {
      this.handler.handle(miner.logPrefix, property, response);
    }).catch(err => {
      Log.debug(err);
    });
  }

  async mineDatabaseEntries() {
    try {
      const properties = await this._fetchDatabaseEntries();
      properties.forEach(p => this.mine(p));

      this.idealistaCounterCycle--;
    } catch (err) {
      Log.error(`[minder]: Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

  private _fetchDatabaseEntries() {
    const query = {
      provider: { $nin: [ 'idealista' ] },
      status: { $ne: 'UNVAILABLE' }
    };

    // reduce times to fetch idealista data
    // if the schedule do a complete cycle now it's time to remove provider from projection to include the 'idealista' on search
    if (this.idealistaCounterCycle === 0) {
      delete query.provider;
      this.idealistaCounterCycle = this.props.intervalIdealistaCounter;
    }

    const sort = { isDataMiningLastCheck: 1, dataMiningLastCheck: 1 };
    return batchProperties(this.db, query, sort, this.props.batchSize);
  }
}

export default MinerBot;
