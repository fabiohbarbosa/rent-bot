import Log from '@config/logger';
import { logPrefix, path, providers } from './consts';

const api = (router, db) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching the providers`);

    Log.info(`${logPrefix} Found ${providers.length} providers`);
    res.json(providers.sort());
  });
};

export default api;
