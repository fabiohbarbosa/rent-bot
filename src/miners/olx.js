import { adapt } from '../lib/html-adapter';
import BotError from '../utils/bot-error';
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
    return this.ensureEnergeticCertificate(url, $, item);
  }

  ensureEnergeticCertificate(url, $, item) {
    if (!item || item.length !== 1 || !item[0].next || !item[0].next.next) {
      throw new BotError(`The page ${url} is out of filter`, 400);
    }

    const el = $(item[0].next.next);
    const energeticCertificate = el.find('strong > a')[0].firstChild.data.trim().toLowerCase();

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

export default OlxMiner;
