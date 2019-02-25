import Log from '@config/logger';
import allProps from '@config/props';
import { batchProperties } from '@utils/batch-utils';
import Availability from '@modules/availability/availability';
import { Db } from 'mongodb';

// get only availability properties
const props = allProps.bots.availability;
let idealistaCounterCycle = props.intervalIdealistaCounter;

class AvailabilityBot {
  static async initialise(db: Db) {
    try {
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
      const properties = await batchProperties(db, query, sort, props.batchSize);

      properties.forEach(p => new Availability(db).evaluate(p));

      idealistaCounterCycle--;

    } catch (err) {
      Log.error(`[availability] Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    }
  }

}

export default AvailabilityBot;
