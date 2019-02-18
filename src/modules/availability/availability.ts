import { Db } from 'mongodb';

import Log from '@config/logger';
import Property from '@models/property';
import { updateDateBatch } from '@utils/batch-utils';

import AvailabilityBotFactory from './factory';

class Availability {
  logPrefix: string;

  constructor(private db: Db) { }

  public evaluate(property: Property) {
    const { provider, url, status } = property;
    const timesUnvailable = property.timesUnvailable || 0;

    const availability = AvailabilityBotFactory.getInstance(provider, url);
    this.logPrefix = availability.logPrefix;

    const callback = this.buildCallback(url);

    // default fields update for success and error
    let set = {
      availabilityLastCheck: new Date(),
      isAvailabilityLastCheck: true,
      status,
      timesUnvailable
    };

    availability.evaluate(url)
      .then(() => {
        Log.info(`${this.logPrefix} The ${url} is a valid URL`);
        updateDateBatch(
          this.db,
          { url: url },
          {
            ...set,
            status: status === 'UNVAILABLE' ? 'PENDING' : status,
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
            timesUnvailable: timesUnvailable + 1
          };
        } else {
          Log.error(`${this.logPrefix} ${err.message}`);
        }

        updateDateBatch(
          this.db,
          { url: url },
          set,
          callback);
      });
  }

  private buildCallback(url: string) {
    const callback = (err, result) => {
      if (err) {
        Log.error(`${this.logPrefix} Error to update availability batch date to ${url}`);
        return;
      }
      Log.debug(`${this.logPrefix} Success to update availability batch date: ${result}`);
    };
    return callback;
  }
}

export default Availability;
