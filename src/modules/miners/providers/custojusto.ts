import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';

  class CustoJustoMiner extends MinerProvider {
    async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adapt(url, true);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
    }

    const elements = $('ul.list-group.gbody');
    if (elements.length === 0) {
      Log.warn(`${this.logPrefix} Cannot access url ${url}. Wait for availability task to confirm unvailability.`);
      throw Error(`Cannot access ${url}`);
    }

    const data = {
      energeticCertificate: this.getEnergeticCertificate(elements),
      topology: this.getTopology(elements),
      price: parseInt($('span.real-price')[0].firstChild.data.trim().split(' ')[0].replace('.', ''), 10)
    };

    const isOnFilter = this.isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);
    Log.debug(`${this.logPrefix} Found topology '${data.topology}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  isInvalidElement(el) {
    return !el || el.length !== 1 ||
      !el[0].firstChild ||
      !el[0].firstChild.firstChild ||
      !el[0].firstChild.firstChild.data;
  }

  getEnergeticCertificate(elements) {
    const el = elements.find("li:contains('Cert.')");
    if (this.isInvalidElement(el)) return 'unknown';

    return el[0].firstChild.firstChild.data.toLowerCase();
  }

  getTopology(elements) {
    const el = elements.find("li:contains('Tipologia')");
    if (this.isInvalidElement(el)) return 'unknown';

    return el[0].firstChild.firstChild.data.toLowerCase();
  }

  isOnFilter(data) {
    if (!dataFilters.energeticCertificates.includes(data.energeticCertificate)) return false;
    if (!dataFilters.topologies.includes(data.topology)) return false;
    return true;
  }
}

export default CustoJustoMiner;
