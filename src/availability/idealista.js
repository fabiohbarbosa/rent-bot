import { rqRetry } from '../lib/rq';
import BotError from '../utils/bot-error';
import { proxy } from '../lib/proxy-factory';
import Log from '../../config/logger';

class IdealistaAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    try {
      await rqRetry(proxy(url), 403, true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new BotError(`The page ${url} is unvailable`, 404);
      }

      Log.error(err);
      const status = err.response && err.response.status ? err.response.status : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }
  }
}

export default IdealistaAvailability;
