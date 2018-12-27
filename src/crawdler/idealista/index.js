import { adapt } from '../../lib/html-adapter';
import Log from '../../../config/logger';
import { filters, itemsPage } from './config';

class IdealistaProvider {
  constructor(logPrefix, type, topology, url) {
    this.logPrefix = logPrefix;
    this.type = type;
    this.topology = topology;
    this.url = url;
  }

  async parse() {
    try {
      let $ = await adapt(this.url);
      const mainTitle = $('div#h1-container > span.h1-simulated')[0];

      if (mainTitle.children.length === 0) {
        Log.warn(`${this.logPrefix}: Not found elements`);
        return [];
      }

      const elements = [];
      elements.push(...this.getElements($));

      const totalPages = Math.ceil(parseInt(mainTitle.children[0].data, 10) / itemsPage);
      for (let page = 2; page <= totalPages; page++) {
        $ = await adapt(this.url.replace('?', `pagina-${page}?`));
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
      // skipping 'Quartos em apartamento partilhado'
      if ($(e).attr('class') === 'item_shared-flat') return;
      // adversings
      if ($(e).attr('class') === 'adv noHover') return;

      elements.push({
        id: $(e).find('div.item').attr('data-adid'),
        title: $(e).find('div.item-info-container > a.item-link').text().trim(),
        subtitle: this.parseSubtitle($, e),
        url: this.parseUrl($, e),
        price: parseInt($(e).find('span.item-price')[0].firstChild.data, 10),
        photos: this.parsePhotos($, e),
        type: this.type,
        topology: this.topology
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
    const prefix = 'https://www.idealista.pt';
    const href = $(e).find('div.item-info-container > a.item-link').attr('href');
    return prefix+href;
  }

  parsePhotos($, e) {
    const gallery = $(e).find('div.gallery-fallback > img');
    if (gallery && gallery[0] && gallery[0].attribs) {
      return [gallery[0].attribs['data-ondemand-img']];
    }
    return [];
  }

}

export { filters }
export default IdealistaProvider;
