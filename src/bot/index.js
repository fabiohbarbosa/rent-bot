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

class Bot {
  static crawlers() {
    Log.info('Initialising crawlers');
    Bot._crawle(CustoJustoProvider, custoJustoFilters);
    Bot._crawle(IdealistaProvider, idealistaFilters);
    Bot._crawle(ImovirtualProvider, imovirtualFilters);
    Bot._crawle(OlxProvider, olxFilters);
  }

  static _crawle(Provider, rawFilters) {
    Log.info(`Initialising crawle for ${Provider.name}...`);
    const filters = rawFilters.filter(filter => {
      if (!filter.enabled)
        Log.warn(`${filter.logPrefix} Skipping search...`);
      return filter.enabled;
    });

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      new Crawdler(Provider, filter).crawl().then(elements => {
        // save element
        Log.debug(elements);
      }).catch(err => {
        Log.error(err.stack);
      });
    }
  }

  static dataMining() {
    Log.info('Initialising data minings');
    Bot._mine(CustoJustoMiner);
    Bot._mine(IdealistaMiner);
    Bot._mine(ImovirtualMiner);
    Bot._mine(OlxMiner);
  }

  static _mine(Miner) {
    Log.info(`Initialising data mining for ${Miner.name}...`);
  }
}

export default Bot;
