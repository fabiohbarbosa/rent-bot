/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import MinerBotFactory from '../miners/factory';
import Log from '../../config/logger';
import { batchProperties, updateDateBatch } from '../utils/schedulers-utils';

const sortField = 'dataMiningLastCheck';

class DataMiningBot {
  constructor(db, provider, url) {
    this.db = db;
    this.miner = MinerBotFactory.getInstance(provider, url);
    this.url = url;
    this.logPrefix = this.miner.logPrefix;
    this.status = 'OUT_OF_FILTER';
    this.sortField = sortField;
  }

  /**
   * @param {MongoDb} db - mongo connection
   */
  mine() {
    const url = this.url;
    const sortField = this.sortField;
    const callback = this.callback.bind(this);
    const status = this.status;

    this.miner.mine(url)
      .then((energeticCertificate) => {
        Log.info(`${this.logPrefix} Success to mine ${url}`);
        updateDateBatch(this.db, callback, {
          url, sortField, set: { energeticCertificate }
        });
      })
      .catch(err => {
        // Unknown error
        if (!err.status && !err.status !== 400) {
          Log.error(`${this.logPrefix} Error to mine ${url}: ${err}`);
          Log.error(err.stack);
          return;
        }

        // BotError
        const { energeticCertificate } = err.fields;
        Log.warn(`${this.logPrefix} ${err.message}`);
        updateDateBatch(this.db, callback, {
          url, sortField, status, set: { energeticCertificate }
        });
      });
  };

  callback(err, result) {
    if (err) {
      Log.error(`${this.logPrefix} Error to update availability batch date to ${this.url}`);
      return;
    }
    Log.debug(`${this.logPrefix} Success to update availability batch date: ${result}`);
  };

  static async initialise(db) {
    try {
      const properties = await batchProperties(db, sortField);
      properties.forEach(p =>
        new DataMiningBot(db, p.provider, p.url).mine()
      );
    } catch (err) {
      Log.error(`Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

}

export default DataMiningBot;
