/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import MinerBotFactory from '../miners/factory';
import Log from '../../config/logger';
import props from '../../config/props';
import { batchProperties, updateDateBatch } from '../utils/batch-utils';

class DataMiningBot {
  constructor(db, provider, url) {
    this.db = db;
    this.miner = MinerBotFactory.getInstance(provider, url);
    this.url = url;
    this.logPrefix = this.miner.logPrefix;
  }

  /**
   * @param {MongoDb} db - mongo connection
   */
  async mine() {
    const url = this.url;
    const callback = this.callback.bind(this);

    try {
      const { isOnFilter, data } = await this.miner.mine(url);

      let status = 'PENDING';
      if (!isOnFilter) {
        Log.warn(`${this.logPrefix} The ${url} is out of filter`);
        status = 'OUT_OF_FILTER';
      } else {
        Log.info(`${this.logPrefix} The ${url} is on filter`);
      }

      const set = {
        ...data,
        dataMiningLastCheck: new Date(),
        isDataMiningLastCheck: true,
        status
      };

      updateDateBatch(this.db, { url }, set, callback);
    } catch (err) {
      Log.error(err);

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
        status: { $ne: 'UNVAILABLE' }, provider: 'idealista'
      };

      const sort = { isDataMiningLastCheck: 1, dataMiningLastCheck: 1 };
      const { batchSize } = props.bots.dataMining;

      const properties = await batchProperties(db, query, sort, batchSize);

      properties.forEach(p =>
        new DataMiningBot(db, p.provider, p.url).mine()
      );
    } catch (err) {
      Log.error(`[minder]: Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

}

export default DataMiningBot;
