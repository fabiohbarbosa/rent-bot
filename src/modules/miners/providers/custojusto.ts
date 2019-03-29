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
      Log.debug(`${this.logPrefix} Cannot access url ${url}. Wait for availability task to check unvailability.`);
      throw new Error(`Cannot access ${url}`);
    }

    const data = {
      energeticCertificate: this._getEnergeticCertificate(elements),
      topology: this._getTopology(elements),
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

  private _isInvalidElement(el): boolean {
    return !el || el.length !== 1 ||
      !el[0].firstChild ||
      !el[0].firstChild.firstChild ||
      !el[0].firstChild.firstChild.data;
  }

  private _getEnergeticCertificate(elements) {
    const el = elements.find("li:contains('Cert.')");
    if (this._isInvalidElement(el)) return 'unknown';

    return el[0].firstChild.firstChild.data.toLowerCase();
  }

  private _getTopology(elements): PropertyTopology {
    const el = elements.find("li:contains('Tipologia')");
    if (this._isInvalidElement(el)) PropertyTopology.UNKNOWN;
    return el[0].firstChild.firstChild.data.toLowerCase();
  }

  protected _isOnFilter(data: Property): boolean {
    const { energeticCertificate, price, topology } = data;
    return dataFilters.energeticCertificates.includes(energeticCertificate)
            && dataFilters.topologies.includes(topology.toString().toLowerCase())
            && price <= dataFilters.maxPrice;
  }
}

export default CustoJustoMiner;
