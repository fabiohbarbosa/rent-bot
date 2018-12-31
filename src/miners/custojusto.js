import { adapt } from '../lib/html-adapter';
import BotError from '../utils/bot-error';
import { energeticCertificates } from '../../config/props';
import Log from '../../config/logger';

class CustoJustoMiner {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async mine(url) {
    let $;
    try {
      $ = await adapt(url, true);
    } catch (err) {
      Log.error(err);
      throw new Error(`Error to access url ${url}`);
    }

    const items = $('ul.list-group.gbody > li.list-group-item');
    return this.ensureEnergeticCertificate(url, items);
  }

  ensureEnergeticCertificate(url, items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.children[0] || !item.children[1] || !item.children[1].data) continue;

      const data = item.children[1].data.toLowerCase();
      if (data.includes('cert') || data.includes('cert.') || data.includes('energética') || data.includes('energetica')) {
        const energeticCertificate = item.children[0].firstChild.data.toLowerCase();
        Log.info(`${this.logPrefix} Found energetic certificate '${energeticCertificate}' for ${url}`);
        const isOnFilter = energeticCertificates.includes(energeticCertificate);

        // found less than minimal expected
        if (!isOnFilter) {
          throw new BotError(`The page ${url} is out of filter`, 400, { energeticCertificate });
        }

        // expected energeetic certificate
        return energeticCertificate;
      }
    }

    // not found
    Log.warn(`${this.logPrefix} Not found energetic certificate for ${url}`);
    throw new BotError(`The page ${url} is out of filter`, 400);
  }
}

export default CustoJustoMiner;
