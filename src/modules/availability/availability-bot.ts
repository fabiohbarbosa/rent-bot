import { Db } from 'mongodb';

import Log from '@config/logger';
import allProps from '@config/props';
import PropertyCache from '@lib/property-cache';
import { batchProperties } from '@utils/batch-utils';

import Property from '@models/property';

import AvailabilityBotFactory from '@modules/availability/factory';
import AvailabilityHandler from '@modules/availability/availability-handler';

class AvailabilityBot {
  private props;
  private idealistaCounterCycle;
  private handler: AvailabilityHandler;

  constructor(private db: Db, cache: PropertyCache) {
    this.handler = new AvailabilityHandler(db, cache);
    this.props = allProps.bots.availability;
    this.idealistaCounterCycle = this.props.intervalIdealistaCounter;
  }

  async evaluate(property: Property) {
    const availability = AvailabilityBotFactory.getInstance(property.provider, property.url);
    const evaluate = availability.evaluate(property.url);
    this.handler.handle(availability.logPrefix, property, evaluate);
  }

  async evaluateDatabaseEntries() {
    try {
      const properties = await this._fetchDatabaseEntries();
      properties.forEach(p => this.evaluate(p));

      this.idealistaCounterCycle--;
    } catch (err) {
      Log.error(`[availability] Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

  private _fetchDatabaseEntries() {
    const query = {
      provider: { $ne: 'idealista' },
      $or: [
        { timesUnvailable: { $lt: this.props.ensureTimes } },
        { timesUnvailable: null }
      ]
    };

    // reduce times to fetch idealista data
    // if the schedule did a complete cycle now it's time to remove provider from projection to include the 'idealista' on search
    if (this.idealistaCounterCycle === 0) {
      delete query['provider'];
      this.idealistaCounterCycle = this.props.intervalIdealistaCounter;
    }

    const sort = { isAvailabilityLastCheck: 1, availabilityLastCheck: 1 };
    return batchProperties(this.db, query, sort, this.props.batchSize);
  }

}

export default AvailabilityBot;
