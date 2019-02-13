import Log from '../../config/logger';
import Crawdler from '../crawdler';
import DataMiningBot from './data-mining-bot';

/**
 * @typedef {import('mongodb').Db} MongoDb
 */

class CrawlerBot {
  /**
   *
   * @param {MongoDb} db - mongo connection
   * @param {*} Provider - provider class to fetch properties
   * @param {*} rawFilters - searchs filters
   */
  static crawle(db, Provider, rawFilters) {
    const providerName = Provider.name.toLowerCase().replace('provider', '');
    Log.info(`[crawler:${providerName}]: Initialising crawle...`);

    const filters = rawFilters.filter(filter => {
      if (!filter.enabled)
        Log.warn(`${filter.logPrefix} Skipping search...`);
      return filter.enabled;
    });

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];

      new Crawdler(Provider, filter)
        .crawl()
        .then(elements => {
          if (!elements) return;

          elements.forEach(e => {
            // calback has been used to notify by e-mail
            const updateOneCallback = (err, result) => {
              if (err) {
                Log.error(`${filter.logPrefix} Error to insert or update property`);
                return;
              }

              Log.debug(`${filter.logPrefix} Success to insert or update property: ${result}`);

              if (result.upsertedCount > 0) {
                Log.info(`${filter.logPrefix} Found new property ${e.url}`);

                // DATA MINE
                new DataMiningBot(db, providerName, e.url).mine().then(() => {
                  Log.debug(`${filter.logPrefix} Success to mine ${e.url}`);
                }).catch(err => {
                  Log.error(`${filter.logPrefix} Error mine ${e.url}`);
                  Log.error(err);
                });

              } else {
                Log.debug(`${filter.logPrefix} The property ${e.url} already exists`);
              }
            };

            db.collection('properties').updateOne(
              { providerId: e.providerId },
              {
                $set: { ...e, provider: providerName },
                $setOnInsert: {
                  createAt: new Date(),
                  availabilityLastCheck: new Date(), isAvailabilityLastCheck: false,
                  dataMiningLastCheck: new Date(), isDataMiningLastCheck: false,
                  status: 'PENDING', notificated: false
                }
              },
              { upsert: true },
              updateOneCallback
            );
          });
        }).catch(err => {
          Log.error(err.stack);
        });
    }
  }
}

export default CrawlerBot;
