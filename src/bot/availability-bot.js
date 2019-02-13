/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import AvailabilityBotFactory from '../availability/factory';
import Log from '../../config/logger';
import props from '../../config/props';
import { batchProperties, updateDateBatch } from '../utils/batch-utils';

let idealistaCounterCycle = props.bots.availability.intervalIdealistaCounter;

class AvailabilityBot {
  /**
   * @param {MongoDb} db - mongo connection
   */
  constructor(db, provider, url, timesUnvailable, status) {
    this.db = db;
    this.url = url;
    this.availability = AvailabilityBotFactory.getInstance(provider, url);
    this.logPrefix = this.availability.logPrefix;
    this.timesUnvailable = timesUnvailable || 0;
    this.status = status;
  }

  evaluate() {
    const callback = this.callback.bind(this);
    // default fields update for success and error
    let set = {
      availabilityLastCheck: new Date(),
      isAvailabilityLastCheck: true
    };

    this.availability.evaluate(this.url)
      .then(() => {
        Log.info(`${this.logPrefix} The ${this.url} is a valid URL`);
        updateDateBatch(
          this.db,
          { url: this.url },
          {
            ...set,
            status: this.status === 'UNVAILABLE' ? 'PENDING' : this.status,
            timesUnvailable: 0 // cleanup unvailable counts to prevent lost property after long time
          },
          callback
        );
      })
      .catch(err => {
        // caught up miner else is unknown error
        if (err.status && err.status === 404) {
          Log.warn(`${this.logPrefix} ${err.message}`);
          set = {
            ...set,
            status: 'UNVAILABLE',
            timesUnvailable: this.timesUnvailable + 1
          };
        } else {
          Log.error(`${this.logPrefix} ${err.message}`);
        }

        updateDateBatch(
          this.db,
          { url: this.url },
          set,
          callback);
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
        provider: { $ne: 'idealista' },
        $or: [
          { timesUnvailable: { $lte: 50 } },
          { timesUnvailable: null }
        ]
      };

      // reduce times to fetch idealista data
      if (idealistaCounterCycle === 0) {
        delete query['provider'];
        idealistaCounterCycle = props.bots.availability.intervalIdealistaCounter;
      }

      const sort = { isAvailabilityLastCheck: 1, availabilityLastCheck: 1 };
      const { batchSize } = props.bots.availability;

      const properties = await batchProperties(db, query, sort, batchSize);
      properties.forEach(p =>
        new AvailabilityBot(db, p.provider, p.url, p.timesUnvailable, p.status).evaluate()
      );

      idealistaCounterCycle--;

    } catch (err) {
      Log.error(`[availability] Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }


}

export default AvailabilityBot;
