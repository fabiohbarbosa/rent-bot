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

import Log from '../../config/logger';
import props from '../../config/props';

class Bot {

  /**
   * Crawler
   * @param {MongoDb} db - mongo connection
   */
  static crawlers(db) {
    const { crawler } = props.bots;
    const logPrefix = '[bot:crawler]:';

    if (!crawler.enabled) {
      Log.warn(`${logPrefix} Skipping...`);
      return;
    }

    Log.info(`${logPrefix} Initialising...`);
    const start = () => {
      CrawlerBot.crawle(db, CustoJustoProvider, custoJustoFilters);
      CrawlerBot.crawle(db, ImovirtualProvider, imovirtualFilters);
      CrawlerBot.crawle(db, OlxProvider, olxFilters);
    };

    const startIdealista = () => {
      CrawlerBot.crawle(db, IdealistaProvider, idealistaFilters);
    };

    setTimeout(() => {
      start();
      startIdealista();
    }, crawler.delay);

    setInterval(start, crawler.interval);
    setInterval(startIdealista, crawler.interval * crawler.intervalIdealistaMultipler);
  }

  /**
   * Data mining
   * @param {MongoDb} db - mongo connection
   */
  static dataMining(db) {
    const { dataMining } = props.bots;
    const logPrefix = '[bot:crawler]:';

    if (!dataMining.enabled) {
      Log.warn(`${logPrefix} Skipping...`);
      return;
    }

    Log.info(`${logPrefix} Initialising...`);

    const start = () => {
      DataMiningBot.initialise(db);
    };

    setTimeout(() => start(), dataMining.delay);
    setInterval(start, dataMining.interval);
  }

  /**
   * Evaluate Availability
   * @param {MongoDb} db - mongo connection
   */
  static evaluateAvailability(db) {
    const { availability } = props.bots;
    const logPrefix = '[bot:availability]:';

    if (!availability.enabled) {
      Log.warn(`${logPrefix} Skipping...`);
      return;
    }

    Log.info(`${logPrefix} Initialising...`);

    const start = () => {
      AvailabilityBot.initialise(db);
    };

    setTimeout(() => start(), availability.delay);
    setInterval(start, availability.interval);
  }
}

export default Bot;
