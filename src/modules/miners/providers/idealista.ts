import { adaptRetry } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import { proxy } from '@lib/proxy-factory';
import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';

class IdealistaMiner extends MinerProvider {

  async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adaptRetry(proxy(url), 403, true);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
    }

    const data = {
      energeticCertificate: this.getEnergeticCertificate($),
      topology: this.getTopology($),
      price: parseInt($('span.info-data-price').text().split(' ')[0].replace('.', ''), 10)
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
