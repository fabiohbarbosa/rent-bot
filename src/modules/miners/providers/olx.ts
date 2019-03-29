import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';
import { priceFromArrayRightSymbol } from '@utils/price-utils';
import Property from '@models/property';

class OlxMiner extends MinerProvider {
  constructor(public logPrefix: string) {
    super(logPrefix);
  }

  async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      Log.debug(err);
      throw new Error(`Error to access url ${url}`);
    }

    const elements = $("th:contains('Certificado Energ')");
    const data = {
      energeticCertificate: this._getEnergeticCertificate($, elements),
      price: this._parsePrice($)
    };

    const isOnFilter = this._isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  private _parsePrice($): number {
    const metadata = $('.price-label > strong').text()
                          .trim().split(' ')
                          .map(v => v.replace('.', ''));
    const price = priceFromArrayRightSymbol(metadata);
    return price;
  }

  private _getEnergeticCertificate($, elements) {
    if (!elements ||
        elements.length !== 1 ||
        !elements[0].next ||
        !elements[0].next.next) {
      return 'unknown';
    }

    const el = $(elements[0].next.next);

    return el.find('strong > a')[0].firstChild.data.trim().toLowerCase();
  }

  private _isOnFilter(data: Property) {
    const { energeticCertificate, price } = data;
    return dataFilters.energeticCertificates.includes(energeticCertificate)
            && price <= dataFilters.maxPrice;
  }

}

export default OlxMiner;
