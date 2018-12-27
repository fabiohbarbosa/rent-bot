import CustoJustoProvider, { filters as custoJustoFilters } from '../crawdler/custojusto';
import IdealistaProvider, { filters as idealistaFilters } from '../crawdler/idealista';
import ImovirtualProvider, { filters as imovirtualFilters } from '../crawdler/imovirtual';
import OlxProvider, { filters as olxFilters } from '../crawdler/olx';

import Crawdler from '../crawdler';
import Log from '../../config/logger';

class Bot {
  static initialize() {
    Log.info('Initialising rent bot');
    Bot.rentBot(CustoJustoProvider, custoJustoFilters);
    Bot.rentBot(IdealistaProvider, idealistaFilters);
    Bot.rentBot(ImovirtualProvider, imovirtualFilters);
    Bot.rentBot(OlxProvider, olxFilters);
  }

  static rentBot(Provider, rawFilters) {
    Log.info(`Initialising crawl for ${Provider.name}...`);
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
}

export default Bot;
