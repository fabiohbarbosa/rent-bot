import { adaptRetry } from '../lib/html-adapter';
import { energeticCertificates } from '../../config/props';
import Log from '../../config/logger';
import { proxy } from '../lib/proxy-factory';

class IdealistaMiner {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async mine(url) {
    let $;
    try {
      $ = await adaptRetry(proxy(url), 403, true);
    } catch (err) {
      Log.error(err);
      throw new Error(`Error to access url ${url}`);
    }

    const item = $('div.details-property_features > ul > span[class^="icon-energy"]');
    return this.ensureEnergeticCertificate(item);
  }

  ensureEnergeticCertificate(item) {
    if (!item || item.length !== 1) {
      return { isOnFilter: false, energeticCertificate: 'unknown' };
    }
    const energeticCertificate = item[0].attribs['title'];

    // not found
    if (!energeticCertificate) {
      return { isOnFilter: false, energeticCertificate: 'unknown' };
    }

    const isOnFilter = energeticCertificates.includes(energeticCertificate);

    return { isOnFilter, energeticCertificate };
  }

}

export default IdealistaMiner;
