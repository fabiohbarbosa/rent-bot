import { Db } from 'mongodb';

import Log from '@config/logger';
import allProps from '@config/props';
import PropertyCache from '@lib/property-cache';
import { batchProperties } from '@utils/batch-utils';

import Property from '@models/property';

import AvailabilityBotFactory from '@modules/availability/factory';
import AvailabilityHandler from '@modules/availability/availability-handler';

const props = allProps.bots.availability;
let idealistaCounterCycle = props.intervalIdealistaCounter;

class AvailabilityBot {
  private logPrefix: string;
  private handler: AvailabilityHandler;

  constructor(private db: Db, cache: PropertyCache) {
    this.logPrefix = '[availability]';
    this.handler = new AvailabilityHandler(db, cache);
  }

  async evaluate(property: Property) {
    const availability = AvailabilityBotFactory.getInstance(property.provider, property.url);
    const evaluate = availability.evaluate(property.url);
    this.handler.handle(availability.logPrefix, property, evaluate);
  }

  async evaluateDatabaseEntries() {
    try {
      const properties = await this._fetchDatabaseEntries();
      if (properties.length === 0) {
        Log.warn(`${this.logPrefix} Not found properties to evaluate.`);
      } else {
        properties.forEach(p => this.evaluate(p));
      }

      idealistaCounterCycle--;
    } catch (err) {
      Log.error(`${this.logPrefix} Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

  private _fetchDatabaseEntries() {
    const query = {
      provider: { $ne: 'idealista' },
      $or: [
        { timesUnvailable: { $lt: props.ensureTimes } },
        { timesUnvailable: null }
      ]
    };

    // reduce times to fetch idealista data
    // if the schedule did a complete cycle now it's time to remove provider from projection to include the 'idealista' on search
    if (idealistaCounterCycle === 0) {
      delete query['provider'];
      idealistaCounterCycle = props.intervalIdealistaCounter;
    }

    const sort = { isAvailabilityLastCheck: 1, availabilityLastCheck: 1 };
    return batchProperties(this.db, query, sort, props.batchSize);
  }

}

export default AvailabilityBot;
