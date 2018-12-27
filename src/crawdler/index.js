import Log from '../../config/logger';
import { maxPrice, onlyPhoto } from './config';

class Crawler {
  constructor(Provider, options) {
    const { url, logPrefix, type, topology } = options;
    this.provider = new Provider(logPrefix, type, topology, url);
    this.logPrefix = logPrefix;
  }

  async crawl() {
    try {
      const elementsRaw = await this.provider.parse();
      const elements = elementsRaw.filter(e => {
        if (e.price > maxPrice) return false;
        if (onlyPhoto) return e.photos.length > 0;
        return true;
      });

      Log.debug(`${this.logPrefix} ${JSON.stringify(elements)}`);
      return elements;
    } catch (err) {
      Log.error(`${this.logPrefix} Error to crawl : ${err.message}`);
      Log.error(err.stack);
    }
  }
}

export default Crawler;
