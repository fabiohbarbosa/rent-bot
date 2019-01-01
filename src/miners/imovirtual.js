import { adapt } from '../lib/html-adapter';
import { energeticCertificates } from '../../config/props';
import Log from '../../config/logger';

class ImovirtualMiner {
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

    const item = $("li:contains('Certificado Energ')");
    return this.ensureEnergeticCertificate(item);
  }

  ensureEnergeticCertificate(item) {
    if (!item || item.length !== 1 || !item[0].lastChild || !item[0].lastChild.firstChild || !item[0].lastChild.firstChild.data) {
      return { isOnFilter: false, energeticCertificate: 'unknown' };
    }

    const energeticCertificate = item[0].lastChild.firstChild.data.toLowerCase();
    const isOnFilter = energeticCertificates.includes(energeticCertificate);

    return { isOnFilter, energeticCertificate };
  }

}

export default ImovirtualMiner;
