import { adapt } from '../../lib/html-adapter';
import Log from '../../../config/logger';
import filters from './config';

class OlxProvider {
  constructor(logPrefix, type, topology, url) {
    this.logPrefix = logPrefix;
    this.type = type;
    this.topology = topology;
    this.url = url;
  }

  async parse() {
    try {
      let $ = await adapt(this.url);

      if ($('h1.c41').length > 0) {
        Log.warn(`${this.logPrefix}: Not found elements`)
        return [];
      }

      const elements = [];
      elements.push(...this.getElements($));

      const totalElement = $('.pager > span.item > a > span');
      if (totalElement && totalElement.length > 0) {
        const totalPages = parseInt(totalElement[totalElement.length - 1].lastChild.data, 10);

        for (let page = 2; page <= totalPages; page++) {
          $ = await adapt(`${url}&page=${page}`);
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
    $('table#offers_table > tbody > tr.wrap > td > div.offer-wrapper > table > tbody').each((i, e) => {
      elements.push({
        id: $(e)[0].parent.attribs['data-id'],
        title: $(e).find('td.title-cell > div > h3').text().trim(),
        subtitle: $(e).find('td.bottom-cell > div > p > small').text().trim().split(' ')[0],
        url: $(e).find('td.title-cell > div > h3 > a').attr('href'),
        price: parseInt($(e).find('td.td-price > div > p').text().trim().split(' ')[0], 10),
        photos: this.parsePhotos($, e),
        type: this.type,
        topology: this.topology
      });
    });
    return elements;
  }

  parsePhotos($, e) {
    const img = $(e).find('td > a > img').attr('src');
    if (!img) {
      return [];
    }
    return [img.split(';')[0]];
  }
}

export { filters }
export default OlxProvider;
