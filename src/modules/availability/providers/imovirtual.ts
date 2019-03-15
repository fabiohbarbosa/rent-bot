import { adapt } from '@lib/html-adapter';
import BotError from '@utils/bot-error';
import AvailabilityProvider from '../availability-provider';

class ImovirtualAvailability extends AvailabilityProvider {
  async evaluate(url: string): Promise<void> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      const status = err.statusCode ? err.statusCode : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }

    const title = $('div#ad-not-available-box > h4');
    if (!title || title.length === 0) {
      return;
    }
    throw new BotError(`The page ${url} is unvailable`, 404);
  }

}

export default ImovirtualAvailability;
