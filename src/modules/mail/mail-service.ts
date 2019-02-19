import * as fs from 'fs';
import Handlebars from 'handlebars';
import mail from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

import props from '@config/props';
import Log from '@config/logger';
import { MailMessage } from './mail.message';

class MailService {
  static send(message: MailMessage): Promise<[ClientResponse, {}]> {
    try {
      const templatePath = `${__dirname}/../../../assets/mail.html`;

      const data = fs.readFileSync(templatePath);
      mail.setApiKey(process.env.SENDGRID_API_KEY);

      const source = data.toString();
      const template = Handlebars.compile(source);
      const html = template(message);

      const msg = {
        to: props.receivers,
        from: 'noreply@rentbot-crawler.com',
        subject: `${message.provider.toUpperCase()} - ${message.title}`,
        html
      };

      return mail.send(msg);
    } catch (err) {
      Log.error(`Error to read mail template file, cause ${err}`);
      Promise.reject(err);
    }
  }
}

export default MailService;
