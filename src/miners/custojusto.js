import { adapt } from '../lib/html-adapter';
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
    return this.ensureEnergeticCertificate(items);
  }

  ensureEnergeticCertificate(items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.children[0] || !item.children[1] || !item.children[1].data) continue;

      const data = item.children[1].data.toLowerCase();
      if (data.includes('cert') || data.includes('cert.') || data.includes('energética') || data.includes('energetica')) {
        const energeticCertificate = item.children[0].firstChild.data.toLowerCase();
        const isOnFilter = energeticCertificates.includes(energeticCertificate);

        return { isOnFilter, energeticCertificate };
      }
    }
    return { isOnFilter: false, energeticCertificate: 'unknown' };
  }
}

export default CustoJustoMiner;
