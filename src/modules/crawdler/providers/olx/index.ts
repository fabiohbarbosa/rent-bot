import CrawlerProvider from '../../crawler-provider';

import { adapt } from '@lib/html-adapter';
import Log from '@config/logger';
import { priceFromArrayRightSymbol } from '@utils/price-utils';

import filters from './config';

class OlxProvider extends CrawlerProvider {
  async parse(): Promise<object[]> {
    try {
      let $ = await adapt(this.url);

      if ($('h1.c41').length > 0) return [];

      const elements = [];
      elements.push(...this._getElements($, this.url));

      const totalElement = $('.pager > span.item > a > span');
      if (totalElement && totalElement.length > 0) {
        const totalPages = parseInt(totalElement[totalElement.length - 1].lastChild.data, 10);

        for (let page = 2; page <= totalPages; page++) {
          const nextUrl = `${this.url}&page=${page}`;
          $ = await adapt(nextUrl);
          elements.push(...this._getElements($, nextUrl, page));
        }
      }

      return elements;
    } catch (err) {
      throw err;
    }
  }

  private _getElements($, url: string, page = 1) {
    Log.info(`${this.logPrefix}: Crawling page ${page} - url: ${url}`);

    const elements = [];
    $('table#offers_table > tbody > tr.wrap > td > div.offer-wrapper > table > tbody').each((i, e) => {
      const url = $(e).find('td.title-cell > div > h3 > a').attr('href').split('#')[0];
      if (url.includes('https://www.imovirtual.com')) return;

      elements.push({
        providerId: $(e)[0].parent.attribs['data-id'],
        title: $(e).find('td.title-cell > div > h3').text().trim(),
        subtitle: $(e).find('td.bottom-cell > div > p > small').text().trim().split(' ')[0],
        url,
        price: this._parsePrice($, e),
        photos: this._parsePhotos($, e),
        type: this.type,
        topology: this.topology
      });
    });
    return elements;
  }

  private _parsePrice($, e): number {
    const metadata = $(e).find('td.td-price > div > p').text()
                          .trim().split(' ')
                          .map(v => v.replace('.', ''));
    const price = priceFromArrayRightSymbol(metadata);
    return price;
  }

  private _parsePhotos($, e) {
    const img = $(e).find('td > a > img').attr('src');
    if (!img) {
      return [];
    }
    return [img.split(';')[0]];
  }
}

export { filters };
export default OlxProvider;
