import MailService from '@sendgrid/mail';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import props from '../../config/props';

class Mail {
  static send(element) {
    fs.readFile('./src/mail/mail.html', (err, data) => {
      if (err) throw err;

      MailService.setApiKey(process.env.SENDGRID_API_KEY);

      const source = data.toString();
      const template = Handlebars.compile(source);
      const html = template(element);

      const msg = {
        to: props.receivers,
        from: 'noreply@rentbot-crawler.com',
        subject: element.title,
        html
      };

      MailService.send(msg);
    });
  }
}

export default Mail;
