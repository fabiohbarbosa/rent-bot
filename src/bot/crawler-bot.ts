import { Db } from 'mongodb';

import Log from '@config/logger';
import { isMatched } from '@utils/energetic-certify';
import NotificationService from '@utils/notification-service';
import Crawdler from '@modules/crawdler';
import DataMiningBot from './data-mining-bot';
import CrawlerProvider, { CrawlerFilter } from '@modules/crawdler/crawler-provider';

class CrawlerBot {
  static crawle(db: Db, Provider: typeof CrawlerProvider, rawFilters: CrawlerFilter[]) {
    const providerName = Provider.name.toLowerCase().replace('provider', '');
    Log.info(`[crawler:${providerName}]: Initialising crawle...`);

    const filters = rawFilters.filter(f => {
      if (!f.enabled)
        Log.warn(`${f.logPrefix} Skipping search...`);
      return f.enabled;
    });

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      new Crawdler(Provider, filter)
        .crawl()
        .then(properties => {
          if (!properties) return;

          properties.forEach(p => {
            const logPrefix = filter.logPrefix;
            const property = { ...p, provider: providerName };

            const callback = CrawlerBot.buildCallback(db, property, logPrefix);
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

            db.collection('properties').updateOne({ providerId }, update, { upsert: true }, callback);

            // notificate new entries by email
            if (status === 'MATCHED' && !property.notificated)
              new NotificationService(logPrefix, db).notificateByEmail(property);
          });
        }).catch(err => {
          Log.error(err.stack);
        });

    }
  }

  static buildCallback(db, property, logPrefix) {
    // calback has been used to data mining
    return (err, result) => {
      if (err) {
        Log.error(`${logPrefix} Error to insert or update property`);
        return;
      }

      Log.debug(`${logPrefix} Success to insert or update property: ${result}`);

      // new property found
      if (result.upsertedCount === 0) {
        Log.debug(`${logPrefix} The property ${property.url} already exists`);
        return;
      }

      Log.info(`${logPrefix} Found new property ${property.url}`);

      new DataMiningBot(db, property).mine()
        .then(() => Log.debug(`${logPrefix} Success to mine ${property.url}`))
        .catch(e => {
          Log.error(`${logPrefix} Error mine ${property.url}`);
          Log.error(e);
        });
    };
  }


}

export default CrawlerBot;
