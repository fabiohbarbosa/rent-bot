/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import CustoJustoProvider, { filters as custoJustoFilters } from '../crawdler/custojusto';
import IdealistaProvider, { filters as idealistaFilters } from '../crawdler/idealista';
import ImovirtualProvider, { filters as imovirtualFilters } from '../crawdler/imovirtual';
import OlxProvider, { filters as olxFilters } from '../crawdler/olx';

import CustoJustoMiner from '../miners/custojusto';
import IdealistaMiner from '../miners/idealista';
import ImovirtualMiner from '../miners/imovirtual';
import OlxMiner from '../miners/olx';

import Crawdler from '../crawdler';
import Log from '../../config/logger';
import { start } from 'repl';

class Bot {
  /**
   *
   * @param {MongoDb} db - mongo connection
   */
  static crawlers(db) {
    Log.info('Initialising crawlers');
    const start = (fct, milliseconds) => {
      setInterval(fct, milliseconds);
    };

    start(() => {
      Bot._crawle(db, CustoJustoProvider, custoJustoFilters);
      Bot._crawle(db, ImovirtualProvider, imovirtualFilters);
      Bot._crawle(db, OlxProvider, olxFilters);
      Bot._crawle(db, IdealistaProvider, idealistaFilters);
    }, 60000);
  }

  /**
   *
   * @param {MongoDb} db - mongo connection
   * @param {*} provider - provider to fetch properties
   * @param {*} rawFilters - searchs filters
   */
  static _crawle(db, Provider, rawFilters) {
    const providerName = Provider.name.toLowerCase().replace('provider', '');
    Log.info(`Initialising crawle for ${providerName}...`);

    const filters = rawFilters.filter(filter => {
      if (!filter.enabled)
        Log.warn(`${filter.logPrefix} Skipping search...`);
      return filter.enabled;
    });

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      const insertCallback = (err, result) => {
        if (err)
          Log.error(`${filter.logPrefix} Error to insert or update property`);
        Log.debug(`${filter.logPrefix} Success to insert or update property: ${result}`);
      };

      new Crawdler(Provider, filter)
        .crawl()
        .then(elements => {
          if (!elements) return;
          // save element
          elements.forEach(e => {
            db.collection('properties').updateOne(
              { providerId: e.providerId },
              {
                $set: { ...e, provider: providerName, status: 'PENDING' },
                $setOnInsert: { createAt: new Date() }
              },
              { upsert: true },
              insertCallback
            );
          });
        }).catch(err => {
          Log.error(err.stack);
        });
    }
  }

  /**
   *
   * @param {MongoDb} db - mongo connection
   */
  static dataMining(db) {
    Log.info('Initialising data minings');
    Bot._mine(db, CustoJustoMiner);
    Bot._mine(db, IdealistaMiner);
    Bot._mine(db, ImovirtualMiner);
    Bot._mine(db, OlxMiner);
  }

  /**
   *
   * @param {MongoDb} db - mongo connection
   * @param {*} Minder - data miner of provider data
   */
  static _mine(db, Miner) {
    Log.info(`Initialising data mining for ${Miner.name}...`);
  }
}

export default Bot;
