import Log from '@config/logger';
import { dataFilters } from '@config/props';
import CrawlerProvider, { CrawlerFilter } from './crawler-provider';

class Crawler {
  private provider: CrawlerProvider;
  private logPrefix: string;
  private url: string;

  constructor(Provider, private providerName: string, private filters: CrawlerFilter) {
    const { url, logPrefix, type, topology } = filters;
    this.provider = new Provider(logPrefix, type, topology, url);
    this.logPrefix = logPrefix;
    this.url = url;
  }

  async crawl() {
    try {
      const elementsRaw = await this.provider.parse();
      const elements = elementsRaw.filter(e => {
        if (e.price > dataFilters.maxPrice) return false;
        if (dataFilters.onlyPhoto) return e.photos.length > 0;
        return true;
      });

      if (elements.length === 0) {
        Log.warn(`${this.logPrefix}: Not found elements for provider '${this.providerName}' with filter '${JSON.stringify(this.filters)}'`);
      } else {
        Log.info(`${this.logPrefix}: Found ${elements.length} elements for provider '${this.providerName}' with filter '${JSON.stringify(this.filters)}'`);
      }

      return elements;
    } catch (err) {
      Log.error(`${this.logPrefix} Error to crawling provider '${this.providerName}''s url: '${this.url}'`);
      Log.error(err.stack);
    }
  }
}

export default Crawler;
