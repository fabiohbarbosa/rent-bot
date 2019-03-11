import { Db } from 'mongodb';

import MinerBotFactory from '@modules/miners/factory';
import Log from '@config/logger';
import allProps from '@config/props';
import { batchProperties, updateDateBatch } from '@utils/batch-utils';
import NotificationService from '@utils/notification-service';
import Property from '@models/property';
import MinderProvider from '@modules/miners/minder-provider';
import PropertyCache from '@lib/property-cache';

// get only dataMining properties
const props = allProps.bots.dataMining;
let idealistaCounterCycle = props.intervalIdealistaCounter;

class DataMiningBot {

  miner: MinderProvider;
  logPrefix: string;

  constructor(private db: Db, private cache: PropertyCache, private property: Property) {
    this.miner = MinerBotFactory.getInstance(property.provider, property.url);
    this.logPrefix = this.miner.logPrefix;
  }

  async mine() {
    const { url, dirty, notificated, status } = this.property;

    let set: Property = {
      dataMiningLastCheck: new Date(),
      isDataMiningLastCheck: true,
    };

    try {
      const { isOnFilter, data } = await this.miner.mine(url);
      const newStatus = this._chooseTheStatus(url, isOnFilter, dirty, status);
      set = {
        ...set,
        ...data,
        status: newStatus
      };

      // email notification for new entries
      if (isOnFilter && !notificated) {
        new NotificationService(this.logPrefix, this.db)
          .notificateByEmail(this.property);
      }
    } catch (err) {
      Log.debug(err);
    } finally {
      const callback = this._callback.bind(this);
      updateDateBatch(this.db, { url }, set, callback);
      this.cache.updateByUrl(url, set);
    }
  }

  private _chooseTheStatus(url: string, isOnFilter: boolean, dirty: boolean, status: string) {
    if (dirty === true) {
      Log.warn(`${this.logPrefix} The ${url} is dirty and by bot is ${isOnFilter ? 'on' : 'not on'} filter but by user is ${status}.`);
      return status;
    }

    if (!isOnFilter === true) {
      Log.warn(`${this.logPrefix} The ${url} is out of filter`);
      return 'OUT_OF_FILTER';
    } else {
      Log.info(`${this.logPrefix} The ${url} is on filter`);
      return 'MATCHED';
    }
  }

  private _callback(err, result) {
    const { url } = this.property;
    if (err) {
      Log.error(`${this.logPrefix} Error to mine URL '${url}'`);
      return;
    }
    Log.debug(`${this.logPrefix} Success to mine URL '${url}': ${result}`);
  }

}

const mineDatabaseEntries = async (db: Db, cache: PropertyCache) => {
  try {
    const query = {
      provider: { $nin: [ 'idealista' ] },
      status: { $ne: 'UNVAILABLE' }
    };

    // reduce times to fetch idealista data
    // if the schedule did a complete cycle now it's time to remove provider from projection to include the 'idealista' on search
    if (idealistaCounterCycle === 0) {
      delete query.provider;
      idealistaCounterCycle = props.intervalIdealistaCounter;
    }

    const sort = { isDataMiningLastCheck: 1, dataMiningLastCheck: 1 };
    const properties = await batchProperties(db, query, sort, props.batchSize);

    properties.forEach(p =>
      new DataMiningBot(db, cache, p).mine()
    );
  } catch (err) {
    Log.error(`[minder]: Error to load properties from database: ${err.message}`);
    Log.error(err.stack);
  }
};

export { mineDatabaseEntries };
export default DataMiningBot;
