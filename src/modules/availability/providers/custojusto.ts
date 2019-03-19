import { adapt } from '@lib/html-adapter';
import BotError from '@utils/bot-error';
import AvailabilityProvider from '../availability-provider';

class CustoJustoAvailability extends AvailabilityProvider {
  async evaluate(url: string): Promise<void> {
    let $;
    try {
      $ = await adapt(url, true);
    } catch (err) {
      const status = err.statusCode ? err.statusCode : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }

    const title = $('div.title-1 > h1');
    if (title.length > 0) {
      // available
      return;
    }
    throw new BotError(`The page ${url} is unvailable`, 404);
  }
}

export default CustoJustoAvailability;
