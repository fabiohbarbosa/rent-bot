import rq from '../lib/rq';
import BotError from '../utils/bot-error';

class ImovirtualAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    try {
      await rq(url);
    } catch (err) {
      if (err.statusCode && err.statusCode === 404) {
        throw new BotError(`The page ${url} is unvailable`, 404);
      }
      throw new Error(`Error to access url ${url}`);
    }
  }
}

export default ImovirtualAvailability;
