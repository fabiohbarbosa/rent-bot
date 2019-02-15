/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import MinerBotFactory from '../miners/factory';
import Log from '../../config/logger';
import allProps from '../../config/props';
import { batchProperties, updateDateBatch } from '../utils/batch-utils';

// get only dataMining properties
const props = allProps.bots.dataMining;
let idealistaCounterCycle = props.intervalIdealistaCounter;

class DataMiningBot {
  constructor(db, property) {
    const { provider, url, status, dirty } = property;

    this.db = db;
    this.url = url;
    this.status = status;
    this.dirty = dirty;

    this.miner = MinerBotFactory.getInstance(provider, url);
    this.logPrefix = this.miner.logPrefix;
  }

  /**
   * @param {MongoDb} db - mongo connection
   */
  async mine() {
    const url = this.url;
    let status = this.status;

    const callback = this.callback.bind(this);

    try {
      const { isOnFilter, data } = await this.miner.mine(url);

      if (!isOnFilter && this.dirty === false) {
        status = 'OUT_OF_FILTER';
        Log.warn(`${this.logPrefix} The ${url} is out of filter`);
      } else if (isOnFilter && this.dirty === false) {
        status = 'MATCHED';
        Log.info(`${this.logPrefix} The ${url} is on filter`);
      } else {
        Log.warn(`${this.logPrefix} The ${url} is dirty and by bot is ${isOnFilter ? 'on' : 'not on'} filter but by user is ${status}`);
      }

      const set = {
        ...data,
        dataMiningLastCheck: new Date(),
        isDataMiningLastCheck: true,
        status
      };

      updateDateBatch(this.db, { url }, set, callback);
    } catch (err) {
      const set = {
        dataMiningLastCheck: new Date(),
        isDataMiningLastCheck: true,
      };
      updateDateBatch(this.db, { url }, set, callback);
    }
  };

  callback(err, result) {
    if (err) {
      Log.error(`${this.logPrefix} Error to mine url ${this.url}`);
      return;
    }
    Log.debug(`${this.logPrefix} Success to mine url ${this.url}: ${result}`);
  };

  static async initialise(db) {
    try {
      const query = {
        provider: { $ne: 'idealista' },
        status: { $ne: 'UNVAILABLE' }
      };

      // reduce times to fetch idealista data
      // if the schedule did a complete cycle now it's time to remove provider from projection to include the 'idealista' on search
      if (idealistaCounterCycle === 0) {
        delete query['provider'];
        idealistaCounterCycle = props.intervalIdealistaCounter;
      }

      const sort = { isDataMiningLastCheck: 1, dataMiningLastCheck: 1 };
      const properties = await batchProperties(db, query, sort, props.batchSize);

      properties.forEach(p => {
        const property = {
          provider: p.provider,
          url: p.url,
          status: p.status,
          dirty: p.dirty !== undefined ? p.dirty : false
        };

        new DataMiningBot(db, property).mine();
      });
    } catch (err) {
      Log.error(`[minder]: Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

}

export default DataMiningBot;
