import { adaptRetry } from '../lib/html-adapter';
import { dataFilters } from '../../config/props';
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
      throw new Error(`Error to access url ${url}`);
    }

    const data = {
      energeticCertificate: this.getEnergeticCertificate($),
      topology: this.getTopology($)
    };

    const isOnFilter = this.isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  getEnergeticCertificate($) {
    const elements = $('div.details-property_features > ul > span[class^="icon-energy"]');
    if (!elements || elements.length !== 1) return 'unknown';

    const energeticCertificate = elements[0].attribs['title'];
    if (!energeticCertificate) return 'unknown';

    return energeticCertificate;
  }

  getTopology($) {
    for (let i = 0; i < dataFilters.topologies.length; i++) {
      const topology = dataFilters.topologies[i];

      if ($(`div.info-features > span:contains("${topology.toUpperCase()}")`)) {
        return topology;
      }
    }
  }

  isOnFilter(data) {
    if (!dataFilters.energeticCertificates.includes(data.energeticCertificate)) return false;
    return true;
  }

}

export default IdealistaMiner;
