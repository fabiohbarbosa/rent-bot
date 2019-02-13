import { batchProperties } from '../utils/batch-utils';
import Log from '../../config/logger';
import props from '../../config/props';
import MailService from './mail-service';

/**
 * @typedef {import('mongodb').Db} MongoDb
 */

class MailJob {

  /**
   * @param {string} logPrefix
   * @param {MongoDb} db - mongo connection
   */
  constructor(logPrefix, db) {
    this.logPrefix = logPrefix;
    this.db = db;
  }

  initialise(properties) {
    if (properties.length === 0)
      Log.warn(`${this.logPrefix} There are not pending e-mails to send`);

    properties.forEach(p => {
      const callback = (err, result) => {
        if (err) {
          Log.error(`${this.logPrefix} Error to update email notification for ${p.url}`);
          return;
        }
        Log.info(`${this.logPrefix} Success to update email notification for ${p.url}`);
      };

      try {
        MailService.send({
          ...p,
          photo: p.photos && p.photos.length > 0 ? p.photos[0] : undefined
        });

        this.db.collection('properties')
          .updateOne(
            { url: p.url },
            { $set: { notificated: true, notificatedAt: new Date() } }, callback);

      } catch (err) {
        Log.error(`Error to notified user about ${p.url}`);
      }
    });
  }

  static schedule(db) {
    const { mail } = props.scheduler;

    const start = async() => {
      const logPrefix = '[scheduler:mail]:';
      if (!mail.enabled) {
        Log.warn(`${logPrefix} Skipping...`);
        return;
      }

      Log.info(`${logPrefix} Initialising mail notification`);

      try {
        const query = {
          notificated: false,
          isAvailabilityLastCheck: true,
          isDataMiningLastCheck: true,
          status: 'MATCHED'
        };

        const sort = { createAt: -1 };

        const properties = await batchProperties(db, query, sort, mail.batchSize);
        new MailJob(logPrefix, db).initialise(properties);

      } catch (err) {
        Log.error(`${logPrefix} Error to load properties from database: ${err.message}`);
        Log.error(err.stack);
      }
    };

    start();
    setTimeout(() => start(), mail.delay);
    setInterval(start, mail.interval);
  }

}

export default MailJob;
