import { Db } from 'mongodb';

import Log from '@config/logger';
import MailService from '@modules/mail/mail-service';
import props from '@config/props';
import Property from '@models/property';

class NotificationService {
  constructor(private logPrefix: string, private db: Db) {}

  async notificateByEmail (property: Property): Promise<void> {
    if (!props.mail.enabled) {
      Promise.resolve();
      return;
    }

    try {
      const { url, photos } = property;
      await MailService.send({
        ...property,
        photo: photos && photos.length > 0 ? photos[0] : undefined
      });

      const filter = { url };
      const update = { $set: { notificated: true, notificatedAt: new Date() } };

      this.db.collection('properties').updateOne(filter, update, (err, result) => {
        if (err) {
          Log.error(`${this.logPrefix} Error in notifying URL '${url}'`);
          return;
        }
        Log.info(`${this.logPrefix} Success in notifying URL '${url}'`);
      });

    } catch (err) {
      Log.error(`Error to send e-mail cause: ${err}`);
    }
  }
}

export default NotificationService;
