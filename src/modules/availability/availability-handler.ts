import { Db } from 'mongodb';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';
import Property from '@models/property';
import { updateProperties } from '@utils/batch-utils';

class AvailabilityHandler {
  constructor(private db: Db, private cache: PropertyCache) {}

  handle(logPrefix: string, property: Property, evaluate: Promise<void>) {
    const { url, status } = property;
    const timesUnvailable = property.timesUnvailable || 0;

    // default fields update for success and error
    let set = {
      availabilityLastCheck: new Date(),
      isAvailabilityLastCheck: true,
      status,
      timesUnvailable
    };

    evaluate.then(() => {
      Log.info(`${logPrefix} The ${url} is a valid URL`);
      set = {
        ...set,
        status: status === 'UNAVAILABLE' ? 'PENDING' : status,
        timesUnvailable: 0 // cleanup unvailable counts to prevent lost temporaly unvailable property
      }
    }).catch(err => {
      if (err.status && err.status === 404) {
        Log.warn(`${logPrefix} ${err.message}`);
        set = {
          ...set,
          status: 'UNAVAILABLE',
          timesUnvailable: timesUnvailable + 1
        };
      } else {
        Log.error(`${logPrefix} ${err.message}`);
      }
    }).finally(() => {
      updateProperties(this.db, { url }, set, (err, result) => {
        if (err) {
          Log.error(`${logPrefix} Error to update availability batch date to ${url}`);
          return;
        }
        Log.debug(`${logPrefix} Success to update availability batch date: ${result}`);
      });
      try {
        this.cache.updateByUrl(url, set);
      } catch(err) {
        Log.error(`${logPrefix} ${err.message}`);
      }
    });
  }
}

export default AvailabilityHandler;
