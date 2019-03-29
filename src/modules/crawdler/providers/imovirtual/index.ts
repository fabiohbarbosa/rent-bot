import CrawlerProvider from '../../crawler-provider';

import { adapt } from '@lib/html-adapter';
import Log from '@config/logger';

import filters from './config';

class ImovirtualProvider extends CrawlerProvider {
  async parse() {
    try {
      let $ = await adapt(this.url);

      if ($('.search-location-extended-warning').length > 0) return [];

      const elements = [];
      elements.push(...this._getElements($, this.url));

      const totalElement = $('.pager-counter > .current');
      if (totalElement && totalElement.length > 0) {
        const totalPages = totalElement[0].firstChild.data;

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
    $('div.col-md-content > article.offer-item').each((i, e) => {
      elements.push({
        providerId: $(e).attr('data-tracking-id'),
        title: $(e).find('div.offer-item-details > header > h3 span.offer-item-title').text(),
        subtitle: $(e).find('div.offer-item-details > header > p').text(),
        energeticCertificate: $(e).find('div.energy-certify').text(),
        url: e.attribs['data-url'].split('#')[0],
        price: this._parsePrice($, e),
        photos: this._parsePhotos($, e),
        type: this.type,
        topology: this.topology
      });
    });
    return elements;
  }

  private _parsePhotos($, e) {
    const gallery = $(e).find('figure.offer-item-image');
    if (gallery && gallery[0].attribs['data-quick-gallery']) {
      const photosElements = JSON.parse(gallery[0].attribs['data-quick-gallery']);
      return photosElements.map(p => p.photo);
    }
    return [];
  }

  private _parsePrice($, e) {
    const metadata = $(e).find('div.offer-item-details li.offer-item-price').text().split('€');
    const price = parseInt(metadata[0].trim().split(' ').join(''), 10);
    return price;
  }

}

export { filters };
export default ImovirtualProvider;
