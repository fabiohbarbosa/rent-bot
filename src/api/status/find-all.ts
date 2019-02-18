import Log from '@config/logger';
import { logPrefix, path, status as statusRaw } from './consts';

const api = (router, db) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching the status`);

    const status = [];
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(statusRaw)) {
      status.push(value);
    }

    Log.info(`${logPrefix} Found ${status.length} status`);
    res.json(status.sort());
  });
};

export default api;
