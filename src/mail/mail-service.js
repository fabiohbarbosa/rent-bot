import mail from '@sendgrid/mail';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import props from '../../config/props';

class MailService {
  static send(property) {
    fs.readFile('./src/mail/mail.html', (err, data) => {
      if (err) throw err;

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

      mail.send(msg);
    });
  }
}

export default MailService;
