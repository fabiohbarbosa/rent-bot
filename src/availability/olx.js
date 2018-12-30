import { adapt } from '../lib/html-adapter';
import AvailabilityError from './availability-error';

class OlxAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      throw new Error(`Error to access url ${url}`);
    }

    const title = $('a[data-cy="adpage_observe_star"]');
    if (title.length > 0) {
      return;
    }
    throw new AvailabilityError(`The page ${url} is unvailable`, 404);
  }

}

export default OlxAvailability;
