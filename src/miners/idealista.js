import { adapt } from '../lib/html-adapter';
import BotError from '../utils/bot-error';
import { energeticCertificates } from '../../config/props';
import Log from '../../config/logger';

class IdealistaMiner {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async mine(url) {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
    }

    const item = $('div.details-property_features > ul > span[class^="icon-energy"]');
    return this.ensureEnergeticCertificate(url, item);
  }

  ensureEnergeticCertificate(url, item) {
    if (!item || item.length !== 1) {
      throw new BotError(`The page ${url} is out of filter`, 400);
    }
    const energeticCertificate = item[0].attribs['title'];

    // not found
    if (!energeticCertificate) {
      Log.warn(`${this.logPrefix} Not found energetic certificate for ${url}`);
      throw new BotError(`The page ${url} is out of filter`, 400);
    }

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

export default IdealistaMiner;
