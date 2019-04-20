import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';

import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';
import { priceFromArrayRightSymbol } from '@utils/price-utils';
import Property from '@models/property';

class ImovirtualMiner extends MinerProvider {
  constructor(public logPrefix: string) {
    super(logPrefix);
  }

  async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      Log.debug(err);
      throw new Error(`Cannot access ${url}`);
    }

    if ($('.section-overview').length === 0) {
      Log.warn(`The ${url} probably is unavailable. Ensure it on unavailable service.`);
      throw new Error(`Cannot mine ${url}`);
    }

    const data = {
      energeticCertificate: this._getEnergeticCertificate($('li:contains("Certificado Energ")')),
      price: this._getPrice($, url)
    };

    const isOnFilter = this._isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  private _getEnergeticCertificate(elements): string {
    if (!elements ||
        elements.length !== 1 ||
        !elements[0].lastChild ||
        !elements[0].lastChild.firstChild ||
        !elements[0].lastChild.firstChild.data) {
      return 'unknown';
    }

    return elements[0].lastChild.firstChild.data.toLowerCase();
  }

  protected _getPrice($, url: string): number {
    const metadata = $($('article > header > div > div')[1])
      .text().trim().split(' ');
    metadata.pop();
    return priceFromArrayRightSymbol(metadata);
  }

  private _isOnFilter(data: Property) {
    const { energeticCertificate, price } = data;
    return dataFilters.energeticCertificates.includes(energeticCertificate)
            && price <= dataFilters.maxPrice;
  }

}

export default ImovirtualMiner;
