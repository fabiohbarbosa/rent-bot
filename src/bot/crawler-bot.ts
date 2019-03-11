import { Db } from 'mongodb';

import Log from '@config/logger';
import { isMatched } from '@utils/energetic-certify';
import NotificationService from '@utils/notification-service';
import Crawdler from '@modules/crawdler';
import DataMiningBot from './data-mining-bot';
import CrawlerProvider, { CrawlerFilter } from '@modules/crawdler/crawler-provider';
import Property from '@models/property';
import PropertyCache from '@lib/property-cache';

class CrawlerBot {

  constructor(private db: Db,
    private propertyCache: PropertyCache,
    private providerClass: typeof CrawlerProvider,
    private rawFilters: CrawlerFilter[]) {
  }

  private _buildProviderName() {
    return this.providerClass.name.toLowerCase().replace('provider', '');
  }

  private _getEnabledFilters() {
    return this.rawFilters.filter(f => {
      if (!f.enabled)
        Log.warn(`${f.logPrefix} Skipping search...`);
      return f.enabled;
    });
  }

  private _crawlerCallback(logPrefix: string, property: Property, status: string) {
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

      // new property
      Log.info(`${logPrefix} Found new property ${property.url}`);
      this.propertyCache.add(property);

      if (status === 'MATCHED') {
        new NotificationService(logPrefix, this.db).notificateByEmail(property);
      }

      new DataMiningBot(this.db, property).mine()
        .then(() => Log.debug(`${logPrefix} Success to mine ${property.url}`))
        .catch(e => {
          Log.error(`${logPrefix} Error to mine ${property.url}`);
          Log.error(e);
        });
    };
  }

  private _handle(logPrefix: string, property: Property) {
    const energyCertify = property.energeticCertificate;
    const status = energyCertify && isMatched(energyCertify) ? 'MATCHED' : 'PENDING';
    const providerId = property.providerId;
    const update = {
      $set: property,
      $setOnInsert: {
        createAt: new Date(),
        availabilityLastCheck: new Date(), isAvailabilityLastCheck: false,
        dataMiningLastCheck: new Date(), isDataMiningLastCheck: false,
        status, notificated: false
      }
    };

    const callback = this._crawlerCallback(logPrefix, property, status);
    this.db.collection('properties').updateOne({ providerId }, update, { upsert: true }, callback);
  }

  crawle() {
    const providerName = this._buildProviderName();
    Log.info(`[crawler:${providerName}]: Initialising crawler...`);
    const filters = this._getEnabledFilters();

    filters.forEach(filter => {
      new Crawdler(this.providerClass, filter)
        .crawl()
        .then(properties => {
          if (!properties) return;
          properties.forEach((p: Property) => {
            const handleProperty = { ...p, provider: providerName };
            this._handle(filter.logPrefix, handleProperty);
          });
        }).catch(err => {
          Log.error(err.stack);
        });
    });
  }
}

export default (db: Db,
                cache: PropertyCache,
                provider: {
                  providerClass: typeof CrawlerProvider,
                  searchFilters: CrawlerFilter[]
                }) => {

  const { providerClass, searchFilters } = provider;
  new CrawlerBot(db, cache, providerClass, searchFilters)
    .crawle();
};
