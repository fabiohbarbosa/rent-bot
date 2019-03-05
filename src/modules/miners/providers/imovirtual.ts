import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import MinderProvider, { MinderProviderResponse } from '../minder-provider';

class ImovirtualMiner extends MinderProvider {
  async mine(url: string): Promise<MinderProviderResponse> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
    }

    const data = {
      energeticCertificate: this.getEnergeticCertificate($('li:contains("Certificado Energ")')),
      price: parseInt($('article > div > header')[0].children[2].children[0].children[0].data.split(' ')[0].replace('.', ''), 10)
    };

    const isOnFilter = this.isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  getEnergeticCertificate(elements) {
    if (!elements ||
        elements.length !== 1 ||
        !elements[0].lastChild ||
        !elements[0].lastChild.firstChild ||
        !elements[0].lastChild.firstChild.data) {
      return 'unknown';
    }

    return elements[0].lastChild.firstChild.data.toLowerCase();
  }

  isOnFilter(data) {
    if (!dataFilters.energeticCertificates.includes(data.energeticCertificate)) return false;
    return true;
  }

}

export default ImovirtualMiner;
