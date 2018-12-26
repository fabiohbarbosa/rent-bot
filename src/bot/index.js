import ImovirtualProvider, { urls as imovirtualUrls } from '../crawdler/imovirtual';
import OlxProvider, { urls as olxUrls } from '../crawdler/olx';
import IdealistaProvider, { urls as idealistaUrls } from '../crawdler/idealista';
import CustoJustoProvider, { urls as custoJustoUrls } from '../crawdler/custojusto';

import Crawdler from '../crawdler';
import Log from '../../config/logger';

class Bot {
  static initialize() {
    Log.info('Initialising rent bot');
    Bot.setupProvider(ImovirtualProvider, imovirtualUrls);
    Bot.setupProvider(OlxProvider, olxUrls);
    Bot.setupProvider(IdealistaProvider, idealistaUrls);
    Bot.setupProvider(CustoJustoProvider, custoJustoUrls);
  }

  static setupProvider(Provider, config) {
    const providerName = Provider.name.replace('Provider', '');
    Log.info(`Initialising ${providerName}`);
    config.filter(c => {
      if (!c.enabled)
        Log.warn(`[${providerName.toLowerCase()}:${c.name}] Search skipped...`);
      return c.enabled;
    }).forEach(c => new Crawdler().crawl(Provider, c.name, c.url));
  }
}

export default Bot;
