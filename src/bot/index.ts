import CrawlerBot from './crawler-bot';
import DataMiningBot from './data-mining-bot';
import AvailabilityBot from './availability-bot';

import CustoJustoProvider, { filters as custoJustoFilters } from '@modules/crawdler/providers/custojusto';
import IdealistaProvider, { filters as idealistaFilters } from '@modules/crawdler/providers/idealista';
import ImovirtualProvider, { filters as imovirtualFilters } from '@modules/crawdler/providers/imovirtual';
import OlxProvider, { filters as olxFilters } from '@modules/crawdler/providers/olx';

import Log from '@config/logger';
import props from '@config/props';

class Bot {
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
