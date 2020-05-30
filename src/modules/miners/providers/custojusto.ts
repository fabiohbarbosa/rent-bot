import { adapt } from '@lib/html-adapter';
import { dataFilters } from '@config/props';
import Log from '@config/logger';
import MinerProvider, { MinerProviderResponse } from '@modules/miners/miner-provider';
import { priceFromArrayRightSymbol } from '@utils/price-utils';
import Property, { PropertyTopology } from '@models/property';

  class CustoJustoMiner extends MinerProvider {
    constructor(public logPrefix: string) {
      super(logPrefix);
    }

    async mine(url: string): Promise<MinerProviderResponse> {
    let $;
    try {
      $ = await adapt(url, true);
    } catch (err) {
      Log.debug(err);
      throw new Error(`Cannot access ${url}`);
    }

    const elements = $('ul.list-group.gbody');
    if (elements.length === 0) {
      Log.warn(`The ${url} probably is unavailable. Ensure it on unavailable service.`);
      throw new Error(`Cannot mine ${url}`);
    }

    const data = {
      energeticCertificate: this._getEnergeticCertificate(url, elements),
      topology: this._getTopology(url, elements),
      price: this._parsePrice($)
    };

    const isOnFilter = this._isOnFilter(data);

    Log.info(`${this.logPrefix} Found energetic certificate '${data.energeticCertificate}' to ${url}`);
    Log.debug(`${this.logPrefix} Found topology '${data.topology}' to ${url}`);

    return {
      isOnFilter,
      data
    };
  }

  private _parsePrice($): number {
    const metadata = $('span.real-price')[0].firstChild.data.trim().split(' ');
    const price = priceFromArrayRightSymbol(metadata);
    return price;
  }

  private _getEnergeticCertificate(url: string, elements) {
    const el = elements.find('li:contains(\'Cert.\')');
    if (!el || el.length === 0) {
      return 'unknown';
    }

    const value = el.find('span').html().toLowerCase();
    return value;
  }

  private _getTopology(url: string, elements): PropertyTopology {
    const el = elements.find('li:contains(\'Tipologia\')');
    if (!el || el.length === 0) {
      return PropertyTopology.UNKNOWN;
    }

    const value = el.find('span > a').html().toLowerCase() || el.find('span').html().toLowerCase();
    return value;
  }

  protected _isOnFilter(data: Property): boolean {
    const { energeticCertificate, price, topology } = data;
    return dataFilters.energeticCertificates.includes(energeticCertificate)
            && dataFilters.topologies.includes(topology.toString().toLowerCase())
            && price <= dataFilters.maxPrice;
  }
}

export default CustoJustoMiner;
