import { rqRetry } from '@lib/rq';
import BotError from '@utils/bot-error';
import { proxy } from '@lib/proxy-factory';
import AvailabilityProvider from '../availabilty-provider';

class IdealistaAvailability extends AvailabilityProvider {
    async evaluate(url: string): Promise<void> {
    try {
      await rqRetry(proxy(url), 403, true);
    } catch (err) {
      if (err.statusCode === 404) {
        throw new BotError(`The page ${url} is unvailable`, 404);
      }

      const status = err.statusCode ? err.statusCode : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }
  }
}

export default IdealistaAvailability;
