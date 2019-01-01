/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import AvailabilityBotFactory from '../availability/factory';
import Log from '../../config/logger';
import props from '../../config/props';
import { batchProperties, updateDateBatch } from '../utils/batch-utils';

class AvailabilityBot {
  constructor(db, provider, url, timesUnvailable) {
    this.db = db;
    this.url = url;
    this.availability = AvailabilityBotFactory.getInstance(provider, url);
    this.logPrefix = this.availability.logPrefix;

    const count = timesUnvailable ? timesUnvailable : 0;
    this.timesUnvailable = count;
  }

  /**
   * @param {MongoDb} db - mongo connection
   */
  evaluate() {
    const callback = this.callback.bind(this);

    this.availability.evaluate(this.url)
      .then(() => {
        Log.info(`${this.logPrefix} The ${this.url} is a valid URL`);
        updateDateBatch(this.db,
          { url: this.url },
          {
            availabilityLastCheck: new Date(),
            isAvailabilityLastCheck: true,
            status: 'PENDING'
          },
          callback
        );
      })
      .catch(err => {
        const set = {
          availabilityLastCheck: new Date(),
          isAvailabilityLastCheck: true
        };

        // caught up miner else is unknown error
        if (err.status && err.status === 404) {
          Log.warn(`${this.logPrefix} ${err.message}`);
          set['status'] = 'UNVAILABLE';
          set['timesUnvailable'] = this.timesUnvailable + 1; // increase time that website was unvailable
        } else {
          Log.error(`${this.logPrefix} ${err.message}`);
        }

        updateDateBatch(this.db, { url: this.url }, set, callback);
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
      const query = {
        $or: [
          { timesUnvailable: { $lte: 50 } },
          { timesUnvailable: null }
        ]
      };
      const sort = { isAvailabilityLastCheck: 1, availabilityLastCheck: 1 };
      const { batchSize } = props.bots.availability;

      const properties = await batchProperties(db, query, sort, batchSize);
      properties.forEach(p =>
        new AvailabilityBot(db, p.provider, p.url, p.timesUnvailable).evaluate()
      );
    } catch (err) {
      Log.error(`Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }



}

export default AvailabilityBot;
