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
    const isOnFilter = this.ensureEnergeticCertificate(url, item);

    if (isOnFilter === false) {
      throw new BotError(`The page ${url} is out of filter`, 400);
    }
  }

  ensureEnergeticCertificate(url, item) {
    if (!item || item.length !== 1) {
      throw new BotError(`The page ${url} is out of filter`, 400);
    }
    const energeticCertificate = item[0].attribs['title'];
    if (!energeticCertificate) {
      Log.warn(`${this.logPrefix} Not found energetic certificate for ${url}`);
      return false; // property without energetic certificate
    }
    Log.info(`${this.logPrefix} Found energetic certificate '${energeticCertificate}' for ${url}`);
    return energeticCertificates.includes(energeticCertificate);
  }

}

export default IdealistaMiner;
