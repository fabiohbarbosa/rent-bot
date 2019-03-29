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

    const data = {
      energeticCertificate: this._getEnergeticCertificate($('li:contains("Certificado Energ")')),
      price: this._getPrice($('article > header > div > div'), url)
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

  protected _getPrice(elements, url: string): number {
    if (!elements || !elements[2] || !elements[2].firstChild) {
      throw new Error(`Error to access price of ${url}`);
    }
    return priceFromArrayRightSymbol(elements[2].firstChild.data.split(' '));
  }

  private _isOnFilter(data: Property) {
    const { energeticCertificate, price } = data;
    return dataFilters.energeticCertificates.includes(energeticCertificate)
            && price <= dataFilters.maxPrice;
  }

}

export default ImovirtualMiner;
