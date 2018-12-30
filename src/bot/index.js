/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import CrawlerBot from './crawler-bot';
import DataMiningBot from './data-mining-bot';
import AvailabilityBot from './availability-bot';

import CustoJustoProvider, { filters as custoJustoFilters } from '../crawdler/custojusto';
import IdealistaProvider, { filters as idealistaFilters } from '../crawdler/idealista';
import ImovirtualProvider, { filters as imovirtualFilters } from '../crawdler/imovirtual';
import OlxProvider, { filters as olxFilters } from '../crawdler/olx';

import CustoJustoMiner from '../miners/custojusto';
import IdealistaMiner from '../miners/idealista';
import ImovirtualMiner from '../miners/imovirtual';
import OlxMiner from '../miners/olx';

import Log from '../../config/logger';
import props, { crawlerInterval, availableInterval, dataMiningInterval } from '../../config/props';

class Bot {

  /**
   * Crawler
   * @param {MongoDb} db - mongo connection
   */
  static crawlers(db) {
    if (!props.bots.crawler) {
      Log.warn('Skipping crawlers...');
      return;
    }

    Log.info('Initialising crawlers');

    const start = () => {
      CrawlerBot.crawle(db, CustoJustoProvider, custoJustoFilters);
      CrawlerBot.crawle(db, ImovirtualProvider, imovirtualFilters);
      CrawlerBot.crawle(db, OlxProvider, olxFilters);
      CrawlerBot.crawle(db, IdealistaProvider, idealistaFilters);
    };

    start();
    setInterval(start, crawlerInterval);
  }

  /**
   * Data mining
   * @param {MongoDb} db - mongo connection
   */
  static dataMining(db) {
    if (!props.bots.dataMining) {
      Log.warn('Skipping data mining...');
      return;
    }

    Log.info('Initialising data minings');

    const start = () => {
      DataMiningBot.mine(db, CustoJustoMiner);
      DataMiningBot.mine(db, IdealistaMiner);
      DataMiningBot.mine(db, ImovirtualMiner);
      DataMiningBot.mine(db, OlxMiner);
    };

    start();
    setInterval(start, dataMiningInterval);
  }

  /**
   * Evaluate Availability
   * @param {MongoDb} db - mongo connection
   */
  static evaluateAvailability(db) {
    if (!props.bots.availability) {
      Log.warn('Skipping evaluate availability...');
      return;
    }

    Log.info('Initialising evaluate availability');

    const start = () => {
      AvailabilityBot.evaluate(db);
    };

    start();
    setInterval(start, availableInterval);
  }
}

export default Bot;
