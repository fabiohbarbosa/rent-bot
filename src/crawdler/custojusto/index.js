import { adapt } from '../../lib/html-adapter';
import Log from '../../../config/logger';
import { filters, itemsPage, regexes } from './config';
import { dataFilters } from '../../../config/props';

class CustoJustoProvider {
  constructor(logPrefix, type, topology, url) {
    this.logPrefix = logPrefix;
    this.type = type;
    this.topology = topology;
    this.url = url;
  }

  async parse() {
    try {
      let $ = await adapt(this.url, true);

      const totalEntries = parseInt($('.list-result-tabs > li > a.active > small').text().trim(), 10);
      const totalPages = Math.ceil(totalEntries / itemsPage);

      if (!totalPages || totalPages === 0) return [];

      const elements = [];
      elements.push(...this.getElements($));

      for (let page = 2; page <= totalPages; page++) {
        const nextUrl = this.url.replace('?', `?o=${page}?`);
        $ = await adapt(nextUrl, true);

        elements.push(...this.getElements($, page));
      }
      return elements;
    } catch (err) {
      throw err;
    }
  }

  getElements($, page = 1) {
    Log.info(`${this.logPrefix}: Crawling page ${page}`);

    const elements = [];
    $('div#dalist > div.container_related > a').each((i, e) => {
      const price = this.parsePrice($, e);
      const title = $(e).find('h2').text().trim();

      if (this.isMetadataInvalid(title, price)) return;

      elements.push({
        providerId: e.attribs['id'],
        title,
        subtitle: this.parseSubtitle($, e),
        url: e.attribs['href'],
        price,
        photos: this.parsePhotos($, e),
        type: this.type,
        topology: this.topology
      });
    });
    return elements;
  }

  isMetadataInvalid(title, price) {
    if (price > dataFilters.maxPrice) return true;

    for (let i = 0; i < regexes.length; i++) {
      const regex = regexes[i];
      const matched = title.match(regex);
      const isInvalid = matched && matched.length > 0;
      if (isInvalid === true) return true;
    }
    return false;
  }

  parsePrice($, e) {
    const h5 = $(e).find('h5')[0].lastChild.data.trim().split(' ');
    if (h5.length === 2) {
      return parseInt(h5[0], 10);
    }
    return parseInt(`${h5[0]}${h5[1]}`, 10);
  }

  parseSubtitle($, e) {
    const spans = $(e).find('div > span').text().split('-').map(s => s.trim());
    return spans.join(' - ');
  }

  parsePhotos($, e) {
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
