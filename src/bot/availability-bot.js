/**
 * @typedef {import('mongodb').Db} MongoDb
 */

import AvailabilityBotFactory from '../availability/factory';
import Log from '../../config/logger';

class AvailabilityBot {
  /**
   * @param {MongoDb} db - mongo connection
   */
  static async evaluate(db) {
    // ----------------------
    // Update availability last check date
    // ----------------------
    const availabilityLastCheck = (logPrefix, url, status) => {
      const updateOneCallback = (err, result) => {
        if (err)
          Log.error(`${logPrefix} Error to update availabilityLastCheck date`);
        Log.debug(`${logPrefix} Success to update availabilityLastCheck date: ${result}`);
      };

      const set = { availabilityLastCheck: new Date() };
      if (status) set['status'] = status;

      db.collection('properties').updateOne(
        { url: url },
        { $set: set },
        updateOneCallback
      );
    };

    // ----------------------
    // Evaluate availability
    // ----------------------
    const cursor = db.collection('properties').aggregate([
      { $match: { status: { $ne: 'UNVAILABLE' } } },
      {
        $group: {
          _id: { provider: '$provider', url: '$url' },
          availabilityLastCheck: { $min: '$availabilityLastCheck' },
        }
      },
      { $sort: { availabilityLastCheck: 1 } },
      { $limit: 4 }
    ]);

    cursor.forEach(async p => {
      const provider = p._id.provider;
      const url = p._id.url;

      const availability = AvailabilityBotFactory.getInstance(provider, url);
      availability.evaluate(url)
        .then(() => {
          Log.info(`${availability.logPrefix} Valid url: ${url}`);
          availabilityLastCheck(availability.logPrefix, url);
        })
        .catch(err => {
          if (!err.status && !err.status !== 404) {
            Log.error(`Error to evaluate url ${url} availability: ${err}`);
            Log.error(err.stack);
            return;
          }
          Log.warn(`${availability.logPrefix} ${err.message}`);
          availabilityLastCheck(availability.logPrefix, url, 'UNVAILABLE');
        });
    }).catch(err => {
      Log.error(`Error to load properties from database: ${err.message}`);
      Log.error(err.stack);
    });
  }
}

export default AvailabilityBot;
