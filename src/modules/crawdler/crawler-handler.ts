import { Db } from 'mongodb';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';
import NotificationService from '@lib/notification-service';

import { isMatched } from '@utils/energetic-certify';

import MinerBot from '@modules/miners/miner-bot';
import Property from '@models/property';

class CrawlerHandler {
  constructor(private db: Db, private cache: PropertyCache) { }

  async handle(logPrefix: string, property: Property) {
    const energyCertify = property.energeticCertificate;
    const status = energyCertify && isMatched(energyCertify) ? 'MATCHED' : 'PENDING';
    const providerId = property.providerId;
    const setOnInsert = {
      createAt: new Date(),
      availabilityLastCheck: new Date(), isAvailabilityLastCheck: false,
      dataMiningLastCheck: new Date(), isDataMiningLastCheck: false,
      status, notificated: false
    };

    const update = {
      $set: property,
      $setOnInsert: setOnInsert
    };

    const callback = this._updateOneCallback(logPrefix, property, setOnInsert);
    this.db.collection('properties').updateOne({ providerId }, update, { upsert: true }, callback);
  }

  private _updateOneCallback(logPrefix: string, property: Property, setOnInsert: Property) {
    const newPropertyExecution = () => {
      Log.info(`${logPrefix} Found new property ${property.url}`);

      // merge both array to simulate the new property object fields
      const newProperty = {
        ...property, ...setOnInsert
      };

      this.cache.add(newProperty);

      if (property.status === 'MATCHED') {
        new NotificationService(logPrefix, this.db).notificateByEmail(property);
      }

      new MinerBot(this.db, this.cache).mine(property);
    };


    return (err, result) => {
      if (err) {
        Log.error(`${logPrefix} Error to insert or update property`);
        return;
      }

      Log.debug(`${logPrefix} Success to insert or update property: ${result}`);

      // exist property
      if (result.upsertedCount === 0) {
        Log.debug(`${logPrefix} The property ${property.url} already exists`);
        return;
      }

      // new property logic
      newPropertyExecution();
    };
  }
}

export default CrawlerHandler;
