import { adapt } from '../lib/html-adapter';
import BotError from '../utils/bot-error';
import Log from '../../config/logger';

class CustoJustoAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      Log.error(err);
      const status = err.response && err.response.status ? err.response.status : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }

    const title = $('div.title-1 > h1');
    if (title.length > 0) {
      return;
    }
    throw new BotError(`The page ${url} is unvailable`, 404);
  }
}

export default CustoJustoAvailability;
