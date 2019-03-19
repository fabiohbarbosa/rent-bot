import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';

class OlxMiner extends MinerProvider {

  async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      Log.error(err);
      throw new Error(`Error to access url ${url}`);
    }

    const elements = $("th:contains('Certificado Energ')");
    const data = {
      energeticCertificate: this.getEnergeticCertificate($, elements),
      price: parseInt($('.price-label > strong').text().split(' ')[0].replace('.', ''), 10)
    };

    const isOnFilter = this.isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  getEnergeticCertificate($, elements) {
    if (!elements ||
        elements.length !== 1 ||
        !elements[0].next ||
        !elements[0].next.next) {
      return 'unknown';
    }

    const el = $(elements[0].next.next);

    return el.find('strong > a')[0].firstChild.data.trim().toLowerCase();
  }

  isOnFilter(data) {
    if (!dataFilters.energeticCertificates.includes(data.energeticCertificate)) return false;
    return true;
  }

}

export default OlxMiner;
