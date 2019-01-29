import { adaptRetry } from '../../lib/html-adapter';
import Log from '../../../config/logger';
import props from '../../../config/props';
import { filters, itemsPage } from './config';
import { proxy, unProxy } from '../../lib/proxy-factory';

class IdealistaProvider {
  constructor(logPrefix, type, topology, url) {
    this.logPrefix = logPrefix;
    this.type = type;
    this.topology = topology;
    this.url = url;
  }

  async parse() {
    let $ = await adaptRetry(proxy(this.url), 403, true);

    try {
      const mainTitleNodes = $('div#h1-container > h1');
      if (!mainTitleNodes || mainTitleNodes.length === 0 || mainTitleNodes.children.length === 0) return [];

      const totalElements = parseInt($('div#h1-container > h1')[0].children[0].data.split(' ')[0], 10);
      if (!totalElements || totalElements === 0) return [];

      const elements = [];
      elements.push(...this.getElements($));

      const totalPages = Math.ceil(totalElements / itemsPage);
      for (let page = 2; page <= totalPages; page++) {
        const nextUrl = this.url.replace('?', `pagina-${page}?`);
        $ = await adaptRetry(proxy(nextUrl), 403, true);

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
    $('div.items-container > article').each((i, e) => {
      // skip 'Quartos em apartamento partilhado'
      if ($(e).attr('class') === 'item_shared-flat') return;
      // skip adversings
      if ($(e).attr('class') === 'adv noHover') return;

      elements.push({
        providerId: $(e).find('div.item').attr('data-adid'),
        title: $(e).find('div.item-info-container > a.item-link').text().trim(),
        subtitle: this.parseSubtitle($, e),
        url: this.parseUrl($, e),
        price: parseInt($(e).find('span.item-price')[0].firstChild.data, 10),
        photos: this.parsePhotos($, e),
        type: this.type
      });
    });
    return elements;
  }

  parseSubtitle($, e) {
    const details = $(e).find('div.item-info-container > span.item-detail');
    let subtitle = '';
    for (let i = 1; i < details.length; i++) {
      details[i].children.forEach(el => {
        if (el.data) {
          subtitle += el.data.trim() + ' ';
        } else if (el.lastChild) {
          subtitle += el.lastChild.data.trim() + ' ';
        }
      });
    }
    return subtitle.trim();
  }

  parseUrl($, e) {
    let url = $(e).find('div.item-info-container > a.item-link').attr('href');
    if (!props.proxy) url = `https://www.idealista.pt${url}`;

    return unProxy(url);
  }

  parsePhotos($, e) {
    const gallery = $(e).find('div.gallery-fallback > img');
    if (gallery && gallery[0] && gallery[0].attribs) {
      return [gallery[0].attribs['data-ondemand-img']];
    }
    return [];
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

export { filters };
export default IdealistaProvider;
