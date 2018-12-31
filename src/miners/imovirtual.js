import { adapt } from '../lib/html-adapter';
import BotError from '../utils/bot-error';
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
    return this.ensureEnergeticCertificate(url, item);
  }

  ensureEnergeticCertificate(url, item) {
    if (!item || item.length !== 1 || !item[0].lastChild || !item[0].lastChild.firstChild || !item[0].lastChild.firstChild.data) {
      throw new BotError(`The page ${url} is out of filter`, 400);
    }

    const energeticCertificate = item[0].lastChild.firstChild.data.toLowerCase();
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

export default ImovirtualMiner;
