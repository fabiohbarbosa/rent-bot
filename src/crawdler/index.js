import Log from '../../config/logger';
import { maxPrice, onlyPhoto } from './config';

class Crawler {
  async crawl(Provider, type, topology, url) {
    const logPrefix = `[${Provider.name
                          .toLowerCase()
                          .replace('provider', '')}:${type}:${topology}]`;

    const provider = new Provider(logPrefix,type, topology, url);

    try {
      const elementsRaw = await provider.parse();
      const elements = elementsRaw.filter(e => {
        if (e.price > maxPrice) return false;
        if (onlyPhoto) return e.photos.length > 0;
        return true;
      });

      // TODO save elements
      Log.debug(elements);
    } catch (err) {
      Log.error(`${logPrefix}:Error to crawling : ${err.message}`);
      Log.error(err.stack);
    }
  }
}

export default Crawler;
