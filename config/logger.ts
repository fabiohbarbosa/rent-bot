import winston from 'winston';
import props from './props';

const localConfig = {
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
    new winston.transports.Console()
  ]
};

const prodConfig = {
  level: props.logLevel,
  transports: [
    new winston.transports.Console()
  ]
};

export default winston.createLogger(props.env === 'local' ? localConfig : prodConfig);
