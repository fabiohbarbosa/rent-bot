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
      throw new Error(`Error to access url ${url}`);
    }

    const items = $('ul.list-group.gbody > li.list-group-item');
    const isOnFilter = this.ensureEnergeticCertificate(url, items);

    if (isOnFilter === false) {
      throw new BotError(`The page ${url} is out of filter`, 400);
    }
  }

  ensureEnergeticCertificate(url, items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.children[0] || !item.children[1] || !item.children[1].data) continue;

      const data = item.children[1].data.toLowerCase();
      if (data.includes('cert') || data.includes('cert.') || data.includes('energética') || data.includes('energetica')) {
        const energeticCertificate = item.children[0].firstChild.data.toLowerCase();
        Log.info(`${this.logPrefix} Found energetic certificate '${energeticCertificate}' for ${url}`);
        return energeticCertificates.includes(energeticCertificate);
      }
    }
    Log.warn(`${this.logPrefix} Not found energetic certificate for ${url}`);
    return false; // property without energetic certificate
  }
}

export default CustoJustoMiner;
