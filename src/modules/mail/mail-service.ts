import mail from '@sendgrid/mail';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import props from '@config/props';
import Log from '@config/logger';
import { ClientResponse } from '@sendgrid/client/src/response';

class MailService {
  static send(property): Promise<[ClientResponse, {}]> {
    try {
      const data = fs.readFileSync('./assets/mail.html');
      mail.setApiKey(process.env.SENDGRID_API_KEY);

      const source = data.toString();
      const template = Handlebars.compile(source);
      const html = template(property);

      const msg = {
        to: props.receivers,
        from: 'noreply@rentbot-crawler.com',
        subject: `${property.provider.toUpperCase()} - ${property.title}`,
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
