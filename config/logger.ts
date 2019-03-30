import winston from 'winston';
import props from './props';
import { LoggingWinston } from '@google-cloud/logging-winston';

export default winston.createLogger({
  level: props.logLevel,
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
    winston.format.printf(msg => {
      const format = props.env === 'local' ?
        `${msg.timestamp} ${msg.level}: ${msg.message}` : msg.message;
      return winston.format
        .colorize()
        .colorize(msg.level, format);
    })
  ),
  transports: [
    new winston.transports.Console(),
    new LoggingWinston()
  ]
});
