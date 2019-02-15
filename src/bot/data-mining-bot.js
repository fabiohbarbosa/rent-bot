/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import MinerBotFactory from '../miners/factory';
import Log from '../../config/logger';
import allProps from '../../config/props';
import { batchProperties, updateDateBatch } from '../utils/batch-utils';
import MailService from '../mail/mail-service';

// get only dataMining properties
const props = allProps.bots.dataMining;
let idealistaCounterCycle = props.intervalIdealistaCounter;

class DataMiningBot {
  constructor(db, property) {
    this.db = db;
    this.property = property;

    this.miner = MinerBotFactory.getInstance(property.provider, property.url);
    this.logPrefix = this.miner.logPrefix;
  }

  /**
   * @param {MongoDb} db - mongo connection
   */
  async mine() {
    const { url, dirty, notificated, status } = this.property;
    const callback = this._callback.bind(this);

    try {
      const { isOnFilter, data } = await this.miner.mine(url);
      const newStatus = this._chooseTheStatus(url, isOnFilter, dirty, status);
      const set = {
        ...data,
        dataMiningLastCheck: new Date(),
        isDataMiningLastCheck: true,
        status: newStatus
      };

      updateDateBatch(this.db, { url }, set, callback);
      this._notificateByEmail(isOnFilter, notificated, this.property);
    } catch (err) {
      const set = {
        dataMiningLastCheck: new Date(),
        isDataMiningLastCheck: true,
      };
      updateDateBatch(this.db, { url }, set, callback);
    }
  };

  _chooseTheStatus(url, isOnFilter, dirty, status) {
    if (dirty === true) {
      Log.warn(`${this.logPrefix} The ${url} is dirty and by bot is ${isOnFilter ? 'on' : 'not on'} filter but by user is ${status}. The status won't be change`);
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

  _notificateByEmail(isOnFilter, notificated, property) {
    if (isOnFilter !== true || notificated === true) {
      return;
    }
    MailService.send(property);
  }

  _callback(err, result) {
    const url = this.property.url;
    if (err) {
      Log.error(`${this.logPrefix} Error to mine url ${url}`);
      return;
    }
    Log.debug(`${this.logPrefix} Success to mine url ${url}: ${result}`);
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

      properties.forEach(p =>
        new DataMiningBot(db, p).mine()
      );
    } catch (err) {
      Log.error(`[minder]: Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

}

export default DataMiningBot;
