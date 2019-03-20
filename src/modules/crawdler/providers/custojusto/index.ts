import CrawlerProvider from '../../crawler-provider';

import { adapt } from '@lib/html-adapter';
import Log from '@config/logger';
import { dataFilters } from '@config/props';

import { filters, itemsPage, regexes } from './config';
import { priceFromArrayRightSymbol } from '@utils/price-utils';

class CustoJustoProvider extends CrawlerProvider {
  async parse() {
    try {
      let $ = await adapt(this.url, true);

      const totalEntries = parseInt($('.list-result-tabs > li > a.active > small').text().trim(), 10);
      const totalPages = Math.ceil(totalEntries / itemsPage);

      if (!totalPages || totalPages === 0) return [];

      const elements = [];
      elements.push(...this._getElements($));

      for (let page = 2; page <= totalPages; page++) {
        const nextUrl = this.url.replace('?', `?o=${page}?`);
        $ = await adapt(nextUrl, true);

        elements.push(...this._getElements($, page));
      }
      return elements;
    } catch (err) {
      throw err;
    }
  }

  private _getElements($, page = 1) {
    Log.info(`${this.logPrefix}: Crawling page ${page}`);

    const elements = [];
    $('div#dalist > div.container_related > a').each((i, e) => {
      const title = $(e).find('h2').text().trim();
      const price = this._parsePrice($, e);

      if (this._isMetadataInvalid(title, price)) return;

      elements.push({
        providerId: e.attribs['id'],
        title,
        subtitle: this._parseSubtitle($, e),
        url: e.attribs['href'],
        price,
        photos: this._parsePhotos($, e),
        type: this.type,
        topology: this.topology
      });
    });
    return elements;
  }

  private _isMetadataInvalid(title: string, price: number) {
    if (price > dataFilters.maxPrice) return true;

    for (let i = 0; i < regexes.length; i++) {
      const regex = regexes[i];
      const matched = title.match(regex);
      const isInvalid = matched && matched.length > 0;
      if (isInvalid === true) return true;
    }
    return false;
  }

  private _parsePrice($, e): number {
    const metadata = $(e).find('h5')[0].lastChild.data.trim().split(' ');
    const price = priceFromArrayRightSymbol(metadata);
    return price;
  }

  private _parseSubtitle($, e) {
    const spans = $(e).find('div > span').text().split('-').map(s => s.trim());
    return spans.join(' - ');
  }

  private _parsePhotos($, e) {
    const gallery = $(e).find('div.imglist > img');
    if (gallery && gallery[0] && gallery[0].attribs) {
      const img = gallery[0].attribs['src'] ? gallery[0].attribs['src'] : gallery[0].attribs['data-src'];
      if (img.includes('no-image.svg')) return [];
      return [img.replace('rule=gallery', 'rule=play')];
    }
    return [];
  }

}

export { filters };
export default CustoJustoProvider;
