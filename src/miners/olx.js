import { adapt } from '../lib/html-adapter';
import { energeticCertificates } from '../../config/props';
import Log from '../../config/logger';

class OlxMiner {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async mine(url) {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      Log.error(err);
      throw new Error(`Error to access url ${url}`);
    }

    const item = $("th:contains('Certificado Energ')");
    return this.ensureEnergeticCertificate($, item);
  }

  ensureEnergeticCertificate($, item) {
    if (!item || item.length !== 1 || !item[0].next || !item[0].next.next) {
      return { isOnFilter: false, energeticCertificate: 'unknown' };
    }

    const el = $(item[0].next.next);

    const energeticCertificate = el.find('strong > a')[0].firstChild.data.trim().toLowerCase();
    const isOnFilter = energeticCertificates.includes(energeticCertificate);

    return { isOnFilter, energeticCertificate };
  }

}

export default OlxMiner;
