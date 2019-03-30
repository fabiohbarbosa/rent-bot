import { adapt } from '@lib/html-adapter';
import BotError from '@utils/bot-error';
import AvailabilityProvider from '../availability-provider';

class OlxAvailability extends AvailabilityProvider {
  async evaluate(url: string): Promise<void> {
    let $;
    try {
      $ = await adapt(url);
    } catch (err) {
      const status = err.statusCode ? err.statusCode : 500;
      throw new BotError(`Error to access url ${url}`, status);
    }

    // fallback for unavailables
    if ($('#ad-not-available-box').length > 0) {
      throw new BotError(`The page ${url} is unavailable`, 404);
    }

    const title = $('a[data-cy="adpage_observe_star"]');
    if (title.length > 0) {
      return;
    }
    throw new BotError(`The page ${url} is unavailable`, 404);
  }

}

export default OlxAvailability;
