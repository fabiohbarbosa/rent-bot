import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';

class ImovirtualMiner extends MinerProvider {
  async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
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

  private _getPrice(elements, url: string): number {
    if (!elements || !elements[2] || !elements[2].firstChild) {
      throw new Error(`Error to access price of ${url}`);
    }
    return this._getPriceFromArray(elements[2].firstChild.data.split(' '));
  }

  private _isOnFilter(data) {
    if (!dataFilters.energeticCertificates.includes(data.energeticCertificate)) return false;
    return true;
  }

  protected _getPriceFromArray(priceArray: string[]): number {
    priceArray.pop();
    return parseInt(priceArray.join(''), 10);
  }

}

export default ImovirtualMiner;
