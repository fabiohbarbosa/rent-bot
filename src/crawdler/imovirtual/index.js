import { adapt } from '../../lib/html-adapter';
import Log from '../../../config/logger';
import filters from './config';

class ImovirtualProvider {
  constructor(logPrefix, type, topology, url) {
    this.logPrefix = logPrefix;
    this.type = type;
    this.topology = topology;
    this.url = url;
  }

  async parse() {
    try {
      let $ = await adapt(this.url);

      if ($('.search-location-extended-warning').length > 0) return [];

      const elements = [];
      elements.push(...this.getElements($));

      const totalElement = $('.pager-counter > .current');
      if (totalElement && totalElement.length > 0) {
        const totalPages = totalElement[0].firstChild.data;

        for (let page = 2; page <= totalPages; page++) {
          $ = await adapt(`${this.url}&page=${page}`);
          elements.push(...this.getElements($, page));
        }
      }

      return elements;
    } catch (err) {
      throw err;
    }
  }

  getElements($, page = 1) {
    Log.info(`${this.logPrefix}: Crawling page ${page}`);

    const elements = [];
    $('div.col-md-content > article.offer-item').each((i, e) => {
      elements.push({
        providerId: $(e).attr('data-tracking-id'),
        title: $(e).find('div.offer-item-details > header > h3 span.offer-item-title').text(),
        subtitle: $(e).find('div.offer-item-details > header > p').text(),
        url: e.attribs['data-url'],
        price: parseInt($(e).find('div.offer-item-details li.offer-item-price').text().split('€')[0].trim(), 10),
        photos: this.parsePhotos($, e),
        type: this.type,
        topology: this.topology
      });
    });
    return elements;
  }

  parsePhotos($, e) {
    const gallery = $(e).find('figure.offer-item-image');
    if (gallery && gallery[0].attribs['data-quick-gallery']) {
      const photosElements = JSON.parse(gallery[0].attribs['data-quick-gallery']);
      return photosElements.map(p => p.photo);
    }
    return [];
  }

}

export { filters };
export default ImovirtualProvider;
