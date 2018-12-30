import { adapt } from '../lib/html-adapter';
import AvailabilityError from './availability-error';

class CustoJustoAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    let $;
    try {
      $ = await adapt(url, true);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
    }

    const title = $('div.title-1 > h1');
    if (title.length > 0) {
      return;
    }
    throw new AvailabilityError(`The page ${url} is unvailable`, 404);
  }
}

export default CustoJustoAvailability;
