import { Db } from 'mongodb';

import Log from '@config/logger';
import Crawdler from '@modules/crawdler';
import CrawlerProvider, { CrawlerFilter } from '@modules/crawdler/crawler-provider';
import Property from '@models/property';
import PropertyCache from '@lib/property-cache';
import CrawlerHandler from './crawler-handler';

interface CrawlerProviderArgs {
  providerClass: typeof CrawlerProvider;
  searchFilters: CrawlerFilter[];
}

class CrawlerBot {
  private providerClass: typeof CrawlerProvider;
  private searchFilters: CrawlerFilter[];
  private handler: CrawlerHandler;

  constructor(db: Db, cache: PropertyCache, provider: CrawlerProviderArgs) {
    this.handler = new CrawlerHandler(db, cache);
    this.providerClass = provider.providerClass;
    this.searchFilters = provider.searchFilters;
  }

  async crawle() {
    const filters = this._prepareSearchFilters();
    filters.forEach(f => this._crawleProvider(f))
  }

  private _crawleProvider(filter: CrawlerFilter) {
    const providerName = this._buildProviderName();
    new Crawdler(this.providerClass, providerName, filter).crawl().then(properties => {
      if (!properties) return;
      properties.forEach((p: Property) => {
        const property = { ...p, provider: providerName };
        this.handler.handle(filter.logPrefix, property);
      });
    }).catch(err => Log.error(err));
  }

  private _buildProviderName() {
    return this.providerClass.name.toLowerCase().replace('provider', '');
  }

  private _prepareSearchFilters(): CrawlerFilter[] {
    return this.searchFilters.filter(f => {
      if (!f.enabled)
        Log.warn(`${f.logPrefix} Skipping search...`);
      return f.enabled;
    });
  }

}

export default CrawlerBot;
