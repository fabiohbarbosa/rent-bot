import rq from '../lib/rq';
import AvailabilityError from './availability-error';

class ImovirtualAvailability {
  constructor(logPrefix) {
    this.logPrefix = logPrefix;
  }

  async evaluate(url) {
    try {
      await rq(url);
    } catch (err) {
      if (err.statusCode && err.statusCode === 404) {
        throw new AvailabilityError(`The page ${url} is unvailable`, 404);
      }
      throw new Error(`Error to access url ${url}`);
    }
  }
}

export default ImovirtualAvailability;
