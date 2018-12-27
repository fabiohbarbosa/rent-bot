// import ImovirtualProvider, { urls as imovirtualUrls } from '../crawdler/imovirtual';
import OlxProvider, { filters as olxFilters } from '../crawdler/olx';
// import IdealistaProvider, { urls as idealistaUrls } from '../crawdler/idealista';
// import CustoJustoProvider, { urls as custoJustoUrls } from '../crawdler/custojusto';

import Crawdler from '../crawdler';
import Log from '../../config/logger';

class Bot {
  static initialize() {
    Log.info('Initialising rent bot');
    // Bot.setupProvider(ImovirtualProvider, imovirtualUrls);
    Bot.setupProvider(OlxProvider, olxFilters);
    // Bot.setupProvider(IdealistaProvider, idealistaUrls);
    // Bot.setupProvider(CustoJustoProvider, custoJustoUrls);
  }

  static setupProvider(Provider, filters) {
    const providerName = Provider.name.replace('Provider', '');
    const logPrefix = `[${providerName.toLowerCase()}]`;

    Log.info(`${logPrefix} Initialising...`);
    filters.filter(c => {
      if (!c.enabled)
        Log.warn(`${logPrefix} Search skipped...`);
      return c.enabled;
    }).forEach(c => new Crawdler().crawl(Provider, c.type, c.topology, c.url));
  }
}

export default Bot;
