import { Db } from 'mongodb';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';

import NotificationService from '@lib/notification-service';
import { updateDateBatch } from '@utils/batch-utils';

import Property from '@models/property';

import { MinerProviderResponse } from '@modules/miners/miner-provider';

class MinerHandler {
  constructor(private db: Db, private cache: PropertyCache) { }

  async handle(logPrefix: string, property: Property, response: MinerProviderResponse) {
    const { url, notificated } = property;
    const { data, isOnFilter } = response;

    let set: Property = {
      dataMiningLastCheck: new Date(),
      isDataMiningLastCheck: true,
    };

    try {
      const status = this._chooseTheStatus(logPrefix, property, response);
      set = {
        ...set,
        ...data,
        status
      };

      // email notification for new entries
      if (isOnFilter && !notificated) {
        new NotificationService(logPrefix, this.db).notificateByEmail(property);
      }
    } catch (err) {
      Log.error(`[minder]: Error to mine ${property.url}: ${err.message}`);
      Log.error(err);
    } finally {
      updateDateBatch(this.db, { url }, set, (err, result) => {
        if (err) {
          Log.error(`${logPrefix} Error to mine URL '${url}'`);
          return;
        }
        Log.debug(`${logPrefix} Success to mine URL '${url}': ${result}`);
      });
      try {
        this.cache.updateByUrl(url, set);
      } catch(err) {
        Log.error(`${logPrefix} ${err.message}`);
      }
    }
  }

  protected _chooseTheStatus(logPrefix: string, property: Property, response: MinerProviderResponse) {
    const { dirty, url, status } = property;
    const { isOnFilter } = response;

    if (dirty === true) {
      Log.warn(`${logPrefix} The ${url} is dirty and by bot is ${isOnFilter ? 'on' : 'not on'} filter but by user is ${status}.`);
      return status;
    }

    if (isOnFilter === true) {
      Log.info(`${logPrefix} The ${url} is on filter`);
      return 'MATCHED';
    } else {
      Log.warn(`${logPrefix} The ${url} is out of filter`);
      return 'OUT_OF_FILTER';
    }
  }
}

export default MinerHandler;
