/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import AvailabilityBotFactory from '../availability/factory';
import Log from '../../config/logger';
import { batchProperties, updateDateBatch } from '../utils/schedulers-utils';

const sortField = 'availabilityLastCheck';

class AvailabilityBot {
  constructor(db, provider, url) {
    this.db = db;
    this.availability = AvailabilityBotFactory.getInstance(provider, url);
    this.url = url;
    this.logPrefix = this.availability.logPrefix;
    this.statusAvailability = 'PENDING';
    this.statusUnvailable = 'UNVAILABLE';
    this.sortField = sortField;
  }

  /**
   * @param {MongoDb} db - mongo connection
   */
  evaluate() {
    const url = this.url;
    const sortField = this.sortField;
    const callback = this.callback.bind(this);

    this.availability.evaluate(url)
      .then(() => {
        Log.info(`${this.logPrefix} The ${url} is a valid URL`);
        updateDateBatch(this.db, callback, {
          url, sortField, status: this.statusAvailability
        });
      })
      .catch(err => {
        if (!err.status && !err.status !== 404) {
          Log.error(`${this.logPrefix} Error to evaluate url ${url} availability: ${err}`);
          Log.error(err.stack);
          return;
        }
        Log.warn(`${this.logPrefix} ${err.message}`);
        updateDateBatch(this.db, callback, {
          url, sortField, status: this.statusUnvailable
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
        new AvailabilityBot(db, p.provider, p.url).evaluate()
      );
    } catch (err) {
      Log.error(`Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

}

export default AvailabilityBot;
