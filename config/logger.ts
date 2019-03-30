import winston from 'winston';
import props from './props';
import { LoggingWinston } from '@google-cloud/logging-winston';

export default winston.createLogger({
  level: props.logLevel,
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
    winston.format.printf(msg =>
      winston.format
        .colorize()
        .colorize(msg.level, `${msg.timestamp} ${msg.level}: ${msg.message}`)
    )
  ),
  transports: [
    new winston.transports.Console(),
    LoggingWinston
  ]
});
