import CrawlerProvider from '../../crawler-provider';

import { adaptRetry } from '@lib/html-adapter';
import Log from '@config/logger';
import props from '@config/props';
import { proxy, unProxy } from '@lib/proxy-factory';

import { filters, itemsPage } from './config';

class IdealistaProvider extends CrawlerProvider {
  async parse() {
    let $ = await adaptRetry(proxy(this.url), 403, true);

    try {
      const mainTitleNodes = $('div#h1-container > h1');
      if (!mainTitleNodes || mainTitleNodes.length === 0 || mainTitleNodes.children.length === 0) return [];

      const totalElements = parseInt($('div#h1-container > h1')[0].children[0].data.split(' ')[0], 10);
      if (!totalElements || totalElements === 0) return [];

      const elements = [];
      elements.push(...this._getElements($, this.url));

      const totalPages = Math.ceil(totalElements / itemsPage);
      for (let page = 2; page <= totalPages; page++) {
        const nextUrl = this.url.replace('?', `pagina-${page}?`);
        $ = await adaptRetry(proxy(nextUrl), 403, true);

        elements.push(...this._getElements($, nextUrl, page));
      }

      return elements;
    } catch (err) {
      throw err;
    }
  }

  private _getElements($, url: string, page = 1) {
    Log.info(`${this.logPrefix}: Crawling page ${page} - url: ${url}`);

    const elements = [];
    $('div.items-container > article').each((i, e) => {
      // skip 'Quartos em apartamento partilhado'
      if ($(e).attr('class') === 'item_shared-flat') return;
      // skip adversings
      if ($(e).attr('class') === 'adv noHover') return;

      elements.push({
        providerId: $(e).find('div.item').attr('data-adid'),
        title: $(e).find('div.item-info-container > a.item-link').text().trim(),
        subtitle: this._parseSubtitle($, e),
        url: this._parseUrl($, e),
        price: parseInt($(e).find('span.item-price')[0].firstChild.data, 10),
        photos: this._parsePhotos($, e),
        type: this.type
      });
    });
    return elements;
  }

  private _parseSubtitle($, e) {
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

  private _parseUrl($, e) {
    let url = $(e).find('div.item-info-container > a.item-link').attr('href');
    if (!props.proxy) url = `https://www.idealista.pt${url}`;

    return unProxy(url);
  }

  private _parsePhotos($, e) {
    const gallery = $(e).find('div.gallery-fallback > img');
    if (gallery && gallery[0] && gallery[0].attribs) {
      return [gallery[0].attribs['data-ondemand-img']];
    }
    return [];
  }

}

export { filters };
export default IdealistaProvider;
